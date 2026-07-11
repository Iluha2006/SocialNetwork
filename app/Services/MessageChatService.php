<?php

namespace App\Services;

use App\Models\FileMessage;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageDeleted;
use App\Services\Cache\MessageCacheService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class MessageChatService
{
    public function __construct(
        protected MessageCacheService $cacheService,
        protected AudioMessageService $audioMessageService
    ) {}
    public function getUserChats(int $userId)
    {
        $chatUserIds = collect();

        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->lazy();

        foreach ($messages as $message) {
            $chatUserId = $message->sender_id === $userId
                ? $message->receiver_id
                : $message->sender_id;

            if ($chatUserId !== $userId) {
                $chatUserIds->push($chatUserId);
            }
        }

        $chatUserIds = $chatUserIds->unique()->values();

        if ($chatUserIds->isEmpty()) {
            return collect([]);
        }

        $users = User::whereIn('id', $chatUserIds)
            ->select(['id', 'name', 'online_status'])
            ->with('profile:user_id,name,avatar')
            ->get();

        foreach ($users as $user) {
            $lastMessage = \App\Models\Message::where(function ($q) use ($userId, $user) {
                $q->where('sender_id', $userId)->where('receiver_id', $user->id);
                $q->orWhere(function ($q2) use ($userId, $user) {
                    $q2->where('sender_id', $user->id)->where('receiver_id', $userId);
                });
            })
            ->latest('created_at')
            ->first(['content', 'created_at', 'images', 'file']);

            $user->last_message = $lastMessage?->toArray();
        }

        return $users;
    }
    public function updateMessage(int $messageId, string $content)
    {
        $message = Message::findOrFail($messageId);
        $message->update(['content' => $content]);
        $message->load(['sender:id,name,email', 'receiver:id,name,email']);

        return $message;
    }


    public function getChatFiles(int $currentUserId, int $otherUserId)
    {
        return Message::where(function($query) use ($currentUserId, $otherUserId) {
            $query->where(function($q) use ($currentUserId, $otherUserId) {
                $q->where('sender_id', $currentUserId)
                  ->where('receiver_id', $otherUserId);
            })->orWhere(function($q) use ($currentUserId, $otherUserId) {
                $q->where('sender_id', $otherUserId)
                  ->where('receiver_id', $currentUserId);
            });
        })->where(function($query) {
            $query->whereNotNull('file')
                  ->orWhereNotNull('images');
        })
        ->with(['sender:id,name', 'receiver:id,name'])
        ->orderBy('created_at', 'desc')
        ->limit(100)
        ->get();
    }

    public function sendMessage(array $data, int $receiverId, $image = null, $file = null)
    {
        $userId = Auth::id();
        $imageUrl = null;
        $fileUrl = null;


        if ($image && $image->isValid()) {
            $imageUrl = $this->uploadFile($image, "user_message/{$userId}/images");
        }

        if ($file) {
            $fileUrl = $this->uploadFile($file, "user_message/{$userId}/files");
        }

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $receiverId,
            'file' => $fileUrl,
            'images' => $imageUrl,
            'content' => $data['content']
        ]);

        if ($file && $fileUrl) {
            FileMessage::create([
                'user_id' => $userId,
                'message_id' => $message->id,
                'original_name' => $file->getClientOriginalName(),
                'path_file' => $fileUrl,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
            ]);
        }

        $message->load(['sender:id,name,email', 'receiver:id,name,email', 'files']);

        $this->cacheService->cacheMessage($message);
        $this->cacheService->updateChatCache($userId, $receiverId, $message);
        $this->cacheService->clearChatMessagesCache($userId, $receiverId);
        return $message;
    }


    public function getChatMessages(int $currentUserId, int $otherUserId)
    {
        $cacheKey = "chat_messages:{$currentUserId}:{$otherUserId}";

        return Cache::remember($cacheKey, 300, function() use ($currentUserId, $otherUserId) {
            return Message::where(function($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $currentUserId)
                      ->where('receiver_id', $otherUserId);
            })->orWhere(function($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                      ->where('receiver_id', $currentUserId);
        })->select(['id', 'sender_id', 'receiver_id', 'content', 'images', 'file', 'created_at', 'updated_at'])
          ->with('sender:id,name,email')
          ->with('files')
          ->orderBy('created_at', 'asc')
          ->limit(200)
          ->get();
        });
    }


    public function deleteMessage(int $messageId)
    {
        $message = Message::findOrFail($messageId);
        $message->delete();

        broadcast(new MessageDeleted($messageId));

        return $messageId;
    }


    public function deleteChat(int $currentUserId, int $otherUserId)
    {

        $messages = Message::where(
            function($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $currentUserId)
                      ->where('receiver_id', $otherUserId);
            })->orWhere(function($query) use ($currentUserId, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                      ->where('receiver_id', $currentUserId);
            })->get();

        foreach ($messages as $message) {
            $messageId = $message->id;
            $message->delete();
            broadcast(new MessageDeleted($messageId));
        }


        $this->audioMessageService->deleteConversationAudio($currentUserId, $otherUserId);

        $this->cacheService->clearChatMessagesCache($currentUserId, $otherUserId);
        $this->cacheService->clearUserChatsCache($currentUserId);
        $this->cacheService->clearUserChatsCache($otherUserId);

        return true;
    }


    private function uploadFile($file, string $path): string
    {
        $extension = $file->getClientOriginalExtension();
        $safeName = time() . '_' . md5($file->getClientOriginalName()) . '.' . $extension;
        $storagePath = Storage::disk('s3')->putFileAs(
            $path,
            $file,
            $safeName,
            'public'
        );

        $baseUrl = config('filesystems.disks.s3.url') ?: env('AWS_ENDPOINT');
        $bucket = env('AWS_BUCKET');

        return $baseUrl . '/' . $bucket . '/' . $storagePath;
    }


}

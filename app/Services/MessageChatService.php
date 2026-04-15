<?php

namespace App\Services;

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

        return User::whereIn('id', $chatUserIds)
            ->with('profile')
            ->get(['id', 'name', 'online_status']);
    }
    public function updateMessage(int $messageId, string $content)
    {
        $message = Message::findOrFail($messageId);
        $message->update(['content' => $content]);
        $message->load(['sender', 'receiver']);

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
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'desc')
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

        $message->load(['sender', 'receiver']);

        $this->cacheService->cacheMessage($message);
        $this->cacheService->updateChatCache($userId, $receiverId, $message);
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
            })->with('sender')
              ->orderBy('created_at', 'asc')
              ->get();
        });
    }


    public function deleteMessage(int $messageId)
    {
        $message = Message::find($messageId);
        $messageId = $message->id;
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
        $filename = time() . '_' . $file->getClientOriginalName();
        $storagePath = Storage::disk('s3')->putFileAs(
            $path,
            $file,
            $filename,
            'public'
        );


        $storageFile= env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $storagePath ;

        return $storageFile ;
    }


}

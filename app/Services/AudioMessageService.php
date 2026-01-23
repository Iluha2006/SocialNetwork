<?php

namespace App\Services;

use App\Models\AudioMessage;
use App\Events\AudioMessageSent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AudioMessageService
{
    public function getUserAudioMessages(int $userId)
    {
        return AudioMessage::where('receiver_id', $userId)
            ->orWhere('sender_id', $userId)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function createAudioMessage(array $data)
    {



        $validator = Validator::make($data, [
            'audio_mess' => 'required|file|mimes:audio/mpeg,mp3,wav,aac,webm,ogg,opus|max:10240',
            'receiver_id' => 'required|integer|exists:users,id',
        ]);



        $userId = Auth::id();
        $receiverId = (int) $data['receiver_id'];



        $recentMessage = AudioMessage::where('sender_id', $userId)
            ->where('receiver_id', $receiverId)
            ->where('created_at', '>=', now()->subSeconds(3))
            ->first();

        try {
            $audioUrl = $this->uploadAudioFile($data['audio_mess'], $userId);

            $message = AudioMessage::create([
                'sender_id' => $userId,
                'receiver_id' => $receiverId,
                'audio_message' => $audioUrl,
            ]);

            $message->load(['sender', 'receiver']);


            event(new AudioMessageSent($message));

            return $message;

        } catch (\Exception $e) {

            throw $e;
        }
    }

       public function uploadAudioFile($audioFile, int $userId): string
    {
        $filename = time() . '_' . $audioFile->getClientOriginalName();
        $path = Storage::disk('s3')->putFileAs(
            "audio_message/{$userId}/audio",
            $audioFile,
            $filename,
            'public'
        );

        return Storage::disk('s3')->get($path);
    }

    public function getConversation(int $userId, int $otherUserId)
    {
        return AudioMessage::where(function($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $otherUserId);
        })->orWhere(function($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                  ->where('receiver_id', $userId);
        })->with(['sender', 'receiver'])
          ->orderBy('created_at', 'asc')
          ->get();
    }


    public function deleteMessage(int $messageId, int $userId): bool
    {
        $message = AudioMessage::where('id', $messageId)
            ->where('sender_id', $userId)
            ->firstOrFail();

        if ($message->audio_message) {

            $path = parse_url($message->audio_message, PHP_URL_PATH);
            if ($path) {
                Storage::disk('s3')->delete(ltrim($path, '/'));
            }
        }

        $message->delete();

        return true;
    }

    public function deleteConversationAudio(int $userId, int $otherUserId): void
    {
        $audioMessages = AudioMessage::where(function($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $otherUserId);
        })->orWhere(function($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                  ->where('receiver_id', $userId);
        })->get();

        foreach ($audioMessages as $audioMessage) {
            if ($audioMessage->audio_message) {
                $path = parse_url($audioMessage->audio_message, PHP_URL_PATH);
                if ($path) {
                    Storage::disk('s3')->delete(ltrim($path, '/'));
                }
            }
            $audioMessage->delete();
        }
    }

    public function getMessageResponse(AudioMessage $message): array
    {
        return [
            'success' => true,
            'data' => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'audio_message' => $message->audio_message,
                'created_at' => $message->created_at,
            ]
        ];
    }
}

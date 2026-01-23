<?php


namespace App\Services;

use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Facades\Cache;

class CacheService
{




    public function cacheMessage(Message $message)
    {
        return Cache::remember("message:{$message->id}",3000, function() use ($message) {
            return $message->load(['sender', 'receiver']);
        });
    }


    public function updateChatCache($userId, $receiverId, Message $message)
    {
        $chatKey = "chat:{$userId}:{$receiverId}";
        $lastMessages = Cache::get($chatKey, []);

        array_unshift($lastMessages, [
            'id' => $message->id,
            'content' => $message->content,
            'created_at' => $message->created_at,
            'sender_id' => $message->sender_id
        ]);

        $lastMessages = array_slice($lastMessages, 0, 50);
        Cache::put($chatKey, $lastMessages, 3600);
        $this->clearUserChatsCache($userId);
        $this->clearUserChatsCache($receiverId);
    }


    public function clearUserChatsCache($userId)
    {
        Cache::forget("user_chats_{$userId}");
    }

    public function clearUserCache($userId)
    {
        Cache::forget("user:{$userId}");
        $this->clearUserChatsCache($userId);
    }
}
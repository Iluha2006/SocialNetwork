<?php

namespace App\Services\Cache;

use App\Contracts\Cache\CacheServiceInterface;
use App\Models\Message;

class MessageCacheService
{
    private const MESSAGE_TTL = 3000;
    private const CHAT_TTL = 3600;

    public function __construct(
        private readonly CacheServiceInterface $cache
    ) {}

    public function cacheMessage(Message $message): Message
    {
        return $this->cache->remember("message:{$message->id}", self::MESSAGE_TTL, fn () =>
            $message->load(['sender', 'receiver'])
        );
    }

    public function updateChatCache(int $userId, int $receiverId, Message $message): void
    {
        $chatKey = "chat:{$userId}:{$receiverId}";
        $lastMessages = $this->cache->get($chatKey, []);

        array_unshift($lastMessages, [
            'id' => $message->id,
            'content' => $message->content,
            'created_at' => $message->created_at,
            'sender_id' => $message->sender_id,
        ]);

        $lastMessages = array_slice($lastMessages, 0, 50);
        $this->cache->put($chatKey, $lastMessages, self::CHAT_TTL);
        $this->clearUserChatsCache($userId);
        $this->clearUserChatsCache($receiverId);
    }

    public function clearUserChatsCache(int $userId): void
    {
        $this->cache->forget("user_chats_{$userId}");
    }

    public function clearUserCache(int $userId): void
    {
        $this->cache->forget("user:{$userId}");
        $this->clearUserChatsCache($userId);
    }

    public function clearChatMessagesCache(int $userId1, int $userId2): void
    {
        $this->cache->forget("chat_messages:{$userId1}:{$userId2}");
        $this->cache->forget("chat_messages:{$userId2}:{$userId1}");
    }
}

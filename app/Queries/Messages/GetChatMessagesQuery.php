<?php

namespace App\Queries\Messages;

class GetChatMessagesQuery
{
    public function __construct(
        public readonly int $currentUserId,
        public readonly int $otherUserId,
    ) {}
}

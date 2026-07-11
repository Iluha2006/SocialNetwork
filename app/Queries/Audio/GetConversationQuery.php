<?php

namespace App\Queries\Audio;

class GetConversationQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly int $otherUserId,
    ) {}
}

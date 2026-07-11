<?php

namespace App\Queries\Messages;

class GetChatFilesQuery
{
    public function __construct(
        public readonly int $currentUserId,
        public readonly int $otherUserId,
    ) {}
}

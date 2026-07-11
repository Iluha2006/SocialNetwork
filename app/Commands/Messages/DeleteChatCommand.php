<?php

namespace App\Commands\Messages;

class DeleteChatCommand
{
    public function __construct(
        public readonly int $currentUserId,
        public readonly int $targetUserId,
    ) {}
}

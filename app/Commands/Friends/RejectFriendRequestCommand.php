<?php

namespace App\Commands\Friends;

class RejectFriendRequestCommand
{
    public function __construct(
        public readonly int $requestId,
        public readonly int $userId,
    ) {}
}

<?php

namespace App\Commands\Friends;

class CancelFriendRequestCommand
{
    public function __construct(
        public readonly int $requestId,
        public readonly int $profileId,
    ) {}
}

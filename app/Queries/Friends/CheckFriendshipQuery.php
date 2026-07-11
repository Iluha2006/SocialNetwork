<?php

namespace App\Queries\Friends;

class CheckFriendshipQuery
{
    public function __construct(
        public readonly int $profileId,
        public readonly int $friendId,
    ) {}
}

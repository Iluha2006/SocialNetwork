<?php

namespace App\Queries\Friends;

class GetFriendshipStatusQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly int $otherUserId,
    ) {}
}

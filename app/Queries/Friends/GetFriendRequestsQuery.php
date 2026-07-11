<?php

namespace App\Queries\Friends;

class GetFriendRequestsQuery
{
    public function __construct(
        public readonly int $profileId,
    ) {}
}

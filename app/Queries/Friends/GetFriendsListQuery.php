<?php

namespace App\Queries\Friends;

class GetFriendsListQuery
{
    public function __construct(
        public readonly int $profileId,
    ) {}
}

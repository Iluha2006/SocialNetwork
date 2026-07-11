<?php

namespace App\Queries\Profile;

class GetFriendsQuery
{
    public function __construct(
        public readonly int $profileId,
    ) {}
}

<?php

namespace App\Commands\Friends;

class DeleteFriendCommand
{
    public function __construct(
        public readonly int $profileId,
        public readonly int $friendProfileId,
    ) {}
}

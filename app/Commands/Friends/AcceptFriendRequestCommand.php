<?php

namespace App\Commands\Friends;

use App\Models\FriendRequest;

class AcceptFriendRequestCommand
{
    public function __construct(
        public readonly FriendRequest $friendRequest,
    ) {}
}

<?php

namespace App\Commands\Friends;

class SendFriendRequestCommand
{
    public function __construct(
        public readonly int $senderProfileId,
        public readonly int $receiverProfileId,
    ) {}
}

<?php

namespace App\Handlers\Commands\Friends;

use App\Commands\Friends\SendFriendRequestCommand;
use App\Services\FriendRequestService;

class SendFriendRequestCommandHandler
{
    public function __construct(
        private readonly FriendRequestService $friendRequestService,
    ) {}

    public function handle(SendFriendRequestCommand $command): array
    {
        return $this->friendRequestService->sendFriendRequest(
            $command->senderProfileId,
            $command->receiverProfileId,
        );
    }
}

<?php

namespace App\Handlers\Commands\Friends;

use App\Commands\Friends\RejectFriendRequestCommand;
use App\Services\FriendRequestService;

class RejectFriendRequestCommandHandler
{
    public function __construct(
        private readonly FriendRequestService $friendRequestService,
    ) {}

    public function handle(RejectFriendRequestCommand $command): array
    {
        return $this->friendRequestService->rejectRequestById(
            $command->requestId,
            $command->userId,
        );
    }
}

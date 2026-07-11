<?php

namespace App\Handlers\Commands\Friends;

use App\Commands\Friends\CancelFriendRequestCommand;
use App\Services\FriendRequestService;

class CancelFriendRequestCommandHandler
{
    public function __construct(
        private readonly FriendRequestService $friendRequestService,
    ) {}

    public function handle(CancelFriendRequestCommand $command): array
    {
        return $this->friendRequestService->cancelRequest(
            $command->requestId,
            $command->profileId,
        );
    }
}

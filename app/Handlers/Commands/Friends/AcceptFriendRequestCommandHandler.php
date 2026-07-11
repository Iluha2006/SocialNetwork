<?php

namespace App\Handlers\Commands\Friends;

use App\Commands\Friends\AcceptFriendRequestCommand;
use App\Services\FriendRequestService;

class AcceptFriendRequestCommandHandler
{
    public function __construct(
        private readonly FriendRequestService $friendRequestService,
    ) {}

    public function handle(AcceptFriendRequestCommand $command): array
    {
        return $this->friendRequestService->acceptRequest($command->friendRequest);
    }
}

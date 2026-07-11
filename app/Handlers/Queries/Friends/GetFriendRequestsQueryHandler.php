<?php

namespace App\Handlers\Queries\Friends;

use App\Queries\Friends\GetFriendRequestsQuery;
use App\Services\FriendRequestService;

class GetFriendRequestsQueryHandler
{
    public function __construct(
        private readonly FriendRequestService $friendRequestService,
    ) {}

    public function handle(GetFriendRequestsQuery $query): array
    {
        return $this->friendRequestService->getRequests($query->profileId);
    }
}

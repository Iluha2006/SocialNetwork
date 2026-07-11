<?php

namespace App\Handlers\Queries\Profile;

use App\Queries\Profile\GetFriendsQuery;
use App\Services\Profile\ProfileService;

class GetFriendsQueryHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(GetFriendsQuery $query): array
    {
        $friends = $this->profileService->getFriends($query->profileId);

        return $friends->toArray();
    }
}

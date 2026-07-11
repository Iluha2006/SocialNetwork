<?php

namespace App\Handlers\Queries\Profile;

use App\Queries\Profile\GetBlockedUsersQuery;
use App\Services\Profile\ProfileService;

class GetBlockedUsersQueryHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(GetBlockedUsersQuery $query): array
    {
        return $this->profileService->getBlockedUsers();
    }
}

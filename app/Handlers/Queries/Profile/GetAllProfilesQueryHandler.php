<?php

namespace App\Handlers\Queries\Profile;

use App\Data\ProfileData;
use App\Queries\Profile\GetAllProfilesQuery;
use App\Services\Profile\ProfileService;

class GetAllProfilesQueryHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(GetAllProfilesQuery $query): array
    {
        $profiles = $this->profileService->index();

        return ProfileData::collect($profiles)->toArray();
    }
}

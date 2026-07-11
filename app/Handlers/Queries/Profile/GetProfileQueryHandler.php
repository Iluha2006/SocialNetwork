<?php

namespace App\Handlers\Queries\Profile;

use App\Data\ProfileShowData;
use App\Queries\Profile\GetProfileQuery;
use App\Services\Profile\ProfileService;

class GetProfileQueryHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(GetProfileQuery $query): ProfileShowData
    {
        $data = $this->profileService->show($query->profileId);

        return new ProfileShowData(
            profile: \App\Data\ProfileData::from($data['profile']),
            is_blocked: $data['is_blocked'],
            has_blocked_this_user: $data['has_blocked_this_user'],
        );
    }
}

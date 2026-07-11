<?php

namespace App\Handlers\Commands\Profile;

use App\Commands\Profile\UpdateProfileCommand;
use App\Data\ProfileData;
use App\Services\Profile\ProfileService;

class UpdateProfileCommandHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(UpdateProfileCommand $command): ProfileData
    {
        $profile = $this->profileService->update($command->data, $command->profileId);

        return ProfileData::from($profile);
    }
}

<?php

namespace App\Handlers\Commands\Profile;

use App\Commands\Profile\UpdateAvatarCommand;
use App\Services\Profile\ProfileService;

class UpdateAvatarCommandHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(UpdateAvatarCommand $command): array
    {
        return $this->profileService->updateAvatar($command->request);
    }
}

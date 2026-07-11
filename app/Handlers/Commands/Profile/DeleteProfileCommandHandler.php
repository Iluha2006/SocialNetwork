<?php

namespace App\Handlers\Commands\Profile;

use App\Commands\Profile\DeleteProfileCommand;
use App\Services\Profile\ProfileService;

class DeleteProfileCommandHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(DeleteProfileCommand $command): void
    {
        $this->profileService->destroy($command->profileId);
    }
}

<?php

namespace App\Handlers\Commands\Profile;

use App\Commands\Profile\UnblockUserCommand;
use App\Services\Profile\ProfileService;

class UnblockUserCommandHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(UnblockUserCommand $command): array
    {
        return $this->profileService->unblock($command->userId);
    }
}

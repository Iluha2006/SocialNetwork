<?php

namespace App\Handlers\Commands\Profile;

use App\Commands\Profile\BlockUserCommand;
use App\Services\Profile\ProfileService;

class BlockUserCommandHandler
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function handle(BlockUserCommand $command): array
    {
        return $this->profileService->block($command->userId);
    }
}

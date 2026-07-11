<?php

namespace App\Handlers\Commands\Audio;

use App\Commands\Audio\DeleteAudioMessageCommand;
use App\Services\AudioMessageService;

class DeleteAudioMessageCommandHandler
{
    public function __construct(
        private readonly AudioMessageService $audioService,
    ) {}

    public function handle(DeleteAudioMessageCommand $command): bool
    {
        return $this->audioService->deleteMessage($command->messageId, $command->userId);
    }
}

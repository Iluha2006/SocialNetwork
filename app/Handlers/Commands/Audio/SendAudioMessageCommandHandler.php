<?php

namespace App\Handlers\Commands\Audio;

use App\Commands\Audio\SendAudioMessageCommand;
use App\Data\AudioMessageData;
use App\Services\AudioMessageService;

class SendAudioMessageCommandHandler
{
    public function __construct(
        private readonly AudioMessageService $audioService,
    ) {}

    public function handle(SendAudioMessageCommand $command): AudioMessageData
    {
        $message = $this->audioService->createAudioMessage($command->validated);

        return AudioMessageData::from($message);
    }
}

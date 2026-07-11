<?php

namespace App\Commands\Audio;

class DeleteAudioMessageCommand
{
    public function __construct(
        public readonly int $messageId,
        public readonly int $userId,
    ) {}
}

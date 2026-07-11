<?php

namespace App\Commands\Audio;

class SendAudioMessageCommand
{
    public function __construct(
        public readonly array $validated,
    ) {}
}

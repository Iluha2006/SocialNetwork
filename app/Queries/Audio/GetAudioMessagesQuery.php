<?php

namespace App\Queries\Audio;

class GetAudioMessagesQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

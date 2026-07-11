<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class AudioMessageData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $sender_id,
        public readonly int $receiver_id,
        public readonly ?string $audio_path,
        public readonly string $created_at,
        public readonly ?UserData $sender = null,
        public readonly ?UserData $receiver = null,
    ) {}
}

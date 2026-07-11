<?php

namespace App\Data;

use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;

class MessageData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $sender_id,
        public readonly int $receiver_id,
        public readonly ?string $content,
        public readonly ?string $images,
        public readonly ?string $file,
        public readonly ?string $file_name,
        #[WithCast(DateTimeInterfaceCast::class, format: CarbonInterface::ATOM)]
        public readonly string $created_at,
        #[WithCast(DateTimeInterfaceCast::class, format: CarbonInterface::ATOM)]
        public readonly ?string $updated_at = null,
        public readonly ?UserData $sender = null,
        public readonly ?UserData $receiver = null,
    ) {}
}

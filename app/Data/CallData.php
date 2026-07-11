<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CallData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $caller_id,
        public readonly int $receiver_id,
        public readonly string $call_type,
        public readonly string $status,
    ) {}
}

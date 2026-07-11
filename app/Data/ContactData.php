<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ContactData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly ?string $phone,
        public readonly ?string $city,
    ) {}
}

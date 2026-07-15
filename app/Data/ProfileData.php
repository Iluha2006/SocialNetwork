<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ProfileData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly ?string $name,
        public readonly ?string $bio,
        public readonly ?string $email = null,
        public readonly ?string $avatar = null,
        public readonly ?string $created_at = null,
    ) {}
}

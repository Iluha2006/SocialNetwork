<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ProfileDetailData extends Data
{
    public function __construct(
        public readonly int $user_id,
        public readonly ?string $avatar,
        public readonly ?string $name,
        public readonly ?string $email,
        public readonly ?string $created_at,
        public readonly ?string $bio,
        public readonly bool $is_blocked = false,
        public readonly bool $has_blocked_this_user = false,
        public readonly ?UserData $user = null,
    ) {}
}

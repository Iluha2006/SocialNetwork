<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ProfileShowData extends Data
{
    public function __construct(
        public readonly ProfileData $profile,
        public readonly ?bool $is_blocked = null,
        public readonly ?bool $has_blocked_this_user = null,
    ) {}
}

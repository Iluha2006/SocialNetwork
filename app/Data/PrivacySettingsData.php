<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PrivacySettingsData extends Data
{
    public function __construct(
        public readonly string $profile_visibility = 'public',
        public readonly bool $friends_visible = true,
        public readonly bool $images_visible = true,
    ) {}
}

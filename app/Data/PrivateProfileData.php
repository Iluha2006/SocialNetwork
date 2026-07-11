<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PrivateProfileData extends Data
{
    public function __construct(
        public readonly array $profile,
        public readonly array $privacy,
        public readonly PrivacySettingsData $privacy_settings,
    ) {}
}

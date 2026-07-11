<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PrivacyImagesData extends Data
{
    public function __construct(
        public readonly array $images = [],
        public readonly bool $can_view_images = true,
        public readonly PrivacySettingsData $privacy_settings = new PrivacySettingsData(),
    ) {}
}

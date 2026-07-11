<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PrivacyFriendsData extends Data
{
    public function __construct(
        public readonly array $friends = [],
        public readonly int $friends_count = 0,
        public readonly bool $can_view_friends = true,
        public readonly PrivacySettingsData $privacy_settings = new PrivacySettingsData(),
    ) {}
}

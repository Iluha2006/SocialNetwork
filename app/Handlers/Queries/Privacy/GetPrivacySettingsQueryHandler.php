<?php

namespace App\Handlers\Queries\Privacy;

use App\Data\PrivacySettingsData;
use App\Models\PrivacySetting;
use App\Queries\Privacy\GetPrivacySettingsQuery;

class GetPrivacySettingsQueryHandler
{
    public function handle(GetPrivacySettingsQuery $query): PrivacySettingsData
    {
        $settings = PrivacySetting::firstOrCreate(
            ['user_id' => $query->userId],
            [
                'profile_visibility' => 'public',
                'friends_visible' => true,
                'images_visible' => true,
                'message_from_friends_only' => false,
            ]
        );

        return PrivacySettingsData::from($settings);
    }
}

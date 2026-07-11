<?php

namespace App\Handlers\Commands\Privacy;

use App\Commands\Privacy\UpdatePrivacySettingsCommand;
use App\Data\PrivacySettingsData;
use App\Models\PrivacySetting;

class UpdatePrivacySettingsCommandHandler
{
    public function handle(UpdatePrivacySettingsCommand $command): PrivacySettingsData
    {
        $settings = PrivacySetting::updateOrCreate(
            ['user_id' => $command->userId],
            [
                'profile_visibility' => $command->settings['profile_visibility'],
                'friends_visible' => $command->settings['friends_visible'] ?? false,
                'images_visible' => $command->settings['images_visible'] ?? false,
                'message_from_friends_only' => $command->settings['message_from_friends_only'] ?? false,
            ]
        );

        return PrivacySettingsData::from($settings);
    }
}

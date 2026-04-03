<?php

namespace App\Http\Resources\PrivateProfile;

use App\Models\PrivacySetting;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacySettingsResource extends JsonResource
{

    public function toArray(Request $request): array
    {  $profile = PrivacySetting::with('user');


        return [
            'success' => true,
            'settings' => [
                'profile_visibility' => $profile->profile_visibility ?? 'public',
                'friends_visible' =>  $profile->friends_visible ?? true,
                'images_visible' =>  $profile->images_visible ?? true,

            ]
        ];
    }
}
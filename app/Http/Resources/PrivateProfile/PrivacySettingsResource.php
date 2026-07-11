<?php

namespace App\Http\Resources\PrivateProfile;

use App\Models\PrivacySetting;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacySettingsResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'settings' => [
                'profile_visibility' => $this->profile_visibility ?? 'public',
                'friends_visible' =>  $this->friends_visible ?? true,
                'images_visible' =>  $this->images_visible ?? true,
            ]
        ];
    }
}

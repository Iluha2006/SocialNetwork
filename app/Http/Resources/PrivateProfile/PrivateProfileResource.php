<?php

namespace App\Http\Resources\PrivateProfile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivateProfileResource extends JsonResource
{
    protected $privacySettings;
    protected $privacyMeta;

    public function __construct($resource, $privacySettings , $privacyMeta )
    {
        parent::__construct($resource);
        $this->privacySettings = $privacySettings;
        $this->privacyMeta = $privacyMeta;
    }

    public function toArray(Request $request): array
    {
        $profile = $this->resource;

        return [
            'success' => true,
            'profile' => [
                'user_id' => $profile['user_id'] ?? $profile->user_id,
                'name' => $profile['name'] ?? $profile->name,
                'email' => $profile['email'] ?? $profile->email,
                'avatar' => $profile['avatar'] ?? $profile->avatar,
                'bio' => $profile['bio'] ?? $profile->bio,
                'created_at' => $profile['created_at'] ?? $profile->created_at,
                'friends' => $this->when(isset($profile['friends']), $profile['friends']),
                'friends_count' => $this->when(isset($profile['friends_count']), $profile['friends_count']),
            ],
            'privacy' => $this->privacyMeta ?? [],
            'privacy_settings' => $this->privacySettings ?? [],
        ];
    }
}
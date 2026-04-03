<?php

namespace App\Http\Resources\PrivateProfile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacyFriendsResource extends JsonResource
{
    protected $privacySettings;
    protected $canViewFriends;

    public function __construct($resource, $privacySettings = null, $canViewFriends = true)
    {
        parent::__construct($resource);
        $this->privacySettings = $privacySettings;
        $this->canViewFriends = $canViewFriends;
    }

    public function toArray(Request $request): array
    {
        $friends = $this->resource ?? [];

        return [
            'success' => true,
            'friends' => $friends,
            'friends_count' => is_countable($friends) ? count($friends) : 0,
            'can_view_friends' => $this->canViewFriends,
            'privacy_settings' => [
                'friends_visible' => $this->privacySettings['friends_visible'] ?? true,
            ],
        ];
    }
}
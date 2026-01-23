<?php
namespace App\Services;

use App\Models\User;
use App\Models\Profile;
use App\Models\Friendship;

class PrivateProfileService
{
    public function canViewProfile(User $viewer, User $owner): bool
    {
        $privacy = $owner->privacySettings;

        if (!$privacy) {
            return true;
        }

        if ($viewer->id === $owner->id) {
            return true;
        }

        $visibility = $privacy->profile_visibility;

        if ($visibility === 'public') {
            return true;
        }

        if ($visibility === 'private') {
            return false;
        }

        if ($visibility === 'friends') {
            return $this->areFriends($viewer, $owner);
        }


        return true;
    }

    public function canViewFriends(User $viewer, User $owner): bool
    {
        $privacy = $owner->privacySettings;

        if (!$privacy || $privacy->friends_visible === true) {
            return $this->canViewProfile($viewer, $owner);
        }


        return $viewer->id === $owner->id;
    }

    public function canViewImages(User $viewer, User $owner): bool
{
    $privacy = $owner->privacySettings;


    if (!$privacy) {
        return true;
    }


    if ($viewer->id === $owner->id) {
        return true;
    }


    if ($privacy->images_visible === false) {
        return false;
    }

    return $this->canViewProfile($viewer, $owner);
}
public function filterProfileData(User $viewer, User $owner, array $profileData): array
{
    $filteredData = $profileData;


    $filteredData['privacy'] = [
        'can_view_profile' => $this->canViewProfile($viewer, $owner),
        'can_view_friends' => $this->canViewFriends($viewer, $owner),
        'can_view_images' => $this->canViewImages($viewer, $owner),

    ];

    return $filteredData;
}
    private function areFriends(User $user1, User $user2): bool
    {
        return Friendship::where(function ($q) use ($user1, $user2) {
                $q->where('user_id', $user1->id)
                  ->where('friend_id', $user2->id);
            })
            ->orWhere(function ($q) use ($user1, $user2) {
                $q->where('user_id', $user2->id)
                  ->where('friend_id', $user1->id);
            })
            ->exists();
    }
}

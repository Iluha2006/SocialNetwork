<?php

namespace App\Handlers\Queries\Friends;

use App\Models\Friendship;
use App\Models\Profile;
use App\Queries\Friends\CheckFriendshipQuery;

class CheckFriendshipQueryHandler
{
    public function handle(CheckFriendshipQuery $query): array
    {
        $profile = Profile::where('user_id', $query->profileId)->first();
        $friendProfile = Profile::where('user_id', $query->friendId)->first();

        if (!$profile || !$friendProfile) {
            throw new \RuntimeException('Профиль не найден', 404);
        }

        $exists = Friendship::where(function($q) use ($profile, $friendProfile) {
            $q->where('user_id', $profile->id)->where('friend_id', $friendProfile->id);
        })->orWhere(function($q) use ($profile, $friendProfile) {
            $q->where('user_id', $friendProfile->id)->where('friend_id', $profile->id);
        })->exists();

        return ['friends' => $exists];
    }
}

<?php

namespace App\Handlers\Queries\Friends;

use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\Profile;
use App\Queries\Friends\GetFriendshipStatusQuery;

class GetFriendshipStatusQueryHandler
{
    public function handle(GetFriendshipStatusQuery $query): array
    {
        $profile = Profile::where('user_id', $query->userId)->first();
        $otherProfile = Profile::where('user_id', $query->otherUserId)->first();

        if (!$profile || !$otherProfile) {
            throw new \RuntimeException('Профиль не найден', 404);
        }

        $profileId = $profile->id;
        $otherProfileId = $otherProfile->id;

        $isFriend = Friendship::where(function($q) use ($profileId, $otherProfileId) {
            $q->where('user_id', $profileId)->where('friend_id', $otherProfileId);
        })->orWhere(function($q) use ($profileId, $otherProfileId) {
            $q->where('user_id', $otherProfileId)->where('friend_id', $profileId);
        })->exists();

        if ($isFriend) {
            return ['status' => 'friends'];
        }

        $sentRequest = FriendRequest::where('sender_id', $profileId)
            ->where('receiver_id', $otherProfileId)
            ->where('status', 'pending')
            ->exists();

        if ($sentRequest) {
            return ['status' => 'request_sent'];
        }

        $receivedRequest = FriendRequest::where('sender_id', $otherProfileId)
            ->where('receiver_id', $profileId)
            ->where('status', 'pending')
            ->exists();

        if ($receivedRequest) {
            return ['status' => 'request_received'];
        }

        return ['status' => 'not_friends'];
    }
}

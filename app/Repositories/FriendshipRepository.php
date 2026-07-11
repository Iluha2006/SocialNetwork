<?php

namespace App\Repositories;

use App\Models\Friendship;
use App\Models\Profile;
use App\Models\FriendRequest;
use App\Repositories\Contracts\FriendshipRepositoryInterface;
use Illuminate\Support\Collection;

class FriendshipRepository implements FriendshipRepositoryInterface
{
    
    public function getFriends(int $profileId): Collection
    {
        return Profile::with('friends')->findOrFail($profileId)->friends;
    }

    public function deleteFriendship(int $profileId, int $friendId): void
    {
        
        Friendship::where('user_id', $profileId)
            ->where('friend_id', $friendId)
            ->delete();
        FriendRequest::where(function ($query) use ($profileId, $friendId) {
            $query->where('sender_id', $profileId)
                  ->where('receiver_id', $friendId);
        })->orWhere(function ($query) use ($profileId, $friendId) {
            $query->where('sender_id', $friendId)
                  ->where('receiver_id', $profileId);
        })->update(['status' => 'rejected']);
    }
}
<?php
namespace App\Http\Controllers;
use App\Models\Friendship;
use App\Models\Profile;
use App\Models\FriendRequest;
use Illuminate\Http\Request;

class FriendshipController extends Controller
{
    public function getFriends($profileId)
    {
        $profile = Profile::with('friends')->findOrFail($profileId);
        return response()->json($profile->friends);
    }
    public function deleteFriend($profileId, $friendId)
    {

        Friendship::where(function($query) use ($profileId, $friendId) {
            $query->where('user_id', $profileId)
                  ->where('friend_id', $friendId);
        })->delete();

        FriendRequest::where(function($query) use ($profileId, $friendId) {
            $query->where('sender_id', $profileId)
                  ->where('receiver_id', $friendId);
        })

        ->orWhere(function($query) use ($profileId, $friendId)
        {
            $query->where('sender_id', $friendId)
                  ->where('receiver_id', $profileId);
        })->update(['status' => 'rejected']);

        return response()->json(['message' => 'Друг удален']);
    }

    public function checkFriendship($profileId, $friendId)
    {
        $isFriend = Friendship::where('user_id', $profileId)
            ->where('friend_id', $friendId)
            ->exists();

        return response()->json(['is_friend' => $isFriend]);
    }

    public function getFriendshipStatus($profileId, $otherProfileId)
    {
        $isFriend = Friendship::where('user_id', $profileId)
            ->where('friend_id', $otherProfileId)
            ->exists();
        if ($isFriend) {
            return response()->json(['status' => 'friends']);
        }

        $outgoingRequest = FriendRequest::where('sender_id', $profileId)
            ->where('receiver_id', $otherProfileId)
            ->where('status', 'pending')
            ->exists();
        if ($outgoingRequest) {
            return response()->json(['status' => 'request_sent']);
        }

        $incomingRequest = FriendRequest::where('sender_id', $otherProfileId)
            ->where('receiver_id', $profileId)
            ->where('status', 'pending')
            ->exists();
        if ($incomingRequest) {
            return response()->json(['status' => 'request_received']);
        }
        return response()->json(['status' => 'not_friends']);
    }
}

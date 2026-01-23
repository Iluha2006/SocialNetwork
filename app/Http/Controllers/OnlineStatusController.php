<?php

namespace App\Http\Controllers;

use App\Events\OnlineUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class OnlineStatusController extends Controller
{

    public function getOnlineUsers(Request $request)
    {
        $onlineUsers = User::where('online_status', true)
            ->get(['id', 'name', 'last_seen']);

        return response()->json([
            'online_users' => $onlineUsers,]);
    }


    public function setUserOnline(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->setOnline();
            broadcast(new OnlineUser($user));

            return response()->json(
                [
                'message' => 'User is now online',
                'user' => $request->only(['id', 'name', 'online_status', 'last_seen'])
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }


    public function setUserOffline(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->setOffline();
            broadcast(new OnlineUser($user));

            return response()->json([
                'message' => 'User is now offline',
                'user' => $request->only(['id', 'name', 'online_status', 'last_seen'])
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }


    public function checkUserStatus($userId)
    {
        $user = User::findOrFail($userId);

        return response()->json([
            'user_id' => $user->id,
            'name' => $user->name,
            'is_online' => $user->isOnline(),
            'last_seen' => $user->last_seen,
            'online_status' => $user->online_status
        ]);
    }
}

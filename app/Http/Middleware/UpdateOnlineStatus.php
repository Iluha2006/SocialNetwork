<?php

namespace App\Http\Middleware;

use Closure;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UpdateOnlineStatus
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (Auth::check()) {
            $user = Auth::user();
            $user->update(['last_seen' => now()]);


            if (!$user->online_status) {
                $user->setOnline();
                broadcast(new \App\Events\OnlineUser($user));
            }
        }

        return $response;
    }
}
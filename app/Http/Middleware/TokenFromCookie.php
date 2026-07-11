<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        $authType = null;

        if ($request->cookie('social_cookie')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->cookie('social_cookie'));

            if (Auth::guard('api')->check()) {
                $authType = 'oauth';
                Auth::setUser(Auth::guard('api')->user());
            }
        }

        if (!$authType && Auth::guard('web')->check()) {
            $authType = 'session';
            Auth::setUser(Auth::guard('web')->user());
        }

        $request->merge(['auth_type' => $authType]);

        return $next($request);
    }
}
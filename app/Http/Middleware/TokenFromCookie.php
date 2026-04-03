<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use Illuminate\Http\Request;

class TokenFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        $authType = null;


        if ($request->cookie('social_cookie')) {

            $request->headers->set('Authorization', 'Bearer ' . $request->cookie('social_cookie'));


            if (Auth::guard('api')->check()) {
                $authType = 'oauth';
            }
        }


        if (!$authType && Auth::guard('web')->check()) {
            $authType = 'session';
        }




        $request->merge(['auth_type' => $authType]);

        return $next($request);
    }
}
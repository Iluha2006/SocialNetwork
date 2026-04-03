<?php

namespace App\Services;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Response;

class OauthService
{

    public function withTokenCookie(string $token, int $minutes = 43200)
    {
        return Cookie::make(
           'social_cookie',
            $token,
            $minutes,
            '/',
            null,
            false,
            true,
            false,
            'lax'
        )->withHttpOnly(true);
    }


    public function clearTokenCookie()
    {
        return Cookie::forget('social_cookie');
    }



}
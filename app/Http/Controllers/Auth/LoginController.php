<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\OauthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Cookie;

class LoginController extends ApiController
{

    public function __construct(
        private readonly OauthService $socialAuthService,

    ) {

    }
    public function login(LoginRequest $request)
    {

        $user = User::where('email', $request->email)->first();
       // !$user->hasVerifiedEmail()


    if (!$user->profile) {
        $user->load('profile');
    }

         Auth::login($user) ;

        return $this->success(
            data: [
                'user' => $user,
            ],
            message: 'Вход выполнен успешно'
        );
    }

    public function logout(Request $request)
    {

        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        Auth::logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $this->success(
            message: 'Выход выполнен успешно'
        )->withCookie($this->socialAuthService->clearTokenCookie());
    }
}
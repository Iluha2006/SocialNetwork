<?php

namespace App\Http\Controllers\Auth;

use App\Buses\Contracts\CommandBusInterface;
use App\Commands\Auth\LoginUserCommand;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\OauthService;
use Illuminate\Http\Request;

class LoginController extends ApiController
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly OauthService $socialAuthService,
    ) {}

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->commandBus->dispatch(new LoginUserCommand($request));

            return $this->success(
                data: ['user' => $result['user']],
                message: 'Вход выполнен успешно',
            );
        } catch (\RuntimeException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 401,
                errors: ['email' => [$e->getMessage()]],
            );
        }
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $user = $request->user();
            $user->setOffline();
            event(new \App\Events\OnlineUser($user));
            $user->currentAccessToken()->delete();
        }

        \Illuminate\Support\Facades\Auth::logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $this->success(
            message: 'Выход выполнен успешно',
        )->withCookie($this->socialAuthService->clearTokenCookie());
    }
}

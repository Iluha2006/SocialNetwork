<?php

namespace App\Handlers\Commands\Auth;

use App\Commands\Auth\LoginUserCommand;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginUserCommandHandler
{
    public function handle(LoginUserCommand $command): array
    {
        $user = User::where('email', $command->request->email)->first();

        if (!$user || !Hash::check($command->request->password, $user->password)) {
            throw new \RuntimeException('Неверный email или пароль');
        }

        if (!$user->profile) {
            $user->load('profile');
        }

        $user->setOnline();
        event(new \App\Events\OnlineUser($user));

        Auth::login($user);

        return [
            'user' => $user,
        ];
    }
}

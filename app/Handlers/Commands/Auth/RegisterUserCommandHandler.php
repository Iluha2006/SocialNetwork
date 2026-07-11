<?php

namespace App\Handlers\Commands\Auth;

use App\Commands\Auth\RegisterUserCommand;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterUserCommandHandler
{
    public function handle(RegisterUserCommand $command): array
    {
        $existingUser = User::where('email', $command->request->email)->first();
        if ($existingUser) {
            throw new \RuntimeException('Пользователь с таким email уже существует');
        }

        $user = User::create([
            'name' => $command->request->name,
            'email' => $command->request->email,
            'password' => Hash::make($command->request->password),
        ]);

        if (!$user->profile) {
            $user->profile()->create([
                'user_id' => $user->id,
                'name' => $command->request->name,
                'email' => $command->request->email,
            ]);
        }

        $user->setOnline();
        event(new \App\Events\OnlineUser($user));

        Auth::login($user);

        return [
            'user' => $user,
        ];
    }
}

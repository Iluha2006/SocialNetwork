<?php

namespace App\Action;

use App\Models\OAuthProvider;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class LoginOauth
{
    public function loginProvider($provider, $userData)
    {

        if ($userData instanceof SocialiteUser) {

            $email = $userData->getEmail();
            $name = $userData->getName();
            $providerId = $userData->getId();
        } else {

            $email = $userData['default_email'] ?? $userData['email'] ?? null;
            $name = $userData['real_name'] ?? $userData['display_name'] ?? $userData['name'] ?? null;
            $providerId = $userData['id'] ?? null;
        }

        $user = User::where('email', $email)->first();


        if (!$user) {
            $user = User::create([
                'name' => $name ?? 'User',
                'email' => $email,
                'password' => bcrypt(Str::random(16)),
                'email_verified_at' => now(),
            ]);
            Profile::create([
                'user_id' => $user->id,
                'email' => $email,
                'name' => $name ?? 'User',
            ]);
        }


        OAuthProvider::updateOrCreate(
            [
                'provider' => $provider,
                'provider_id' => $providerId,
            ],
            [
                'user_id' => $user->id,
            ]
        );

        return $user;
    }
}

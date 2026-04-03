<?php

namespace App\Services;

use App\Models\User;
use App\Models\Profile;
use App\Models\OAuthProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SocialAuthService
{

    public function handleCallback(string $provider, object $socialUser): array
    {
            $oauthProvider = OAuthProvider::where('provider', $provider)
                ->where('provider_id', $socialUser->getId())
                ->first();
            if ($oauthProvider) {
                $user = $oauthProvider->user;
                $action = 'existing';
            } else {
                $user = User::where('email', $socialUser->getEmail())->first();
                if ($user) {

                    $this->attachProvider($user, $provider, $socialUser);
                    $action = 'linked';
                } else {

                    $user = $this->createUserWithProfile($provider, $socialUser);
                    $this->attachProvider($user, $provider, $socialUser);
                    $action = 'created';
                }
            }


            Auth::login($user, true);
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'success' => true,
                'action' => $action,
                'user' => $user,
                'data' => $this->formatUserData($user),
                'token' => $token,
            ];


    }


    private function createUserWithProfile(string $provider, object $socialUser): User
    {
        return DB::transaction(function () use ($provider, $socialUser) {

            $user = User::create([
                'name' => $socialUser->getName() ,
                'email' => $socialUser->getEmail(),
                'password' => null,
                'email_verified_at' => now(),
            ]);


            $this->createProfile($user, $socialUser);

            return $user;
        });
    }


    private function createProfile(User $user, object $socialUser): Profile
    {
        return Profile::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $socialUser->getAvatar(),
        ]);
    }


    private function attachProvider(User $user, string $provider, object $socialUser): void
    {
        OAuthProvider::updateOrCreate(
            [
                'user_id' => $user->id,
                'provider' => $provider,
            ],
            values: [
                'provider_id' => $socialUser->getId(),
            ]
        );
    }

    private function formatUserData(User $user): array
    {

        $user->load('profile');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified' => $user->email_verified_at !== null,
            'profile' => $user->profile ? [
                'id' => $user->profile->id,
                'name' => $user->profile->name,
                'bio' => $user->profile->bio,
                'avatar' => $user->profile->avatar,
            ] : null,
            'oauth_providers' => $user->oauthProviders->pluck('provider')->toArray(),
        ];
    }

}
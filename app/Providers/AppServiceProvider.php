<?php

namespace App\Providers;
use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }


    public function boot(): void
    {

        URL::forceScheme('http');

        // Event::listen([
        //   IncomingCall::class,
        //   CallAccepted::class,
        //   CallEnded::class,
        //   CallRejected::class,
        //   OnlineUser::class,
        //   MessageDeleted::class,
        //   PrivateMessage::class
        // ]);



        if (env('APP_ENV') === 'local' && str_contains(env('APP_URL'), 'https')) {
            URL::forceScheme('https');
        }
    }
}
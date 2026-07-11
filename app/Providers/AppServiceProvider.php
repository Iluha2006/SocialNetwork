<?php

namespace App\Providers;

use App\Contracts\Media\MediaServiceInterface;
use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

use App\Contracts\Posts\LikePost;
use App\Repositories\Contracts\FriendshipRepositoryInterface;
use App\Repositories\FriendshipRepository;
use App\Services\Media\S3MediaService;
use App\Services\Posts\PostsLikeService;
class AppServiceProvider extends ServiceProvider

{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LikePost::class, PostsLikeService::class);
       $this->app-> singleton(FriendshipRepositoryInterface::class, FriendshipRepository::class);
    
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
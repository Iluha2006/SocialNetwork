<?php

namespace App\Providers;

use App\Contracts\Cache\CacheServiceInterface;
use App\Contracts\Profile\PrivateProfileServiceInterface;
use App\Contracts\Profile\ProfileServiceInterface;
use App\Services\Cache\CacheService;
use App\Services\Cache\MessageCacheService;
use App\Services\Posts\PostService;
use App\Services\Profile\ProfileService;
use App\Services\Profile\PrivateProfileService;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $this->app->singleton(CacheServiceInterface::class, CacheService::class);

        $this->app->singleton(ProfileServiceInterface::class, ProfileService::class);
        $this->app->singleton(PrivateProfileServiceInterface::class, PrivateProfileService::class);
        $this->app->singleton(PostService::class, PostService::class);

        $this->app->singleton(MessageCacheService::class, function ($app) {
            return new MessageCacheService($app->make(CacheServiceInterface::class));
        });
    }


    public function boot(): void
    {
        //
    }
}

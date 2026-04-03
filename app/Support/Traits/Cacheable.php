<?php

namespace App\Support\Traits;

use App\Contracts\Cache\CacheServiceInterface;
use Illuminate\Support\Facades\Cache;


trait Cacheable
{
    protected ?CacheServiceInterface $cacheService = null;

    protected int $defaultCacheTtl = 3600;


    public function setCacheService(CacheServiceInterface $cacheService): static
    {
        $this->cacheService = $cacheService;
        return $this;
    }


    protected function getCache(): CacheServiceInterface
    {
        if ($this->cacheService !== null) {
            return $this->cacheService;
        }
        return app(CacheServiceInterface::class);
    }

    protected function remember(string $key, int $ttl, callable $callback): mixed
    {
        return $this->getCache()->remember($key, $ttl, $callback);
    }

    protected function forget(string $key): bool
    {
        return $this->getCache()->forget($key);
    }

    protected function invalidateProfileCache(int $profileId): void
    {
        $this->forget("profile:{$profileId}");
    }

    protected function invalidateProfileListCache(): void
    {
        $this->forget('profiles:list');
    }
}

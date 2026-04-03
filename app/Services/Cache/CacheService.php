<?php

namespace App\Services\Cache;

use App\Contracts\Cache\CacheServiceInterface;
use Illuminate\Support\Facades\Cache;

class CacheService implements CacheServiceInterface
{
    public function remember(string $key, int $ttl, callable $callback): mixed
    {
        return Cache::remember($key, $ttl, $callback);
    }

    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return Cache::get($key, $default);
    }

    public function put(string $key, mixed $value, int $ttl): void
    {
        Cache::put($key, $value, $ttl);
    }
}

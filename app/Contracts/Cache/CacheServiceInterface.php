<?php

namespace App\Contracts\Cache;

interface CacheServiceInterface
{
    public function remember(string $key, int $ttl, callable $callback): mixed;

    public function forget(string $key): bool;

    public function get(string $key, mixed $default = null): mixed;

    public function put(string $key, mixed $value, int $ttl): void;
}

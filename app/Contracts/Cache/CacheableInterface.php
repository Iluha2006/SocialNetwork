<?php

namespace App\Contracts\Cache;

interface CacheableInterface
{
    public function getCacheKey(): string;

    public function getCacheTtl(): int;
}

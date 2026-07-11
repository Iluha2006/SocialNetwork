<?php

namespace App\Queries\Images;

class GetCurrentBackgroundQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

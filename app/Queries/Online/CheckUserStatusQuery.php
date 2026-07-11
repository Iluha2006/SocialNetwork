<?php

namespace App\Queries\Online;

class CheckUserStatusQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

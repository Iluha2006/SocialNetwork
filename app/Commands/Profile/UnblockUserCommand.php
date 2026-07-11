<?php

namespace App\Commands\Profile;

class UnblockUserCommand
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

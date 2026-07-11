<?php

namespace App\Commands\Profile;

class BlockUserCommand
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

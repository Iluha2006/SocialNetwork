<?php

namespace App\Commands\Profile;

class UpdateProfileCommand
{
    public function __construct(
        public readonly array $data,
        public readonly int $profileId,
    ) {}
}

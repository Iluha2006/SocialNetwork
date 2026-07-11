<?php

namespace App\Commands\Profile;

class DeleteProfileCommand
{
    public function __construct(
        public readonly int $profileId,
    ) {}
}

<?php

namespace App\Queries\Profile;

class GetProfileQuery
{
    public function __construct(
        public readonly int $profileId,
    ) {}
}

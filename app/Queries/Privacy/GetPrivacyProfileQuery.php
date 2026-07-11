<?php

namespace App\Queries\Privacy;

class GetPrivacyProfileQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?object $viewer = null,
    ) {}
}

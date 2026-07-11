<?php

namespace App\Queries\Privacy;

class GetPrivacySettingsQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

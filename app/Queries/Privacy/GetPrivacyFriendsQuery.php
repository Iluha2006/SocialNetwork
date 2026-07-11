<?php

namespace App\Queries\Privacy;

class GetPrivacyFriendsQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

<?php

namespace App\Queries\Privacy;

class GetPrivacyImagesQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

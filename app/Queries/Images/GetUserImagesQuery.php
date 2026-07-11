<?php

namespace App\Queries\Images;

class GetUserImagesQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

<?php

namespace App\Queries\Posts;

class GetUserPostsQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

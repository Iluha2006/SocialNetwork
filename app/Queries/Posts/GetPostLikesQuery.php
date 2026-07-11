<?php

namespace App\Queries\Posts;

class GetPostLikesQuery
{
    public function __construct(
        public readonly int $postId,
    ) {}
}

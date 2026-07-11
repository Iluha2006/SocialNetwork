<?php

namespace App\Queries\Posts;

class GetPostLikesHistoryQuery
{
    public function __construct(
        public readonly int $postId,
    ) {}
}

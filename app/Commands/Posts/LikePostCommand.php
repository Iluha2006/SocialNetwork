<?php

namespace App\Commands\Posts;

class LikePostCommand
{
    public function __construct(
        public readonly int $postId,
    ) {}
}

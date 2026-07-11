<?php

namespace App\Commands\Posts;

class UnlikePostCommand
{
    public function __construct(
        public readonly int $postId,
    ) {}
}

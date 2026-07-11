<?php

namespace App\Commands\Posts;

class DeletePostCommand
{
    public function __construct(
        public readonly int $postId,
    ) {}
}

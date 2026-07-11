<?php

namespace App\Commands\Comments;

class CreateCommentCommand
{
    public function __construct(
        public readonly int $postId,
        public readonly string $comment,
        public readonly int $userId,
    ) {}
}

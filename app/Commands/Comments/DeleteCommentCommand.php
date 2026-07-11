<?php

namespace App\Commands\Comments;

class DeleteCommentCommand
{
    public function __construct(
        public readonly int $commentId,
    ) {}
}

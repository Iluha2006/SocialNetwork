<?php

namespace App\Handlers\Commands\Comments;

use App\Commands\Comments\DeleteCommentCommand;
use App\Models\CommentPost;

class DeleteCommentCommandHandler
{
    public function handle(DeleteCommentCommand $command): void
    {
        $comment = CommentPost::findOrFail($command->commentId);
        $comment->delete();
    }
}

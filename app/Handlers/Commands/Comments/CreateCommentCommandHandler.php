<?php

namespace App\Handlers\Commands\Comments;

use App\Commands\Comments\CreateCommentCommand;
use App\Data\CommentData;
use App\Models\CommentPost;

class CreateCommentCommandHandler
{
    public function handle(CreateCommentCommand $command): CommentData
    {
        $comment = CommentPost::create([
            'comment' => $command->comment,
            'user_id' => $command->userId,
            'post_id' => $command->postId,
        ])->load('user');

        return CommentData::from($comment);
    }
}

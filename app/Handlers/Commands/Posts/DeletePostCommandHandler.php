<?php

namespace App\Handlers\Commands\Posts;

use App\Commands\Posts\DeletePostCommand;

class DeletePostCommandHandler
{
    public function handle(DeletePostCommand $command): void
    {
        $post = \App\Models\Post::findOrFail($command->postId);
        $post->delete();
    }
}

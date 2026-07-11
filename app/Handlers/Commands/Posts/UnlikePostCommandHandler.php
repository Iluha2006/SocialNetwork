<?php

namespace App\Handlers\Commands\Posts;

use App\Commands\Posts\UnlikePostCommand;
use App\Contracts\Posts\LikePost;

class UnlikePostCommandHandler
{
    public function __construct(
        private readonly LikePost $likeService,
    ) {}

    public function handle(UnlikePostCommand $command): array
    {
        $success = $this->likeService->deleteLike($command->postId);

        return [
            'status' => $success,
            'message' => 'Лайк успешно удалён',
        ];
    }
}

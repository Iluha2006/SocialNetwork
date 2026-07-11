<?php

namespace App\Handlers\Commands\Posts;

use App\Commands\Posts\LikePostCommand;
use App\Contracts\Posts\LikePost;

class LikePostCommandHandler
{
    public function __construct(
        private readonly LikePost $likeService,
    ) {}

    public function handle(LikePostCommand $command): array
    {
        $result = $this->likeService->likePost($command->postId);

        return [
            'status' => 'success',
            'liked' => (bool) $result['liked'],
            'count' => (int) $result['total_likes'],
        ];
    }
}

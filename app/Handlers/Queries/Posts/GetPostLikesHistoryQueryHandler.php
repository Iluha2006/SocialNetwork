<?php

namespace App\Handlers\Queries\Posts;

use App\Contracts\Posts\LikePost;
use App\Queries\Posts\GetPostLikesHistoryQuery;

class GetPostLikesHistoryQueryHandler
{
    public function __construct(
        private readonly LikePost $likeService,
    ) {}

    public function handle(GetPostLikesHistoryQuery $query): array
    {
        $history = $this->likeService->historyLikePost($query->postId);

        return ['history' => $history];
    }
}

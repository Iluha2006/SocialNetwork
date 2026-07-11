<?php

namespace App\Handlers\Queries\Posts;

use App\Contracts\Posts\LikePost;
use App\Queries\Posts\GetPostLikesQuery;

class GetPostLikesQueryHandler
{
    public function __construct(
        private readonly LikePost $likeService,
    ) {}

    public function handle(GetPostLikesQuery $query): array
    {
        return $this->likeService->getCountLike($query->postId);
    }
}

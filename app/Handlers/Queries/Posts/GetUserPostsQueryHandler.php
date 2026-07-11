<?php

namespace App\Handlers\Queries\Posts;

use App\Data\PostData;
use App\Queries\Posts\GetUserPostsQuery;
use App\Services\Posts\PostService;

class GetUserPostsQueryHandler
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    public function handle(GetUserPostsQuery $query): array
    {
        $posts = $this->postService->getUserPosts($query->userId);

        return PostData::collect($posts)->toArray();
    }
}

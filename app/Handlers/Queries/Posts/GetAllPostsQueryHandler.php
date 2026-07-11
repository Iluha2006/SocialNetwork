<?php

namespace App\Handlers\Queries\Posts;

use App\Data\PostData;
use App\Queries\Posts\GetAllPostsQuery;
use App\Services\Posts\PostService;

class GetAllPostsQueryHandler
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    public function handle(GetAllPostsQuery $query): array
    {
        $posts = $this->postService->getAllPosts();

        return PostData::collect($posts)->toArray();
    }
}

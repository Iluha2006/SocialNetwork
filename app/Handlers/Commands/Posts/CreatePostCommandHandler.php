<?php

namespace App\Handlers\Commands\Posts;

use App\Commands\Posts\CreatePostCommand;
use App\Data\PostData;
use App\Services\Posts\PostService;

class CreatePostCommandHandler
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    public function handle(CreatePostCommand $command): PostData
    {
        $post = $this->postService->store($command->request);

        return PostData::from($post);
    }
}

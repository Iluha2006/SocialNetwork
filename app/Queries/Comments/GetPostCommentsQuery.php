<?php

namespace App\Queries\Comments;

use App\Models\Post;

class GetPostCommentsQuery
{
    public function __construct(
        public readonly Post $post,
    ) {}
}

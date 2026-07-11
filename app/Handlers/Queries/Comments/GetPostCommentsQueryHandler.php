<?php

namespace App\Handlers\Queries\Comments;

use App\Data\CommentData;
use App\Queries\Comments\GetPostCommentsQuery;

class GetPostCommentsQueryHandler
{
    public function handle(GetPostCommentsQuery $query): array
    {
        $comments = $query->post->comments()
            ->with('user:id,name,email')
            ->latest()
            ->limit(50)
            ->get();

        return [
            'comments' => CommentData::collect($comments)->toArray(),
        ];
    }
}

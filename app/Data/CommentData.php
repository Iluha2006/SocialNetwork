<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CommentData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $comment,
        public readonly int $user_id,
        public readonly int $post_id,
        public readonly string $created_at,
        public readonly ?UserData $user = null,
    ) {}
}

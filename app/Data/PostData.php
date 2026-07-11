<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PostData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly ?string $content,
        public readonly ?string $images,
        public readonly ?string $videos,
        public readonly int $user_id,
        public readonly string $created_at,
        public readonly ?ProfileData $profile = null,
        public readonly ?bool $is_liked = null,
        public readonly int $likes_count = 0,
    ) {}
}

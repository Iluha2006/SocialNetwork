<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ImageData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly ?string $path_image,
        public readonly ?string $created_at = null,
    ) {}
}

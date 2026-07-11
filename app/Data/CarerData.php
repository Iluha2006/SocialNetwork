<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CarerData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly ?string $city,
        public readonly ?string $place_work,
        public readonly ?string $work_experience,
        public readonly ?string $skills_work,
        public readonly ?string $position,
    ) {}
}

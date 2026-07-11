<?php

namespace App\Queries\Carer;

class GetCarersQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

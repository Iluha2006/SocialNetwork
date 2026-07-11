<?php

namespace App\Commands\Images;

class DeleteImageCommand
{
    public function __construct(
        public readonly int $imageId,
    ) {}
}

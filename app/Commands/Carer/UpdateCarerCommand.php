<?php

namespace App\Commands\Carer;

use Illuminate\Http\Request;

class UpdateCarerCommand
{
    public function __construct(
        public readonly Request $request,
        public readonly int $carerId,
    ) {}
}

<?php

namespace App\Commands\Carer;

use Illuminate\Http\Request;

class CreateCarerCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

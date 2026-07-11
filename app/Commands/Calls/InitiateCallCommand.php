<?php

namespace App\Commands\Calls;

use Illuminate\Http\Request;

class InitiateCallCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

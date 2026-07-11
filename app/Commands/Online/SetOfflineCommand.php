<?php

namespace App\Commands\Online;

use Illuminate\Http\Request;

class SetOfflineCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

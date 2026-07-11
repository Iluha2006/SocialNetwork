<?php

namespace App\Commands\Online;

use Illuminate\Http\Request;

class SetOnlineCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

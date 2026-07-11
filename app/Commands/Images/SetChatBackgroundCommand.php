<?php

namespace App\Commands\Images;

use Illuminate\Http\Request;

class SetChatBackgroundCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

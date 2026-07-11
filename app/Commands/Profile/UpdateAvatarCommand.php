<?php

namespace App\Commands\Profile;

use Illuminate\Http\Request;

class UpdateAvatarCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

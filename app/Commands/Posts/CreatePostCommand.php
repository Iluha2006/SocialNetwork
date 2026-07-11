<?php

namespace App\Commands\Posts;

use Illuminate\Http\Request;

class CreatePostCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

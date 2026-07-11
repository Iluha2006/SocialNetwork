<?php

namespace App\Commands\Images;

use Illuminate\Http\Request;

class UploadImageCommand
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

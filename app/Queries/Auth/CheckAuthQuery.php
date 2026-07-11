<?php

namespace App\Queries\Auth;

use Illuminate\Http\Request;

class CheckAuthQuery
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

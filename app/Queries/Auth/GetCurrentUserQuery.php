<?php

namespace App\Queries\Auth;

use Illuminate\Http\Request;

class GetCurrentUserQuery
{
    public function __construct(
        public readonly Request $request,
    ) {}
}

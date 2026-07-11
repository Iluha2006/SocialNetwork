<?php

namespace App\Commands\Auth;

use App\Http\Requests\Auth\LoginRequest;

class LoginUserCommand
{
    public function __construct(
        public readonly LoginRequest $request,
    ) {}
}

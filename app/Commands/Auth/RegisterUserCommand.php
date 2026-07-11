<?php

namespace App\Commands\Auth;

use App\Http\Requests\Auth\RegisterRequest;

class RegisterUserCommand
{
    public function __construct(
        public readonly RegisterRequest $request,
    ) {}
}

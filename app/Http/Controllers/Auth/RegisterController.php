<?php

namespace App\Http\Controllers\Auth;

use App\Buses\Contracts\CommandBusInterface;
use App\Commands\Auth\RegisterUserCommand;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Auth\RegisterRequest;

class RegisterController extends ApiController
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
    ) {}

    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->commandBus->dispatch(new RegisterUserCommand($request));

            return $this->created(
                data: ['user' => $result['user']],
                message: 'Регистрация успешна. Проверьте почту для подтверждения.',
            );
        } catch (\RuntimeException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 409,
                errors: ['email' => $e->getMessage()],
            );
        }
    }
}

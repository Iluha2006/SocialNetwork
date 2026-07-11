<?php

namespace App\Buses;

use App\Buses\Contracts\CommandBusInterface;
use Illuminate\Container\Container;

class CommandBus implements CommandBusInterface
{
    public function __construct(
        private readonly Container $container
    ) {}

    public function dispatch(object $command): mixed
    {
        $handlerClass = $this->resolveHandlerClass($command);

        $handler = $this->container->make($handlerClass);

        return $handler->handle($command);
    }

    private function resolveHandlerClass(object $command): string
    {
        $commandClass = $command::class;

        $handlerClass = str_replace(
            'App\\Commands\\',
            'App\\Handlers\\Commands\\',
            $commandClass
        ) . 'Handler';

        if (!class_exists($handlerClass)) {
            throw new \RuntimeException("Handler not found for command: {$commandClass}");
        }

        return $handlerClass;
    }
}

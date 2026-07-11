<?php

namespace App\Buses;

use App\Buses\Contracts\QueryBusInterface;
use Illuminate\Container\Container;

class QueryBus implements QueryBusInterface
{
    public function __construct(
        private readonly Container $container
    ) {}

    public function ask(object $query): mixed
    {
        $handlerClass = $this->resolveHandlerClass($query);

        $handler = $this->container->make($handlerClass);

        return $handler->handle($query);
    }

    private function resolveHandlerClass(object $query): string
    {
        $queryClass = $query::class;

        $handlerClass = str_replace(
            'App\\Queries\\',
            'App\\Handlers\\Queries\\',
            $queryClass
        ) . 'Handler';

        if (!class_exists($handlerClass)) {
            throw new \RuntimeException("Handler not found for query: {$queryClass}");
        }

        return $handlerClass;
    }
}

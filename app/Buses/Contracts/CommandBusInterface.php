<?php

namespace App\Buses\Contracts;

interface CommandBusInterface
{
    public function dispatch(object $command): mixed;
}

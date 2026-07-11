<?php

namespace App\Buses\Contracts;

interface QueryBusInterface
{
    public function ask(object $query): mixed;
}

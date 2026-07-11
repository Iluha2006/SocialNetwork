<?php

namespace App\Commands\Contacts;

class CreateContactCommand
{
    public function __construct(
        public readonly array $data,
        public readonly int $userId,
    ) {}
}

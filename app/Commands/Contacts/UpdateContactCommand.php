<?php

namespace App\Commands\Contacts;

class UpdateContactCommand
{
    public function __construct(
        public readonly int $contactId,
        public readonly array $data,
    ) {}
}

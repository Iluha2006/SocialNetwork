<?php

namespace App\Commands\Contacts;

class DeleteContactCommand
{
    public function __construct(
        public readonly int $contactId,
    ) {}
}

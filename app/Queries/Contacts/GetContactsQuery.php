<?php

namespace App\Queries\Contacts;

class GetContactsQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

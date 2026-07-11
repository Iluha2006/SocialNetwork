<?php

namespace App\Queries\Messages;

class GetUserChatsQuery
{
    public function __construct(
        public readonly int $userId,
    ) {}
}

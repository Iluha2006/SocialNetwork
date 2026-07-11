<?php

namespace App\Commands\Messages;

class DeleteMessageCommand
{
    public function __construct(
        public readonly int $messageId,
    ) {}
}

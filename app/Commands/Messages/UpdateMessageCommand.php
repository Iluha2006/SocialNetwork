<?php

namespace App\Commands\Messages;

class UpdateMessageCommand
{
    public function __construct(
        public readonly int $messageId,
        public readonly ?string $content,
    ) {}
}

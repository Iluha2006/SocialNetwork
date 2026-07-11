<?php

namespace App\Handlers\Commands\Messages;

use App\Commands\Messages\DeleteMessageCommand;
use App\Services\MessageChatService;

class DeleteMessageCommandHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(DeleteMessageCommand $command): int
    {
        return $this->messageService->deleteMessage($command->messageId);
    }
}

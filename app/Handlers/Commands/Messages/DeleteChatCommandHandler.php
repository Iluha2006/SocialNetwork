<?php

namespace App\Handlers\Commands\Messages;

use App\Commands\Messages\DeleteChatCommand;
use App\Services\MessageChatService;

class DeleteChatCommandHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(DeleteChatCommand $command): bool
    {
        return $this->messageService->deleteChat(
            $command->currentUserId,
            $command->targetUserId,
        );
    }
}

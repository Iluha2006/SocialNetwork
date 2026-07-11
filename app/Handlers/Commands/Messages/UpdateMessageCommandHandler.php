<?php

namespace App\Handlers\Commands\Messages;

use App\Commands\Messages\UpdateMessageCommand;
use App\Data\MessageData;
use App\Services\MessageChatService;

class UpdateMessageCommandHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(UpdateMessageCommand $command): MessageData
    {
        $message = $this->messageService->updateMessage(
            $command->messageId,
            $command->content,
        );

        return MessageData::from($message);
    }
}

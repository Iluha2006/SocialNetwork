<?php

namespace App\Handlers\Commands\Messages;

use App\Commands\Messages\SendMessageCommand;
use App\Data\MessageData;
use App\Events\PrivateMessage;
use App\Services\MessageChatService;

class SendMessageCommandHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(SendMessageCommand $command): MessageData
    {
        $message = $this->messageService->sendMessage(
            $command->data,
            $command->receiverId,
            $command->image,
            $command->file,
        );

        broadcast(new PrivateMessage($message))->toOthers();

        return MessageData::from($message);
    }
}

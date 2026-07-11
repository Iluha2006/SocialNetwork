<?php

namespace App\Handlers\Queries\Messages;

use App\Queries\Messages\GetChatMessagesQuery;
use App\Services\MessageChatService;

class GetChatMessagesQueryHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(GetChatMessagesQuery $query): array
    {
        return [
            'success' => true,
            'messages' => $this->messageService->getChatMessages(
                $query->currentUserId,
                $query->otherUserId,
            ),
        ];
    }
}

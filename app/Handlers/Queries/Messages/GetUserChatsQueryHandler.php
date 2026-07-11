<?php

namespace App\Handlers\Queries\Messages;

use App\Queries\Messages\GetUserChatsQuery;
use App\Services\MessageChatService;

class GetUserChatsQueryHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(GetUserChatsQuery $query): array
    {
        $chats = $this->messageService->getUserChats($query->userId);

        return $chats->toArray();
    }
}

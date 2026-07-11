<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Messages\DeleteChatCommand;
use App\Queries\Messages\GetUserChatsQuery;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function getUserChats()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $chats = $this->queryBus->ask(new GetUserChatsQuery($userId));

        return response()->json($chats);
    }

    public function deleteChat($userId)
    {
        $currentUserId = Auth::id();

        if (!$currentUserId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $this->commandBus->dispatch(new DeleteChatCommand($currentUserId, (int) $userId));

        return response()->json(['success' => true]);
    }
}

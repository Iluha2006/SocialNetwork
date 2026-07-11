<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Messages\DeleteChatCommand;
use App\Commands\Messages\DeleteMessageCommand;
use App\Commands\Messages\SendMessageCommand;
use App\Commands\Messages\UpdateMessageCommand;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Queries\Messages\GetChatFilesQuery;
use App\Queries\Messages\GetChatMessagesQuery;
use Illuminate\Support\Facades\Auth;

class MessagesController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function updateMessage($messageId, \Illuminate\Http\Request $request)
    {
        $message = $this->commandBus->dispatch(
            new UpdateMessageCommand((int) $messageId, $request->input('content'))
        );

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    public function getFiles($userId)
    {
        $currentUserId = Auth::id();

        if (!$currentUserId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        return response()->json(
            $this->queryBus->ask(new GetChatFilesQuery($currentUserId, (int) $userId))
        );
    }

    public function sendMessage(StoreMessageRequest $request, $id)
    {
        $validated = $request->validated();

        $messageData = $this->commandBus->dispatch(
            new SendMessageCommand(
                $validated,
                (int) $id,
                $request->file('image_mess'),
                $request->file('file'),
            )
        );

        return response()->json([
            'success' => true,
            'message' => 'Сообщение успешно отправлено',
            'data' => $messageData,
        ]);
    }

    public function getChatMessages($userId)
    {
        $currentUserId = Auth::id();

        if (!$currentUserId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        return response()->json(
            $this->queryBus->ask(new GetChatMessagesQuery($currentUserId, (int) $userId))
        );
    }

    public function deleteMessage($messageId)
    {
        try {
            $deletedId = $this->commandBus->dispatch(
                new DeleteMessageCommand((int) $messageId)
            );

            return response()->json([
                'success' => true,
                'message' => 'Сообщение успешно удалено',
                'deleted_id' => $deletedId,
            ]);
        } catch (\Exception $e) {
            $status = in_array($e->getCode(), [401, 403, 404, 422, 500], true) ? $e->getCode() : 500;
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $status);
        }
    }
}

<?php
namespace App\Http\Controllers;

use App\Services\MessageChatService;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Events\PrivateMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessagesController extends Controller
{
    protected $messageService;
    public function __construct(MessageChatService $messageService)
    {
        $this->messageService = $messageService;
    }



    public function updateMessage(Request $request, $messageId)
    {
        $message = $this->messageService->updateMessage(
            $messageId,
            $request->input('content')
        );

        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }

    public function getFiles($userId)
    {
        $currentUserId = Auth::id();

        $files = $this->messageService->getChatFiles($currentUserId, (int)$userId);

        return response()->json([
            'success' => true,
            'files' => $files
        ]);
    }

    public function sendMessage(StoreMessageRequest $request, $id)
    {
        $validated = $request->validated();

        $message = $this->messageService->sendMessage(
            $validated,
            (int)$id,
            $request->file('image_mess'),
            $request->file('file'),

        );
        broadcast(new PrivateMessage($message))->toOthers();
        return response()->json([
            'success' => true,
            'message' => 'Сообщение успешно отправлено',
            'data' => $message,
        ]);
    }

    public function getChatMessages($userId)
    {
        $currentUserId = Auth::id();
        $messages = $this->messageService->getChatMessages($currentUserId, (int)$userId);
        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    public function deleteMessage($messageId)
    {
        try {
            $deletedId = $this->messageService->deleteMessage((int)$messageId);

            return response()->json([
                'success' => true,
                'message' => 'Сообщение успешно удалено',
                'deleted_id' => $deletedId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }

}

<?php

namespace App\Http\Controllers;

use App\Services\MessageChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ChatMessageController extends Controller
{
    protected $messageService;
    public function __construct(MessageChatService $messageService)
    {
        $this->messageService = $messageService;
    }


    public function getUserChats(Request $request)
    {
        $userId = Auth::id();
        $chats = $this->messageService->getUserChats($userId);
        return response()->json($chats);
    }
    public function deleteChat($userId)
    {
        $currentUserId = Auth::id();
        $this->messageService->deleteChat($currentUserId, (int)$userId);

        return response()->json(['success' => true]);
    }
}

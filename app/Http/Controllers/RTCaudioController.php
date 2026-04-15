<?php

namespace App\Http\Controllers;

use App\Services\AudioMessageService;
use App\Http\Requests\Audio\AudioMessageRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RTCaudioController extends Controller
{
    private AudioMessageService $audioService;

    public function __construct(AudioMessageService $audioService)
    {
        $this->audioService = $audioService;
    }

    public function index(Request $request)
    {
        $userId = Auth::id();
        $audioMessages = $this->audioService->getUserAudioMessages($userId);

        return response()->json(['data' => $audioMessages]);
    }

    public function sendMessageAudio(Request $request)
{
        $validated = $request->validate([
            'audio_mess' => 'required|file|mimes:audio/mpeg,mp3,wav,aac,webm,ogg,opus|max:10240',
            'receiver_id' => 'required|integer|exists:users,id',
        ]);
        $message = $this->audioService->createAudioMessage($validated);
        return response()->json([
            'success' => true,
            'data' => $message
        ]);
}
    public function getConversationAudio(Request $request, $otherUserId)
    {
        $userId = Auth::id();
        $messages = $this->audioService->getConversation($userId, $otherUserId);

        return response()->json(['data' => $messages]);
    }

    public function delete(Request $request, $messageId)
    {
        $userId = Auth::id();


            $this->audioService->deleteMessage($messageId, $userId);
            return response()->json(['success' => true]);

    }
}

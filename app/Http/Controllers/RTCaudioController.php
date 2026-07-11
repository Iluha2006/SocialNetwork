<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Audio\DeleteAudioMessageCommand;
use App\Commands\Audio\SendAudioMessageCommand;
use App\Queries\Audio\GetAudioMessagesQuery;
use App\Queries\Audio\GetConversationQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RTCaudioController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function index(Request $request)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        return response()->json($this->queryBus->ask(new GetAudioMessagesQuery($userId)));
    }

    public function sendMessageAudio(Request $request)
    {
        $validated = $request->validate([
            'audio_mess' => 'required|file|mimes:audio/mpeg,mp3,wav,aac,webm,ogg,opus|max:10240',
            'receiver_id' => 'required|integer|exists:users,id',
        ]);

        $message = $this->commandBus->dispatch(new SendAudioMessageCommand($validated));

        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    public function getConversationAudio(Request $request, $otherUserId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        return response()->json(
            $this->queryBus->ask(new GetConversationQuery($userId, (int) $otherUserId))
        );
    }

    public function delete(Request $request, $messageId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $this->commandBus->dispatch(new DeleteAudioMessageCommand((int) $messageId, $userId));

        return response()->json(['success' => true]);
    }
}

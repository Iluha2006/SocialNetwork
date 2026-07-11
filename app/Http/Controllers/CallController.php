<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Commands\Calls\AcceptCallCommand;
use App\Commands\Calls\InitiateCallCommand;
use App\Events\CallEnded;
use App\Events\CallRejected;
use App\Models\Call;
use Illuminate\Http\Request;

class CallController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
    ) {}

    public function initiateCall(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'call_type' => 'required|in:audio,video',
            'sdp_offer' => 'required|array',
        ]);

        try {
            $result = $this->commandBus->dispatch(new InitiateCallCommand($request));

            return response()->json($result);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to initiate call: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function acceptCall(Request $request, Call $call)
    {
        $request->validate(['sdp_answer' => 'required|array']);

        $result = $this->commandBus->dispatch(
            new AcceptCallCommand($call, $request->sdp_answer)
        );

        return response()->json($result);
    }

    public function rejectCall(Request $request, Call $call)
    {
        $call->update(['status' => 'rejected', 'ended_at' => now()]);
        broadcast(new CallRejected($call));

        return response()->json(['status' => 'rejected']);
    }

    public function endCall(Request $request, Call $call)
    {
        $call->endCall();
        broadcast(new CallEnded($call));

        return response()->json(['status' => 'ended']);
    }

    public function sendICECandidate(Request $request, Call $call)
    {
        $candidates = $call->ice_candidates ?? [];
        $candidates[] = $request->candidate;
        $call->update(['ice_candidates' => $candidates]);

        return response()->json(['status' => 'ok']);
    }

    public function getCallStatus(Request $request, Call $call)
    {
        return response()->json([
            'id' => $call->id,
            'status' => $call->status,
            'call_type' => $call->call_type,
            'caller_id' => $call->caller_id,
            'receiver_id' => $call->receiver_id,
        ]);
    }

    public function getUserCalls(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $calls = app(\App\Services\CallService::class)->getCallHistory($user->id);

        return response()->json($calls);
    }
}

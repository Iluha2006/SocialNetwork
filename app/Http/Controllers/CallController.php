<?php

namespace App\Http\Controllers;

use App\Models\Call;
use App\Models\User;
use App\Services\CallService;
use App\Events\IncomingCall;
use App\Events\CallAccepted;
use App\Events\CallRejected;
use App\Events\CallEnded;
use App\Events\WebRTCOffer;
use App\Events\Answer;
use App\Events\WebRTCIceCandidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

class CallController extends Controller
{
    protected $callService;

    public function __construct(CallService $callService)
    {
        $this->callService = $callService;
    }

    public function initiateCall(Request $request)
{
    try {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'call_type' => 'required|in:audio,video',
            'sdp_offer' => 'required|array'
        ]);


        $result = $this->callService->initiateCall($request);

          if (is_array($result) && isset($result['call'])) {

            $call = $result['call'];
        }

        $caller = Auth::user();
        $receiver = User::findOrFail($request->receiver_id);


        broadcast(new IncomingCall($call, $caller));
        broadcast(new WebRTCOffer($receiver->id, $request->sdp_offer, $caller->id));

        return response()->json([
            'call_id' => $call->id,
            'status' => 'initiated',
            'message' => 'Call initiated successfully'
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'error' => 'Failed to initiate call: ' . $e->getMessage()
        ], 500);
    }
}

    public function acceptCall(Request $request, Call $call)
    {
        $request->validate([
            'sdp_answer' => 'required|array'
        ]);

        $result = $this->callService->CallAccept($call, $request->sdp_answer);

        if ($result['success']) {
            broadcast(new CallAccepted($call, $request->sdp_answer));
            broadcast(new Answer($call->caller_id, $request->sdp_answer, Auth::id(),$call->id));

            return response()->json([
                'call_id' => $call->id,
                'status' => 'accepted'
            ]);
        }

        return response()->json(['error' => 'Failed to accept call'], 500);
    }
}

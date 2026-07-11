<?php

namespace App\Handlers\Commands\Calls;

use App\Commands\Calls\InitiateCallCommand;
use App\Events\IncomingCall;
use App\Events\WebRTCOffer;
use App\Models\User;
use App\Services\CallService;
use Illuminate\Support\Facades\Auth;

class InitiateCallCommandHandler
{
    public function __construct(
        private readonly CallService $callService,
    ) {}

    public function handle(InitiateCallCommand $command): array
    {
        $result = $this->callService->initiateCall($command->request);

        $call = $result['call'];
        $caller = Auth::guard('api')->user() ?? Auth::guard('web')->user();
        $receiver = User::findOrFail($command->request->receiver_id);

        broadcast(new IncomingCall($call, $caller));
        broadcast(new WebRTCOffer($receiver->id, $command->request->sdp_offer, $caller->id));

        return [
            'call_id' => $call->id,
            'caller_id' => $caller->id,
            'receiver_id' => $receiver->id,
            'call_type' => $call->call_type,
            'caller_name' => $caller->name,
            'caller_avatar' => $caller->profile?->avatar,
            'receiver_name' => $receiver->name,
            'receiver_avatar' => $receiver->profile?->avatar,
            'status' => 'initiated',
            'message' => 'Call initiated successfully',
        ];
    }
}

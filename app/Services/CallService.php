<?php

namespace App\Services;

use App\Models\Call;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CallService
{
    public function initiateCall(Request $request)
    {
        $caller = Auth::user();
        $receiver = User::findOrFail($request->receiver_id);

         $this->CallStatus($receiver->id, $caller->id);


            $call = Call::create([
                'caller_id' => $caller->id,
                'receiver_id' => $receiver->id,
                'status' => 'initiated',
                'call_type' => $request->call_type,
                'sdp_offer' => json_encode($request->sdp_offer)
            ]);

            return [
                'success' => true,
                'call' => $call,
                'message' => 'Call initiated successfully'
            ];

    }

    public function CallStatus($receiverId, $callerId)
    {
        $callStatus = ['can_call' => true];


        $activeCall = Call::where(function($query) use ($receiverId, $callerId) {
            $query->where('receiver_id', $receiverId)
                  ->orWhere('caller_id', $receiverId);
        })->whereIn('status', ['initiated', 'ringing', 'ongoing'])->first();

        if ($activeCall) {
            return [
                'can_call' => false,
                'error' => 'User is already in a call',
                'existing_call_id' => $activeCall->id
            ];
        }


        $lastCall = Call::where(function($query) use ($receiverId, $callerId) {
            $query->where('caller_id', $callerId)
                  ->where('receiver_id', $receiverId)
                  ->orWhere('caller_id', $receiverId)
                  ->where('receiver_id', $callerId);
        })->latest()->first();

        if (!$lastCall) {
            return $callStatus;
        }

        switch ($lastCall->status) {
            case 'ended':
            case 'missed':
            case 'rejected':

                return $callStatus;

            case 'initiated':
            case 'ringing':

                if ($lastCall->created_at->diffInMinutes(now()) > 2) {
                    $lastCall->update(['status' => 'missed']);
                    return $callStatus;
                }
                return [
                    'can_call' => false,
                    'error' => 'Call already in progress',
                    'existing_call_id' => $lastCall->id
                ];

            case 'ongoing':
                return [
                    'can_call' => false,
                    'error' => 'User is already in a call',
                    'existing_call_id' => $lastCall->id
                ];

            default:
                return $callStatus;
        }
    }

    public function CallAccept(Call $call, $sdpAnswer)
    {
        $call->update([
            'status' => 'ongoing',
            'started_at' => now(),
            'sdp_answer' => json_encode($sdpAnswer)
        ]);

        return [
            'success' => true,
            'call' => $call,
            'message' => 'Call accepted successfully'
        ];
    }
}
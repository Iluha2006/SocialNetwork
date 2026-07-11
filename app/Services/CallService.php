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
        $caller = $this->resolveCurrentUser();
        if (!$caller) {
            throw new \RuntimeException('User not authenticated');
        }

        $receiver = User::findOrFail($request->receiver_id);

        $statusResult = $this->CallStatus($receiver->id, $caller->id);
        if (isset($statusResult['can_call']) && !$statusResult['can_call']) {
            return $statusResult;
        }

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
      public function resolveCurrentUser(): ?User
    {
        return Auth::guard('api')->user() ?? Auth::guard('web')->user() ?? Auth::user();
    }
    public function CallStatus(int $receiverId,int  $callerId)
    {
        $callStatus = ['can_call' => true];


        $activeCall = Call::select(['id', 'status'])
            ->where(function($query) use ($receiverId, $callerId) {
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

                $lastCall->update(['status' => 'ringing']) ;
                $lastCall->update(['status'=> 'initiated']) ;
                return $callStatus;

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
  
public function getCallHistory(int $userId)
{
     $calls = Call::select('id', 'caller_id', 'receiver_id', 'call_type', 'status', 'duration', 'started_at', 'ended_at')
    ->where('caller_id', $userId)
    ->orWhere('receiver_id', $userId)
    ->orderBy('created_at', 'desc')
    ->limit(50)
    ->get();
    
    return $calls;
}
}
<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $call;
    public $sdpAnswer;

    public function __construct(Call $call, $sdpAnswer)
    {
        $this->call = $call;
        $this->sdpAnswer = $sdpAnswer;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('call-accept.' . $this->call->caller_id);
    }

    public function broadcastWith()
    {
        return [
            'call_id' => $this->call->id,
            'sdp_answer' => $this->sdpAnswer,
            'accepted_at' => $this->call->started_at->toISOString(),
            'receiver' => [
                'id' => $this->call->receiver->id,
                'name' => $this->call->receiver->name,
            ],
        ];
    }

    public function broadcastAs()
    {
        return 'call.accepted';
    }
}
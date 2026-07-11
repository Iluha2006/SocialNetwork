<?php

namespace App\Events;

use App\Models\Call;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IncomingCall implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $call;
    public $caller;

    public function __construct(Call $call, User $caller)
    {
        $this->call = $call;
        $this->caller = $caller;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('call.' . $this->call->receiver_id);
    }

    public function broadcastWith()
    {
        return [
            'call_id' => $this->call->id,
            'caller_id' => $this->call->caller_id,
            'receiver_id' => $this->call->receiver_id,
            'caller' => [
                'id' => $this->caller->id,
                'name' => $this->caller->name,
                'email' => $this->caller->email,
                'avatar' => $this->caller->profile?->avatar,
            ],
            'call_type' => $this->call->call_type,
            'sdp_offer' => $this->call->sdp_offer ? json_decode($this->call->sdp_offer, true) : null,
            'created_at' => $this->call->created_at->toISOString(),
        ];
    }

    public function broadcastAs()
    {
        return 'incoming.call';
    }
}
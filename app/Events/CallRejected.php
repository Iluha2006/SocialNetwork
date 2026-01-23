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

class CallRejected implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $call;

    public function __construct(Call $call)
    {
        $this->call = $call;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('call-reject.' . $this->call->caller_id);
    }

    public function broadcastWith()
    {
        return [
            'call_id' => $this->call->id,
            'rejected_by' => $this->call->receiver->id,
            'reason' => 'user_rejected',
            'rejected_at' => now()->toISOString(),
        ];
    }

    public function broadcastAs()
    {
        return 'call.rejected';
    }
}
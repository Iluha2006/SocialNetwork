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

class CallEnded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $call;

    public function __construct(Call $call)
    {
        $this->call = $call;
    }

    public function broadcastOn()
    {
        $ids = [$this->call->caller_id, $this->call->receiver_id];
        sort($ids);
        return new PrivateChannel('call-end.' . implode('.', $ids));

    }

    public function broadcastWith()
    {
        return [
            'call_id' => $this->call->id,
            'ended_by' => auth()->id(),
            'duration' => $this->call->duration,
            'ended_at' => $this->call->ended_at->toISOString(),
            'status' => 'ended',
        ];
    }

    public function broadcastAs()
    {
        return 'call.ended';
    }
}
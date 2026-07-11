<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;

class Answer implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $toUserId;
    public $answer;
    public $fromUserId;

    public $callId;

    public function __construct($toUserId, $answer, $fromUserId, $call)
    {
        $this->toUserId = $toUserId;
        $this->answer = $answer;
        $this->fromUserId = $fromUserId;
        $this->callId=$call;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->toUserId);
    }

    public function broadcastWith()
    {
        return [
            'answer' => $this->answer,
            'from' => $this->fromUserId,
            'call_id' => $this->callId,
        ];
    }

    public function broadcastAs()
    {
        return 'webrtc.answer';
    }
}
<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;

class Answer implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $toUserId;
    public $answer;
    public $fromUserId;

    public function __construct($toUserId, $answer, $fromUserId)
    {
        $this->toUserId = $toUserId;
        $this->answer = $answer;
        $this->fromUserId = $fromUserId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->toUserId);
    }

    public function broadcastWith()
    {
        return [
            'answer' => $this->answer,
            'from' => $this->fromUserId
        ];
    }

    public function broadcastAs()
    {
        return 'webrtc.answer';
    }
}
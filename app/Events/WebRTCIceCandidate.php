<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class WebRTCIceCandidate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $toUserId;
    public $candidate;
    public $fromUserId;

    public function __construct($toUserId, $candidate, $fromUserId)
    {
        $this->toUserId = $toUserId;
        $this->candidate = $candidate;
        $this->fromUserId = $fromUserId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->toUserId);
    }

    public function broadcastWith()
    {
        return [
            'candidate' => $this->candidate,
            'from' => $this->fromUserId
        ];
    }

    public function broadcastAs()
    {
        return 'webrtc.ice-candidate';
    }
}
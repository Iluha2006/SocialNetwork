<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;

class WebRTCOffer implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $toUserId;
    public $offer;
    public $fromUserId;
    public $callId;
    public function __construct($toUserId, $offer, $fromUserId, $callId = null )
    {
        $this->toUserId = $toUserId;
        $this->offer = $offer;
        $this->fromUserId = $fromUserId;
        $this->callId=$callId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->toUserId);
    }

    public function broadcastWith()
    {
        return [
            'offer' => $this->offer,
            'from' => $this->fromUserId,
            'call_id' => $this->callId,

        ];
    }
    public function broadcastAs()
    {
        return 'webrtc.offer';
    }
}
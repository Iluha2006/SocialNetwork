<?php
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class MessageDeleted implements ShouldBroadcast
{
    use Dispatchable;

    public $messageId;

    public function __construct($messageId)
    {
        $this->messageId = $messageId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('messages');
    }

    public function broadcastWith()
    {
        return ['id' => $this->messageId];
    }
}
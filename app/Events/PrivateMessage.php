<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class PrivateMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets ;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load(['sender', 'receiver']);
    }

    public function broadcastOn()
    {

    $ids = [$this->message->sender_id, $this->message->receiver_id];
    sort($ids);
    return new PrivateChannel('chat.' . implode('.', $ids));
    }

    public function broadcastAs()
    {
        return 'private-message';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'content' => $this->message->content,
            'images' => $this->message->images,
            'file' => $this->message->file,
            'sender_id' => $this->message->sender_id,
            'receiver_id' => $this->message->receiver_id,
            'sender' => [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ],
            'receiver' => [
                'id' => $this->message->receiver->id,
                'name' => $this->message->receiver->name,
            ],
            'timestamp' => $this->message->created_at->toISOString(),
            'created_at' => $this->message->created_at,
        ];
    }
}
<?php

namespace App\Jobs;

use App\Models\AudioMessage;
use App\Events\AudioMessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendAudioMessage implements ShouldQueue
{
    use Queueable;

    public $audioMessage;


    public function __construct(AudioMessage $audioMessage)
    {
        $this->audioMessage = $audioMessage->load(['sender', 'receiver']);

    }

    public function handle(): void
    {
        broadcast(new AudioMessageSent($this->audioMessage));
    }
}
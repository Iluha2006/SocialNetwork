<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class AudioMessage extends Model
{
    protected $fillable = [
        'sender_id',
        'audio_message',
        'receiver_id',
    ];

    protected function audioPath(): Attribute
    {
        return Attribute::get(fn () => $this->audio_message);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }


        public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
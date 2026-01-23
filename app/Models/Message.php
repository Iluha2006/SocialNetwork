<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'id',
        'sender_id',
        'file',
        'receiver_id',
        'content',
        'images',         ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function file()
    {
        return $this->hasMany(FileMessage::class);
    }
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}

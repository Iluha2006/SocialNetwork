<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'id',
        'sender_id',
        'file',
        'receiver_id',
        'content',
        'images',
    ];

    protected $appends = ['file_name'];

    protected function fileName(): Attribute
    {
        return Attribute::get(function () {
            $fileMessage = $this->files->first();
            if ($fileMessage) {
                return $fileMessage->original_name;
            }
            return null;
        });
    }

    protected function imageMess(): Attribute
    {
        return Attribute::get(fn () => $this->images);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function files()
    {
        return $this->hasMany(FileMessage::class);
    }
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}

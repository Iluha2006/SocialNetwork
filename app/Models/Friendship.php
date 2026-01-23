<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{

    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    protected $fillable = ['user_id', 'friend_id'];

    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }
    public function friend()
    {
        return $this->belongsTo(Profile::class, 'friend_id');
    }
}

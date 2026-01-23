<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivacySetting extends Model
{
    protected $fillable = [
        'user_id',
        'profile_visibility',
        'friends_visible',
        'images_visible',
        'visible_friends'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

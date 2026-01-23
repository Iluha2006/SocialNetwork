<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageProfile extends Model
{

    protected $fillable = [
        'user_id',
        'path_image',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city',
        'place_work',
        'work_experience',
        'skills_work',
        'position'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
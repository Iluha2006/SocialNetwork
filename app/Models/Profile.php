<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\AssignOp\Concat;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
          'bio',
        'avatar',
        'images',
        'videos',
        'email'
    ];


    public function carer()
    {
        return $this->hasMany(Carer::class);
    }
    public function contact()
    {
        return $this->hasMany(ContactProfile::class);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function friends()
    {
        return $this->belongsToMany(Profile::class, 'friendships', 'user_id', 'friend_id')
                    ->withTimestamps();
    }

    public function friendships()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }


    public function sentRequests()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedRequests()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }
}
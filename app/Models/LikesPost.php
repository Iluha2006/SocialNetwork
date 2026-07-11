<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Workbench\App\Models\User;

class LikesPost extends Model
{

    protected $fillable = ["user_id","post_id"];

    public function UserLike()
    {
        return $this->belongsTo(User::class);
    }
    public function post()
    {
        return $this->belongsTo(Post::class);
    }


    public function likesByPost($userId){ 

     return $this->where("user_id", $userId)->exists();
    }
}

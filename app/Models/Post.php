<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'images',
        'videos',
        'title',
        'content',
        'user_id',
        'media_type',
        'likes_count',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(CommentPost::class)->latest();
    }

   
    public function likes(): HasMany
    {
        return $this->hasMany(LikesPost::class);
    }

 
    public function likedByUser($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        return $this->hasOne(LikesPost::class)
                    ->where('user_id', $userId);
    }

   
    public function getIsLikedByCurrentUserAttribute()
    {

        
        return $this->likes()
                    ->where('user_id', Auth::id())
                    ->exists();
    }

   
    public function getTotalLikesCountAttribute()
    {
        return $this->likes_count ?? $this->likes()->count();
    }

    protected function profile(): Attribute
    {
        return Attribute::get(fn () => $this->user?->profile);
    }
}
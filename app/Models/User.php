<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'last_seen',
        'online_status',
        'phone_verified_at'
    ];


    protected $casts = [

        'last_seen' => 'datetime',
        'online_status' => 'boolean',
    ];


    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    public function contact()
    {
        return $this->hasMany(ContactProfile::class);
    }
    public function  carer()
    {
        return $this->hasMany(Carer::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function messagesAudio():HasMany
    {
        return $this->hasMany(AudioMessage::class);
    }
    public function privacySettings()
    {
        return $this->hasOne(PrivacySetting::class);
    }
    public function messages()
    {
        return $this->hasMany(Messages::class);
    }
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function image()
    {
        return $this->hasMany(ImageProfile::class);
    }

    public function imageBacround()
    {
        return $this->hasMany(ImagesBacround::class);
    }
    public function file()
    {
        return $this->hasMany(FileMessage::class);
    }
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }



    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class, 'blocker_id');
    }


    public function blockedByBlocks(): HasMany
    {
        return $this->hasMany(Block::class, 'blocked_id');
    }


    public function hasBlocked(User $user): bool
{

    return $this->blocks()->where('blocked_id', $user->id)->exists();
}


    public function isBlockedBy(User $user): bool
    {
        return $this->blockedByBlocks()->where('blocker_id', $user->id)->exists();
    }
}
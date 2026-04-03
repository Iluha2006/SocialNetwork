<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OAuthProvider extends Model
{

    protected $table = 'oauth_providers';
    protected $fillable = [
        'user_id', 'provider', 'provider_id'  ,  'token',
        'refresh_token',
        'token' => 'encrypted',
        'expires_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
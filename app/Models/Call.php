<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Call extends Model
{
    use HasFactory;

    protected $fillable = [
        'caller_id',
        'receiver_id',
        'status',
        'call_type',
        'sdp_offer',
        'sdp_answer',
        'ice_candidates',
        'started_at',
        'ended_at',
        'duration'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'ice_candidates' => 'array'
    ];

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['initiated', 'ringing', 'ongoing']);
    }

    public function endCall(): void
    {
        $this->update([
            'status' => 'ended',
            'ended_at' => now(),
            'duration' => $this->started_at ? now()->diffInSeconds($this->started_at) : 0
        ]);
    }
}
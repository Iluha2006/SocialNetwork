<?php

namespace App\Http\Resources\BlockedUser;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlockedUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name ?? $this->resource['name'] ?? null,
            'email' => $this->email ?? $this->resource['email'] ?? null,
            'avatar' => $this->avatar ?? $this->resource['avatar'] ?? null,
        ];
    }
}

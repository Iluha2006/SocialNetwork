<?php

namespace App\Commands\Calls;

use App\Models\Call;
use Illuminate\Http\Request;

class AcceptCallCommand
{
    public function __construct(
        public readonly Call $call,
        public readonly array $sdpAnswer,
    ) {}
}

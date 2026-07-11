<?php

namespace App\Handlers\Commands\Calls;

use App\Commands\Calls\AcceptCallCommand;
use App\Events\Answer;
use App\Events\CallAccepted;
use App\Services\CallService;
use Illuminate\Support\Facades\Auth;

class AcceptCallCommandHandler
{
    public function __construct(
        private readonly CallService $callService,
    ) {}

    public function handle(AcceptCallCommand $command): array
    {
        $result = $this->callService->CallAccept($command->call, $command->sdpAnswer);

        if ($result['success']) {
            broadcast(new CallAccepted($command->call, $command->sdpAnswer));
            broadcast(new Answer(
                $command->call->caller_id,
                $command->sdpAnswer,
                Auth::id(),
                $command->call->id,
            ));

            return [
                'call_id' => $command->call->id,
                'status' => 'accepted',
            ];
        }

        throw new \RuntimeException('Failed to accept call');
    }
}

<?php

namespace App\Handlers\Commands\Carer;

use App\Commands\Carer\UpdateCarerCommand;
use App\Models\Carer;

class UpdateCarerCommandHandler
{
    public function handle(UpdateCarerCommand $command): array
    {
        $user = $command->request->user();
        $carer = Carer::where('id', $command->carerId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $carer->update($command->request->all());

        return $carer->toArray();
    }
}

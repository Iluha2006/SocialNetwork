<?php

namespace App\Handlers\Commands\Carer;

use App\Commands\Carer\CreateCarerCommand;
use App\Models\Carer;

class CreateCarerCommandHandler
{
    public function handle(CreateCarerCommand $command): array
    {
        $user = $command->request->user();

        $existingCarer = Carer::where('user_id', $user->id)->first();
        if ($existingCarer) {
            throw new \RuntimeException('У вас уже есть информация об опыте работы. Вы можете только обновить существующую.');
        }

        $carer = Carer::create([
            'user_id' => $user->id,
            'city' => $command->request->city,
            'place_work' => $command->request->place_work,
            'work_experience' => $command->request->work_experience,
            'skills_work' => $command->request->skills_work,
            'position' => $command->request->position,
        ]);

        return $carer->toArray();
    }
}

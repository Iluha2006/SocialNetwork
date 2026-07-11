<?php

namespace App\Http\Controllers\Settings;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Carer\CreateCarerCommand;
use App\Commands\Carer\UpdateCarerCommand;
use App\Http\Controllers\Controller;
use App\Queries\Carer\GetCarersQuery;
use Illuminate\Http\Request;

class CarerController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function index($userId)
    {
        return response()->json($this->queryBus->ask(new GetCarersQuery((int) $userId)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'city' => 'nullable|string|max:255',
            'place_work' => 'nullable|string|max:255',
            'work_experience' => 'nullable|string',
            'skills_work' => 'nullable|string',
            'position' => 'nullable|string|max:255',
        ]);

        try {
            $result = $this->commandBus->dispatch(new CreateCarerCommand($request));

            return response()->json($result, 201);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'city' => 'nullable|string|max:255',
            'place_work' => 'nullable|string|max:255',
            'work_experience' => 'nullable|string',
            'skills_work' => 'nullable|string',
            'position' => 'nullable|string|max:255',
        ]);

        $carer = $this->commandBus->dispatch(new UpdateCarerCommand($request, (int) $id));

        return response()->json($carer);
    }
}

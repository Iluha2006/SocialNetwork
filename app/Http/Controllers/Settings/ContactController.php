<?php

namespace App\Http\Controllers\Settings;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Contacts\CreateContactCommand;
use App\Commands\Contacts\DeleteContactCommand;
use App\Commands\Contacts\UpdateContactCommand;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\CreateContactRequest;
use App\Queries\Contacts\GetContactsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function index($userId)
    {
        return response()->json($this->queryBus->ask(new GetContactsQuery((int) $userId)));
    }

    public function store(CreateContactRequest $request)
    {
        $validatedData = $request->validated();

        try {
            $contactData = $this->commandBus->dispatch(
                new CreateContactCommand($validatedData, Auth::id())
            );

            return response()->json([
                'success' => true,
                'message' => 'Контакт успешно создан',
                'data' => $contactData,
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contactData = $this->commandBus->dispatch(
                new UpdateContactCommand((int) $id, $validator->validated())
            );

            return response()->json([
                'success' => true,
                'message' => 'Контакт успешно обновлен',
                'data' => $contactData,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->commandBus->dispatch(new DeleteContactCommand((int) $id));

            return response()->json(['success' => true, 'message' => 'Контакт успешно удален']);
        } catch (\RuntimeException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }
}

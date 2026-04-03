<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactProfile;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Contact\CreateContactRequest;
use Illuminate\Support\Facades\Auth;
class ContactController extends Controller
{




    public function index($userId)
    {




        $contacts = ContactProfile::where('user_id', $userId)->get();
        return response()->json($contacts);
    }

    public function store(CreateContactRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();


        $existingContact = ContactProfile::where('user_id', Auth::id())->first();

        if ($existingContact) {
            return response()->json([
                'success' => false,
                'message' => 'У вас уже есть контактная информация. Вы можете только обновить существующую.'
            ], 422);
        }


        $existingPhone = ContactProfile::where('phone', $validatedData['phone'])->first();
        if ($existingPhone) {
            return response()->json([
                'success' => false,
                'message' => 'Этот номер телефона уже используется другим пользователем.'
            ], 422);
        }

        $contact = ContactProfile::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Контакт успешно создан',
            'data' => $contact
        ], 201);
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
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        $contact = ContactProfile::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Контакт не найден'
            ], 404);
        }


        $contact->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Контакт успешно обновлен',
            'data' => $contact
        ]);
    }

    public function destroy($id)
    {
        $contact = ContactProfile::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Контакт не найден'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Контакт успешно удален'
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Carer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarerController extends Controller
{
    public function index($userId)
    {
        $carers = Carer::where('user_id', $userId)->get();


        return response()->json($carers);
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

        $user = Auth::user();
        if (!$user) {

            return response()->json([
                'message' => 'Пользователь не авторизован'
            ], 401);
        }
        $existingCarer = Carer::where('user_id', $user->id)->first();

        if ($existingCarer) {
            return response()->json([
                'success' => false,
                'message' => 'У вас уже есть информация об опыте работы. Вы можете только обновить существующую.'
            ], 422);
        }


            $carer = Carer::create([
                'user_id' => $user->id,
                'city' => $request->city,
                'place_work' => $request->place_work,
                'work_experience' => $request->work_experience,
                'skills_work' => $request->skills_work,
                'position' => $request->position,
            ]);

            return response()->json($carer, 201);

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

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $carer = Carer::where('id', $id)
                     ->where('user_id', $user->id)
                     ->firstOrFail();

        $carer->update($request->all());

        return response()->json($carer);
    }


}
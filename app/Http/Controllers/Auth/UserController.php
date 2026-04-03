<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    public function getCurrentUser(Request $request)
    {

            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated'
                ], 401);
            }


            $user->load([
                'profile',

            ]);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);


    }


    public function checkAuth(Request $request)
    {
        return response()->json([
            'authenticated' => $request->user() ? true : false,
            'user' => $request->user()
        ]);
    }
}

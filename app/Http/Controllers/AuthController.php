<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Profile;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        $user->update(['last_seen' => now()]);


        if (!$user->profile) {
            $user->profile()->create([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        }


        Auth::login($user);

        return response()->json([
            'user' => $user,
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');


        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Неверные учетные данные'
            ], 401);
        }


        $user = Auth::user();


        $user->update([
            'last_seen' => now(),
            'online_status' => true
        ]);


        if (!$user->profile) {
            Profile::create([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        }


        return response()->json([
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
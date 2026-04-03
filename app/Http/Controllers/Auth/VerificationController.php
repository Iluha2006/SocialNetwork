<?php

namespace App\Http\Controllers\Auth;


use App\Jobs\SendVerificationEmail;
use Illuminate\Auth\Events\Verified;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
class VerificationController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $id = $request->route('id');
        $hash = $request->route('hash');

        $user = User::find($id);

        if (!$user) {
            return redirect('/login?error=user_not_found');
        }
        if (! hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
            return redirect('/login?error=invalid_hash');
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return redirect('/email-verified');
    }

    public function verify(Request $request)
    {

        $user = User::find($request->route('id'));
        if (!$user) {
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }
        if (!hash_equals((string) $request->route('id'), (string) $user->getKey())) {
            return response()->json(['message' => 'Неверная ссылка'], 403);
        }

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Неверная ссылка'], 403);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email уже подтвержден'], 200);
        }
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
        return response()->json(['message' => 'Email успешно подтвержден! Теперь вы можете войти.'], 200);
    }
    public function checkVerification(Request $request): JsonResponse
    {

        $user = $request->user();
        $isVerified = $user->hasVerifiedEmail();

        return response()->json([
            'success' => true,
            'verified' => $isVerified,
            'user' => [
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
            ],
            'message' => $isVerified
                ? 'Email подтвержден'
                : 'Требуется подтверждение email',
                'redirect_to' => '/login'
        ]);
    }

    public function resend(RegisterRequest $request)
    {

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Пользователь с таким email не найден'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email уже подтвержден. Вы можете войти.'
            ], 422);
        }
        SendVerificationEmail::dispatch($user);
        return response()->json([
            'message' => 'Письмо подтверждения отправлено повторно. Проверьте почту.'
        ], 200);
    }
}


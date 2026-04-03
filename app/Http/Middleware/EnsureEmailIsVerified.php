<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->user() || !$request->user()->mustVerifyEmail() || $request->user()->hasVerifiedEmail()) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Пожалуйста, подтвердите email',
            'error' => 'email_not_verified',
            'redirect_to' => '/email/verify'
        ], Response::HTTP_FORBIDDEN);
    }
}
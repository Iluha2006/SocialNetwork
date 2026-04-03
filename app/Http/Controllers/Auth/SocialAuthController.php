<?php

namespace App\Http\Controllers\Auth;

use App\Action\LoginOauth;
use App\Http\Controllers\Controller;
use App\Services\OauthService;
use App\Services\SocialAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use  Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function __construct(
        private readonly OauthService $socialAuthService,
        private readonly LoginOauth $loginOauth,
    ) {

    }


    public function redirectToYandex()
    {
        $redirectResponse = Socialite::driver('yandex')->with(['force_confirm' => 'true']) ->stateless()->redirect();


        $redirect_url = $redirectResponse->getTargetUrl();

    return response()->json([
        'success' => true,
        'redirect_url' => $redirect_url,
    ]);



    }
    public function callback(Request $request)
    {

        $code = $request->input('code');

        if (is_array($code) && isset($code['code'])) {
            $code = $code['code'];
        }

            $tokenResponse = Http::asForm()->post('https://oauth.yandex.ru/token', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'client_id' => config('services.yandex.client_id'),
                'client_secret' => config('services.yandex.client_secret'),
                'redirect_uri' => config('services.yandex.redirect'),
            ]);



            $tokens = $tokenResponse->json();



            $userResponse = Http::withHeaders([
                'Authorization' => 'OAuth ' . $tokens['access_token'],
            ])->get('https://login.yandex.ru/info');


            $yandexUser = $userResponse->json();




            $user = $this->loginOauth->loginProvider('yandex', $yandexUser);


            $tokenResult = $user->createToken('Yandex OAuth');
            $yourToken = $tokenResult->accessToken;



            $cookie = $this->socialAuthService->withTokenCookie($yourToken);

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],

            ])->withCookie($cookie);


    }

    public function logout(Request $request)
    {

        if ($request->user()) {
            $request->user()->token()->revoke();
        }

        return response()->json(['success' => true])
            ->withCookie($this->socialAuthService->clearTokenCookie());
    }
}



<?php
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\ChatMessageController;

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\MessagesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;

use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\CallController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\Settings\ContactController;
use App\Http\Controllers\OnlineStatusController;
use App\Http\Controllers\RTCaudioController;
use App\Http\Controllers\Settings\CarerController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\WebRTCController;

use App\Http\Controllers\Settings\PrivacySettingsController;
use App\Http\Controllers\Auth\SocialAuthNetwork;
use App\Http\Controllers\Image\ImageController;
use App\Http\Controllers\Images\ImagesBacroundController;

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/email/verification-notification', function (Request $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }
        \App\Jobs\SendVerificationEmail::dispatch($request->user());
        return response()->json(['message' => 'Verification link sent']);
    })->name('verification.send');

    Route::get('/email/verification-status', [VerificationController::class, 'checkVerification'])
        ->name('verification.status');
});


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [UserController::class, 'getCurrentUser']);


    Route::get('/user/check', [UserController::class, 'checkAuth']);
});



Route::get('/email/verify/{id}/{hash}', [VerificationController::class, '__invoke'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/resend', [VerificationController::class, 'resend'])
    ->name('verification.resend');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/chat-background', [ImagesBacroundController::class, 'setChatBackground']);
    Route::get('/chat-background/{userId}', [ImagesBacroundController::class, 'getCurrentBackground']);
    Route::delete('/chat-background/{id}', [ImagesBacroundController::class, 'destroy']);
});

Route::prefix('auth')->middleware('auth.token' )->group(function () {

    Route::get('/yandex/redirect', [SocialAuthController::class, 'redirectToYandex']);
    Route::post('/yandex/callback', [SocialAuthController::class, 'callback'])->name('yandex.callback');
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');

});

Route::prefix('api')->middleware('auth.token' )->group(function () {
    Route::post('/create-carers', [CarerController::class, 'store']);
    Route::put('/update-carers/{id}', [CarerController::class, 'update']);

    Route::get('/carers/{userId}', [CarerController::class, 'index']);
});






Route::middleware(['auth.token' ])->group(function () {
    Route::prefix('online-status')->group(function () {
        Route::get('/users', [OnlineStatusController::class, 'getOnlineUsers']);
        Route::post('/online', [OnlineStatusController::class, 'setUserOnline']);
        Route::post('/offline', [OnlineStatusController::class, 'setUserOffline']);
        Route::get('/user/{userId}', [OnlineStatusController::class, 'checkUserStatus']);
    });
});



    Route::prefix('contacts')->middleware(['auth.token' ])->group(function () {
        Route::get('/{userId}', [ContactController::class, 'index']);
        Route::post('/', [ContactController::class, 'store']);
        Route::put('/{id}', [ContactController::class, 'update']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });




Route::middleware(['auth.token' ])->group(function () {

    Route::post('/messages/send/{id}', [MessagesController::class, 'sendMessage']);
    Route::get('/messages/chats', [MessagesController::class, 'getChatMessages']);
    Route::get('/files/{userId}', [MessagesController::class, 'getFiles']);
    Route::put('/messages/chat/{messageId}', [MessagesController::class, 'updateMessage']);
    Route::delete('/messages/{messageId}', [MessagesController::class, 'deleteMessage']);
});




Route::middleware('auth.token')->group(function () {
    Route::get('/messages/mess-chats', [ChatMessageController::class, 'getUserChats']);
    Route::delete('/messages/chat/{userId}', [ChatMessageController::class, 'deleteChat']);

});




Route::middleware('auth.token')->group(function () {

  Route::get('/friends/{profileId}', [FriendshipController::class, 'getFriends']);
  Route::delete('/friends/{profileId}/{friendId}', [FriendshipController::class, 'deleteFriend']);
  Route::get('/friends/check/{profileId}/{friendId}', [FriendshipController::class, 'checkFriendship']);
  Route::get('/friends/status/{profileId}/{otherProfileId}', [FriendshipController::class, 'getFriendshipStatus']);

});



Route::middleware('auth.token')->group(function () {
    Route::prefix('calls')->group(function () {
        Route::post('/initiate', [CallController::class, 'initiateCall']);
        Route::post('/accept/{call}', [CallController::class, 'acceptCall']);
        Route::post('/reject/{call}', [CallController::class, 'rejectCall']);
        Route::post('/end/{call}', [CallController::class, 'endCall']);
        Route::post('/ice-candidate/{call}', [CallController::class, 'sendICECandidate']);
        Route::get('/status/{call}', [CallController::class, 'getCallStatus']);
        Route::get('/historycals', [CallController::class, 'getUserCalls']);
    });
});

Route::middleware('auth.token')->group(function () {
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
});


Route::middleware('auth.token')->group(function () {
    Route::post('/friend/send', [FriendRequestController::class, 'send']);
    Route::post('/friend/accept/{requestId}', [FriendRequestController::class, 'accept']);
    Route::post('/friend/reject/{requestId}', [FriendRequestController::class, 'reject']);
    Route::get('/friend/{profileId}', [FriendRequestController::class, 'getRequests']);

 });




 Route::middleware( 'auth.token')->group(function () {

    Route::get('/privacy-settings', [PrivacySettingsController::class, 'getPrivacySettings']);
    Route::post('/privacy-settings', [PrivacySettingsController::class, 'updatePrivacySettings']);


    Route::get('/profile/{userId}/privacy-check', [PrivacySettingsController::class, 'PrivacyProfile']);
    Route::get('/profile/{userId}/friends/privacy', [PrivacySettingsController::class, 'PrivacyFriends']);
    Route::get('/profile/{userId}/images/privacy', [PrivacySettingsController::class, 'PrivacyImages']);
});




Route::middleware('auth.token')->group( function () {


        Route::get('/blocked-users', [ProfileController::class, 'getBlockedUsers']);
        Route::get('/profile', [ProfileController::class, 'index']);
        Route::get('/profile/{id}', [ProfileController::class, 'show']);
        Route::get('/profiles/{id}/friends', [ProfileController::class, 'getFriends']);
        Route::get('/profiles/{id}/images', [ProfileController::class, 'getImages']);
        Route::put('/profile/update/{id}', [ProfileController::class, 'update']);
        Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']);
        Route::post('/profiles/{userId}/block', [ProfileController::class, 'block']);
        Route::post('/profiles/{userId}/unblock', [ProfileController::class, 'unblock']);
        Route::get('/blocked-users', [ProfileController::class, 'getBlockedUsers']);

        Route::post('/update-avatar', [ProfileController::class, 'updateAvatar']);

});





Route::middleware('auth.token')->group(function () {
    Route::get('/images/{userId}', [ImageController::class, 'index']);
    Route::post('/images/upload', [ImageController::class, 'store']);
    Route::delete('/images/{id}', [ImageController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::get('/posts/user/{userId}', [PostController::class, 'getUserPosts']);

});

Route::get('/posts', [PostController::class, 'getAllPosts']);








Route::middleware(['auth.token' ])->group(function () {
    Route::prefix('audio')->group(function () {

        Route::get('/messages', [RTCaudioController::class, 'index']);


        Route::post('/send-message', [RTCaudioController::class, 'sendMessageAudio']);



        Route::get('/conversation/{otherUserId}', [RTCaudioController::class, 'getConversationAudio']);

        Route::delete('/delete/{messageId}', [RTCaudioController::class, 'delete']);
    });
});


Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the application and automatically get the "api"
| middleware group and the "/api" URL prefix.
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/create-carers', [CarerController::class, 'store']);
    Route::put('/update-carers/{id}', [CarerController::class, 'update']);
    Route::get('/carers/{userId}', [CarerController::class, 'index']);
});


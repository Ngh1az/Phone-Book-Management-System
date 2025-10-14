<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protected API routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Contact routes - Define specific routes BEFORE apiResource
    Route::get('contacts/trashed', [ContactController::class, 'trashed'])->name('contacts.trashed');
    Route::post('contacts/{id}/restore', [ContactController::class, 'restore'])->name('contacts.restore');
    Route::post('contacts/{contact}/toggle-favorite', [ContactController::class, 'toggleFavorite'])->name('contacts.toggle-favorite');
    Route::apiResource('contacts', ContactController::class);

    // Group routes
    Route::apiResource('groups', GroupController::class);

    // Tag routes
    Route::apiResource('tags', TagController::class);
});

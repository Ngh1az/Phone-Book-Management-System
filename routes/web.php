<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Redirect to dashboard if authenticated, otherwise to login
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Web\DashboardController::class, 'index'])
        ->name('dashboard');

    // Contact Management Routes
    Route::get('contacts/trash', [App\Http\Controllers\Web\ContactController::class, 'trash'])
        ->name('contacts.trash');
    Route::post('contacts/{id}/restore', [App\Http\Controllers\Web\ContactController::class, 'restore'])
        ->name('contacts.restore');
    Route::delete('contacts/{id}/force', [App\Http\Controllers\Web\ContactController::class, 'forceDelete'])
        ->name('contacts.force-delete');
    Route::resource('contacts', App\Http\Controllers\Web\ContactController::class);
    Route::post('contacts/{contact}/toggle-favorite', [App\Http\Controllers\Web\ContactController::class, 'toggleFavorite'])
        ->name('contacts.toggle-favorite');

    Route::resource('groups', App\Http\Controllers\Web\GroupController::class);
    Route::resource('tags', App\Http\Controllers\Web\TagController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

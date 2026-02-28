<?php

use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\RealizationAdminController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\RealizationController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::post('/contact', [ContactController::class, 'store']);
Route::get('/realizations', [RealizationController::class, 'index']);
Route::get('/realizations/{id}', [RealizationController::class, 'show'])->whereNumber('id');

Route::prefix('admin')->middleware([StartSession::class])->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        Route::get('/realizations', [RealizationAdminController::class, 'index']);
        Route::post('/realizations', [RealizationAdminController::class, 'store']);
        Route::post('/realizations/gallery/upload', [RealizationAdminController::class, 'uploadGalleryImage']);
        Route::get('/realizations/{realization}', [RealizationAdminController::class, 'show']);
        Route::put('/realizations/{realization}', [RealizationAdminController::class, 'update']);
        Route::patch('/realizations/{realization}/toggle-published', [RealizationAdminController::class, 'togglePublished']);
        Route::post('/realizations/{realization}/toggle-published', [RealizationAdminController::class, 'togglePublished']);
        Route::delete('/realizations/{realization}', [RealizationAdminController::class, 'destroy']);
        Route::delete('/realizations/{realization}/gallery', [RealizationAdminController::class, 'removeGalleryImage']);
    });
});

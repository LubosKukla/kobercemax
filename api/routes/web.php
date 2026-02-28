<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return response()->json([
        'message' => 'Prihlasenie je dostupne cez Vue admin stranku.',
    ], 401);
})->name('login');


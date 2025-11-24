<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\GameProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/game-profile', [GameProfileController::class, 'show']);
    Route::post('/game-profile', [GameProfileController::class, 'store']);
    Route::put('/game-profile', [GameProfileController::class, 'update']);
    Route::delete('/game-profile', [GameProfileController::class, 'destroy']);
    Route::get('/game-profile/{userId}', [GameProfileController::class, 'getPublicProfile']);

    Route::get('/locations/random', [LocationController::class, 'getRandom']);

    Route::post('/games', [GameController::class, 'create']);
    Route::post('/games/{id}/rounds', [GameController::class, 'submitRound']);
    Route::post('/games/{id}/complete', [GameController::class, 'complete']);

    Route::get('/leaderboard', [LeaderboardController::class, 'index']);
    Route::get('/leaderboard/user/{id}', [LeaderboardController::class, 'userScores']);
});

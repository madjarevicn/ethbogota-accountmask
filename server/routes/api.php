<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1'], function ($router) {


    Route::group(['prefix' => 'transactions'], function ($router) {
        Route::get('/{wallet}', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'show']);
        Route::delete('/{wallet}', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'delete']);
        Route::put('/', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'update']);
        Route::post('/', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'create']);
    });

    Route::group(['prefix' => 'alerts'], function ($router) {
        Route::get('/{wallet}', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'showAlert']);
        Route::post('/', [\App\Http\Controllers\Api\v1\Transaction\TransactionController::class, 'createAlert']);
    });


});

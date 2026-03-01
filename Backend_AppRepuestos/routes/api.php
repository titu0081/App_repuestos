<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PartController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\RepairController;
use App\Http\Controllers\InventoryMovementController;
use App\Http\Controllers\RepairConsumptionController;
use App\Http\Controllers\AuthController;

Route::prefix('parts')->group(function () {
    Route::get('/', [PartController::class, 'index']);
    Route::get('/search', [PartController::class, 'search']);
    Route::get('/{id}', [PartController::class, 'show']);
    Route::get('/{id}/stock', [PartController::class, 'stock']);
    Route::post('/', [PartController::class, 'store']);
    Route::patch('/{id}', [PartController::class, 'update']);
    Route::delete('/{id}', [PartController::class, 'destroy']);
});

Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class,'index']);
    Route::get('/search', [ClientController::class,'search']);
    Route::get('/{id}', [ClientController::class,'show']);
    Route::post('/', [ClientController::class,'store']);
    Route::patch('/{id}', [ClientController::class,'update']);
    Route::delete('/{id}', [ClientController::class,'destroy']);
});

Route::prefix('devices')->group(function () {
    Route::get('/', [DeviceController::class,'index']);
    Route::get('/search', [DeviceController::class,'search']);
    Route::get('/{id}', [DeviceController::class,'show']);
    Route::post('/', [DeviceController::class,'store']);
    Route::patch('/{id}', [DeviceController::class,'update']);
    Route::delete('/{id}', [DeviceController::class,'destroy']);
});

Route::prefix('repairs')->group(function () {
    Route::get('/', [RepairController::class, 'index']);
    Route::get('/search', [RepairController::class, 'search']);
    Route::get('/{id}', [RepairController::class, 'show']);
    Route::post('/', [RepairController::class, 'store']);
    Route::patch('/{id}', [RepairController::class, 'update']);
    Route::delete('/{id}', [RepairController::class, 'destroy']);
});


Route::prefix('inventory-movements')->group(function () {
    Route::get('/', [InventoryMovementController::class, 'index']);
    Route::get('/search', [InventoryMovementController::class, 'search']);
    Route::get('/{id}', [InventoryMovementController::class, 'show']);
    Route::post('/', [InventoryMovementController::class, 'store']);
    Route::patch('/{id}', [InventoryMovementController::class, 'update']);
    Route::delete('/{id}', [InventoryMovementController::class, 'destroy']);
});

Route::prefix('repair-consumptions')->group(function () {
    Route::get('/', [RepairConsumptionController::class, 'index']);
    Route::get('/search', [RepairConsumptionController::class, 'search']);
    Route::get('/{id}', [RepairConsumptionController::class, 'show']);
    Route::post('/', [RepairConsumptionController::class, 'store']);
    Route::patch('/{id}', [RepairConsumptionController::class, 'update']);
    Route::delete('/{id}', [RepairConsumptionController::class, 'destroy']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;


Route::post('/product-colors', [App\Http\Controllers\productColorController::class, 'store']);
Route::get('/product-colors/{id}', [App\Http\Controllers\productColorController::class, 'show']);
Route::put('/product-colors/{id}', [App\Http\Controllers\productColorController::class, 'update']);
Route::delete('/product-colors/{id}', [App\Http\Controllers\productColorController::class, 'destroy']);
Route::get('/product-colors', [App\Http\Controllers\productColorController::class, 'index']);

Route::post('/product-specs', [App\Http\Controllers\ProductSpecController::class, 'store']);
Route::get('/product-specs/{id}', [App\Http\Controllers\ProductSpecController::class, 'show']);
Route::put('/product-specs/{id}', [App\Http\Controllers\ProductSpecController::class, 'update']);
Route::delete('/product-specs/{id}', [App\Http\Controllers\ProductSpecController::class, 'destroy']);
Route::get('/product-specs', [App\Http\Controllers\ProductSpecController::class, 'index']);

Route::post('/product-images', [App\Http\Controllers\ProductImageController::class, 'store']);
Route::get('/product-images/{id}', [App\Http\Controllers\ProductImageController::class, 'show']);
Route::put('/product-images/{id}', [App\Http\Controllers\ProductImageController::class, 'update']);
Route::delete('/product-images/{id}', [App\Http\Controllers\ProductImageController::class, 'destroy']);
Route::get('/product-images', [App\Http\Controllers\ProductImageController::class, 'index']);

Route::post('/product-storages', [App\Http\Controllers\ProductStorageController::class, 'store']);
Route::get('/product-storages/{id}', [App\Http\Controllers\ProductStorageController::class, 'show']);
Route::put('/product-storages/{id}', [App\Http\Controllers\ProductStorageController::class, 'update']);
Route::delete('/product-storages/{id}', [App\Http\Controllers\ProductStorageController::class, 'destroy']);
Route::get('/product-storages', [App\Http\Controllers\ProductStorageController::class, 'index']);

Route::post('/category', [App\Http\Controllers\CategoryController::class, 'store']);
Route::get('/category/{id}', [App\Http\Controllers\CategoryController::class, 'show']);
Route::put('/category/{id}', [App\Http\Controllers\CategoryController::class, 'update']);
Route::delete('/category/{id}', [App\Http\Controllers\CategoryController::class, 'destroy']);
Route::get('/category', [App\Http\Controllers\CategoryController::class, 'index']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']); 
    Route::post('/', [ProductController::class, 'store']);       
    Route::get('/{id}', [ProductController::class, 'show']);   
    Route::put('/{id}', [ProductController::class, 'update']);  
    Route::delete('/{id}', [ProductController::class, 'destroy']); 
});


Route::post('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'attachCoupon']);
Route::delete('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'detachCoupon']);

Route::post('/coupons', [App\Http\Controllers\CouponController::class, 'store']);
Route::get('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'show']);
Route::put('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'update']);
Route::delete('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'destroy']);
Route::get('/coupons', [App\Http\Controllers\CouponController::class, 'index']);

Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store']);
Route::get('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'show']);
Route::put('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'destroy']);
Route::get('/reviews', [App\Http\Controllers\ReviewController::class, 'index']);


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('verify-email', [AuthController::class, 'verifyEmail']);
Route::post('resend-code', [AuthController::class, 'resendCode']);

Route::middleware(['auth:sanctum', 'admin'])->get('/admin', function (Request $request) {
    return response()->json([
        'user' => $request->user()
    ]);
});


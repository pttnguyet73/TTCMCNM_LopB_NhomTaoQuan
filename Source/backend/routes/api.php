<?php

use Illuminate\Support\Facades\Route;

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
Route::post('/category/soft-delete/{id}', [App\Http\Controllers\CategoryController::class, 'softDelete']);

Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'show']);
Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update']);
Route::delete('/products/{id}', [App\Http\Controllers\ProductController::class, 'destroy']);
Route::get('/products', [App\Http\Controllers\ProductController::class, 'index']);
Route::post('/products/soft-delete/{id}', [App\Http\Controllers\ProductController::class, 'softDelete']);

Route::post('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'attachCoupon']);
Route::delete('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'detachCoupon']);

Route::post('/coupons', [App\Http\Controllers\CouponController::class, 'store']);
Route::get('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'show']);
Route::put('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'update']);
Route::delete('/coupons/{id}', [App\Http\Controllers\CouponController::class, 'destroy']);
Route::get('/coupons', [App\Http\Controllers\CouponController::class, 'index']);
Route::post('/coupons/soft-delete/{id}', [App\Http\Controllers\CouponController::class, 'softDelete']);

Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store']);
Route::get('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'show']);
Route::put('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'destroy']);
Route::get('/reviews', [App\Http\Controllers\ReviewController::class, 'index']);

Route::post('/carts', [App\Http\Controllers\CartController::class, 'store']);
Route::get('/carts/{id}', [App\Http\Controllers\CartController::class, 'show']);
Route::put('/carts/{id}', [App\Http\Controllers\CartController::class, 'update']);
Route::delete('/carts/{id}', [App\Http\Controllers\CartController::class, 'destroy']);

Route::post('/cart-items', [App\Http\Controllers\CartItemController::class, 'store']);
Route::get('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'show']);
Route::put('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'update']);
Route::delete('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'destroy']);

Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store']);
Route::get('/orders/{id}', [App\Http\Controllers\OrderController::class, 'show']);
Route::put('/orders/{id}', [App\Http\Controllers\OrderController::class, 'update']);
Route::delete('/orders/{id}', [App\Http\Controllers\OrderController::class, 'destroy']);
Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index']);

Route::post('/addresses', [App\Http\Controllers\AddressController::class, 'store']);
Route::get('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'show']);
Route::put('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'update']);
Route::delete('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'destroy']);

Route::post('/order-items', [App\Http\Controllers\OrderItemController::class, 'store']);
Route::get('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'show']);
Route::put('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'update']);
Route::delete('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'destroy']);
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\CustomerController;  
use App\Http\Controllers\Admin\CustomerExportController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\ProductSpecController; 
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\ReviewController;

Route::middleware(['auth:sanctum', 'admin'])->prefix('product-colors')->group(function () {
    Route::get('/', [App\Http\Controllers\ProductColorController::class, 'index']);
    Route::post('/', [App\Http\Controllers\productColorController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\productColorController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\productColorController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\productColorController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('product-specs')
    ->group(function () {
        Route::get('/', [ProductSpecController::class, 'index']);
        Route::post('/', [ProductSpecController::class, 'store']);
        Route::get('/{id}', [ProductSpecController::class, 'show']);
        Route::put('/{id}', [ProductSpecController::class, 'update']);
        Route::delete('/{id}', [ProductSpecController::class, 'destroy']);
    });

Route::get('product-specs/product/{productId}', [App\Http\Controllers\ProductSpecController::class, 'getByProductId']);
Route::get('product-specs/by-product', [App\Http\Controllers\ProductSpecController::class, 'getByProduct']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('product-images')->group(function () {
    Route::get('/', [App\Http\Controllers\ProductImageController::class, 'index']);
    Route::post('/', [App\Http\Controllers\ProductImageController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\ProductImageController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\ProductImageController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\ProductImageController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'admin'])->prefix('product-storages')->group(function () {
    Route::get('/', [App\Http\Controllers\ProductStorageController::class, 'index']);
    Route::post('/', [App\Http\Controllers\ProductStorageController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\ProductStorageController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\ProductStorageController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\ProductStorageController::class, 'destroy']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [App\Http\Controllers\CategoryController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\CategoryController::class, 'show']);
});

// Route::prefix('products')->group(function () {
//     Route::get('/', [ProductController::class, 'index']);
//     Route::get('/{id}', [ProductController::class, 'show']);
// });

Route::middleware(['auth:sanctum'])->prefix('categories')->group(function () {
    Route::get('/', [App\Http\Controllers\CategoryController::class, 'index']);
    Route::post('/', [App\Http\Controllers\CategoryController::class, 'store']);
    Route::put('/{id}', [App\Http\Controllers\CategoryController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\CategoryController::class, 'destroy']);
});

// Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/products')->group(function () {
//     Route::post('/', [AdminProductController::class, 'store']);
//     Route::put('/{id}', [AdminProductController::class, 'update']);
//     Route::delete('/{id}', [AdminProductController::class, 'destroy']);
//     route::get('/', [AdminProductController::class, 'index']);
// });

Route::prefix('admin/products')->group(function () {
    Route::get('/', [AdminProductController::class, 'index']); 
    Route::get('/{id}', [AdminProductController::class, 'show']);   
    Route::post('/', [AdminProductController::class, 'store']);       
    Route::put('/{id}', [AdminProductController::class, 'update']);  
    Route::delete('/{id}', [AdminProductController::class, 'destroy']);
});
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::post('/', [ProductController::class, 'store']);       
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});

Route::post('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'attachCoupon']);
Route::delete('/product-coupons', [App\Http\Controllers\ProductCouponController::class, 'detachCoupon']);

route::middleware(['auth:sanctum'])->prefix('coupons')->group(function () {
    Route::get('/', [CouponController::class, 'index']); 
    Route::post('/', [CouponController::class, 'store']);       
    Route::put('/{id}', [CouponController::class, 'update']);  
    Route::delete('/{id}', [CouponController::class, 'destroy']); 
    Route::get('/{code}', [CouponController::class, 'getCode']);
}); 


Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store']);
Route::get('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'show']);
Route::put('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'destroy']);
Route::get('/reviews', [App\Http\Controllers\ReviewController::class, 'index']);
Route::get('/reviews/{productId}', [App\Http\Controllers\ReviewController::class, 'getByProductId']);


Route::middleware(['auth:sanctum'])->prefix('cart')->group(function () {
     Route::get('/', [CartController::class, 'index']);
    Route::post('/', [CartController::class, 'store']);
    Route::put('/{id}', [CartController::class, 'update']);
    Route::delete('/{id}', [CartController::class, 'destroy']);
    Route::delete('/', [CartController::class, 'clear']);
});

Route::post('/cart-items', [App\Http\Controllers\CartItemController::class, 'store']);
Route::get('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'show']);
Route::put('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'update']);
Route::delete('/cart-items/{id}', [App\Http\Controllers\CartItemController::class, 'destroy']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::get('/orders', [OrderController::class, 'index']);
Route::middleware('auth:sanctum')->get(
    '/my-orders',
    [OrderController::class, 'myOrders']
);
Route::post('/checkout', [OrderController::class, 'store'])
    ->middleware('auth:sanctum');

Route::post('/addresses', [App\Http\Controllers\AddressController::class, 'store']);
Route::get('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'show']);
Route::put('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'update']);
Route::delete('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'destroy']);

Route::post('/order-items', [App\Http\Controllers\OrderItemController::class, 'store']);
Route::get('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'show']);
Route::put('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'update']);
Route::delete('/order-items/{id}', [App\Http\Controllers\OrderItemController::class, 'destroy']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('verify-email', [AuthController::class, 'verifyEmail']);
Route::post('resend-code', [AuthController::class, 'resendCode']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::get('profile', [AuthController::class, 'getProfile'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin,saler'])->get('/admin', function (Request $request) {
    return response()->json([
        'user' => $request->user()
    ]);
});

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/customers', [CustomerController::class, 'index']);
});

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::put('/customers/{id}/status', [CustomerController::class, 'updateStatus']);
});

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/order', [AdminOrderController::class, 'index']);
});

Route::get('/admin/customers/export', [CustomerExportController::class, 'export']);

Route::prefix('admin')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
});
Route::middleware('auth:sanctum')->post('profile', [AuthController::class, 'updateProfile']);

Route::get('/admin/orders/{id}', [OrderController::class, 'show']);
Route::prefix('admin')->group(function () {
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
});

Route::post('/coupon/validate', [OrderController::class, 'validateCoupon']);

Route::post('/chat', [ChatController::class, '__invoke']);

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
    Route::put('/users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store']);
});
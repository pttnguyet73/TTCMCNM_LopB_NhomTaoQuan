<?php

namespace App\Http\Controllers;


use App\Models\Product;
use App\Models\Coupon;
use App\Http\Requests\ProductCouponRequest;

class ProductCouponController extends Controller
{
    public function attachCoupon(ProductCouponRequest $request)
    {
        $product = Product::findOrFail($request->input('product_id'));
        $couponId = $request->input('coupon_id');

        $product->coupons()->attach($couponId);

        return response()->json(['message' => 'Mã giảm giá đã được gắn vào sản phẩm thành công.'], 200);
    }

    public function detachCoupon(ProductCouponRequest $request)
    {
        $product = Product::findOrFail($request->input('product_id'));
        $couponId = $request->input('coupon_id');

        $product->coupons()->detach($couponId);

        return response()->json(['message' => 'Mã giảm giá đã được gỡ khỏi sản phẩm thành công.'], 200);
    }
}

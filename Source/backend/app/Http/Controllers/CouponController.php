<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;
use App\Http\Requests\CouponRequest;


class CouponController extends Controller
{
    //
    public function index()
    {
        $coupons = Coupon::all();
        return response()->json($coupons);
    }

    public function store(CouponRequest $request)
    {
        $validated = $request->validated();

        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    public function show($id)
    {
        $coupon = Coupon::findOrFail($id);
        return response()->json($coupon);
    }

    public function update(CouponRequest $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $validated = $request->validated();

        $coupon->update($validated);
        return response()->json($coupon);
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return response()->json(['message' => 'Xóa mã giảm giá thành công']);
    }

    //viết funtion xóa mềm có tên softDelete update lại trường is_delete thành true
    public function softDelete($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update(['is_delete' => true]);
        return response()->json(null, 204);
    }
}

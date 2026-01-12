<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return Coupon::where('is_delete', false)->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|unique:coupon,code',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|integer|min:1',
            'min_order_amount' => 'nullable|integer|min:0',
            'usage_limit' => 'nullable|integer|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $coupon = Coupon::create([
            ...$data,
            'used_count' => 0,
            'is_active' => true,
            'is_delete' => false,
        ]);

        return response()->json($coupon, 201);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $data = $request->validate([
            'code' => 'required|unique:coupon,code,' . $coupon->id,
            'type' => 'required|in:percent,fixed',
            'value' => 'required|integer|min:1',
            'min_order_amount' => 'nullable|integer|min:0',
            'usage_limit' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $coupon->update($data);

        return response()->json($coupon);
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update(['is_delete' => true]);

        return response()->json(['message' => 'Deleted']);
    }
}

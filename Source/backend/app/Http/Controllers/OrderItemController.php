<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Http\Requests\OrderItemRequest;

class OrderItemController extends Controller
{
    //
    public function store(OrderItemRequest $request)
    {
        $orderItem = OrderItem::create($request->validated());
        return response()->json($orderItem, 201);
    }

    public function update(OrderItemRequest $request, $id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->update($request->validated());
        return response()->json($orderItem, 200);
    }

    public function destroy($id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->delete();
        return response()->json(null, 204);
    }

    //lấy thêm name của product và địa chỉ trong function show
    public function show($id)
    {
        $orderItem = OrderItem::with('product', 'order.address')->findOrFail($id);
        return response()->json($orderItem, 200);
    }
}

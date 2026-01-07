<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\OrderRequest;

class OrderItemController extends Controller
{
    //
    public function store(OrderRequest $request)
    {
        $order = Order::create($request->validated());
        return response()->json($order, 201);
    }

    public function update(OrderRequest $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->validated());
        return response()->json($order, 200);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(null, 204);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id);
        return response()->json($order, 200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Http\Requests\CartItemRequest;

class CartItemController extends Controller
{
    //
    public function store(CartItemRequest $request)
    {
        $cartItem = CartItem::create($request->validated());
        return response()->json($cartItem, 201);
    }

    public function update(CartItemRequest $request, $id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->update($request->validated());
        return response()->json($cartItem, 200);
    }

    public function destroy($id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->delete();
        return response()->json(null, 204);
    }

    public function show($id)
    {
        $cartItem = CartItem::findOrFail($id);
        return response()->json($cartItem, 200);
    }
}

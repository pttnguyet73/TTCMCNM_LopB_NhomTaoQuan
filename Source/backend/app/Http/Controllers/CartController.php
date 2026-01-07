<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Http\Requests\CartRequest;


class CartController extends Controller
{

    public function store(CartRequest $request)
    {
        $cart = Cart::create($request->validated());
        return response()->json($cart, 201);
    }

    public function update(CartRequest $request, $id)
    {
        $cart = Cart::findOrFail($id);
        $cart->update($request->validated());
        return response()->json($cart, 200);
    }

    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();
        return response()->json(null, 204);
    }

    public function show($id)
    {
        $cart = Cart::findOrFail($id);
        return response()->json($cart, 200);
    }
}

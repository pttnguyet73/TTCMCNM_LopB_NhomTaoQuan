<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
   public function index()
{
    $userId = Auth::id();
Log::info('Auth ID', ['id' => Auth::id()]);

    if (!$userId) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $cart = Cart::with('cartItems.product')
        ->where('user_id', $userId)
        // ->where('status', 'active')
        ->first();

    if (!$cart) {
        return response()->json([]);
    }

    return response()->json(
        $cart->cartItems->map(function ($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'color' => $item->color,
                'storage' => $item->storage,
                'image' => $item->image,
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                ] : null,
            ];
        })
    );
}



public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'color' => 'required|string|max:50',
    ]);

    $userId = Auth::id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $cart = Cart::firstOrCreate(
        ['user_id' => $userId, 'status' => 'active']
    );

    $item = CartItem::where('cart_id', $cart->id)
        ->where('product_id', $request->product_id)
        ->where('color', $request->color)
        ->first();

    if ($item) {
        $item->increment('quantity', $request->quantity);
    } else {
        $product = Product::with('images')->findOrFail($request->product_id);

        $image = optional($product->images->first())->image_url;

        $item = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'color' => $request->color,
            'image' => $image, 
        ]);
    }

    return response()->json($item->load('product'), 201);
}


    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::findOrFail($id);
        $item->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Updated']);
    }

    public function destroy($id)
    {
        CartItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())
            ->where('status', 'active')
            ->first();

        if ($cart) {
            $cart->cartItems()->delete();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}

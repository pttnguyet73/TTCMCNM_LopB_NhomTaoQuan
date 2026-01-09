<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use App\Http\Requests\ProductImageRequest;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function index()
    {
        $images = ProductImage::all();
        return response()->json($images);
    }


    public function show($id)
    {
        $image = ProductImage::findOrFail($id);
        return response()->json($image);
    }

    public function store(ProductImageRequest $request)
    {
    $data = $request->validated();
    $product = \App\Models\Product::find($data['product_id'] ?? 0);
    if (!$product) {
        return response()->json(['error' => 'Product not found'], 404);
    }

    $image = ProductImage::create($data);

    return response()->json($image, 201);
    }

    public function update(ProductImageRequest $request, $id)
    {
        $product = ProductImage::findOrFail($id);
        $product->update($request->validated());
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = ProductImage::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }
}

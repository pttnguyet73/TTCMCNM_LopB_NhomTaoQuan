<?php

namespace App\Http\Controllers;
use App\Models\ProductImage;
use App\Http\Requests\ProductImageRequest;

class ProductImageController extends Controller
{
    //
    public function index()
    {
        $images = ProductImage::all();
        return response()->json($images);
    }

    public function store(ProductImageRequest $request)
    {
        $validated = $request->validated();

        $image = ProductImage::create($validated);
        return response()->json($image, 201);
    }

    public function show($id)
    {
        $image = ProductImage::findOrFail($id);
        return response()->json($image);
    }

    public function update(ProductImageRequest $request, $id)
    {
        $image = ProductImage::findOrFail($id);
        $validated = $request->validated();

        $image->update($validated);
        return response()->json($image);
    }

    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);
        $image->delete();
        return response()->json(['message' => 'Xóa hình ảnh sản phẩm thành công']);
    }
}

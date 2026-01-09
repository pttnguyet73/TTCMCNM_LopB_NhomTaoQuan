<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
   public function index()
{
    $products = Product::with(['images', 'colors', 'specs', 'category'])->get();
    return response()->json($products);
}


   public function store(ProductRequest $request)
{
    DB::beginTransaction();

    try {
        $data = $request->validated();

        // 1️⃣ Tạo product
        $product = Product::create([
            'name'           => $data['name'],
            'category_id'    => $data['category_id'],
            'price'          => $data['price'],
            'original_price' => $data['original_price'],
            'status'         => $data['status'],
            'description'    => $data['description'] ?? null,
            'is_new'         => $data['is_new'] ?? false,
            'is_featured'    => $data['is_featured'] ?? false,
            'rating'         => $data['rating'] ?? 5.0,
            'review_count'   => $data['review_count'] ?? 200,
        ]);

        // 2️⃣ Images
        if (!empty($data['images'])) {
            foreach ($data['images'] as $index => $imageUrl) {
                $product->images()->create([
                    'image_url' => $imageUrl,
                    'is_main'   => $index === 0,
                ]);
            }
        }

        // 3️⃣ Colors
        if (!empty($data['colors'])) {
            foreach ($data['colors'] as $color) {
                $product->colors()->create($color);
            }
        }

        // 4️⃣ Specs
        if (!empty($data['specs'])) {
            foreach ($data['specs'] as $spec) {
                $product->specs()->create($spec);
            }
        }

        DB::commit();

        return response()->json($product->load(['images','colors','specs']), 201);

    } catch (\Throwable $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Tạo sản phẩm thất bại',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function update(ProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->validated());
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }

    //viết funtion xóa mềm có tên softDelete update lại trường is_delete thành true
    public function softDelete($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_delete' => true]);
        return response()->json(null, 204);
    }
}

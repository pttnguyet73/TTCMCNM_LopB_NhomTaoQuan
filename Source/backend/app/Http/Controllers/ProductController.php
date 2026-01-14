<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['images', 'colors', 'category'])
            ->where('is_delete', 0)
            ->where('status', 1);

        // 🔍 Tìm kiếm
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // 📂 Lọc theo danh mục
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // 💰 Lọc theo khoảng giá
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            // Kiểm tra nếu max_price không phải Infinity
            if ($request->max_price !== 'Infinity') {
                $query->where('price', '<', $request->max_price);
            }
        }

        switch ($request->sort_by) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;

            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;

            case 'newest':
                $query->orderBy('is_new', 'desc')
                      ->orderBy('created_at', 'desc');
                break;

            case 'rating':
                $query->orderBy('rating', 'desc');
                break;

            default: // featured
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('created_at', 'desc');
        }

        // Trả về tất cả sản phẩm (không phân trang cho frontend filter)
        $products = $query->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Products retrieved successfully'
        ]);
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
                foreach ($data['images'] as $index => $image) {
                    $product->images()->create([
                        'image_url' => $image['image_url'],
                        'is_main'   => $image['is_main'] ?? ($index === 0),
                    ]);
                }
            }

            // 3️⃣ Colors
            if (!empty($data['colors'])) {
                foreach ($data['colors'] as $color) {
                    $product->colors()->create([
                        'name' => $color['name'],
                        'hex_code'  => $color['hex_code'] ?? null,
                    ]);
                }
            }

            // 4️⃣ Specs
            if (!empty($data['specs'])) {
                foreach ($data['specs'] as $spec) {
                    $product->specs()->create([
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                    ]);
                }
            }

            DB::commit();

            return response()->json($product->load(['images', 'colors', 'specs']), 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Tạo sản phẩm thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
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
        $product = Product::with(['images', 'colors', 'specs', 'category'])
            ->where('is_delete', 0)
            ->where('status', 1)
            ->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            $data = $request->validated();

            $product->update([
                'name'           => $data['name'],
                'category_id'    => $data['category_id'],
                'price'          => $data['price'],
                'original_price' => $data['original_price'],
                'status'         => $data['status'],
                'description'    => $data['description'] ?? $product->description,
                'is_new'         => $data['is_new'] ?? $product->is_new,
                'is_featured'    => $data['is_featured'] ?? $product->is_featured,
                'rating'         => $data['rating'] ?? $product->rating,
                'review_count'   => $data['review_count'] ?? $product->review_count,
            ]);

            if (isset($data['images'])) {
            $product->images()->delete();

            foreach ($data['images'] as $index => $image) {
                $product->images()->create([
                    'image_url' => $image['image_url'],
                    'is_main'   => $image['is_main'] ?? ($index === 0),
                ]);
            }
        }

           if (isset($data['colors'])) {
            $product->colors()->delete();

            foreach ($data['colors'] as $color) {
                $product->colors()->create([
                    'name'     => $color['name'],
                    'hex_code' => $color['hex_code'],
                ]);
            }
        }

            /* ========= 4️⃣ SPECS (UPSERT) ========= */
             if (isset($data['specs'])) {
            $product->specs()->delete();

            foreach ($data['specs'] as $spec) {
                $product->specs()->create([
                    'label' => $spec['label'],
                    'value' => $spec['value'],
                ]);
            }
        }

            DB::commit();

            return response()->json(
                $product->load(['images', 'colors', 'specs']),
                200
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật sản phẩm thất bại',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }

    public function softDelete($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_delete' => true]);
        return response()->json(null, 204);
    }
}

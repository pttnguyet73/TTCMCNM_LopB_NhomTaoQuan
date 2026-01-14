<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use App\Http\Requests\ReviewRequest;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user')->get();
        return response()->json($reviews);
    }

    public function getByProductId($productId)
    {
        $reviews = Review::where('product_id', $productId)
                         ->where('status', 'approved')
                         ->get();
        return response()->json($reviews);
    }

    public function store(ReviewRequest $request)
    {
        $validated = $request->validated();
        $review = Review::create($validated);

        return response()->json($review, 201);
    }

    public function show($id)
    {
        $review = Review::with('user')->findOrFail($id);
        return response()->json($review);
    }

    public function update(ReviewRequest $request, $id)
    {
        $review = Review::findOrFail($id);
        $validated = $request->validated();
        $review->update($validated);

        return response()->json($review);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Xóa đánh giá thành công']);
    }
}
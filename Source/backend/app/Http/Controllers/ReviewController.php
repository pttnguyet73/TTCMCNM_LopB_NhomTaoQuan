<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use App\Http\Requests\ReviewRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

     public function store(Request $request)
    {
    $userId = Auth::id();
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'required|string|max:1000',
        ]);

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id'    => $userId,
            'rating'     => $request->rating,
            'comment'    => $request->comment,
            'status'     => 'approved', 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi đánh giá',
            'data'    => $review,
        ], 201);
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
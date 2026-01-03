<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function store(CategoryRequest $request)
    {
        $validated = $request->validated();

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(CategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validated();

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Xóa danh mục thành công']);
    }
}

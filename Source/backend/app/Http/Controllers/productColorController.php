<?php

namespace App\Http\Controllers;
use App\Models\ProductColor;
use App\Http\Requests\ProductColorRequest;

class productColorController extends Controller
{
    //
    public function index()
    {
        $colors = ProductColor::all();
        return response()->json($colors);
    }

    public function store(ProductColorRequest $request)
    {
        $validated = $request->validated();

        $color = ProductColor::create($validated);
        return response()->json($color, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $color = ProductColor::findOrFail($id);
        return response()->json($color);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductColorRequest $request, $id)
    {
        $color = ProductColor::findOrFail($id);
        $validated = $request->validated();

        $color->update($validated);
        return response()->json($color);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $color = ProductColor::findOrFail($id);
        $color->delete();
        return response()->json(['message' => 'Xóa màu sản phẩm thành công']);
    }
}

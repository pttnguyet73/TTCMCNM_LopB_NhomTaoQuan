<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductSpec;
use App\Http\Requests\ProductSpecRequest;


class ProductSpecController extends Controller
{
    //
    public function index()
    {
        $specs = ProductSpec::all();
        return response()->json($specs);
    }

    public function store(ProductSpecRequest $request)
    {
        $validated = $request->validated();

        $spec = ProductSpec::create($validated);
        return response()->json($spec, 201);
    }

    public function show($id)
    {
        $spec = ProductSpec::findOrFail($id);
        return response()->json($spec);
    }

    public function update(ProductSpecRequest $request, $id)
    {
        $spec = ProductSpec::findOrFail($id);
        $validated = $request->validated();

        $spec->update($validated);
        return response()->json($spec);
    }

    public function destroy($id)
    {
        $spec = ProductSpec::findOrFail($id);
        $spec->delete();
        return response()->json(['message' => 'Xóa thông số sản phẩm thành công']);
    }

}

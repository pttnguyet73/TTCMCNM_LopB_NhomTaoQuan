<?php

namespace App\Http\Controllers;
use App\Models\ProductStorage;
use App\Http\Requests\ProductStorageRequest;

class ProductStorageController extends Controller
{
    //
    public function index()
    {
        $storages = ProductStorage::all();
        return response()->json($storages);
    }

    public function store(ProductStorageRequest $request)
    {
        $validated = $request->validated();

        $storage = ProductStorage::create($validated);
        return response()->json($storage, 201);
    }

    public function show($id)
    {
        $storage = ProductStorage::findOrFail($id);
        return response()->json($storage);
    }

    public function update(ProductStorageRequest $request, $id)
    {
        $storage = ProductStorage::findOrFail($id);
        $validated = $request->validated();

        $storage->update($validated);
        return response()->json($storage);
    }

    public function destroy($id)
    {
        $storage = ProductStorage::findOrFail($id);
        $storage->delete();
        return response()->json(['message' => 'Xóa thông tin lưu trữ sản phẩm thành công']);
    }

}

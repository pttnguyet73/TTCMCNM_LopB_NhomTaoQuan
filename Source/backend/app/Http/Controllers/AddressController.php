<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;
use App\Http\Requests\AddressRequest;

class AddressController extends Controller
{
    //
    public function store(AddressRequest $request)
    {
        $address = Address::create($request->validated());
        return response()->json($address, 201);
    }

    public function update(AddressRequest $request, $id)
    {
        $address = Address::findOrFail($id);
        $address->update($request->validated());
        return response()->json($address, 200);
    }

    public function destroy($id)
    {
        $address = Address::findOrFail($id);
        $address->delete();
        return response()->json(null, 204);
    }

    public function show($id)
    {
        $address = Address::findOrFail($id);
        return response()->json($address, 200);
    }
}

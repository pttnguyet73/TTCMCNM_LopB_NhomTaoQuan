<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
        'message' => 'Admin access granted',
        'user' => $request->user()
    ]);
    }
}

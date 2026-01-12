<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::whereNull('deleted_at')
            ->withCount('orders')
            ->withSum('orders', 'total_amount');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $query->orderBy('created_at', 'desc');

        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                'orders_count' => $user->orders_count ?? 0,
                'total_spent' => $user->orders_sum_total_amount ?? 0,
                'is_verified' => (bool) $user->is_verified,
                'profile_photo_url' => $user->profile_photo_url,
            ];
        });

        $stats = [
            'total' => User::whereNull('deleted_at')->count(),
            'admin' => User::whereNull('deleted_at')->where('role', 'admin')->count(),
            'saler' => User::whereNull('deleted_at')->where('role', 'saler')->count(),
            'user' => User::whereNull('deleted_at')->where('role', 'user')->count(),
            'active' => User::whereNull('deleted_at')->where('status', 'active')->count(),
            'inactive' => User::whereNull('deleted_at')->where('status', 'inactive')->count(),
            'vip' => User::whereNull('deleted_at')->where('status', 'vip')->count(),
            'banned' => User::whereNull('deleted_at')->where('status', 'banned')->count(),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,saler,user',
            'status' => 'required|in:active,inactive,vip,banned',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validated['status'] === 'vip' && $validated['role'] !== 'user') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ người dùng thông thường (user) mới có thể có trạng thái VIP'
            ], 400);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
            'phone' => $validated['phone'] ?? null,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm người dùng thành công',
            'data' => $user
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive,vip,banned'
        ]);

        $user = User::findOrFail($id);

        if ($validated['status'] === 'vip' && $user->role !== 'user') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ người dùng thông thường (user) mới có thể được nâng lên VIP'
            ], 400);
        }

        $user->status = $validated['status'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,saler,user'
        ]);

        $user = User::findOrFail($id);

        if ($user->role === 'user' && $user->status === 'vip' && in_array($validated['role'], ['admin', 'saler'])) {
            $user->status = 'active';
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật vai trò thành công'
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa tài khoản admin'
            ], 403);
        }

        if ($user->orders()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa người dùng có đơn hàng'
            ], 400);
        }

        // XÓA MỀM
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công (xóa mềm)'
        ]);
    }
}

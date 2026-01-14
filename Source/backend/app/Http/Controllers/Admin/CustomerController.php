<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::query()
            ->where('users.role', 'user')
            ->leftJoin('orders', 'orders.user_id', '=', 'users.id')
            ->leftJoin('address', 'address.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.status',
                'users.role',
                'users.email_verified_at',
                DB::raw('MAX(address.street) AS street'),
                DB::raw('MAX(address.district) AS district'),
                DB::raw('COUNT(DISTINCT orders.id) AS orders_count'),
                DB::raw('COALESCE(SUM(orders.total_amount), 0) AS total_spent'),
                DB::raw('MAX(orders.created_at) AS last_order_date')
            )
            ->groupBy(
                'users.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.status',
                'users.role',
                'users.email_verified_at'
            )
            ->orderByDesc('total_spent')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'status' => $customer->status,
                    'role' => $customer->role,

                    'email_verified_at' => $customer->email_verified_at,

                    'address' => $customer->street
                        ? $customer->street . ', ' . $customer->district
                        : 'Chưa cập nhật',

                    'orders_count' => (int) $customer->orders_count,
                    'total_spent' => (float) $customer->total_spent,
                    'last_order_date' => $customer->last_order_date,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_customers' => User::where('role', 'user')->count(),
                'active_customers' => User::where('role', 'user')
                    ->where('status', 'active')
                    ->count(),
                'vip_customers' => User::where('role', 'user')
                    ->where('status', 'vip')
                    ->count(),
                'total_revenue' => DB::table('orders')->sum('total_amount'),
            ]
        ]);
    }

    public function show($id)
    {
        $customer = User::where('role', 'user')
            ->leftJoin('addresses', 'addresses.user_id', '=', 'users.id')
            ->select(
                'users.*',
                DB::raw('MAX(addresses.street) AS street'),
                DB::raw('MAX(addresses.district) AS district')
            )
            ->groupBy('users.id')
            ->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy khách hàng'
            ], 404);
        }

        $orderStats = DB::table('orders')
            ->where('user_id', $id)
            ->selectRaw('
                COUNT(id) AS orders_count,
                COALESCE(SUM(total_amount), 0) AS total_spent,
                MAX(created_at) AS last_order_date
            ')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'status' => $customer->status,
                'role' => $customer->role,

                'email_verified_at' => $customer->email_verified_at,

                'address' => $customer->street
                    ? $customer->street . ', ' . $customer->district
                    : 'Chưa cập nhật',

                'orders_count' => (int) $orderStats->orders_count,
                'total_spent' => (float) $orderStats->total_spent,
                'last_order_date' => $orderStats->last_order_date,
                'created_at' => $customer->created_at,
                'updated_at' => $customer->updated_at,
            ]
        ]);
    }

    public function getOrders($id)
    {
        $orders = DB::table('orders')
            ->where('user_id', $id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'shipping_fee' => (float) $order->shipping_fee,
                    'created_at' => $order->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}

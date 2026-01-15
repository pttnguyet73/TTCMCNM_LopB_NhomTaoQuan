<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with([
                'user:id,name',
                'orderItems.product:id,name'
            ])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($order) {

                // Lấy danh sách tên sản phẩm
                $productNames = $order->orderItems
                    ->map(function ($item) {
                        return $item->product?->name;
                    })
                    ->filter() // bỏ null
                    ->values();

                // Format hiển thị sản phẩm
                if ($productNames->count() <= 2) {
                    $productText = $productNames->join(', ');
                } else {
                    $productText = $productNames
                        ->take(2)
                        ->join(', ') . '...';
                }

                return [
                    'id'       => $order->id,
                    'customer' => $order->user?->name ?? 'N/A',
                    'product'  => $productText ?: '—',
                    'total_amount'   => $order->total_amount,
                    'status'   => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($orders);
    }
}
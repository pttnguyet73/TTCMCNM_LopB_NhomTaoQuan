<?php

namespace App\Http\Controllers;
use App\Models\Order;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use DateTime; 
use Exception;

class OrderController extends Controller
{
    //
    public function store(OrderRequest $request)
    {
        $order = Order::create($request->validated());
        return response()->json($order, 201);
    }

    public function update(OrderRequest $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->validated());
        return response()->json($order, 200);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|string|max:50', // Lưu trạng thái tiếng Việt tự do
    ]);

    $order = Order::findOrFail($id);
    $order->status = $request->status; // Lưu trực tiếp tiếng Việt
    $order->save();

    return response()->json([
        'success' => true,
        'message' => 'Cập nhật trạng thái thành công',
        'status' => $order->status // Trả ra luôn tiếng Việt
    ]);
}




   public function show($id)
{
    // Lấy thông tin đơn hàng
    $order = DB::table('orders')
        ->join('users', 'users.id', '=', 'orders.user_id')
        ->leftJoin('address', 'address.user_id', '=', 'users.id')
        ->where('orders.id', $id)
        ->select(
            'orders.id',
            'orders.status',
            'orders.total_amount',
            'orders.shipping_fee',
            'orders.coupon_code',
            'orders.tracking_number',
            'orders.created_at',
            'users.name as customer',
            'users.email',
            'users.phone as user_phone',
            'address.street',
            'address.district'
        )
        ->first();

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy đơn hàng'
        ], 404);
    }

    // Lấy sản phẩm của đơn hàng
    $orderItems = DB::table('order_item')
        ->where('order_id', $id)
        ->join('product', 'product.id', '=', 'order_item.product_id')
        ->leftJoin('product_image', function($join) {
            $join->on('product.id', '=', 'product_image.product_id')
                 ->where('product_image.is_main', 1);
        })
        ->select(
            'product.id as product_id',
            'product.name',
            'order_item.quantity',
            'product.price as price',
            DB::raw('(order_item.quantity * product.price) as subtotal'),
            'product_image.image_url as product_image'
        )
        ->get();

    // Tính tổng tiền hàng
    $subtotal = $orderItems->sum('subtotal');

    // Tính giảm giá nếu có coupon
    $discount = 0;
    $couponData = null;
    if ($order->coupon_code) {
        $coupon = DB::table('coupon')
            ->where('code', $order->coupon_code)
            ->first();

        if ($coupon) {
            $discount = ($coupon->type == 'percentage') 
                ? round($subtotal * ($coupon->value / 100), 0) 
                : round($coupon->value, 0);

            $couponData = [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'min_order_amount' => $coupon->min_order_amount,
                'is_active' => $coupon->is_active,
                'is_delete' => $coupon->is_delete,
                'is_valid' => true
            ];
        } else {
            $couponData = [
                'code' => $order->coupon_code,
                'is_valid' => false,
                'error' => 'Mã giảm giá không còn tồn tại trong hệ thống'
            ];
        }
    }

    $shippingFee = $order->shipping_fee ?? 0;
    $totalAmount = round($subtotal - $discount + $shippingFee, 0);

    // Map trạng thái sang tiếng Việt
    
    $vietnameseStatus = $order->status;

    // Địa chỉ đầy đủ
    $addressParts = [];
    if ($order->street) $addressParts[] = $order->street;
    if ($order->district) $addressParts[] = $order->district;
    $fullAddress = !empty($addressParts) ? implode(', ', $addressParts) : 'Chưa cập nhật';

    // Trả JSON
    return response()->json([
        'success' => true,
        'data' => [
            'order' => [
                'id' => '#ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT),
                'raw_id' => $order->id,
                'customer' => $order->customer,
                'email' => $order->email,
                'phone' => $order->user_phone ?? 'Chưa cập nhật',
                'address' => $fullAddress,
                'subtotal' => number_format($subtotal, 0, ',', '.') . ' đ',
                'subtotal_raw' => (float) $subtotal,
                'discount' => number_format($discount, 0, ',', '.') . ' đ',
                'discount_raw' => (float) $discount,
                'shipping_fee' => number_format($shippingFee, 0, ',', '.') . ' đ',
                'shipping_fee_raw' => (float) $shippingFee,
                'total_amount' => number_format($totalAmount, 0, ',', '.') . ' đ',
                'total_raw' => (float) $totalAmount,
                'coupon_code' => $order->coupon_code,
                'coupon_data' => $couponData,
                'status' => $order->status, 
                'status_key' => $order->status,
                'payment_method' => 'COD',
                'tracking_number' => $order->tracking_number,
                'created_at' => $order->created_at ? date('d/m/Y H:i', strtotime($order->created_at)) : 'Chưa cập nhật',
                'created_at_raw' => $order->created_at,
            ],
            'items' => $orderItems->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'name' => $item->name,
                    'quantity' => $item->quantity,
                    'price' => number_format($item->price, 0, ',', '.') . ' đ',
                    'price_raw' => (float) $item->price,
                    'subtotal' => number_format($item->subtotal, 0, ',', '.') . ' đ',
                    'subtotal_raw' => (float) $item->subtotal,
                    'image' => $item->product_image,
                ];
            })
        ]
    ]);
}


    public function index()
{
    $orders = DB::table('orders')
        ->join('users', 'users.id', '=', 'orders.user_id')
        ->leftJoin('address', 'address.user_id', '=', 'users.id') 
        ->select(
            'orders.id',
            'orders.total_amount',
            'orders.status',
            'orders.shipping_fee',
            'orders.coupon_code',
            'orders.payment_method',
            'orders.tracking_number',
            'orders.created_at',

            'users.name as customer',
            'users.email',
            'users.phone as user_phone',

            'address.street',
            'address.district',
        )
        ->orderByDesc('orders.created_at')
        ->get()
        ->map(function ($order) {

            // Tạo địa chỉ
            $addressParts = array_filter([
                $order->street,
                $order->district,
            ]);

            // Tính subtotal từ order_item
            $orderItems = DB::table('order_item')
                ->where('order_id', $order->id)
                ->join('product', 'product.id', '=', 'order_item.product_id')
                ->select('order_item.quantity', 'product.price')
                ->get();

            $subtotal = $orderItems->sum(function($item){
                return $item->quantity * $item->price;
            });

            // Tính giảm giá nếu có coupon
            $discount = 0;
            if ($order->coupon_code) {
                $coupon = DB::table('coupon')->where('code', $order->coupon_code)->first();
                if ($coupon) {
                    $discount = ($coupon->type == 'percentage')
                        ? round($subtotal * ($coupon->value / 100), 0)
                        : round($coupon->value, 0);
                }
            }

            // Tính tổng tiền
            $shippingFee = $order->shipping_fee ?? 0;
            $totalAmount = round($subtotal - $discount + $shippingFee, 0);

            // Format ngày tháng
            $createdAtFormatted = $order->created_at ? date('d/m/Y H:i', strtotime($order->created_at)) : 'Chưa cập nhật';

            return [
                'id'       => '#ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT), 
                'raw_id'   => $order->id,
                'customer' => $order->customer,
                'email'    => $order->email,
                'phone'    => $order->user_phone,
                'address'  => !empty($addressParts) ? implode(', ', $addressParts) : 'Chưa cập nhật',

                // Số tiền hiển thị
                'subtotal' => number_format($subtotal, 0, ',', '.') . ' đ',
                'discount' => number_format($discount, 0, ',', '.') . ' đ',
                'shipping_fee' => number_format($shippingFee, 0, ',', '.') . ' đ',
                'total_amount' => number_format($totalAmount, 0, ',', '.') . ' đ',
                'total_raw' => (float) $totalAmount,

                'status'     => $order->status, // Trả thẳng tiếng Việt
                'status_key' => $order->status, // Key cũng tiếng Việt luôn
                'payment_method'     => $order->payment_method,
                'payment_method_key' => $order->payment_method,
                'tracking_number' => $order->tracking_number,
                'created_at' => $createdAtFormatted,
            ];
        });

    return response()->json([
        'success' => true,
        'data'    => $orders
    ]);
}
    
    public function validateCoupon(Request $request)
{
    $request->validate([
        'code' => 'required|string',
        'order_amount' => 'required|numeric|min:0',
    ]);

    $coupon = DB::table('coupon')
        ->where('code', $request->code)
        ->where('is_active', 1)
        ->where('is_delete', 0)
        ->first();

    if (!$coupon) {
        return response()->json([
            'success' => false,
            'message' => 'Mã giảm giá không tồn tại'
        ], 404);
    }

    // Kiểm tra ngày hiệu lực
    $today = date('Y-m-d');
    $isValidDate = true;
    if ($coupon->start_date && $coupon->start_date > $today) {
        $isValidDate = false;
    }
    if ($coupon->end_date && $coupon->end_date < $today) {
        $isValidDate = false;
    }

    if (!$isValidDate) {
        return response()->json([
            'success' => false,
            'message' => 'Mã giảm giá đã hết hạn'
        ], 400);
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if ($coupon->min_order_amount && $request->order_amount < $coupon->min_order_amount) {
        return response()->json([
            'success' => false,
            'message' => 'Đơn hàng không đạt giá trị tối thiểu ' . number_format($coupon->min_order_amount, 0, ',', '.') . ' đ'
        ], 400);
    }

    // Kiểm tra giới hạn sử dụng
    if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
        return response()->json([
            'success' => false,
            'message' => 'Mã giảm giá đã hết lượt sử dụng'
        ], 400);
    }

    // Tính discount
    $discount = 0;
    if ($coupon->type == 'percentage') {
        $discount = $request->order_amount * ($coupon->value / 100);
    } else {
        $discount = $coupon->value;
    }

    return response()->json([
        'success' => true,
        'data' => [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $discount,
            'min_order_amount' => $coupon->min_order_amount,
            'message' => $coupon->type == 'percentage' 
                ? "Giảm {$coupon->value}% đơn hàng" 
                : "Giảm " . number_format($coupon->value, 0, ',', '.') . " đ"
        ]
    ]);
}
}  
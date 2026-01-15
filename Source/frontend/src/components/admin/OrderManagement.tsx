import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { orderAPI } from '@/services/order';

interface OrderItemDetail {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  price_raw: number;
  subtotal: string;
  subtotal_raw: number;
  image?: string;
}

interface OrderDetail {
  id: string;
  raw_id: number;
  customer: string;
  email: string;
  phone: string;
  address: string;
  subtotal: string;
  subtotal_raw: number;
  discount: string;
  discount_raw: number;
  shipping_fee: string;
  shipping_fee_raw: number;
  total_amount: string;
  total_raw: number;
  coupon_code: string | null;
  coupon_data: {
    code: string;
    type: string;
    value: number;
    min_order_amount: number | null;
    is_active?: number;
    is_delete?: number;
    warning?: string;
    error?: string;
  } | null;
  status: string;
  status_key: string;
  payment_method: string;
  tracking_number: string;
  created_at: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItemDetail[];
  subtotal: string;
  subtotal_raw: number;
  discount: string;
  discount_raw: number;
  shipping_fee: string;
  shipping_fee_raw: number;
  total_amount: string;
  total_raw: number;
  coupon_code: string | null;
  coupon_data: {
    code: string;
    type: string;
    value: number;
    min_order_amount: number | null;
    is_active?: number;
    is_delete?: number;
    warning?: string;
    error?: string;
  } | null;
  status: string;
  status_key: string;
  payment_method: string;
  created_at: string;
  raw_id: number;
}

const statusConfig = {
  'Chờ xác nhận': {
    label: 'Chờ xác nhận',
    color: 'bg-amber-100 text-amber-700',
    icon: Clock,
  },
  'Đã xác nhận': {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-700',
    icon: Package,
  },
  'Đang giao': {
    label: 'Đang giao',
    color: 'bg-violet-100 text-violet-700',
    icon: Truck,
  },
  'Hoàn thành': {
    label: 'Hoàn thành',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
  'Đã hủy': {
    label: 'Đã hủy',
    color: 'bg-destructive/10 text-destructive',
    icon: XCircle,
  },
};

const getRawIdFromFormattedId = (formattedId: string): number => {
  const matches = formattedId.match(/#ORD-(\d+)/);
  return matches ? parseInt(matches[1], 10) : 0;
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItemDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await orderAPI.getOrders();

        // 🔥 res CHÍNH LÀ ARRAY
        if (!Array.isArray(res)) {
          throw new Error('Dữ liệu đơn hàng không hợp lệ');
        }

        const transformedOrders: Order[] = res.map((order: any) => ({
          id: `#ORD-${String(order.id).padStart(3, '0')}`,
          raw_id: order.id,

          customer: order.customer || '',
          email: '',
          phone: '',
          address: '',

          items: [],

          subtotal: '',
          subtotal_raw: 0,
          discount: '',
          discount_raw: 0,
          shipping_fee: '',
          shipping_fee_raw: 0,

          total_amount: Number(order.total_amount).toLocaleString('vi-VN') + ' ₫',
          total_raw: Number(order.amount),

          coupon_code: null,
          coupon_data: null,

          status: order.status || 'Chờ xác nhận',
          status_key: order.status_key || order.status || 'Chờ xác nhận',
          payment_method: 'COD',
          created_at: order.created_at || '',
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Lỗi tải đơn hàng', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách đơn hàng',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };


    fetchOrders();
  }, [toast]);

  const handleViewDetail = async (order: Order) => {
    try {
      setDetailLoading(true);
      const rawId = order.raw_id || getRawIdFromFormattedId(order.id);

      if (!rawId) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy ID đơn hàng',
          variant: 'destructive',
        });
        return;
      }

      const res = await orderAPI.getOrderDetail(rawId);

      if (res.success && res.data) {
        setSelectedOrderDetail(res.data.order);
        setSelectedOrderItems(res.data.items || []);
      } else {
        toast({
          title: 'Lỗi',
          description: res.message || 'Không thể tải chi tiết đơn hàng',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Lỗi tải chi tiết đơn hàng', error);
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải chi tiết đơn hàng',
        variant: 'destructive',
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    try {
      const rawId = order.raw_id || getRawIdFromFormattedId(order.id);

      if (!rawId) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy ID đơn hàng',
          variant: 'destructive',
        });
        return;
      }

      await orderAPI.updateOrderStatus(rawId, newStatus);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
              ...o,
              status: newStatus,
              status_key: newStatus,
            }
            : o,
        ),
      );

      if (selectedOrderDetail && selectedOrderDetail.raw_id === rawId) {
        setSelectedOrderDetail((prev) =>
          prev
            ? {
              ...prev,
              status: newStatus,
              status_key: newStatus,
            }
            : null,
        );
      }

      toast({
        title: 'Cập nhật thành công',
        description: `Đơn hàng ${order.id} đã được cập nhật trạng thái thành "${newStatus}"`,
      });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái', error);
      toast({
        title: 'Cập nhật thất bại',
        description: 'Đã có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'Chờ xác nhận').length,
    shipping: orders.filter((o) => o.status === 'Đang giao').length,
    completed: orders.filter((o) => o.status === 'Hoàn thành').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn</p>
              <p className="text-2xl font-bold">{orderStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
              <p className="text-2xl font-bold">{orderStats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-100">
              <Truck className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang giao</p>
              <p className="text-2xl font-bold">{orderStats.shipping}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
              <p className="text-2xl font-bold">{orderStats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
            <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
            <SelectItem value="Đang giao">Đang giao</SelectItem>
            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Mã đơn
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Khách hàng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tổng tiền
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Thanh toán
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Ngày tạo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        {searchTerm
                          ? 'Không tìm thấy đơn hàng nào phù hợp'
                          : 'Chưa có đơn hàng nào'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const StatusIcon =
                        statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
                      const statusConfigItem =
                        statusConfig[order.status as keyof typeof statusConfig];

                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium">{order.customer}</p>
                              {order.phone && order.phone !== 'Chưa cập nhật' && (
                                <p className="text-xs text-muted-foreground">{order.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">{order.total_amount}</td>
                          <td className="py-3 px-4 text-sm">{order.payment_method}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${statusConfigItem?.color || 'bg-gray-100 text-gray-700'
                                }`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {order.created_at}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetail(order)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {order.status === 'Chờ xác nhận' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(order, 'Đã xác nhận')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Xác nhận đơn
                                  </DropdownMenuItem>
                                )}
                                {order.status === 'Đã xác nhận' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(order, 'Đang giao')}
                                  >
                                    <Truck className="h-4 w-4 mr-2" />
                                    Giao hàng
                                  </DropdownMenuItem>
                                )}
                                {order.status === 'Đang giao' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(order, 'Hoàn thành')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Hoàn thành
                                  </DropdownMenuItem>
                                )}
                                {order.status !== 'Hoàn thành' && order.status !== 'Đã hủy' && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleUpdateStatus(order, 'Đã hủy')}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Hủy đơn
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrderDetail}
        onOpenChange={() => {
          setSelectedOrderDetail(null);
          setSelectedOrderItems([]);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrderDetail?.id}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải chi tiết...</span>
            </div>
          ) : (
            selectedOrderDetail && (
              <div className="space-y-6">
                {/* Thông tin khách hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Khách hàng</p>
                    <p className="font-medium text-lg">{selectedOrderDetail.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điện thoại</p>
                    <p className="font-medium">{selectedOrderDetail.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrderDetail.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{selectedOrderDetail.address}</p>
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                  <div className="space-y-3">
                    {selectedOrderItems.length > 0 ? (
                      selectedOrderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Số lượng: {item.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">Đơn giá: {item.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.subtotal}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">Không có sản phẩm</p>
                    )}
                  </div>
                </div>

                {/* Tổng cộng */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng tiền hàng:</span>
                    <span className="font-medium">{selectedOrderDetail.subtotal}</span>
                  </div>

                  {/* Phần coupon */}
                  {selectedOrderDetail.coupon_code && (
                    <>
                      <div
                        className={`p-3 rounded-lg ${selectedOrderDetail.coupon_data?.warning ||
                            selectedOrderDetail.coupon_data?.error
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-amber-50 border border-amber-200'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Mã giảm giá:</span>
                          <span
                            className={`font-bold ${selectedOrderDetail.coupon_data?.warning ||
                                selectedOrderDetail.coupon_data?.error
                                ? 'text-red-700'
                                : 'text-amber-700'
                              }`}
                          >
                            {selectedOrderDetail.coupon_code}
                          </span>
                        </div>
                        {selectedOrderDetail.coupon_data ? (
                          <>
                            <p
                              className={`text-sm ${selectedOrderDetail.coupon_data?.warning ||
                                  selectedOrderDetail.coupon_data?.error
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                                } mt-2`}
                            >
                              {selectedOrderDetail.coupon_data.type === 'percentage'
                                ? `Giảm ${selectedOrderDetail.coupon_data.value}% đơn hàng`
                                : `Giảm ${Number(
                                  selectedOrderDetail.coupon_data.value,
                                ).toLocaleString('vi-VN')} đ`}
                            </p>
                            {selectedOrderDetail.coupon_data.min_order_amount && (
                              <p className="text-xs text-gray-500 mt-1">
                                Áp dụng cho đơn từ{' '}
                                {Number(
                                  selectedOrderDetail.coupon_data.min_order_amount,
                                ).toLocaleString('vi-VN')}{' '}
                                đ
                              </p>
                            )}
                            {/* Hiển thị cảnh báo nếu có */}
                            {selectedOrderDetail.coupon_data.warning && (
                              <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                                <p className="text-xs text-red-700 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {selectedOrderDetail.coupon_data.warning}
                                </p>
                              </div>
                            )}
                            {selectedOrderDetail.coupon_data.error && (
                              <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                                <p className="text-xs text-red-700 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {selectedOrderDetail.coupon_data.error}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-amber-600 mt-2">
                            Thông tin mã giảm giá không khả dụng
                          </p>
                        )}
                      </div>

                      {/* Dòng Giảm giá */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Giảm giá:</span>
                        <span
                          className={
                            selectedOrderDetail.discount_raw > 0
                              ? 'text-emerald-600 font-bold'
                              : 'text-gray-500'
                          }
                        >
                          {selectedOrderDetail.discount_raw > 0 ? '-' : ''}
                          {selectedOrderDetail.discount}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Phí vận chuyển */}
                  {selectedOrderDetail.shipping_fee_raw > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển:</span>
                      <span className="font-medium">+{selectedOrderDetail.shipping_fee}</span>
                    </div>
                  )}

                  {/* Tổng thanh toán */}
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                    <span>Tổng thanh toán:</span>
                    <span className="text-primary text-xl">{selectedOrderDetail.total_amount}</span>
                  </div>
                </div>

                {/* Thông tin thanh toán và trạng thái */}
                <div className="border-t border-border pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                        <p className="font-medium">{selectedOrderDetail.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày tạo</p>
                        <p className="font-medium">{selectedOrderDetail.created_at}</p>
                      </div>
                    </div>
                    {selectedOrderDetail.status && (
                      <Badge
                        className={`text-base md:text-lg px-4 py-2 ${statusConfig[selectedOrderDetail.status as keyof typeof statusConfig]
                            ?.color || statusConfig['Chờ xác nhận'].color
                          }`}
                      >
                        {selectedOrderDetail.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
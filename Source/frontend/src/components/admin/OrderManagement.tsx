import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: "#ORD-12345",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    items: [
      { name: "iPhone 15 Pro Max 256GB", quantity: 1, price: 34990000 },
      { name: "AirPods Pro 2", quantity: 1, price: 6990000 },
    ],
    total: 41980000,
    status: "pending",
    paymentMethod: "COD",
    createdAt: "2024-01-15 10:30",
  },
  {
    id: "#ORD-12344",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    items: [{ name: "MacBook Pro 14\" M3 Pro", quantity: 1, price: 49990000 }],
    total: 49990000,
    status: "confirmed",
    paymentMethod: "Banking",
    createdAt: "2024-01-15 09:15",
  },
  {
    id: "#ORD-12343",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    address: "789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
    items: [
      { name: "iPad Pro 12.9\" M2", quantity: 1, price: 28990000 },
      { name: "Apple Pencil 2", quantity: 1, price: 3490000 },
    ],
    total: 32480000,
    status: "shipping",
    paymentMethod: "MoMo",
    createdAt: "2024-01-14 16:45",
  },
  {
    id: "#ORD-12342",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0934567890",
    address: "321 Võ Văn Tần, Q.3, TP.HCM",
    items: [{ name: "iPhone 15 128GB", quantity: 2, price: 24990000 }],
    total: 49980000,
    status: "completed",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-14 11:20",
  },
  {
    id: "#ORD-12341",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    address: "654 Cách Mạng Tháng 8, Q.10, TP.HCM",
    items: [{ name: "MacBook Air 15\" M2", quantity: 1, price: 32990000 }],
    total: 32990000,
    status: "cancelled",
    paymentMethod: "ZaloPay",
    createdAt: "2024-01-13 14:00",
  },
];

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: Package },
  shipping: { label: "Đang giao", color: "bg-violet-100 text-violet-700", icon: Truck },
  completed: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Cập nhật thành công",
      description: `Đơn hàng ${orderId} đã được cập nhật trạng thái`,
    });
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

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
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mã đơn</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thanh toán</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày tạo</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
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
                            <p className="text-xs text-muted-foreground">{order.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.total)}</td>
                        <td className="py-3 px-4 text-sm">{order.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[order.status].color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{order.createdAt}</td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {order.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "confirmed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Xác nhận đơn
                                </DropdownMenuItem>
                              )}
                              {order.status === "confirmed" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "shipping")}>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Giao hàng
                                </DropdownMenuItem>
                              )}
                              {order.status === "shipping" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "completed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Hoàn thành
                                </DropdownMenuItem>
                              )}
                              {order.status !== "completed" && order.status !== "cancelled" && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleUpdateStatus(order.id, "cancelled")}
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
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium mb-3">Sản phẩm</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-border font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-accent">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <Badge className={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  MoreVertical,
  Users,
  UserCheck,
  UserX,
  Star,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Filter,
  Download,
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
import { formatPrice } from "@/data/products";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "vip";
  joinedAt: string;
  lastOrder: string;
  orders: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
}

const mockCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    avatar: "NV",
    totalOrders: 12,
    totalSpent: 156000000,
    status: "vip",
    joinedAt: "2023-01-15",
    lastOrder: "2024-01-10",
    orders: [
      { id: "#ORD-12345", date: "2024-01-10", total: 34990000, status: "completed" },
      { id: "#ORD-12300", date: "2023-12-20", total: 28990000, status: "completed" },
      { id: "#ORD-12250", date: "2023-11-15", total: 49990000, status: "completed" },
    ],
  },
  {
    id: "CUS-002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    avatar: "TT",
    totalOrders: 5,
    totalSpent: 78000000,
    status: "active",
    joinedAt: "2023-06-20",
    lastOrder: "2024-01-08",
    orders: [
      { id: "#ORD-12340", date: "2024-01-08", total: 24990000, status: "shipping" },
      { id: "#ORD-12200", date: "2023-10-05", total: 18990000, status: "completed" },
    ],
  },
  {
    id: "CUS-003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    address: "789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
    avatar: "LV",
    totalOrders: 8,
    totalSpent: 98000000,
    status: "active",
    joinedAt: "2023-03-10",
    lastOrder: "2024-01-05",
    orders: [
      { id: "#ORD-12330", date: "2024-01-05", total: 32990000, status: "completed" },
    ],
  },
  {
    id: "CUS-004",
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0934567890",
    address: "321 Võ Văn Tần, Q.3, TP.HCM",
    avatar: "PT",
    totalOrders: 2,
    totalSpent: 45000000,
    status: "inactive",
    joinedAt: "2023-09-01",
    lastOrder: "2023-10-15",
    orders: [
      { id: "#ORD-12100", date: "2023-10-15", total: 22990000, status: "completed" },
    ],
  },
  {
    id: "CUS-005",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    address: "654 Cách Mạng Tháng 8, Q.10, TP.HCM",
    avatar: "HV",
    totalOrders: 15,
    totalSpent: 245000000,
    status: "vip",
    joinedAt: "2022-12-01",
    lastOrder: "2024-01-12",
    orders: [
      { id: "#ORD-12350", date: "2024-01-12", total: 49990000, status: "pending" },
      { id: "#ORD-12280", date: "2023-12-01", total: 34990000, status: "completed" },
    ],
  },
];

const statusConfig = {
  active: { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Không hoạt động", color: "bg-muted text-muted-foreground" },
  vip: { label: "VIP", color: "bg-amber-100 text-amber-700" },
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = (customerId: string, newStatus: Customer["status"]) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      )
    );
    toast({
      title: "Cập nhật thành công",
      description: `Khách hàng đã được cập nhật trạng thái`,
    });
  };

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <UserCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Khách VIP</p>
              <p className="text-2xl font-bold">{stats.vip}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-100">
              <ShoppingBag className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-lg font-bold">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Liên hệ</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đơn hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tổng chi tiêu</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đơn gần nhất</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCustomers.map((customer) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-accent">{customer.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{customer.totalOrders}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatPrice(customer.totalSpent)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[customer.status].color}`}
                        >
                          {customer.status === "vip" && <Star className="h-3 w-3" />}
                          {statusConfig[customer.status].label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{customer.lastOrder}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {customer.status !== "vip" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, "vip")}>
                                <Star className="h-4 w-4 mr-2" />
                                Nâng cấp VIP
                              </DropdownMenuItem>
                            )}
                            {customer.status === "inactive" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, "active")}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            {customer.status !== "inactive" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleUpdateStatus(customer.id, "inactive")}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Vô hiệu hóa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">{selectedCustomer.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                    <Badge className={statusConfig[selectedCustomer.status].color}>
                      {statusConfig[selectedCustomer.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.id}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tham gia: {selectedCustomer.joinedAt}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-accent">{selectedCustomer.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-bold text-accent">{formatPrice(selectedCustomer.totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-bold text-accent">
                    {formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                  </p>
                  <p className="text-sm text-muted-foreground">TB/đơn</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-medium mb-3">Lịch sử mua hàng gần đây</h4>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatPrice(order.total)}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;

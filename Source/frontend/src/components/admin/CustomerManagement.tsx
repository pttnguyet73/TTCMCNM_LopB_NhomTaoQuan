import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  AlertCircle,
  Loader2,
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
import { customerAPI, type Customer, type Order } from '@/services/customer';
import { formatPrice } from '@/data/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusConfig: Record<
  'active' | 'inactive' | 'vip' | 'banned',
  {
    label: string;
    color: string;
    icon?: any;
  }
> = {
  active: {
    label: 'Hoạt động',
    color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: UserCheck,
  },
  inactive: {
    label: 'Không hoạt động',
    color: 'bg-gray-100 text-gray-700 border border-gray-200',
    icon: UserX,
  },
  vip: {
    label: 'VIP',
    color: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: Star,
  },
  banned: {
    label: 'Bị khóa',
    color: 'bg-red-100 text-red-700 border border-red-200',
    icon: AlertCircle,
  },
};

// Hàm lấy avatar từ tên
const getAvatarFromName = (name: string): string => {
  if (!name || name.trim() === '') return '??';
  const nameParts = name.trim().split(' ');
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Hàm format ngày
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Chưa có';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

// Hàm format mã khách hàng
const formatCustomerId = (id: number): string => {
  return `CUS-${String(id).padStart(3, '0')}`;
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getCustomers();

      const customersData = response.data || response || [];

      const formattedCustomers = customersData.map((customer: any) => ({
        ...customer,
        avatar: getAvatarFromName(customer.name),
        orders_count: customer.orders_count ?? 0,
        total_spent: customer.total_spent || 0,
        last_order_date: customer.last_order_date || null,
        phone: customer.phone || 'Chưa cập nhật',
        address: customer.address || 'Chưa cập nhật',
      }));

      setCustomers(formattedCustomers);
      setFilteredCustomers(formattedCustomers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải danh sách khách hàng',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm && filterStatus === 'all') {
      setFilteredCustomers(customers);
      return;
    }

    let result = customers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          (customer.phone && customer.phone.toLowerCase().includes(term)),
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((customer) => customer.status === filterStatus);
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm, filterStatus]);

 const fetchCustomerOrders = async (customerId: number) => {
  try {
    setOrdersLoading(true);

  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    toast({
      variant: 'destructive',
      title: 'Lỗi',
      description:
        error.response?.data?.message || 'Không thể tải đơn hàng',
    });
  } finally {
    setOrdersLoading(false);
  }
};

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerOrders(customer.id);
  };

  const handleUpdateStatus = async (
    customerId: number,
    newStatus: 'active' | 'inactive' | 'vip',
  ) => {
    try {
      await customerAPI.updateCustomerStatus(customerId, newStatus);

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, status: newStatus } : customer,
        ),
      );

      setFilteredCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, status: newStatus } : customer,
        ),
      );

      toast({
        title: 'Cập nhật thành công',
        description: `Trạng thái khách hàng đã được cập nhật`,
      });
    } catch (error: any) {
      console.error('Error updating customer status:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể cập nhật trạng thái',
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const blob = await customerAPI.exportCustomers();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Xuất file thành công',
        description: 'File Excel đã được tải xuống',
      });
    } catch (error: any) {
      console.error('Error exporting customers:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xuất file',
      });
    } finally {
      setExporting(false);
    }
  };

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    vip: customers.filter((c) => c.status === 'vip').length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Khách VIP</p>
                <p className="text-2xl font-bold">{stats.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-violet-100 text-violet-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-lg font-bold">{formatPrice(stats.totalRevenue)}</p>
              </div>
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
        <div className="flex gap-3 w-full sm:w-auto">
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
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={exporting || customers.length === 0}
            className="w-full sm:w-auto"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy khách hàng</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc'
                  : 'Chưa có khách hàng nào trong hệ thống'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead className="text-center">Đơn hàng</TableHead>
                    <TableHead>Tổng chi tiêu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đơn gần nhất</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredCustomers.map((customer) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {customer.avatar}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCustomerId(customer.id)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {customer.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">{customer.orders_count}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium">
                            {formatPrice(customer.total_spent || 0)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${statusConfig[customer.status].color
                              }`}
                          >
                            {customer.status === 'vip' && <Star className="h-3 w-3" />}
                            {statusConfig[customer.status].label}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-sm text-muted-foreground">
                          {customer.last_order_date
                            ? formatDate(customer.last_order_date)
                            : 'Chưa có'}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSelectCustomer(customer)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {customer.status !== 'vip' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(customer.id, 'vip')}
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Nâng cấp VIP
                                </DropdownMenuItem>
                              )}
                              {customer.status === 'inactive' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(customer.id, 'active')}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Kích hoạt
                                </DropdownMenuItem>
                              )}
                              {customer.status !== 'inactive' && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleUpdateStatus(customer.id, 'inactive')}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Vô hiệu hóa
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{selectedCustomer.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <Badge className={statusConfig[selectedCustomer.status].color}>
                      {statusConfig[selectedCustomer.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCustomerId(selectedCustomer.id)}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Vai trò: </span>
                      <span className="font-medium">
                        {selectedCustomer.role === 'vip' ? 'VIP' : selectedCustomer.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Xác thực: </span>
                      <Badge variant={selectedCustomer.is_verified === 1 ? 'outline' : 'secondary'}>
                        {selectedCustomer.is_verified === 1
                          ? 'Đã xác thực email'
                          : 'Chưa xác thực email'}
                      </Badge>

                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Thông tin liên hệ</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Địa chỉ</h4>
                  </div>
                  <p className="text-sm">{selectedCustomer.address}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Thời gian</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                      <p className="font-medium">{formatDate(selectedCustomer.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                      <p className="font-medium">{formatDate(selectedCustomer.updated_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Đơn hàng</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Đơn hàng cuối</p>
                      <p className="font-medium">
                        {selectedCustomer.last_order_date
                          ? formatDate(selectedCustomer.last_order_date)
                          : 'Chưa có'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedCustomer.orders_count || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 text-center">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(selectedCustomer.total_spent || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 text-center">
                  <p className="text-lg font-bold text-primary">
                    {selectedCustomer.orders_count && selectedCustomer.orders_count > 0
                      ? formatPrice(
                        (selectedCustomer.total_spent || 0) / selectedCustomer.orders_count,
                      )
                      : formatPrice(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">TB/đơn</p>
                </div>
              </div>

              {/* Order History */}
              
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MoreVertical,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  Eye,
  Trash2,
  UserCog,
  EyeOff,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Phone,
  Crown,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: 'admin' | 'saler' | 'user';
  status: 'active' | 'inactive' | 'vip' | 'banned';
  created_at: string;
  orders_count: number;
  total_spent: number;
  is_verified: boolean;
  profile_photo_url?: string;
}

interface Stats {
  total: number;
  admin: number;
  saler: number;
  user: number;
  active: number;
  inactive: number;
  vip: number;
  banned: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    admin: 0,
    saler: 0,
    user: 0,
    active: 0,
    inactive: 0,
    vip: 0,
    banned: 0,
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user' as 'admin' | 'saler' | 'user',
    status: 'active' as 'active' | 'inactive' | 'vip' | 'banned',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
  const { toast } = useToast();

  // Fetch users data from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/admin/users?${params.toString()}`);
      console.log('API Response:', response.data);

      if (response.data.success) {
        setUsers(response.data.data || []);
        setStats(
          response.data.stats || {
            total: response.data.data?.length || 0,
            admin: 0,
            saler: 0,
            user: 0,
            active: 0,
            inactive: 0,
            vip: 0,
            banned: 0,
          },
        );
      } else {
        setError(response.data.message || 'Không thể tải dữ liệu');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'Không thể tải dữ liệu người dùng';
      setError(errorMessage);
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    setSearchTimeout(timer);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm, filterRole, filterStatus]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    const errors: Record<string, string> = {};

    if (!newUserForm.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
    }
    if (!newUserForm.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(newUserForm.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!newUserForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (newUserForm.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (newUserForm.password !== newUserForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      console.log('Creating user:', newUserForm);
      const response = await api.post('/admin/users', {
        name: newUserForm.name,
        email: newUserForm.email,
        password: newUserForm.password,
        role: newUserForm.role,
        status: newUserForm.status,
        phone: newUserForm.phone || null,
      });

      console.log('User created:', response.data);

      if (response.data.success) {
        setIsAddUserOpen(false);
        setNewUserForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          role: 'user',
          status: 'active',
        });
        setFormErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);

        // Refresh user list
        fetchUsers();

        toast({
          title: 'Thêm thành công',
          description: response.data.message || `Đã thêm người dùng ${response.data.data?.name}`,
        });
      } else {
        toast({
          title: 'Lỗi',
          description: response.data.message || 'Không thể thêm người dùng',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Create user error:', err);
      const errorData = err.response?.data;
      let errorMsg = 'Không thể thêm người dùng';

      if (errorData?.errors) {
        // Laravel validation errors
        const firstError = Object.values(errorData.errors)[0];
        errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'saler':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Saler
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="hover:bg-gray-100">
            <Shield className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Hoạt động</Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="hover:bg-gray-100">
            Không hoạt động
          </Badge>
        );
      case 'vip':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
            <Crown className="h-3 w-3 mr-1" />
            VIP
          </Badge>
        );
      case 'banned':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
            <Ban className="h-3 w-3 mr-1" />
            Bị cấm
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const response = await api.put(`/admin/users/${selectedUser.id}/role`, {
        role: newRole,
      });

      if (response.data.success) {
        toast({
          title: 'Cập nhật thành công',
          description: response.data.message,
        });

        const updatedUser = { ...selectedUser, role: newRole as User['role'] };
        if (
          selectedUser.role === 'user' &&
          selectedUser.status === 'vip' &&
          (newRole === 'admin' || newRole === 'saler')
        ) {
          updatedUser.status = 'active';
        }

        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)));

        // Update stats
        fetchUsers();

        setIsRoleDialogOpen(false);
      } else {
        toast({
          title: 'Lỗi',
          description: response.data.message || 'Không thể cập nhật vai trò',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Update role error:', err);
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật vai trò';
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: User['status']) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast({
          title: 'Cập nhật thành công',
          description: response.data.message,
        });

        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));

        fetchUsers();
      } else {
        toast({
          title: 'Lỗi',
          description: response.data.message || 'Không thể cập nhật trạng thái',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật trạng thái';
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const response = await api.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        toast({
          title: 'Đã xóa',
          description: response.data.message || 'Người dùng đã được xóa khỏi hệ thống',
        });

        // Remove from local state
        setUsers((prev) => prev.filter((u) => u.id !== userId));

        // Update stats
        fetchUsers();
      }
    } catch (err: any) {
      console.error('Delete user error:', err);
      const errorMsg = err.response?.data?.message || 'Không thể xóa người dùng';
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Render loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải dữ liệu người dùng...</p>
        <Button onClick={() => fetchUsers()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  // Render error state
  if (error && users.length === 0) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => fetchUsers()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tải lại dữ liệu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <div className="flex items-center gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="saler">Saler</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="banned">Bị cấm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats - Sửa thành 6 cột để hiển thị đủ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <UserCog className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="text-2xl font-bold">{stats.admin}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saler</p>
              <p className="text-2xl font-bold">{stats.saler}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoạt động</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VIP</p>
              <p className="text-2xl font-bold">{stats.vip}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <Ban className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bị cấm</p>
              <p className="text-2xl font-bold">{stats.banned}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách người dùng ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Người dùng
                    </th>
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Vai trò
                    </th>
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </th>
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Đơn hàng
                    </th>
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Tổng chi tiêu
                    </th>
                    <th className="text-center py-4 px-2 text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          Không có người dùng nào
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.profile_photo_url} />
                                <AvatarFallback className="bg-gray-100 text-gray-700">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                {user.phone && (
                                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex justify-center">{getRoleBadge(user.role)}</div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex justify-center">{getStatusBadge(user.status)}</div>
                          </td>
                          <td className="py-4 px-2 text-center text-sm font-medium">
                            {user.orders_count || 0}
                          </td>
                          <td className="py-4 px-2 text-center text-sm font-medium">
                            {formatPrice(user.total_spent)}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewDetail(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)}>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Thay đổi vai trò
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status !== 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(user.id, 'active')}
                                  >
                                    Kích hoạt
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'inactive' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(user.id, 'inactive')}
                                  >
                                    Tạm ngừng
                                  </DropdownMenuItem>
                                )}
                                {/* CHỈ hiển thị "Nâng lên VIP" cho user có role là 'user' */}
                                {user.role === 'user' && user.status !== 'vip' ? (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(user.id, 'vip')}
                                    className="text-purple-600"
                                  >
                                    <Crown className="h-4 w-4 mr-2" />
                                    Nâng lên VIP
                                  </DropdownMenuItem>
                                ) : (
                                  // Hiển thị thông báo disabled cho admin/saler
                                  user.role !== 'user' &&
                                  user.status !== 'vip' && (
                                    <DropdownMenuItem
                                      disabled
                                      className="text-gray-400 cursor-not-allowed"
                                    >
                                      <Crown className="h-4 w-4 mr-2" />
                                      Nâng lên VIP (chỉ dành cho User)
                                    </DropdownMenuItem>
                                  )
                                )}
                                {user.status !== 'banned' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(user.id, 'banned')}
                                    className="text-red-600"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Cấm người dùng
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa người dùng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về người dùng</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profile_photo_url} />
                  <AvatarFallback className="text-lg bg-gray-100">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{selectedUser.email}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Tham gia: {formatDate(selectedUser.created_at)}</span>
                </div>
                {selectedUser.is_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Đã xác thực email
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedUser.orders_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-lg font-bold">{formatPrice(selectedUser.total_spent)}</p>
                  <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thay đổi vai trò</DialogTitle>
            <DialogDescription>Thay đổi vai trò của người dùng</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thay đổi vai trò cho <strong>{selectedUser.name}</strong>
              </p>
              <div className="space-y-2">
                <Label>Vai trò mới</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="saler">Saler</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateRole}>Cập nhật</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={isAddUserOpen}
        onOpenChange={(open) => {
          setIsAddUserOpen(open);
          if (!open) {
            setFormErrors({});
            setShowPassword(false);
            setShowConfirmPassword(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Thêm người dùng mới
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin để thêm người dùng mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Họ và tên
              </Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên"
                value={newUserForm.name}
                onChange={(e) => {
                  setNewUserForm((prev) => ({ ...prev, name: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="required">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={newUserForm.email}
                onChange={(e) => {
                  setNewUserForm((prev) => ({ ...prev, email: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={formErrors.email ? 'border-destructive' : ''}
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại (tuỳ chọn)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0901234567"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="required">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={newUserForm.password}
                  onChange={(e) => {
                    setNewUserForm((prev) => ({ ...prev, password: e.target.value }));
                    setFormErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={formErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-destructive">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="required">
                Nhập lại mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={newUserForm.confirmPassword}
                  onChange={(e) => {
                    setNewUserForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={formErrors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vai trò</Label>
                <Select
                  value={newUserForm.role}
                  onValueChange={(value: 'admin' | 'saler' | 'user') =>
                    setNewUserForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="saler">Saler</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={newUserForm.status}
                  onValueChange={(value: 'active' | 'inactive' | 'vip' | 'banned') => {
                    setNewUserForm((prev) => ({ ...prev, status: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem
                      value="vip"
                      disabled={newUserForm.role !== 'user'}
                      className={newUserForm.role !== 'user' ? 'text-gray-400' : ''}
                    >
                      VIP {newUserForm.role !== 'user' && '(chỉ dành cho User)'}
                    </SelectItem>
                    <SelectItem value="banned">Bị cấm</SelectItem>
                  </SelectContent>
                </Select>
                {newUserForm.role !== 'user' && newUserForm.status === 'vip' && (
                  <p className="text-xs text-amber-600">
                    Chỉ người dùng với role "User" mới có thể có trạng thái VIP
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddUser} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Thêm người dùng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

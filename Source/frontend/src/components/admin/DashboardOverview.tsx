import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import api from "@/lib/api";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const statsCards = [
  { title: "Tổng doanh thu", value: "₫2.45 tỷ", change: "+12.5%", trend: "up", icon: DollarSign, color: "bg-accent" },
  { title: "Đơn hàng", value: "1,234", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "bg-emerald-500" },
  { title: "Sản phẩm", value: "156", change: "+3", trend: "up", icon: Package, color: "bg-amber-500" },
  { title: "Khách hàng", value: "8,456", change: "-2.4%", trend: "down", icon: Users, color: "bg-violet-500" },
];

const revenueData = [
  { name: "T1", revenue: 1200 }, { name: "T2", revenue: 1800 }, { name: "T3", revenue: 1500 },
  { name: "T4", revenue: 2200 }, { name: "T5", revenue: 1900 }, { name: "T6", revenue: 2600 },
  { name: "T7", revenue: 2100 }, { name: "T8", revenue: 2800 }, { name: "T9", revenue: 2400 },
  { name: "T10", revenue: 3100 }, { name: "T11", revenue: 2700 }, { name: "T12", revenue: 3500 },
];

const categoryData = [
  { name: "iPhone", value: 45 }, { name: "iPad", value: 25 },
  { name: "MacBook", value: 20 }, { name: "Phụ kiện", value: 10 },
];

const DashboardOverview = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/order');
        setOrders(res.data); 
      } catch (err) {
        console.error("Lỗi lấy đơn hàng admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-amber-100 text-amber-700";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Hoàn thành";
      case "processing": return "Đang xử lý";
      case "pending": return "Chờ xác nhận";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-destructive"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground">so với tháng trước</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    formatter={(value: number) => [`₫${value}M`, "Doanh thu"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={70} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: number) => [`${value}%`, "Tỷ lệ"]} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu đơn hàng...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mã đơn</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium">#{order.id}</td>
                        <td className="py-3 px-4 text-sm">{order.customer}</td>
                        <td className="py-3 px-4 text-sm">{order.product}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-muted-foreground">Không có đơn hàng nào gần đây.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
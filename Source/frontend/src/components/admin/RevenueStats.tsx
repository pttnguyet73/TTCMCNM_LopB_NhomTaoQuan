import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const monthlyRevenue = [
  { name: "T1", revenue: 1250, orders: 45, profit: 312 },
  { name: "T2", revenue: 1820, orders: 62, profit: 455 },
  { name: "T3", revenue: 1540, orders: 53, profit: 385 },
  { name: "T4", revenue: 2280, orders: 78, profit: 570 },
  { name: "T5", revenue: 1950, orders: 67, profit: 487 },
  { name: "T6", revenue: 2650, orders: 89, profit: 662 },
  { name: "T7", revenue: 2180, orders: 74, profit: 545 },
  { name: "T8", revenue: 2890, orders: 98, profit: 722 },
  { name: "T9", revenue: 2450, orders: 83, profit: 612 },
  { name: "T10", revenue: 3150, orders: 107, profit: 787 },
  { name: "T11", revenue: 2780, orders: 94, profit: 695 },
  { name: "T12", revenue: 3580, orders: 122, profit: 895 },
];

const categoryRevenue = [
  { name: "iPhone", value: 45, amount: 12500 },
  { name: "MacBook", value: 28, amount: 7800 },
  { name: "iPad", value: 15, amount: 4200 },
  { name: "Apple Watch", value: 8, amount: 2200 },
  { name: "Phụ kiện", value: 4, amount: 1100 },
];

const COLORS = ["hsl(211, 100%, 50%)", "hsl(142, 76%, 36%)", "hsl(45, 93%, 47%)", "hsl(262, 83%, 58%)", "hsl(0, 84%, 60%)"];

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: 156, revenue: 5456 },
  { name: "MacBook Pro 14\"", sales: 89, revenue: 4450 },
  { name: "iPhone 15", sales: 124, revenue: 3100 },
  { name: "iPad Pro 12.9\"", sales: 67, revenue: 1943 },
  { name: "AirPods Pro 2", sales: 234, revenue: 1638 },
];

const formatCurrency = (value: number) => `₫${value}M`;

const RevenueStats = () => {
  const [timeRange, setTimeRange] = useState("year");

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = monthlyRevenue.reduce((sum, m) => sum + m.profit, 0);
  const totalOrders = monthlyRevenue.reduce((sum, m) => sum + m.orders, 0);
  const avgOrderValue = Math.round((totalRevenue / totalOrders) * 1000000);

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Thống kê doanh thu</h2>
          <p className="text-sm text-muted-foreground">Phân tích chi tiết hiệu suất kinh doanh</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="quarter">Quý này</SelectItem>
            <SelectItem value="year">Năm nay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-3xl font-bold">₫{(totalRevenue / 1000).toFixed(1)} tỷ</p>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+18.2%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-accent">
                  <DollarSign className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lợi nhuận</p>
                  <p className="text-3xl font-bold">₫{totalProfit}M</p>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold">{totalOrders.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+8.7%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-violet-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Giá trị trung bình</p>
                  <p className="text-3xl font-bold">₫{(avgOrderValue / 1000000).toFixed(1)}M</p>
                  <div className="flex items-center gap-1 text-destructive">
                    <ArrowDownRight className="h-4 w-4" />
                    <span className="text-sm font-medium">-2.3%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Xu hướng doanh thu & lợi nhuận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "revenue" ? "Doanh thu" : "Lợi nhuận",
                    ]}
                  />
                  <Legend 
                    formatter={(value) => (value === "revenue" ? "Doanh thu" : "Lợi nhuận")}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(211, 100%, 50%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(211, 100%, 50%)", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value}% (₫${props.payload.amount}M)`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryRevenue.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs fill-muted-foreground" />
                <YAxis dataKey="name" type="category" className="text-xs fill-muted-foreground" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    name === "sales" ? `${value} sản phẩm` : `₫${value}M`,
                    name === "sales" ? "Số lượng" : "Doanh thu",
                  ]}
                />
                <Legend formatter={(value) => (value === "sales" ? "Số lượng" : "Doanh thu")} />
                <Bar dataKey="sales" fill="hsl(211, 100%, 50%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueStats;

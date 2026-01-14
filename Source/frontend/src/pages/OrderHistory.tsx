import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, CreditCard, Calendar, Hash, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type OrderStatus = "all" | "pending" | "shipping" | "delivered";

import { orderAPI } from "@/services/order";

interface OrderItem {
  product_id?: number | string;
  id?: string;
  name: string;
  image?: string;
  storage?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string; // formatted id like #ORD-001
  raw_id?: number;
  orderNumber?: string;
  date: string;
  paymentMethod?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "shipping" | "delivered";
}

const STATUS_TABS = [
  { key: "all" as OrderStatus, label: "Tất cả", icon: Package },
  { key: "pending" as OrderStatus, label: "Chờ xác nhận", icon: Clock },
  { key: "shipping" as OrderStatus, label: "Đang giao hàng", icon: Truck },
  { key: "delivered" as OrderStatus, label: "Hoàn thành", icon: CheckCircle },
];

const getStatusConfig = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      };
    case "shipping":
      return {
        label: "Đang giao hàng",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Truck,
      };
    case "delivered":
      return {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      };
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  // backend may already return formatted `dd/mm/YYYY H:i`, just return raw in that case
  if (dateStr.includes('/')) return dateStr;
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const parsePrice = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const s = String(val).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const mapStatusKey = (statusStr: string | undefined) => {
    if (!statusStr) return 'pending';
    const s = statusStr.toLowerCase();
    if (s.includes('chờ') || s.includes('cho') || s.includes('pending')) return 'pending';
    if (s.includes('hoàn') && s.includes('thành') || s.includes('hoan') && s.includes('thanh') || s.includes('hoàn thanh') || s.includes('hoan thành') || s.includes('hoàn thành')|| s.includes('deliv')) return 'delivered';
    if (s.includes('đang') || s.includes('giao') || s.includes('dang') || s.includes('shipping')) return 'shipping';
    return 'pending';
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getUserOrders();
        const payload = res && res.data ? res.data : res; // support shapes
        const list = Array.isArray(payload) ? payload : (payload?.data ?? payload?.data ?? payload);
        const ordersList = Array.isArray(list) ? list : (payload?.data ?? []);

        const full = await Promise.all((ordersList as any[]).map(async (o: any) => {
          const detailRes = await orderAPI.getOrderDetailPublic(o.raw_id ?? o.rawId ?? o.rawId ?? o.id?.replace(/[^0-9]/g, ''));
          const detail = detailRes && detailRes.data ? detailRes.data : detailRes;
          const itemsRaw = detail?.items ?? [];
          const items: OrderItem[] = (itemsRaw as any[]).map((it: any, idx: number) => ({
            id: String(it.product_id ?? idx),
            product_id: it.product_id,
            name: it.name,
            image: it.image ?? it.product_image,
            quantity: Number(it.quantity) || 0,
            price: parsePrice(it.price_raw ?? it.price ?? it.price_raw),
          }));

          const total = parsePrice(o.total_raw ?? o.total_amount ?? o.total_raw ?? o.total_amount);

          return {
            id: o.id,
            raw_id: o.raw_id ?? o.rawId ?? o.id,
            orderNumber: o.id,
            date: o.created_at ?? o.createdAt ?? o.createdAtRaw ?? o.created_at,
            paymentMethod: o.payment_method ?? o.paymentMethod,
            items,
            total,
            status: mapStatusKey(o.status_key ?? o.status),
          } as Order;
        }));

        setOrders(full);
      } catch (err) {
        console.error('Error loading orders', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-xl">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = tab.key === "all"
            ? orders.length
            : orders.filter(o => o.status === tab.key).length;

          return (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                ${isActive 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`
                px-2 py-0.5 rounded-full text-xs
                ${isActive ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}
              `}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Orders List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {filteredOrders.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground">Không có đơn hàng</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Chưa có đơn hàng nào trong danh mục này
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <Card className="border-border/50 shadow-elegant overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Order Header */}
                    <div className="bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-border/50">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="w-4 h-4" />
                          <span className="font-medium text-foreground">{order.orderNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="w-4 h-4" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                      <Badge className={`${statusConfig.className} border`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={item.id}>
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {item.storage && (
                                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                      {item.storage}
                                    </span>
                                  )}
                                  {item.color && (
                                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-muted-foreground">
                                    Số lượng: {item.quantity}
                                  </span>
                                  <span className="font-semibold text-accent">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {index < order.items.length - 1 && (
                              <Separator className="my-3" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} sản phẩm
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Tổng tiền: </span>
                            <span className="text-lg font-bold text-accent">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            Chi tiết
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;

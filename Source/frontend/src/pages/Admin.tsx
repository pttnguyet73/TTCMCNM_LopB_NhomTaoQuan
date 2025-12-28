import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FileText,
  Megaphone,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import RevenueStats from "@/components/admin/RevenueStats";
import CustomerManagement from "@/components/admin/CustomerManagement";
import ContentManagement from "@/components/admin/ContentManagement";
import MarketingManagement from "@/components/admin/MarketingManagement";
import UserManagement from "@/components/admin/UserManagement";

const menuItems = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "products", label: "Sản phẩm", icon: Package },
  { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
  { id: "revenue", label: "Doanh thu", icon: BarChart3 },
  { id: "customers", label: "Khách hàng", icon: Users },
  { id: "users", label: "Người dùng", icon: UserCog },
  { id: "content", label: "Nội dung", icon: FileText },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "revenue":
        return <RevenueStats />;
      case "customers":
        return <CustomerManagement />;
      case "content":
        return <ContentManagement />;
      case "marketing":
        return <MarketingManagement />;
      case "users":
        return <UserManagement />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Tính năng đang phát triển...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-card border-r border-border flex flex-col h-screen sticky top-0"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {sidebarOpen && isActive && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && (
              <span className="font-medium">Đăng xuất</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-semibold">
              {menuItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý cửa hàng của bạn
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

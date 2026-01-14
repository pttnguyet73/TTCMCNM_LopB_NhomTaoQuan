import { useState } from "react";
import { motion } from "framer-motion";
import { User, ShoppingBag, Settings, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ProfileSettings from "./ProfileSettings";
import OrderHistory from "./OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-hero border-b border-border/50">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
            >
              <span>Trang chủ</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Tài khoản của tôi</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Tài khoản của tôi
                </h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý thông tin cá nhân và theo dõi đơn hàng
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl w-full md:w-auto grid grid-cols-2 md:inline-flex gap-1">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 gap-2"
              >
                <Settings className="w-4 h-4" />
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Lịch sử đơn hàng
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="profile" className="mt-0">
                <ProfileSettings />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrderHistory />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;

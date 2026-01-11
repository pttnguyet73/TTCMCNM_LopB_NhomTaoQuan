import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import ChatBot from "@/components/chat/Chatbot";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SocialCallback from "./pages/SocialCallback";
import AdminGuard from "./pages/AuthGuard.tsx";
import Profile from "./pages/profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <Admin />
              </AdminGuard>
            }
          />
          <Route path="/auth/callback" element={<SocialCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ChatBot />
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;

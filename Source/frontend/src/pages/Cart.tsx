import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
 const {
  items,
  updateQuantity,
  removeFromCart,
  totalPrice,
  shippingFee,
  clearCart,
  discount,
  setDiscount,
  finalTotal, 
} = useCart();



  const handleApplyPromo = async () => {
    if (!promoCode) return toast.error('Vui lòng nhập mã giảm giá');

    try {
      const res = await api.get(`/coupons/${promoCode}`);
      const coupon = res.data;

      const now = new Date();
      if (coupon.used >= coupon.max_uses) throw new Error('Mã giảm giá đã hết lượt sử dụng');
      if (totalPrice < coupon.min_total) throw new Error(`Đơn hàng tối thiểu ${formatPrice(coupon.min_total)} để sử dụng mã`);
      if (new Date(coupon.valid_from) > now || new Date(coupon.valid_to) < now) throw new Error('Mã giảm giá chưa tới hạn hoặc đã hết hạn');

      let newDiscount = 0;
      const value = Number(coupon.value) || 0;

      if (coupon.type === 'percent') {
        newDiscount = totalPrice * (value / 100);
      } else if (coupon.type === 'fixed') {
        newDiscount = value;
      }

      setDiscount(newDiscount);

      toast.success(`Đã áp dụng mã giảm giá ${coupon.code} - Giảm ${formatPrice(newDiscount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Mã giảm giá không hợp lệ');
      setDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Giỏ hàng trống
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
              </p>
              <Link to="/products">
                <Button variant="hero" size="lg">
                  Tiếp tục mua sắm
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            Giỏ hàng ({items.length} sản phẩm)
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 md:gap-6 p-4 md:p-6 bg-card rounded-2xl border border-border"
                >
                  {/* Image */}
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary">
                      <img
                        src={item.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{item.selectedColor}</span>
                      <span>•</span>
                    </div>
                    <p className="text-lg font-bold text-foreground mt-2">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="inline-flex items-center gap-2 bg-secondary rounded-xl p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.quantity - 1
                          )}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.quantity + 1
                          )}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(
                          item.product.id,
                          item.selectedColor,
                        )}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end">
                <Button variant="ghost" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tất cả
                </Button>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-24 p-6 bg-card rounded-2xl border border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Tóm tắt đơn hàng
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="w-full h-11 pl-10 pr-4 bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <Button variant="apple" onClick={handleApplyPromo}>
                      Áp dụng
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="font-medium">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">Tổng cộng</span>
                    <span className="text-2xl font-bold text-foreground">{formatPrice(finalTotal)}</span>
                  </div>
                </div>


                {/* Checkout Button */}
                <Link to="/checkout">
                  <Button variant="hero" size="lg" className="w-full">
                    Thanh toán
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link to="/products">
                  <Button variant="ghost" className="w-full mt-3">
                    Tiếp tục mua sắm
                  </Button>
                </Link>

                {/* Info */}
                <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    🚚 Miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

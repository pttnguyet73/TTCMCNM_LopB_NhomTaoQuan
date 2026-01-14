import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import {
  CreditCard,
  Truck,
  Building2,
  Smartphone,
  Wallet,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronLeft,
  CheckCircle2,
  Shield,
} from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note: string;
}

const paymentMethods = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: Truck,
    color: 'text-green-600',
  },
  {
    id: 'banking',
    name: 'Internet Banking',
    description: 'Chuyển khoản qua ngân hàng nội địa',
    icon: Building2,
    color: 'text-blue-600',
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: Wallet,
    color: 'text-pink-500',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ví điện tử ZaloPay',
    icon: Smartphone,
    color: 'text-blue-500',
  },
  {
    id: 'credit',
    name: 'Thẻ tín dụng / Ghi nợ',
    description: 'Visa, Mastercard, JCB',
    icon: CreditCard,
    color: 'text-purple-600',
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    note: '',
  });

  const shippingFee = totalPrice >= 10000000 ? 0 : 50000;
  const finalTotal = totalPrice + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!shippingInfo.fullName.trim()) {
      toast({ title: 'Vui lòng nhập họ tên', variant: 'destructive' });
      return false;
    }
    if (!shippingInfo.phone.trim() || !/^0\d{9}$/.test(shippingInfo.phone)) {
      toast({
        title: 'Số điện thoại không hợp lệ',
        description: 'Vui lòng nhập số điện thoại 10 số bắt đầu bằng 0',
        variant: 'destructive',
      });
      return false;
    }
    if (!shippingInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      toast({ title: 'Email không hợp lệ', variant: 'destructive' });
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast({ title: 'Vui lòng nhập địa chỉ', variant: 'destructive' });
      return false;
    }
    if (!shippingInfo.city.trim()) {
      toast({ title: 'Vui lòng chọn Tỉnh/Thành phố', variant: 'destructive' });
      return false;
    }
    if (!shippingInfo.district.trim()) {
      toast({ title: 'Vui lòng chọn Quận/Huyện', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    clearCart();

    toast({
      title: 'Đặt hàng thành công!',
      description: 'Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm nhất.',
    });

    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán.
            </p>
            <Button onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-6 -ml-2">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại giỏ hàng
        </Button>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
                    <p className="text-sm text-muted-foreground">
                      Điền đầy đủ thông tin để nhận hàng
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Nguyễn Văn A"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="0912345678"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Địa chỉ cụ thể *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Hồ Chí Minh"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Quận 1"
                      value={shippingInfo.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="Phường Bến Nghé"
                      value={shippingInfo.ward}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Input
                      id="note"
                      name="note"
                      placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                      value={shippingInfo.note}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
                    <p className="text-sm text-muted-foreground">Chọn cách thanh toán phù hợp</p>
                  </div>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted ${method.color}`}
                      >
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </label>
                  ))}
                </RadioGroup>

                {/* Payment specific info */}
                {paymentMethod === 'banking' && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Thông tin chuyển khoản:
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">Ngân hàng: Vietcombank</p>
                    <p className="text-blue-700 dark:text-blue-300">STK: 1234567890</p>
                    <p className="text-blue-700 dark:text-blue-300">Chủ TK: CONG TY ISTORE</p>
                    <p className="text-blue-700 dark:text-blue-300 mt-2">
                      Nội dung: [Họ tên] - [SĐT]
                    </p>
                  </div>
                )}

                {(paymentMethod === 'momo' || paymentMethod === 'zalopay') && (
                  <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl text-sm">
                    <p className="text-pink-700 dark:text-pink-300">
                      Bạn sẽ được chuyển đến ứng dụng{' '}
                      {paymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'} để hoàn tất thanh toán sau khi
                      đặt hàng.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit' && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-sm">
                    <p className="text-purple-700 dark:text-purple-300">
                      Bạn sẽ được chuyển đến cổng thanh toán an toàn để nhập thông tin thẻ.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedColor} / {item.selectedStorage}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                          <span className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Miễn phí vận chuyển cho đơn hàng từ 10 triệu
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Đặt hàng</>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Giao dịch được bảo mật 100%
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

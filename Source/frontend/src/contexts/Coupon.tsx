import { createContext, useContext, useEffect, useState } from 'react';
import { couponService } from '@/services/coupon';
import { Coupon } from '@/types/coupon';
import { toast } from 'sonner';

interface CouponContextType {
  coupons: Coupon[];
  fetchCoupons: () => void;
  createCoupon: (data: any) => Promise<void>;
  updateCoupon: (id: number, data: any) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchCoupons = async () => {
    const data = await couponService.getAll();
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createCoupon = async (data: any) => {
    await couponService.create(data);
    toast.success('Tạo mã giảm giá thành công');
    fetchCoupons();
  };

  const updateCoupon = async (id: number, data: any) => {
    await couponService.update(id, data);
    toast.success('Cập nhật mã giảm giá thành công');
    fetchCoupons();
  };

  const deleteCoupon = async (id: number) => {
    await couponService.remove(id);
    toast.success('Đã xoá mã giảm giá');
    fetchCoupons();
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        fetchCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupon must be used inside CouponProvider');
  return ctx;
};

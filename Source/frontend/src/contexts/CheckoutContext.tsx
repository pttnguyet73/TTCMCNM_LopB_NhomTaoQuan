import { createContext, useContext } from 'react';
import axios from '@/lib/api'; 

type CheckoutPayload = {
  items: any[];
  total_amount: number;
  shipping: {
    fullName: string;
    phone: string;
    address: string;
    district: string;
  };
  paymentMethod: string;
};

const CheckoutContext = createContext<
  (payload: CheckoutPayload) => Promise<any>
>(() => {
  throw new Error('useCheckout must be used within CheckoutProvider');
});

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const createOrder = async (payload: CheckoutPayload) => {
    const response = await axios.post('/checkout', payload);
    return response.data;
  };

  return (
    <CheckoutContext.Provider value={createOrder}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);

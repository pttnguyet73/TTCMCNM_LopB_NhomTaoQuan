import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '@/services/cart';
import { toast } from 'sonner';
export interface CartItem {
  cartItemId: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  selectedColor: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    productId: number,
    color: string,
    quantity: number
  ) => Promise<void>;
  updateQuantity: (
    productId: number,
    color: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (
    productId: number,
    color: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

    const fetchCart = async () => {
    try {
      const data = await cartService.getCart();

      setItems(
        data.map(item => ({
          cartItemId: item.id,
          product: item.product,
          selectedColor: item.color,
          quantity: item.quantity,
          image: item.image,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


   const addToCart = async (
    productId: number,
    color: string,
    quantity: number
  ) => {
    try {
      await cartService.addToCart({
        product_id: productId,
        color: color,
        quantity,
      });

      toast.success('Đã thêm vào giỏ hàng');
      fetchCart();
    } catch (err) {
      toast.error('Không thể thêm vào giỏ');
    }
  };

  const updateQuantity = async (
    productId: number,
    color: string,
    quantity: number
  ) => {
    const item = items.find(
      i =>
        i.product.id === productId &&
        i.selectedColor === color    );

    if (!item || quantity < 1) return;

    try {
      await cartService.updateQuantity(item.cartItemId, quantity);
      fetchCart();
    } catch (err) {
      toast.error('Không thể cập nhật số lượng');
    }
  };

  const removeFromCart = async (
    productId: number,
    color: string  ) => {
    const item = items.find(
      i =>
        i.product.id === productId &&
        i.selectedColor === color 
    );

    if (!item) return;

    try {
      await cartService.removeItem(item.cartItemId);
      toast.success('Đã xoá sản phẩm');
      fetchCart();
    } catch (err) {
      toast.error('Không thể xoá sản phẩm');
    }
  };

const clearCart = async () => {
    try {
      await cartService.clearCart();
      setItems([]);
      toast.success('Đã xoá toàn bộ giỏ hàng');
    } catch (err) {
      toast.error('Không thể xoá giỏ hàng');
    }
  };

const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        addToCart,
        totalItems,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

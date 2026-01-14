import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItemProduct {
  id: string; // ✅ Sửa: id là string thay vì number
  name: string;
  price: number;
  image: string;
  description: string;
  colors?: Array<{ name: string; hex: string }>;
  storage?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  specs?: Array<{ label: string; value: string }>;
  images?: string[];
}

interface CartItem {
  id: string; // ✅ Sửa: id là string
  name: string;
  price: number;
  image: string;
  description: string;
  selectedColor: string;
  selectedStorage: string;
  quantity: number;
  product: CartItemProduct;
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
  addToCart: (product: CartItemProduct, color: string, storage: string, quantity?: number) => void;
  removeFromCart: (productId: string, color: string, storage: string) => void;
  updateQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
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
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (
    product: CartItemProduct,
    color: string,
    storage: string,
    quantity: number = 1,
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedStorage === storage,

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

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: product.id, // ✅ Giữ nguyên id string
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        selectedColor: color,
        selectedStorage: storage,
        quantity: quantity,
        product: product,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, color: string, storage: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedStorage === storage
          ),
      ),
    );
  };

  const updateQuantity = (productId: string, color: string, storage: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedColor === color &&
              item.selectedStorage === storage
            ),
        );
      }

      const updated = prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedStorage === storage
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      return updated;
    });
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
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        addToCart,
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

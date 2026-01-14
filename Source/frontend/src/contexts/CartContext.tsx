import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItemProduct, CartItem } from '@/types/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItemProduct, color: string, storage: string, quantity?: number) => void;
  removeFromCart: (productId: number, color: string, storage: string) => void;
  updateQuantity: (productId: number, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
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
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const cartItemId = `${product.id}-${color}-${storage}`;

      const newItem: CartItem = {
        id: cartItemId,
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

  const removeFromCart = (productId: number, color: string, storage: string) => {
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

  const updateQuantity = (productId: number, color: string, storage: string, quantity: number) => {
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
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

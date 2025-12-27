import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, color: string, storage: string) => void;
  removeFromCart: (productId: string, color: string, storage: string) => void;
  updateQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, color: string, storage: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor === color && 
                item.selectedStorage === storage
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { product, quantity: 1, selectedColor: color, selectedStorage: storage }];
    });
  };

  const removeFromCart = (productId: string, color: string, storage: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && 
                item.selectedColor === color && 
                item.selectedStorage === storage)
    ));
  };

  const updateQuantity = (productId: string, color: string, storage: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, storage);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.product.id === productId && 
          item.selectedColor === color && 
          item.selectedStorage === storage) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
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

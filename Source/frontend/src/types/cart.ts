// src/types/cart.ts
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  colors?: Array<{ name: string; hex: string }>;
  storage?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  [key: string]: any; // Cho phép thêm các trường khác
}

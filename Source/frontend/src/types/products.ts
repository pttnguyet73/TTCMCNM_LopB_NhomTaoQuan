// src/types/product.ts

export interface Category {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_main?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductColor {
  id: number;
  product_id: number;
  color_name: string;
  color_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sale_price?: number;
  category_id?: number;
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
  status: number;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  stock_quantity: number;
  images?: string[];
  colors?: Array<{
    id: number;
    name: string;
    hex_code: string;
  }>;
  storage_options?: string[];
  specifications?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

// For API payload
export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock?: number;
  category_id: number;
}

// For ProductCard
export interface ProductCardItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  colors?: { id: number; name: string; hex_code: string }[];
  storage?: string[];
  inStock?: boolean;
  isNew?: boolean;
  description?: string;
}

// For Cart
export interface CartItemProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors?: Array<{
    id: number;
    name: string;
    hex_code: string;
  }>;
  storage?: string[];
  category?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  selectedColor: string;
  selectedStorage: string;
  quantity: number;
  product: CartItemProduct;
}

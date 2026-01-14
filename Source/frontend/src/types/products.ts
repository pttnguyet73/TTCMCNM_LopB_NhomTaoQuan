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

// ✅ Đồng bộ cả 2 format colors
export interface ProductColor {
  id: number;
  product_id: number;
  color_name: string;
  color_code?: string;
  hex_code?: string; // ✅ Thêm hex_code cho frontend
  name?: string; // ✅ Thêm name cho frontend
  hex?: string; // ✅ Thêm hex cho frontend
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
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
    hex_code?: string;
    hex?: string; // ✅ Thêm hex cho compatibility
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

// For ProductCard - đồng bộ với Product hiện tại
export interface ProductCardItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  colors?: Array<{
    id?: number; // ✅ Optional
    name: string;
    hex_code?: string;
    hex?: string; // ✅ Thêm hex cho compatibility
  }>;
  storage?: string[];
  inStock?: boolean;
  isNew?: boolean;
  description?: string;
  isFeatured?: boolean;
}

// For Cart - hỗ trợ cả 2 format colors
export interface CartItemProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors?: Array<{
    id?: number;
    name: string;
    hex_code?: string;
    hex?: string; // ✅ Thêm hex cho compatibility
  }>;
  storage?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  images?: string[];
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

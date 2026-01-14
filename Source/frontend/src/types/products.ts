
// src/types/product.ts

export interface Category {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}
export interface Spec {
  id: number;
  product_id: number;
  label: string;
  value: string;  
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string; // URL ảnh (string)
  is_main?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductColor {
  id: number;
  product_id: number;
  color_name: string;
  color_code?: string; // ví dụ: #ffffff
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
 
  status: number;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  stock_quantity: number;
  storage_options?: string[];
  specs?: Spec[];
  stock?: number;
  category_id: number;
  category?: Category;
  images?: ProductImage[];
  colors?: ProductColor[];

  created_at?: string;
  updated_at?: string;
}


// Dùng khi tạo / cập nhật sản phẩm (POST, PUT)
export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock?: number;
  category_id: number;
}
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
    id?: number;
    name: string;
    hex_code?: string;
    hex?: string;
  }>;
  storage?: string[];
  inStock?: boolean;
  isNew?: boolean;
  description?: string;
  isFeatured?: boolean;
}
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
    hex?: string;
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
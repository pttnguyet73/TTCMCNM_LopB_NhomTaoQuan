
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
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock?: number;
  category_id: number;


  // Quan hệ
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

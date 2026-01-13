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

// src/types/products.ts
export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: string | number;
  category?: {
    id: string | number;
    name: string;
  };
  status: number;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  images?: Array<{
    id: string | number;
    image_url: string;
    is_main: boolean;
  }>;
  colors?: Array<{
    id: string | number;
    name: string;
    hex: string;
  }>;
  specs?: Array<{
    id?: string | number;
    key?: string;
    value?: string;
    label?: string;
  }>;
  // Thêm storage nếu API có
  storage?: string[];
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


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
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock?: number;
  category_id: number;

  category?: Category;
  images?: ProductImage[];
  colors?: ProductColor[];

  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock?: number;
  category_id: number;
}

// src/services/productService.ts
import api from '@/lib/api';
import { Product } from '@/types/products';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
}

export const productService = {
  // Lấy sản phẩm với filter
  async getFilteredProducts(params?: {
    search?: string;
    category_id?: string | number;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  }): Promise<Product[]> {
    try {
      console.log('Fetching products with params:', params);

      const res = await api.get<ApiResponse<Product[]>>('/products', {
        params: {
          ...params,
          // Xử lý đặc biệt cho Infinity
          max_price: params?.max_price === Infinity ? undefined : params?.max_price,
        },
      });

      if (res.data.success && res.data.data) {
        console.log('Received products:', res.data.data.length);
        return res.data.data;
      }

      console.warn('No products received or invalid response');
      return [];
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  },

  // Lấy tất cả sản phẩm (cho trang sản phẩm)
  async getAll(): Promise<Product[]> {
    try {
      const res = await api.get<ApiResponse<Product[]>>('/products');
      return res.data.data || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  },

  // Lấy sản phẩm nổi bật
  async getFeatured(limit: number = 4): Promise<Product[]> {
    try {
      const res = await api.get<ApiResponse<Product[]>>('/products', {
        params: {
          sort_by: 'featured',
          status: 1,
        },
      });

      const products = res.data.data || [];
      return products.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Lấy sản phẩm mới
  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    try {
      const res = await api.get<ApiResponse<Product[]>>('/products', {
        params: {
          sort_by: 'newest',
          status: 1,
        },
      });

      const products = res.data.data || [];
      return products.slice(0, limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },

  // Lấy chi tiết sản phẩm
  async getById(id: string | number): Promise<Product | null> {
    try {
      const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return res.data.data || null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  },
};

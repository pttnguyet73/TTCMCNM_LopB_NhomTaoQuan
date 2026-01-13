// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/product';
import { toast } from 'sonner';

interface UseProductsProps {
  category_id?: number;
  category_slug?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  limit?: number;
  is_featured?: number;
  is_new?: number;
  status?: number;
}

export function useProducts(filters?: UseProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching products with filters:', filters);

      // Sử dụng searchProducts thay vì getAll để rõ ràng hơn
      const data = await productService.searchProducts(filters);
      setProducts(data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải sản phẩm';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = async () => {
    await fetchProducts();
  };

  return {
    products,
    isLoading,
    error,
    refresh,
  };
}

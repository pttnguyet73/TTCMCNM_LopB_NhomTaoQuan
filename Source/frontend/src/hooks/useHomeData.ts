// src/hooks/useHomeData.ts
import { useState, useEffect } from 'react';
import { productService } from '@/services/product';
import { toast } from 'sonner';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  slug: string;
}

export interface HomeData {
  featuredProducts: any[];
  newProducts: any[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Dữ liệu mẫu - CHỈ dùng khi API không hoạt động
const createSampleProduct = (base: any, isFeatured: boolean, isNew: boolean) => ({
  ...base,
  is_featured: isFeatured ? 1 : 0,
  is_new: isNew ? 1 : 0,
  status: 1,
  review_count: base.review_count || 0,
});

const sampleFeaturedProducts = [
  createSampleProduct(
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 34990000,
      original_price: 36990000,
      category_id: 1,
      rating: 4.9,
      review_count: 2840,
      description: 'iPhone mới nhất với thiết kế Titanium',
    },
    true,
    false,
  ),
  createSampleProduct(
    {
      id: 2,
      name: 'MacBook Air M3',
      price: 28990000,
      original_price: 29990000,
      category_id: 3,
      rating: 4.8,
      review_count: 2456,
      description: 'MacBook Air mới với chip M3',
    },
    true,
    false,
  ),
  createSampleProduct(
    {
      id: 3,
      name: 'iPad Pro M4',
      price: 44980000,
      original_price: 45980000,
      category_id: 2,
      rating: 4.9,
      review_count: 1890,
      description: 'iPad Pro mới với chip M4',
    },
    true,
    false,
  ),
  createSampleProduct(
    {
      id: 4,
      name: 'iPhone 15',
      price: 24990000,
      original_price: 26990000,
      category_id: 1,
      rating: 4.7,
      review_count: 3421,
      description: 'iPhone 15 với camera 48MP',
    },
    true,
    false,
  ),
];

const sampleNewProducts = [
  createSampleProduct(
    {
      id: 5,
      name: 'iPhone 16 Pro',
      price: 37990000,
      original_price: 39990000,
      category_id: 1,
      rating: 4.9,
      review_count: 156,
      description: 'iPhone 16 Pro mới nhất',
    },
    false,
    true,
  ),
  createSampleProduct(
    {
      id: 6,
      name: 'MacBook Pro M4',
      price: 59990000,
      original_price: 62990000,
      category_id: 3,
      rating: 4.9,
      review_count: 89,
      description: 'MacBook Pro mới với chip M4',
    },
    false,
    true,
  ),
  createSampleProduct(
    {
      id: 7,
      name: 'iPad Air M2',
      price: 21990000,
      original_price: 23990000,
      category_id: 2,
      rating: 4.7,
      review_count: 342,
      description: 'iPad Air mới với chip M2',
    },
    false,
    true,
  ),
  createSampleProduct(
    {
      id: 8,
      name: 'Apple Watch Series 10',
      price: 14990000,
      original_price: 15990000,
      category_id: 4,
      rating: 4.8,
      review_count: 228,
      description: 'Apple Watch mới nhất',
    },
    false,
    true,
  ),
];

// Helper function để transform product data
const transformProduct = (product: any) => {
  if (!product) return null;

  // Chỉ lấy sản phẩm có status = 1 (đang hoạt động)
  if (product.status !== 1) return null;

  // Lấy hình ảnh chính
  let mainImage = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800';

  if (product.images && product.images.length > 0) {
    const main = product.images.find((img: any) => img.is_main) || product.images[0];
    mainImage = main.image_url || mainImage;
  }

  // Map category_id sang tên category
  let categoryName = 'Electronics';
  if (product.category_id === 1) {
    categoryName = 'iPhone';
  } else if (product.category_id === 2) {
    categoryName = 'iPad';
  } else if (product.category_id === 3) {
    categoryName = 'Mac';
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price || 0,
    originalPrice: product.original_price || undefined,
    category: categoryName,
    image: mainImage,
    rating: product.rating || 4.5,
    reviews: product.review_count || 0,
    colors: product.colors?.map((color: any) => ({
      name: color.color_name || 'Default',
      hex: color.color_code || '#cccccc',
    })) || [
      { name: 'Black', hex: '#000000' },
      { name: 'Silver', hex: '#c0c0c0' },
    ],
    storage: ['128GB', '256GB', '512GB'],
    inStock: true,
    isNew: product.is_new === 1,
    isFeatured: product.is_featured === 1,
    description: product.description,
  };
};

export function useHomeData(): HomeData {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  // CHỈ có 3 danh mục: iPhone, iPad, Mac
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: 'iPhone',
      slug: 'iphone',
      image:
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'iPad',
      slug: 'ipad',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Mac',
      slug: 'mac',
      image:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching home data from API...');

      let featuredData: any[] = [];
      let newArrivalsData: any[] = [];

      // Thử lấy dữ liệu từ API
      try {
        // Lấy sản phẩm nổi bật - CHỈ lấy is_featured = 1
        featuredData = await productService.getFeatured(4);
        console.log('Featured products from API:', featuredData);

        // Lấy sản phẩm mới - CHỈ lấy is_new = 1
        newArrivalsData = await productService.getNewArrivals(4);
        console.log('New arrivals from API:', newArrivalsData);

        // Nếu có dữ liệu từ API, không dùng sample data
        if (featuredData.length > 0 || newArrivalsData.length > 0) {
          setUseSampleData(false);
        }
      } catch (apiError) {
        console.warn('API error, using sample data:', apiError);
        setUseSampleData(true);
      }

      // Xử lý dữ liệu
      if (useSampleData || (featuredData.length === 0 && newArrivalsData.length === 0)) {
        // Dùng sample data
        console.log('Using sample data');
        const transformedFeatured = sampleFeaturedProducts
          .filter((product) => product.is_featured === 1)
          .map(transformProduct)
          .filter(Boolean);

        const transformedNew = sampleNewProducts
          .filter((product) => product.is_new === 1)
          .map(transformProduct)
          .filter(Boolean);

        setFeaturedProducts(transformedFeatured);
        setNewProducts(transformedNew);
      } else {
        // Dùng dữ liệu từ API
        const transformedFeatured = featuredData
          .filter((product) => product.is_featured === 1) // Đảm bảo chỉ lấy sản phẩm nổi bật
          .map(transformProduct)
          .filter(Boolean);

        const transformedNew = newArrivalsData
          .filter((product) => product.is_new === 1) // Đảm bảo chỉ lấy sản phẩm mới
          .map(transformProduct)
          .filter(Boolean);

        setFeaturedProducts(transformedFeatured);
        setNewProducts(transformedNew);
      }
    } catch (err: any) {
      console.error('Error in fetchHomeData:', err);

      // Fallback to sample data
      const transformedFeatured = sampleFeaturedProducts
        .filter((product) => product.is_featured === 1)
        .map(transformProduct)
        .filter(Boolean);

      const transformedNew = sampleNewProducts
        .filter((product) => product.is_new === 1)
        .map(transformProduct)
        .filter(Boolean);

      setFeaturedProducts(transformedFeatured);
      setNewProducts(transformedNew);
      setUseSampleData(true);

      const errorMessage = 'Đang sử dụng dữ liệu mẫu';
      setError(errorMessage);

      toast.warning(errorMessage, {
        description: 'Không thể kết nối đến server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const refresh = async () => {
    await fetchHomeData();
    if (useSampleData) {
      toast.info('Đang sử dụng dữ liệu mẫu');
    } else {
      toast.success('Đã làm mới dữ liệu từ server');
    }
  };

  return {
    featuredProducts,
    newProducts,
    categories,
    isLoading,
    error,
    refresh,
  };
}

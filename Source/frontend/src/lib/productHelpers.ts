import { CartItemProduct, Product, ProductCardItem } from '@/types/products';

/**
 * Chuyển đổi Product từ API sang ProductCardItem cho component
 */
export const convertToProductCardItem = (product: Product): ProductCardItem => {
  return {
    id: product.id,
    name: product.name,
    image: product.images?.[0] || '', // Lấy ảnh đầu tiên
    price: product.sale_price || product.price,
    originalPrice: product.original_price,
    rating: product.rating,
    reviews: product.review_count,
    category: product.category?.name || '',
    colors: product.colors?.map((color) => ({
      id: color.id,
      name: color.name,
      hex_code: color.hex_code,
    })),
    storage: product.storage_options,
    inStock: product.stock_quantity > 0,
    isNew: product.is_new,
    description: product.description,
  };
};

/**
 * Chuyển đổi Product từ API sang CartItemProduct
 */
export const convertToCartItemProduct = (product: Product): CartItemProduct => {
  return {
    id: product.id,
    name: product.name,
    price: product.sale_price || product.price,
    image: product.images?.[0] || '',
    description: product.description,
    colors: product.colors?.map((color) => ({
      id: color.id,
      name: color.name,
      hex_code: color.hex_code,
    })),
    storage: product.storage_options,
    category: product.category?.name,
  };
};

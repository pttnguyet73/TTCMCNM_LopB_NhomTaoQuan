import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CartItemProduct } from '@/types/products';

interface ApiReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ApiSpecification {
  id: number;
  product_id: number;
  label: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
}

interface Specification {
  label: string;
  value: string;
}

interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  status: number;
  is_new: number;
  is_featured: number;
  rating?: number;
  review_count?: number;
  images: Array<{ id: number; product_id: number; image_url: string; is_main: string }>;
  colors: Array<{ id: number; product_id: number; name: string; hex_code: string }>;
  category: { id: number; name: string; slug: string };
  specifications?: ApiSpecification[];
  storage?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [relatedProducts, setRelatedProducts] = useState<CartItemProduct[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`products/${id}`);

        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        const responseData = response.data;
        console.log('Full API response:', responseData);

        if (!responseData.success || !responseData.data) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        const productData = responseData.data;
        console.log('Product data from API:', productData);

        const normalizedProduct: ApiProduct = {
          id: productData.id,
          category_id: productData.category_id,
          name: productData.name,
          description: productData.description || 'Mô tả sản phẩm',
          price: productData.price || 0,
          original_price: productData.original_price,
          status: productData.status || 0,
          is_new: productData.is_new || 0,
          is_featured: productData.is_featured || 0,
          rating: productData.rating || 0,
          review_count: productData.review_count || 0,
          storage: productData.storage || ['128GB', '256GB', '512GB'],
          specifications: productData.specifications || [],
          colors: productData.colors || [],
          images: productData.images || [],
          category: productData.category || { id: 0, name: 'Uncategorized', slug: 'uncategorized' },
        };

        setProduct(normalizedProduct);

        if (normalizedProduct.colors && normalizedProduct.colors.length > 0) {
          setSelectedColor(normalizedProduct.colors[0].name);
        }

        if (normalizedProduct.storage && normalizedProduct.storage.length > 0) {
          setSelectedStorage(normalizedProduct.storage[0]);
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('Không tìm thấy ID sản phẩm');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;

    const fetchSpecifications = async () => {
      try {
        setLoadingSpecs(true);
        console.log('Fetching specs for product ID:', product.id);

        const response = await api.get(`product-specs/product/${product.id}`);
        console.log('Specs API response:', response.data);

        let specsData: ApiSpecification[] = [];

        if (response.data && Array.isArray(response.data)) {
          specsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          specsData = response.data.data;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          specsData = response.data.data;
        }

        console.log('Processed specs data:', specsData);

        if (specsData.length > 0) {
          const formattedSpecs: Specification[] = specsData.map((spec: ApiSpecification) => ({
            label: spec.label,
            value: spec.value,
          }));
          setSpecifications(formattedSpecs);
        } else {
          try {
            const response2 = await api.get(`product-specs/by-product`, {
              params: { product_id: product.id },
            });
            console.log('Alternative specs API response:', response2.data);

            let specsData2: ApiSpecification[] = [];

            if (response2.data && Array.isArray(response2.data)) {
              specsData2 = response2.data;
            } else if (
              response2.data &&
              response2.data.data &&
              Array.isArray(response2.data.data)
            ) {
              specsData2 = response2.data.data;
            } else if (
              response2.data &&
              response2.data.success &&
              Array.isArray(response2.data.data)
            ) {
              specsData2 = response2.data.data;
            }

            if (specsData2.length > 0) {
              const formattedSpecs: Specification[] = specsData2.map((spec: ApiSpecification) => ({
                label: spec.label,
                value: spec.value,
              }));
              setSpecifications(formattedSpecs);
            } else if (product.specifications && product.specifications.length > 0) {
              const formattedSpecs: Specification[] = product.specifications.map(
                (spec: ApiSpecification) => ({
                  label: spec.label,
                  value: spec.value,
                }),
              );
              setSpecifications(formattedSpecs);
            } else {
              setSpecifications([
                { label: 'Màn hình', value: 'Retina Display' },
                { label: 'Chip', value: 'Apple Silicon' },
                { label: 'RAM', value: '8GB' },
                { label: 'Bộ nhớ', value: selectedStorage || '256GB' },
                { label: 'Hệ điều hành', value: 'iOS/iPadOS/macOS' },
                { label: 'Pin', value: 'Cả ngày sử dụng' },
              ]);
            }
          } catch (fallbackErr) {
            console.error('Lỗi khi lấy thông số kỹ thuật (fallback):', fallbackErr);
            if (product.specifications && product.specifications.length > 0) {
              const formattedSpecs: Specification[] = product.specifications.map(
                (spec: ApiSpecification) => ({
                  label: spec.label,
                  value: spec.value,
                }),
              );
              setSpecifications(formattedSpecs);
            } else {
              setSpecifications([
                { label: 'Màn hình', value: 'Retina Display' },
                { label: 'Chip', value: 'Apple Silicon' },
                { label: 'RAM', value: '8GB' },
                { label: 'Bộ nhớ', value: selectedStorage || '256GB' },
                { label: 'Hệ điều hành', value: 'iOS/iPadOS/macOS' },
                { label: 'Pin', value: 'Cả ngày sử dụng' },
              ]);
            }
          }
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy thông số kỹ thuật (chính):', err);
        try {
          const response2 = await api.get(`product-specs/by-product`, {
            params: { product_id: product.id },
          });
          console.log('Fallback specs API response:', response2.data);

          let specsData2: ApiSpecification[] = [];

          if (response2.data && Array.isArray(response2.data)) {
            specsData2 = response2.data;
          } else if (response2.data && response2.data.data && Array.isArray(response2.data.data)) {
            specsData2 = response2.data.data;
          } else if (
            response2.data &&
            response2.data.success &&
            Array.isArray(response2.data.data)
          ) {
            specsData2 = response2.data.data;
          }

          if (specsData2.length > 0) {
            const formattedSpecs: Specification[] = specsData2.map((spec: ApiSpecification) => ({
              label: spec.label,
              value: spec.value,
            }));
            setSpecifications(formattedSpecs);
          } else if (product.specifications && product.specifications.length > 0) {
            const formattedSpecs: Specification[] = product.specifications.map(
              (spec: ApiSpecification) => ({
                label: spec.label,
                value: spec.value,
              }),
            );
            setSpecifications(formattedSpecs);
          } else {
            setSpecifications([
              { label: 'Màn hình', value: 'Retina Display' },
              { label: 'Chip', value: 'Apple Silicon' },
              { label: 'RAM', value: '8GB' },
              { label: 'Bộ nhớ', value: selectedStorage || '256GB' },
              { label: 'Hệ điều hành', value: 'iOS/iPadOS/macOS' },
              { label: 'Pin', value: 'Cả ngày sử dụng' },
            ]);
          }
        } catch (finalErr) {
          console.error('Lỗi khi lấy thông số kỹ thuật (cuối cùng):', finalErr);
          if (product.specifications && product.specifications.length > 0) {
            const formattedSpecs: Specification[] = product.specifications.map(
              (spec: ApiSpecification) => ({
                label: spec.label,
                value: spec.value,
              }),
            );
            setSpecifications(formattedSpecs);
          } else {
            setSpecifications([
              { label: 'Màn hình', value: 'Retina Display' },
              { label: 'Chip', value: 'Apple Silicon' },
              { label: 'RAM', value: '8GB' },
              { label: 'Bộ nhớ', value: selectedStorage || '256GB' },
              { label: 'Hệ điều hành', value: 'iOS/iPadOS/macOS' },
              { label: 'Pin', value: 'Cả ngày sử dụng' },
            ]);
          }
        }
      } finally {
        setLoadingSpecs(false);
      }
    };

    fetchSpecifications();
  }, [product?.id, product?.specifications, selectedStorage]);

  useEffect(() => {
    if (!product?.id) return;

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);

        const response = await api.get(`reviews/product/${product.id}`);

        console.log('Reviews API response for product', product.id, ':', response.data);

        let reviewsData: ApiReview[] = [];

        if (response.data && Array.isArray(response.data)) {
          reviewsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          reviewsData = response.data.data;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          reviewsData = response.data.data;
        }

        const productReviews = reviewsData.filter(
          (review: ApiReview) => review.product_id === product.id && review.status === 'approved',
        );

        console.log('Filtered reviews for product', product.id, ':', productReviews);

        const formattedReviews: Review[] = productReviews.map((review: ApiReview) => {
          const authorName = review.user?.name || `User ${review.user_id}`;
          let avatarUrl = review.user?.avatar;
          if (!avatarUrl && authorName) {
            const encodedName = encodeURIComponent(authorName);
            avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=128`;
          }

          return {
            id: review.id.toString(),
            author: authorName,
            avatar: avatarUrl || '/placeholder-avatar.jpg',
            date: new Date(review.created_at).toLocaleDateString('vi-VN'),
            rating: review.rating,
            content: review.comment,
          };
        });

        setReviews(formattedReviews);
      } catch (err: any) {
        console.error('Lỗi khi lấy review:', err);

        try {
          const response = await api.get(`reviews`);

          let allReviews: ApiReview[] = [];

          if (response.data && Array.isArray(response.data)) {
            allReviews = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            allReviews = response.data.data;
          }

          const productReviews = allReviews.filter(
            (review: ApiReview) => review.product_id === product.id && review.status === 'approved',
          );

          const formattedReviews: Review[] = productReviews.map((review: ApiReview) => {
            const authorName = review.user?.name || `User ${review.user_id}`;
            let avatarUrl = review.user?.avatar;
            if (!avatarUrl && authorName) {
              const encodedName = encodeURIComponent(authorName);
              avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=128`;
            }

            return {
              id: review.id.toString(),
              author: authorName,
              avatar: avatarUrl || '/placeholder-avatar.jpg',
              date: new Date(review.created_at).toLocaleDateString('vi-VN'),
              rating: review.rating,
              content: review.comment,
            };
          });

          setReviews(formattedReviews);
        } catch (fallbackErr) {
          console.error('Lỗi khi lấy review (fallback):', fallbackErr);
          setReviews([]);
        }
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

  useEffect(() => {
    if (!product?.category_id) return;

    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true);
        const response = await api.get(`products`, {
          params: {
            category_id: product.category_id,
            exclude_id: product.id,
            limit: 4,
          },
        });

        const responseData = response.data;
        const relatedData = responseData.data || responseData || [];

        const convertedProducts: CartItemProduct[] = relatedData.map((item: any) => {
          const images = item.images || [];
          const imageUrls = images
            .map((img: any) => (typeof img === 'string' ? img : img.image_url || ''))
            .filter((url: string) => url);

          return {
            id: item.id,
            name: item.name,
            price: item.price || 0,
            originalPrice: item.original_price,
            image: imageUrls[0] || '/placeholder.jpg',
            description: item.description || 'Mô tả sản phẩm',
            colors:
              item.colors?.map((color: any) => ({
                name: color.name,
                hex_code: color.hex_code,
                hex: color.hex_code,
              })) || [],
            storage: item.storage || [],
            category: item.category?.name || 'Uncategorized',
            rating: item.rating || 0,
            reviews: item.review_count || 0,
            isNew: Boolean(item.is_new),
            inStock: item.status === 1,
            images: imageUrls,
          };
        });

        setRelatedProducts(convertedProducts.slice(0, 4));
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', err);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleShowMoreReviews = () => {
    if (showAllReviews) {
      setShowAllReviews(false);
    } else {
      setShowAllReviews(true);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, visibleReviewCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/products">
            <Button variant="apple" className="mt-4">
              Quay lại cửa hàng
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [];
  const imageUrls = images
    .map((img) => (typeof img === 'string' ? img : img.image_url || ''))
    .filter((url) => url);

  const allImages = imageUrls.length > 0 ? imageUrls : ['/placeholder.jpg'];
  const productRating = product.rating || 0;
  const reviewCount = reviews.length;
  const inStock = product.status === 1;
  const categoryName = product.category?.name || 'Uncategorized';

  const convertToCartItemProduct = (): CartItemProduct => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: allImages[0] || '/placeholder.jpg',
      description: product.description,
      colors:
        product.colors?.map((color) => ({
          name: color.name,
          hex_code: color.hex_code,
          hex: color.hex_code,
        })) || [],
      storage: product.storage || [],
      category: product.category?.name,
      rating: productRating,
      reviews: reviewCount,
      isNew: Boolean(product.is_new),
      inStock: inStock,
      images: allImages,
    };
  };

  const handleAddToCart = () => {
    addToCart(product.id, selectedColor, quantity);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart(product.id, selectedColor,  quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground">
              Sản phẩm
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category?.slug || 'uncategorized'}`}
              className="hover:text-foreground capitalize"
            >
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/30 mb-4">
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                        selectedImage === index
                          ? 'border-accent'
                          : 'border-transparent hover:border-border',
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                {product.is_new === 1 && (
                  <span className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                    Mới
                  </span>
                )}
                {product.original_price && product.original_price > product.price && (
                  <span className="px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                    Giảm {Math.round((1 - product.price / product.original_price) * 100)}%
                  </span>
                )}
                {inStock ? (
                  <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded-full">
                    Còn hàng
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-medium bg-red-500/10 text-red-600 rounded-full">
                    Hết hàng
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(productRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground',
                      )}
                    />
                  ))}
                  <span className="ml-2 font-medium">{productRating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">({reviewCount} đánh giá)</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-foreground">
                  {product.price ? formatPrice(product.price) : 'Liên hệ'}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Màu sắc: <span className="text-muted-foreground">{selectedColor}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={color.id || index}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                          selectedColor === color.name
                            ? 'border-accent scale-110'
                            : 'border-transparent hover:border-border',
                        )}
                        style={{ backgroundColor: color.hex_code || '#CCCCCC' }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check
                            className={cn(
                              'w-5 h-5',
                              color.hex_code === '#FFFFFF' ||
                                color.hex_code === '#F0F0EB' ||
                                color.hex_code === '#E3E4E5' ||
                                color.hex_code === '#F0E4D3'
                                ? 'text-foreground'
                                : 'text-primary-foreground',
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.storage && product.storage.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Dung lượng</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    {product.storage.map((storage: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedStorage(storage)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                          selectedStorage === storage
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary hover:bg-secondary/80',
                        )}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-sm font-medium text-foreground mb-3">Số lượng</h3>
                <div className="inline-flex items-center gap-3 bg-secondary rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="hero"
                  size="xl"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  Mua ngay
                </Button>
                <Button
                  variant="apple-outline"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Thêm vào giỏ
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-5 h-5" />
                  Yêu thích
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/50 rounded-2xl">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Giao hàng miễn phí</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Bảo hành 12 tháng</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Đổi trả 30 ngày</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto">
              {[
                { id: 'specs', label: 'Thông số kỹ thuật' },
                { id: 'description', label: 'Mô tả' },
                { id: 'reviews', label: `Đánh giá (${reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[2px]',
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {loadingSpecs ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Đang tải thông số kỹ thuật...
                    </p>
                  </div>
                ) : specifications.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                      >
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-secondary/30 rounded-3xl">
                    <p className="text-muted-foreground">
                      Chưa có thông số kỹ thuật cho sản phẩm này
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-gray max-w-none"
              >
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || 'Chưa có mô tả cho sản phẩm này'}
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Sản phẩm {product.name} được thiết kế và sản xuất bởi Apple Inc. với các công nghệ
                  tiên tiến nhất. Đây là sản phẩm chính hãng được phân phối tại Việt Nam bởi các đại
                  lý ủy quyền của Apple.
                </p>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Đang tải đánh giá...</p>
                  </div>
                ) : displayedReviews.length > 0 ? (
                  <>
                    {displayedReviews.map((review) => (
                      <div key={review.id} className="p-6 bg-secondary/50 rounded-2xl">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
                            <img
                              src={review.avatar}
                              alt={review.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const name = review.author || 'User';
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  name,
                                )}&background=random&color=fff&bold=true&size=128`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{review.author}</h4>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-4 h-4',
                                    i < review.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-muted-foreground',
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {reviews.length > visibleReviewCount && (
                      <Button
                        variant="apple-outline"
                        className="w-full"
                        onClick={handleShowMoreReviews}
                      >
                        {showAllReviews
                          ? 'Thu gọn đánh giá'
                          : `Xem thêm đánh giá (${reviews.length - displayedReviews.length})`}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-secondary/30 rounded-3xl">
                    <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {loadingRelated ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Đang tải sản phẩm liên quan...</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-8">Sản phẩm liên quan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
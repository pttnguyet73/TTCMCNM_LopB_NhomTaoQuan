import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
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
import { products, formatPrice, type Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.storage[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  // ✅ Fix lỗi API: Thêm encodeURIComponent để xử lý ký tự đặc biệt
  useEffect(() => {
    if (!product) return;

    axios
      .get(`http://localhost:8000/api/reviews`, {
        params: { product_id: product.id }, // dùng query param
      })
      .then((res) => setReviews(res.data))
      .catch((err) => {
        console.error('Lỗi khi lấy review:', err);
        setReviews([]);
      });
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
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

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // ✅ Không cần chuyển đổi vì giờ cả Product và CartItemProduct đều có id là string
  const handleAddToCart = () => {
    // Type cast: Product phù hợp với CartItemProduct
    addToCart(product, selectedColor, selectedStorage, quantity);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedStorage, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
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
              to={`/products?category=${product.category}`}
              className="hover:text-foreground capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Info */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/30 mb-4">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) => (prev - 1 + product.images.length) % product.images.length,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, index) => (
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
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                    Mới
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                    Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                {product.inStock ? (
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

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground',
                      )}
                    />
                  ))}
                  <span className="ml-2 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} đánh giá)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Màu sắc: <span className="text-muted-foreground">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                        selectedColor === color.name
                          ? 'border-accent scale-110'
                          : 'border-transparent hover:border-border',
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={cn(
                            'w-5 h-5',
                            color.hex === '#FFFFFF' ||
                              color.hex === '#F0F0EB' ||
                              color.hex === '#E3E4E5' ||
                              color.hex === '#F0E4D3'
                              ? 'text-foreground'
                              : 'text-primary-foreground',
                          )}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">Dung lượng</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.storage.map((storage) => (
                    <button
                      key={storage}
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

              {/* Quantity */}
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

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="hero"
                  size="xl"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Mua ngay
                </Button>
                <Button
                  variant="apple-outline"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Thêm vào giỏ
                </Button>
              </div>

              {/* Quick Actions */}
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

              {/* Features */}
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

          {/* Tabs */}
          <div className="mb-16">
            <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto">
              {[
                { id: 'specs', label: 'Thông số kỹ thuật' },
                { id: 'description', label: 'Mô tả' },
                { id: 'reviews', label: `Đánh giá (${product.reviews})` },
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

            {/* Tab Content */}
            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {product.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-gray max-w-none"
              >
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
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
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-secondary/50 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
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

                <Button variant="apple-outline" className="w-full">
                  Xem thêm đánh giá
                </Button>
              </motion.div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-8">Sản phẩm liên quan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  Smartphone,
  Tablet,
  Laptop,
  Star,
  Truck,
  Shield,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Gift,
  Zap,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardItem } from '@/types/products';

const heroSlides = [
  {
    title: 'iPhone 17 Pro',
    subtitle: 'Titanium. Siêu mạnh mẽ.',
    description: 'Chip A19 Pro đột phá. Camera 18MP. Khung Titanium cao cấp.',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80',
    link: '/product/1',
    color: 'from-slate-900 to-slate-700',
  },
  {
    title: 'iPad Pro M4',
    subtitle: 'Mỏng đến không ngờ.',
    description: 'Chip M4 siêu mạnh. Màn hình Ultra Retina XDR tuyệt đẹp.',
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop&q=80',
    link: '/product/2',
    color: 'from-slate-800 to-slate-600',
  },
  {
    title: 'MacBook Pro',
    subtitle: 'Chip M3 Pro & M3 Max.',
    description: 'Hiệu năng chuyên nghiệp. Pin cả ngày dài.',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
    link: '/product/3',
    color: 'from-gray-900 to-gray-700',
  },
];

const features = [
  {
    icon: Truck,
    title: 'Giao hàng miễn phí',
    description: 'Đơn hàng từ 2 triệu',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng',
    description: '12-24 tháng',
  },
  {
    icon: CreditCard,
    title: 'Trả góp 0%',
    description: 'Qua thẻ tín dụng',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Tư vấn tận tâm',
  },
];

const promos = [
  {
    title: 'Flash Sale',
    description: 'Giảm đến 20% các sản phẩm iPhone',
    icon: Zap,
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    title: 'Quà tặng hấp dẫn',
    description: 'Tặng AirPods khi mua MacBook',
    icon: Gift,
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertToProductCardItem = (product: any): ProductCardItem => {
    return {
      id: product.id,
      name: product.name,
      image: product.images?.[0]?.image_url || '',
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating || 4.5,
      reviews: product.review_count || 0,
      category: product.category?.name,
      colors: product.colors?.map((color: any) => ({
        id: color.id,
        name: color.name,
        hex_code: color.hex_code,
        hex: color.hex_code,
      })),
      storage: [],
      inStock: true,
      isNew: Boolean(product.is_new),
      isFeatured: Boolean(product.is_featured),
      description: product.description,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        const productsData = response.data.data.map(convertToProductCardItem);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Lỗi tải dữ liệu</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="apple" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-hero" />

          {/* Slide Content */}
          <div className="container mx-auto px-4 pt-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
              {/* Text Content */}
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-4 py-2 bg-secondary rounded-full text-sm font-medium text-muted-foreground mb-6"
                >
                  ✨ Mới ra mắt
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl text-gradient font-medium mb-4"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0"
                >
                  {heroSlides[currentSlide].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                >
                  <Link to={heroSlides[currentSlide].link}>
                    <Button variant="hero" size="xl">
                      Mua ngay
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="hero-secondary" size="xl">
                      Tìm hiểu thêm
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                key={`image-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl" />
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl animate-float"
                  />
                </div>
              </motion.div>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="ghost" size="icon" onClick={prevSlide} className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-accent'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={nextSlide} className="rounded-full">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 border-y border-border bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Danh mục sản phẩm
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá các dòng sản phẩm Apple chính hãng với giá tốt nhất
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  id: '1',
                  name: 'iPhone',
                  icon: Smartphone,
                  image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
                  desc: 'Điện thoại thông minh',
                },
                {
                  id: '2',
                  name: 'iPad',
                  icon: Tablet,
                  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
                  desc: 'Máy tính bảng',
                },
                {
                  id: '3',
                  name: 'Mac',
                  icon: Laptop,
                  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
                  desc: 'Máy tính xách tay',
                },
              ].map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Link to={`/products?category=${category.id}`}>
                    <div className="group relative overflow-hidden rounded-3xl bg-card border border-border aspect-[4/3] cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                        <div className="flex items-center gap-3 mb-2">
                          <category.icon className="w-6 h-6" />
                          <span className="text-sm opacity-80">{category.desc}</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                        <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-4 transition-all">
                          Khám phá <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {promos.map((promo, index) => (
                <motion.div
                  key={promo.title}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`${promo.color} rounded-3xl p-8 text-primary-foreground relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <promo.icon className="w-10 h-10 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                    <p className="opacity-90 mb-4">{promo.description}</p>
                    <Button
                      variant="hero-secondary"
                      className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                    >
                      Xem ngay
                    </Button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-muted-foreground">
                  Những sản phẩm được yêu thích nhất
                  {featuredProducts.length === 0 && ' (Hiện chưa có sản phẩm nổi bật)'}
                </p>
              </div>
              {featuredProducts.length > 0 && (
                <Link to="/products?filter=featured">
                  <Button variant="apple-outline">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </motion.div>

            {featuredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-3xl">
                <p className="text-muted-foreground">Chưa có sản phẩm nổi bật nào</p>
                <Link to="/products">
                  <Button variant="apple-outline" className="mt-4">
                    Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* New Products */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Sản phẩm mới
                </h2>
                <p className="text-muted-foreground">
                  Cập nhật những sản phẩm mới nhất từ Apple
                  {newProducts.length === 0 && ' (Hiện chưa có sản phẩm mới)'}
                </p>
              </div>
              {newProducts.length > 0 && (
                <Link to="/products?filter=new">
                  <Button variant="apple-outline">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </motion.div>

            {newProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-3xl">
                <p className="text-muted-foreground">Chưa có sản phẩm mới nào</p>
                <Link to="/products">
                  <Button variant="apple-outline" className="mt-4">
                    Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-dark rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Đăng ký nhận ưu đãi</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                  Nhận thông tin về sản phẩm mới và các chương trình khuyến mãi độc quyền
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 h-12 px-6 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                  />
                  <Button variant="hero" size="lg">
                    Đăng ký
                  </Button>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

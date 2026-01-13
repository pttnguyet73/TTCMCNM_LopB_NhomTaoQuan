import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Smartphone,
  Tablet,
  Laptop,
  Loader2,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { productService } from '@/services/product';
import { Product as ApiProduct } from '@/types/products';
import { Product as LocalProduct } from '@/data/products';
import { cn } from '@/lib/utils';

// Helper function để kiểm tra link active
const isLinkActive = (linkPath: string, currentPath: string, currentSearch: string) => {
  if (linkPath === '/') {
    return currentPath === '/';
  }

  if (linkPath === '/products') {
    return currentPath === '/products' && !currentSearch.includes('category=');
  }

  // Kiểm tra category links
  if (linkPath.includes('/products?category=')) {
    const category = linkPath.split('=')[1];
    return currentPath === '/products' && currentSearch.includes(`category=${category}`);
  }

  return false;
};

// Hàm chuyển đổi dữ liệu từ API sang format cho ProductCard
const mapApiToLocalProduct = (apiProduct: ApiProduct): LocalProduct => {
  // Map category từ API sang định dạng 'iphone' | 'ipad' | 'mac'
  let category: 'iphone' | 'ipad' | 'mac' = 'iphone';

  if (apiProduct.category) {
    const catName = apiProduct.category.name.toLowerCase();
    if (catName.includes('iphone') || catName === 'iphone') {
      category = 'iphone';
    } else if (catName.includes('ipad') || catName === 'ipad') {
      category = 'ipad';
    } else if (catName.includes('mac') || catName === 'mac') {
      category = 'mac';
    }
  } else if (apiProduct.category_id) {
    const categoryId = apiProduct.category_id.toString();
    if (categoryId === '1' || categoryId === 'iphone') {
      category = 'iphone';
    } else if (categoryId === '2' || categoryId === 'ipad') {
      category = 'ipad';
    } else if (categoryId === '3' || categoryId === 'mac') {
      category = 'mac';
    }
  }

  const images = apiProduct.images?.map((img) => img.image_url) || [];
  const mainImage = images.length > 0 ? images[0] : '/images/placeholder.jpg';

  const colors =
    apiProduct.colors?.map((color) => ({
      name: color.name || 'Default',
      hex: color.hex || '#000000',
    })) || [];

  const specs: { label: string; value: string }[] = [];

  if (apiProduct.specs && Array.isArray(apiProduct.specs)) {
    specs.push(
      ...apiProduct.specs.map((spec: any) => ({
        label: spec.label || spec.key || '',
        value: spec.value || '',
      })),
    );
  }

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    category: category,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price || undefined,
    image: mainImage,
    images: images,
    description: apiProduct.description || '',
    specs: specs,
    colors: colors,
    storage: [],
    rating: apiProduct.rating || 0,
    reviews: apiProduct.review_count || 0,
    inStock: apiProduct.status === 1,
    isNew: apiProduct.is_new || false,
    isFeatured: apiProduct.is_featured || false,
  };
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<LocalProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { totalItems } = useCart();

  // Navigation links - sử dụng category ID
  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/products', label: 'Sản phẩm' },
    { path: '/products?category=1', label: 'iPhone', icon: Smartphone },
    { path: '/products?category=2', label: 'iPad', icon: Tablet },
    { path: '/products?category=3', label: 'Mac', icon: Laptop },
  ];

  // Gợi ý tìm kiếm
  const searchSuggestions = [
    'iPhone 15 Pro',
    'iPad Pro',
    'MacBook Air',
    'iPhone 15',
    'MacBook Pro',
    'iPad Air',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Hàm tìm kiếm sản phẩm
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const data = await productService.getFilteredProducts({
        search: query,
        sort_by: 'featured',
      });

      const mappedProducts = data.map(mapApiToLocalProduct);
      setSearchResults(mappedProducts);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce search khi người dùng nhập
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchInput.trim()) {
      const timeout = setTimeout(() => {
        performSearch(searchInput);
      }, 500); // Debounce 500ms

      setSearchTimeout(timeout as any);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchInput, performSearch]);

  // Đóng overlay khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchOpen && e.target instanceof Element) {
        const overlay = document.querySelector('[data-search-overlay]');
        if (overlay && !overlay.contains(e.target)) {
          setIsSearchOpen(false);
          setSearchInput('');
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Ngăn scroll body
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Render rating stars
  const renderRating = (rating: number, reviews: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">({reviews} đánh giá)</span>
      </div>
    );
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple',
          isScrolled ? 'glass border-b border-border/50 shadow-sm' : 'bg-transparent',
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg"></span>
              </div>
              <span className="text-xl font-bold text-foreground">iStore</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.path, location.pathname, location.search);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    )}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Button>
              </Link>

              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-border/50 md:hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.path, location.pathname, location.search);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto"
            data-search-overlay
          >
            <div className="container mx-auto px-4 pt-6 pb-12">
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 py-4 z-10">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full h-12 pl-12 pr-4 text-base bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent"
                    autoFocus
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchInput('');
                    setSearchResults([]);
                  }}
                  className="ml-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Nội dung tìm kiếm */}
              <div className="max-w-6xl mx-auto">
                {searchInput ? (
                  // Hiển thị kết quả tìm kiếm
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Kết quả tìm kiếm cho "{searchInput}"
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        Tìm thấy {searchResults.length} sản phẩm
                      </p>
                    </div>

                    {searchLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-6 mb-8">
                        {searchResults.slice(0, 5).map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchInput('');
                            }}
                            className="group block"
                          >
                            <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                              {/* Category header */}
                              <div className="mb-4">
                                <h4 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                                  {product.category === 'iphone'
                                    ? 'IPHONE'
                                    : product.category === 'ipad'
                                    ? 'IPAD'
                                    : 'MAC'}
                                </h4>
                              </div>

                              <div className="flex gap-6">
                                <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-secondary/30">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors mb-3">
                                    {product.name}
                                  </h4>

                                  {/* Rating */}
                                  {renderRating(product.rating, product.reviews)}

                                  {/* Price */}
                                  <div className="mt-4 flex items-center gap-4">
                                    <div className="flex flex-col">
                                      <span className="text-2xl font-bold text-foreground">
                                        {formatPrice(product.price)}
                                      </span>
                                      {product.originalPrice &&
                                        product.originalPrice > product.price && (
                                          <span className="text-sm text-muted-foreground line-through mt-1">
                                            {formatPrice(product.originalPrice)}
                                          </span>
                                        )}
                                    </div>

                                    {/* Status badge */}
                                    {product.isNew && (
                                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full">
                                        Mới
                                      </span>
                                    )}
                                    {!product.inStock && (
                                      <span className="px-3 py-1 bg-red-500/10 text-red-600 text-xs font-bold rounded-full">
                                        Hết hàng
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-xl font-bold text-foreground mb-2">
                          Không tìm thấy sản phẩm
                        </h4>
                        <p className="text-muted-foreground mb-6">
                          Không có sản phẩm nào phù hợp với từ khóa "{searchInput}"
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {searchSuggestions.slice(0, 4).map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => setSearchInput(suggestion)}
                              className="px-4 py-2 bg-secondary text-sm font-medium rounded-full hover:bg-secondary/80 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <div className="text-center mb-8 pt-4 border-t border-border/50">
                        <Link
                          to={`/products?search=${encodeURIComponent(searchInput)}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="inline-flex items-center gap-3 px-8 py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
                        >
                          Xem tất cả {searchResults.length} sản phẩm
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  // Hiển thị gợi ý khi chưa có từ khóa
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-foreground mb-4">Gợi ý tìm kiếm</h3>
                      <div className="flex flex-wrap gap-3">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchInput(suggestion)}
                            className="px-5 py-3 bg-secondary text-foreground font-medium rounded-xl hover:bg-secondary/80 transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-4">Danh mục phổ biến</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            id: '1',
                            name: 'iPhone',
                            icon: Smartphone,
                            color: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
                            textColor: 'text-blue-600',
                          },
                          {
                            id: '2',
                            name: 'iPad',
                            icon: Tablet,
                            color: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
                            textColor: 'text-purple-600',
                          },
                          {
                            id: '3',
                            name: 'Mac',
                            icon: Laptop,
                            color: 'bg-gradient-to-br from-gray-500/20 to-gray-600/20',
                            textColor: 'text-gray-600',
                          },
                        ].map((category) => (
                          <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="group p-6 bg-card rounded-2xl border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
                          >
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                            >
                              <category.icon className={`w-7 h-7 ${category.textColor}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                                {category.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Khám phá tất cả sản phẩm
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

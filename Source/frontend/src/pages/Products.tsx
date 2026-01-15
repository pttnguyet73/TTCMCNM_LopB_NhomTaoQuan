import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  X,
  ChevronDown,
  Smartphone,
  Tablet,
  Laptop,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/product';
import { Product as ApiProduct } from '@/types/products';
import { Product as LocalProduct } from '@/data/products';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'rating', label: 'Đánh giá cao' },
];

const priceRanges = [
  { min: 0, max: 15000000, label: 'Dưới 15 triệu' },
  { min: 15000000, max: 30000000, label: '15 - 30 triệu' },
  { min: 30000000, max: 50000000, label: '30 - 50 triệu' },
  { min: 50000000, max: Infinity, label: 'Trên 50 triệu' },
];

const categoryIcons = {
  all: Grid3X3,
  iphone: Smartphone,
  ipad: Tablet,
  mac: Laptop,
};

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: '1', name: 'iPhone' },
  { id: '2', name: 'iPad' },
  { id: '3', name: 'Mac' },
];

const mapApiToLocalProduct = (apiProduct: ApiProduct): LocalProduct => {
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

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = searchParams.get('category') || 'all';

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        sort_by: sortBy,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedCategory !== 'all') {
        params.category_id = selectedCategory;
      }

      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        params.min_price = range.min;
        params.max_price = range.max === Infinity ? undefined : range.max;
      }

      const data = await productService.getFilteredProducts(params);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPriceRange(null);
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || selectedPriceRange !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-40">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-2 text-muted-foreground">Đang tải sản phẩm...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Có lỗi xảy ra</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="apple" onClick={fetchProducts}>
                Thử lại
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedCategory === 'all'
                ? 'Tất cả sản phẩm'
                : categories.find((c) => c.id === selectedCategory)?.name || 'Sản phẩm'}
            </h1>
            <p className="text-muted-foreground">{products.length} sản phẩm</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full h-12 pl-12 pr-4 bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Grid3X3;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                      selectedCategory === category.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 pl-4 pr-10 bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={cn('rounded-xl', showFilters && 'bg-accent text-accent-foreground')}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>

              <div className="hidden md:flex items-center gap-1 bg-secondary rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGridView(true)}
                  className={cn('rounded-lg h-9 w-9', isGridView && 'bg-background shadow-sm')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGridView(false)}
                  className={cn('rounded-lg h-9 w-9', !isGridView && 'bg-background shadow-sm')}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mb-6 flex-wrap"
              >
                <span className="text-sm text-muted-foreground">Đang lọc:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={() => handleCategoryChange('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPriceRange !== null && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm">
                    {priceRanges[selectedPriceRange].label}
                    <button onClick={() => setSelectedPriceRange(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-sm text-destructive hover:underline">
                  Xóa tất cả
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-secondary/50 rounded-2xl border border-border"
              >
                <h3 className="font-semibold text-foreground mb-4">Khoảng giá</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedPriceRange(selectedPriceRange === index ? null : index)
                      }
                      className={cn(
                        'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                        selectedPriceRange === index
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-background hover:bg-background/80',
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {products.length > 0 ? (
            <div
              className={cn(
                'grid gap-6',
                isGridView
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1',
              )}
            >
              {products.map((apiProduct, index) => {
                const localProduct = mapApiToLocalProduct(apiProduct);
                return <ProductCard key={apiProduct.id} product={localProduct} index={index} />;
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-muted-foreground mb-6">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <Button variant="apple" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products'; // Sử dụng Product từ data/products

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Hàm format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Lấy màu và storage mặc định
    const defaultColor = product.colors?.[0]?.name || '';
    const defaultStorage = product.storage?.[0] || '';

    addToCart(product, defaultColor, defaultStorage);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="group relative bg-card rounded-3xl p-4 md:p-6 transition-all duration-500 hover:shadow-elegant border border-border/50 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                Mới
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Đã thêm vào yêu thích');
            }}
          >
            <Heart className="w-5 h-5" />
          </button>

          <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-secondary/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} đánh giá)</span>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 py-2">
                {product.colors.slice(0, 4).map((color, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <Button
              variant="apple"
              className="w-full mt-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4" />
              Thêm vào giỏ
            </Button>
          </div>

          <div
            className={cn(
              'absolute bottom-4 right-4 w-2 h-2 rounded-full',
              product.inStock ? 'bg-green-500' : 'bg-red-500',
            )}
          />
        </div>
      </Link>
    </motion.div>
  );
}

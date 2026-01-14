import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ProductCardItem } from '@/types/products';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductCardItem;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct = {
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description || '',
      colors: product.colors?.map((color) => ({
        id: color.id,
        name: color.name,
        hex_code: color.hex_code,
      })),
      storage: product.storage,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      isNew: product.isNew,
      originalPrice: product.originalPrice,
      inStock: product.inStock,
    };

    addToCart(product.id, product.colors?.[0]?.name || '', 1);

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
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.isNew && (
              <span
                key="badge-new"
                className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full"
              >
                Mới
              </span>
            )}
            {product.originalPrice && (
              <span
                key="badge-sale"
                className="px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full"
              >
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist */}
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

          {/* Image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-secondary/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>

            <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating || 0}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews || 0} đánh giá)
              </span>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5 py-2">
              {product.colors?.slice(0, 4).map((color) => (
                <span
                  key={`color-${color.id}`}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
              {product.colors && product.colors.length > 4 && (
                <span key="color-more" className="text-xs text-muted-foreground">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              variant="apple"
              className="w-full mt-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="w-4 h-4" />
              Thêm vào giỏ
            </Button>
          </div>

          {/* Stock */}
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

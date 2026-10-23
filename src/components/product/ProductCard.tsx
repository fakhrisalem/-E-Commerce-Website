import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore, useWishlistStore } from '@/stores';
import { Badge, Rating } from '@/components/ui';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { addItem: addToCart } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

  const isInWishlistNow = isInWishlist(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.colors[0].name, product.sizes[4] || product.sizes[0]);
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(isInWishlistNow ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="perspective-1000"
    >
      <Link to={`/product/${product.slug}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-500"
        >
          
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            {product.images[1] && (
              <motion.img
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            )}

            
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {discount > 0 && (
                <Badge variant="sale">-{discount}%</Badge>
              )}
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
            </div>

            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`
                absolute top-3 right-3 z-10 p-2.5 rounded-full
                bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
                transition-all duration-300 shadow-soft
                ${isInWishlistNow ? 'text-error-500' : 'text-gray-400 hover:text-error-500'}
              `}
            >
              <Heart className={`w-5 h-5 ${isInWishlistNow ? 'fill-current' : ''}`} />
            </motion.button>

            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 right-3 z-10 flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-lg"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          
          <div className="p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {product.name}
            </h3>

            
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <span
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner-soft"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>

            
            <div className="mb-3">
              <Rating value={product.rating} size="sm" />
            </div>

            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

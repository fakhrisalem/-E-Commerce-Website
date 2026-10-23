import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight,
  Star, Check, Truck, RefreshCw, Shield,
} from 'lucide-react';
import { Button, Rating, Badge, QuantitySelector } from '@/components/ui';
import { ProductCard } from '@/components/product';
import { products, reviews } from '@/data/products';
import { useCartStore, useWishlistStore } from '@/stores';
import { useTranslation } from '@/i18n';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const product = products.find((p) => p.slug === slug);
  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[4] || product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem: addToCart, isInCart } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

  const isInWishlistNow = product ? isInWishlist(product.id) : false;
  const inCart = product ? isInCart(product.id, selectedColor, selectedSize) : false;
  const discount = product?.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const productReviews = product ? reviews.filter((r) => r.productId === product.id) : [];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[4] || product.sizes[0] || '');
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => { addToCart(product, selectedColor, selectedSize, quantity); toast.success('Added to cart'); };
  const handleToggleWishlist = () => { toggleWishlist(product); toast.success(isInWishlistNow ? 'Removed from wishlist' : 'Added to wishlist'); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !isZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imageRef.current.style.setProperty('--zoom-x', `${x}%`);
    imageRef.current.style.setProperty('--zoom-y', `${y}%`);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">{t('nav.shop')}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              ref={imageRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              style={{ '--zoom-x': '50%', '--zoom-y': '50%' } as React.CSSProperties}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={isZoomed ? { transformOrigin: 'var(--zoom-x) var(--zoom-y)' } : undefined}
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2">
                {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
                {product.isNew && <Badge variant="new">New</Badge>}
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
                <button onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="pointer-events-auto p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="pointer-events-auto p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>

            
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((image, index) => (
                <motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ${selectedImage === index ? 'ring-2 ring-gray-900 dark:ring-white' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          
          <div className="space-y-4 sm:space-y-5">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <Rating value={product.rating} size="md" showValue count={product.reviewCount} />
            </div>

            <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.oldPrice && <span className="text-lg sm:text-xl text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
              {discount > 0 && <span className="text-success-600 font-medium text-sm sm:text-base">Save ${((product.oldPrice || 0) - product.price).toFixed(2)}</span>}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{product.shortDescription}</p>

            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                {t('product.selectColor')}
                {selectedColor && <span className="text-gray-500 font-normal ml-2">({selectedColor})</span>}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.colors.map((color) => (
                  <button key={color.name} onClick={() => setSelectedColor(color.name)} title={color.name}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}>
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    {selectedColor === color.name && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${color.hex === '#ffffff' || color.hex === '#f5f5f5' ? 'text-gray-900' : 'text-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base">{t('product.selectSize')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`min-w-[42px] sm:min-w-[48px] h-10 sm:h-12 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all ${selectedSize === size ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base">{t('product.quantity')}</h3>
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={product.stock} />
            </div>

            
            <div className="text-sm sm:text-base">
              {product.stock > 10 ? (
                <span className="text-success-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> {t('product.inStock')} ({product.stock} available)
                </span>
              ) : product.stock > 0 ? (
                <span className="text-warning-600">Low stock - only {product.stock} left</span>
              ) : (
                <span className="text-error-600">{t('product.outOfStock')}</span>
              )}
            </div>

            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" className="flex-1" leftIcon={<ShoppingCart className="w-5 h-5" />}
                onClick={handleAddToCart} disabled={product.stock === 0}>
                {inCart ? 'Add More' : t('product.addToCart')}
              </Button>
              <Button size="lg" variant="outline"
                leftIcon={<Heart className={`w-5 h-5 ${isInWishlistNow ? 'fill-current text-error-500' : ''}`} />}
                onClick={handleToggleWishlist}>
                {isInWishlistNow ? t('product.removeFromWishlist') : t('product.addToWishlist')}
              </Button>
              <Button size="lg" variant="ghost" className="shrink-0 sm:w-auto">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Warranty</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-12 sm:mt-16">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
              <button className="pb-4 text-base sm:text-lg font-medium text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white whitespace-nowrap">
                {t('product.description')}
              </button>
              <button className="pb-4 text-base sm:text-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">
                {t('product.reviews')} ({productReviews.length})
              </button>
            </div>
          </div>
          <div className="py-6 sm:py-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl text-sm sm:text-base">{product.longDescription}</p>
          </div>
        </div>

        
        {productReviews.length > 0 && (
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {productReviews.map((review) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img src={review.avatar} alt={review.author} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{review.author}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs sm:text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}

        
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
              {t('product.relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
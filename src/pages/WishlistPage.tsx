import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useWishlistStore, useCartStore } from '@/stores';
import { useTranslation } from '@/i18n';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { t } = useTranslation();
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleMoveToCart = (item: { productId: string; product: typeof items[0]['product'] }) => {
    addToCart(item.product, item.product.colors[0].name, item.product.sizes[0]);
    removeItem(item.productId);
    toast.success('Moved to cart');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('wishlist.empty')}</h1>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">{t('wishlist.title')}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div key={item.productId} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <Link to={`/product/${item.product.slug}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={item.product.images[0]} alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="p-3 sm:p-4">
                  <Link to={`/product/${item.product.slug}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 text-sm sm:text-base">{item.product.name}</h3>
                  </Link>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">${item.product.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs sm:text-sm" leftIcon={<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />}
                      onClick={() => handleMoveToCart({ productId: item.productId, product: item.product })}>
                      {t('wishlist.addToCart')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button, QuantitySelector } from '@/components/ui';
import { useCartStore } from '@/stores';
import { useTranslation } from '@/i18n';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('cart.empty')}
          </h1>
          <Link to="/shop">
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('cart.continueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {t('cart.title')}
          </h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                >
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.product.brand} | {item.color} | Size: {item.size}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                      ${item.product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.productId, item.color, item.size, qty)}
                        size="sm"
                      />
                      <button
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="p-2 text-gray-400 hover:text-error-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.subtotal')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-success-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${(total * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('cart.total')}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(total + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ هنا التعديل - Link يلف الـ Button */}
              <Link to="/checkout" className="block w-full">
                <Button className="w-full" size="lg">
                  {t('cart.checkout')}
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
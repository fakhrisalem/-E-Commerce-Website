import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingCart, Menu, X,
  Sun, Moon, Globe, User, LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useCartStore, useWishlistStore, useThemeStore, useLanguageStore, useUserStore } from '@/stores';
import { useTranslation } from '@/i18n';

export function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const location   = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { t }                          = useTranslation();
  const { getTotalItems }              = useCartStore();
  const { items: wishlistItems }       = useWishlistStore();
  const { mode, toggleTheme }          = useThemeStore();
  const { language, setLanguage }      = useLanguageStore();
  const { isAuthenticated, logout }    = useUserStore();

  const cartCount     = getTotalItems();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  const navLinks = [
    { name: t('nav.home'),    href: '/'        },
    { name: t('nav.shop'),    href: '/shop'    },
    { name: t('nav.about'),   href: '/about'   },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled || isMobileMenuOpen
            ? 'py-2 bg-white dark:bg-gray-950 shadow-md border-b border-gray-100 dark:border-gray-800'
            : 'py-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-12">

            
            <Link to="/" className="relative z-10 flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-9 sm:w-9">
                  <circle cx="19" cy="19" r="18" className="fill-gray-900 dark:fill-white" />
                  <path d="M11 24 L16 12 L20 18 L24 12 L27 24" stroke="white" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-gray-900" fill="none" />
                  <path d="M9 27 L29 27" stroke="white" strokeWidth="2"
                    strokeLinecap="round" className="dark:stroke-gray-900" />
                </svg>
                <span className="text-xl font-black tracking-widest text-gray-900 dark:text-white sm:text-2xl" style={{ letterSpacing: '0.15em' }}>
                  NOVA
                </span>
              </motion.div>
            </Link>

            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <motion.span
                    whileHover={{ y: -1 }}
                    className={`relative text-sm font-medium transition-colors
                      ${location.pathname === link.href
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {link.name}
                    {location.pathname === link.href && (
                      <motion.div layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
                    )}
                  </motion.span>
                </Link>
              ))}
            </div>

            
            <div className="flex items-center gap-0 sm:gap-1">

              
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors sm:p-2"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              
              <motion.button whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="hidden rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex sm:p-2"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium uppercase">{language}</span>
              </motion.button>

              
              <Link to="/wishlist">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="relative rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:p-2"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              
              <Link to="/cart">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="relative rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:p-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              
              <div className="hidden md:flex items-center gap-2 ml-1">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                      </motion.div>
                    </Link>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={logout}
                      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link to="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
                    <Link to="/register"><Button size="sm">{t('nav.register')}</Button></Link>
                  </>
                )}
              </div>

              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-0 rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden sm:ml-1 sm:p-2"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>

        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="px-6 pt-4 pb-8 space-y-1">

                
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center py-3 text-base font-medium border-b border-gray-50 dark:border-gray-800 transition-colors
                        ${location.pathname === link.href
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      {link.name}
                      {location.pathname === link.href && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.06 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-3 w-full py-3 text-base font-medium text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'en' ? 'العربية' : 'English'}</span>
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.06 + 0.05 }}
                  className="sm:hidden"
                >
                  <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 border-b border-gray-50 py-3 text-base font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span>{isDark ? t('nav.lightMode') : t('nav.darkMode')}</span>
                  </button>
                </motion.div>

                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-5"
                >
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">{t('nav.profile')}</Button>
                      </Link>
                      <Button variant="ghost" onClick={logout} className="flex-1">{t('nav.logout')}</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                      </Link>
                      <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full">{t('nav.register')}</Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.search') + '...'}
                    className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/product';
import { Hero3DShoe, CategoriesSection, ReviewsSection } from '@/components/home';
import { products } from '@/data/products';
import { useTranslation } from '@/i18n';

export default function HomePage() {
  const { t } = useTranslation();
  const heroTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroTextRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.9, ease: 'power3.out' });
      gsap.fromTo('.hero-buttons',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.2, ease: 'power3.out' });
    }, heroTextRef);
    return () => ctx.revert();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers      = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals      = products.filter((p) => p.isNew).slice(0, 4);

  const titleWords = t('home.heroTitle').split(' ');

  const wordVariants = {
    hidden:  { opacity: 0, y: 70, skewY: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.75, delay: 0.1 + i * 0.14, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/30">

        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full aspect-square rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, #1a6fff22, transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/2 w-full aspect-square rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, #4d9fff18, transparent 70%)' }}
          />
        </div>

        
        <Hero3DShoe />

        
        <div
          ref={heroTextRef}
          className="relative z-10 w-full px-4 sm:px-8 lg:px-16 xl:px-24
                     flex flex-col items-center text-center
                     md:items-start md:text-left
                     md:max-w-[55%] lg:max-w-[50%]"
        >
          
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(26,111,255,0.12)',
              border: '1px solid rgba(77,159,255,0.28)',
              backdropFilter: 'blur(10px)',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.01em',
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-7 text-gray-700 dark:text-[#8ab4d4]"
          >
            <Sparkles className="w-4 h-4" style={{ color: '#4d9fff' }} />
            Premium Sportswear Collection
          </motion.div>

          
          <h1 className="hero-title mb-6 overflow-hidden">
            <span className="flex flex-wrap justify-center md:justify-start"
              style={{ gap: '0 0.3em', lineHeight: 1.0 }}>
              {titleWords.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                  <motion.span
                    className="inline-block bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-blue-200"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={wordVariants}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)',
                      letterSpacing: '-0.04em',
                      lineHeight: 1.0,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          
          <p
            className="hero-subtitle max-w-md mb-10 text-slate-600 dark:text-blue-100/85"
            style={{
              opacity: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
              lineHeight: 1.65,
              letterSpacing: '0.005em',
            }}
          >
            {t('home.heroSubtitle')}
          </p>

          
          <div
            className="hero-buttons flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            style={{ opacity: 0 }}
          >
            <Link to="/shop">
              <Button size="lg" variant="blue" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {t('home.shopNow')}
              </Button>
            </Link>
            <Link to="/shop?category=running">
              <Button size="lg" variant="blue-outline">
                {t('home.exploreCollection')}
              </Button>
            </Link>
          </div>
        </div>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full flex items-start justify-center p-1.5"
            style={{ border: '2px solid rgba(77,159,255,0.4)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#4d9fff' }}
            />
          </motion.div>
        </motion.div>
      </section>

      
      <CategoriesSection />

      
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.featuredProducts')}
            </motion.h2>
            <Link to="/shop?featured=true">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>{t('common.viewAll')}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      
      <section className="py-12 lg:py-20 bg-gray-100 dark:bg-[rgba(10,13,20,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.bestSellers')}
            </motion.h2>
            <Link to="/shop?sort=popular">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>{t('common.viewAll')}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bestSellers.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.newArrivals')}
            </motion.h2>
            <Link to="/shop?new=true">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>{t('common.viewAll')}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newArrivals.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      
      <ReviewsSection />

    </div>
  );
}
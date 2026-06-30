import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '@/data/products';
import { useTranslation } from '@/i18n';

const BLUE = '#2563eb';
const BLUE_LIGHT = '#3b82f6';

// Mini 3D shoe card with tilt effect per category
function Category3DCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <Link to={`/shop?category=${category.slug}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: '800px' }}
          className="cursor-pointer"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
            className="relative group rounded-2xl lg:rounded-3xl overflow-hidden aspect-square"
          >
            {/* Category image */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Blue glow overlay on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 80%, ${BLUE}33 0%, transparent 60%)`,
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-2xl lg:rounded-3xl pointer-events-none"
              style={{ border: `1px solid ${BLUE_LIGHT}00` }}
              whileHover={{ borderColor: `${BLUE_LIGHT}55`, boxShadow: `0 0 30px 5px ${BLUE}22` }}
              transition={{ duration: 0.4 }}
            />

            {/* Sparkle in top-right */}
            <motion.div
              className="absolute top-3 right-3 pointer-events-none"
              animate={{ rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
            >
              <Sparkles className="w-4 h-4" style={{ color: BLUE_LIGHT, opacity: 0.7 }} />
            </motion.div>

            {/* Floating light particle */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 6,
                height: 6,
                backgroundColor: BLUE_LIGHT,
                boxShadow: `0 0 12px 4px ${BLUE_LIGHT}88`,
                left: '20%',
                top: '30%',
              }}
              animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6" style={{ transform: 'translateZ(30px)' }}>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">{category.name}</h3>
              <p className="text-gray-300 text-sm hidden lg:block mb-3">{category.description}</p>
              <motion.div
                whileHover={{ x: 6 }}
                className="flex items-center gap-2 text-white/80 group-hover:text-white text-sm font-medium transition-colors"
                style={{ color: BLUE_LIGHT }}
              >
                Explore
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoriesSection() {
  const { t } = useTranslation();

  const particles = [
    { x: '8%',  y: '20%', size: 4, delay: 0,   dur: 4 },
    { x: '92%', y: '15%', size: 3, delay: 0.8, dur: 5 },
    { x: '50%', y: '90%', size: 5, delay: 1.5, dur: 3.8 },
    { x: '15%', y: '75%', size: 3, delay: 0.3, dur: 4.5 },
    { x: '85%', y: '70%', size: 4, delay: 1.2, dur: 4.2 },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Background particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`cat-p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: BLUE_LIGHT,
            boxShadow: `0 0 ${p.size * 4}px ${p.size}px ${BLUE_LIGHT}66`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Background orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: '-10%',
          top: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}15, transparent 70%)`,
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Glowing badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background: `linear-gradient(135deg, ${BLUE}22, ${BLUE_LIGHT}11)`,
              border: `1px solid ${BLUE_LIGHT}33`,
              color: BLUE_LIGHT,
            }}
            animate={{ boxShadow: [`0 0 0px ${BLUE}00`, `0 0 20px ${BLUE}44`, `0 0 0px ${BLUE}00`] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            Shop by Category
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.featuredCategories')}
          </h2>

          {/* Animated underline */}
          <motion.div
            className="h-1 rounded-full mx-auto"
            style={{ background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)` }}
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Category3DCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

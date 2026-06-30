import { motion, AnimatePresence } from 'framer-motion';
import { Target, Lightbulb, Leaf, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop', label: 'Air Max Collection' },
  { image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1600&auto=format&fit=crop', label: 'Running Series' },
  { image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=1600&auto=format&fit=crop', label: 'Performance Line' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((p) => (p + 1) % heroSlides.length);

  const values = [
    { icon: Award, title: t('about.valuesQuality'), description: t('about.valuesQualityText'), color: 'bg-primary-500' },
    { icon: Lightbulb, title: t('about.valuesInnovation'), description: t('about.valuesInnovationText'), color: 'bg-amber-500' },
    { icon: Leaf, title: t('about.valuesSustainability'), description: t('about.valuesSustainabilityText'), color: 'bg-success-500' },
  ];

  const team = [
    { name: 'Eslam salem', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Aya salem', role: 'Head of Design', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Mostafa ahmed ', role: 'Product Manager', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Shaimaa Khaild', role: 'Lead Developer', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16">

      {/* Hero Slider */}
      <section className="relative py-16 sm:py-20 overflow-hidden min-h-[420px] sm:min-h-[520px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <img src={heroSlides[current].image} alt={heroSlides[current].label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto">
            <motion.span key={heroSlides[current].label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 text-white"
              style={{ background: 'rgba(77,159,255,0.35)', border: '1px solid rgba(77,159,255,0.5)' }}>
              {heroSlides[current].label}
            </motion.span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4">{t('about.heroTitle')}</h1>
            <p className="text-lg sm:text-xl font-medium text-blue-300 mb-4 sm:mb-6">{t('about.heroSubtitle')}</p>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">{t('about.heroDescription')}</p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={prev} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#4d9fff' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-5 sm:mb-6">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white dark:text-gray-900" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('about.missionTitle')}</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{t('about.missionText')}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop" alt="Our Mission" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500/20 rounded-2xl blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('about.valuesTitle')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }}
                className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-soft-lg transition-all">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The passionate people behind NOVA who bring our vision to life every day.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {team.map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center group">
                <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-2xl">
                  <img src={member.image} alt={member.name} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{member.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Step Into the Future?</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">Explore our collection and find your perfect pair.</p>
            <Link to="/shop"><Button size="lg">Shop Now</Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
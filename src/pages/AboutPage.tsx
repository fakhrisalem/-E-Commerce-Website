import { AnimatePresence, motion } from 'framer-motion';
import { Target, Lightbulb, Leaf, Award } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const storyVideo = `${import.meta.env.BASE_URL}p2.mp4`;
const missionImages = [
  `${import.meta.env.BASE_URL}p0.jpeg`,
  `${import.meta.env.BASE_URL}P1.jpeg`,
];

export default function AboutPage() {
  const { t } = useTranslation();
  const [missionSlide, setMissionSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMissionSlide((current) => (current + 1) % missionImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const values = [
    { icon: Award, title: t('about.valuesQuality'), description: t('about.valuesQualityText'), color: 'bg-primary-500' },
    { icon: Lightbulb, title: t('about.valuesInnovation'), description: t('about.valuesInnovationText'), color: 'bg-amber-500' },
    { icon: Leaf, title: t('about.valuesSustainability'), description: t('about.valuesSustainabilityText'), color: 'bg-success-500' },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16">

      
      <section className="relative flex min-h-[520px] items-center overflow-hidden bg-gray-950 py-20 sm:min-h-[620px] sm:py-24">
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          src={storyVideo}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 sm:text-sm">
              <span className="h-px w-8 bg-blue-300" />
              {t('about.heroEyebrow')}
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t('about.heroTitle')}
            </h1>
            <p className="mb-4 text-xl font-semibold text-blue-200 sm:text-2xl">{t('about.heroSubtitle')}</p>
            <p className="max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">{t('about.heroDescription')}</p>
          </motion.div>
        </div>
      </section>

      
      <section className="overflow-hidden bg-gray-50 py-16 dark:bg-gray-900 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 shadow-lg shadow-gray-900/10 dark:bg-white">
                <Target className="h-6 w-6 text-white dark:text-gray-900" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400">
                {t('about.missionEyebrow')}
              </p>
              <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                {t('about.missionTitle')}
              </h2>
              <div className="border-s-2 border-primary-500 ps-5 sm:ps-6">
                <p className="max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl sm:leading-9">
                  {t('about.missionText')}
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-200 shadow-2xl shadow-gray-900/10 dark:bg-gray-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={missionSlide}
                    src={missionImages[missionSlide]}
                    alt={`${t('about.missionTitle')} ${missionSlide + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-5 end-5 flex gap-2" aria-hidden="true">
                  {missionImages.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${index === missionSlide ? 'w-7 bg-white' : 'w-2 bg-white/60'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
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
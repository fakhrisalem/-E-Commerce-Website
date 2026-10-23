import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/i18n';

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const customerService = [
    { name: 'FAQ', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Size Guide', href: '#' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('footer.newsletter')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('footer.newsletterText')}
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1"
              />
              <Button variant="primary" className="w-full sm:w-auto">{t('footer.subscribe')}</Button>
            </form>
          </div>
        </div>

        
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                NOVA
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer.customerService')}
            </h4>
            <ul className="space-y-2">
              {customerService.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('contact.title')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>123 Fashion Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 shrink-0" />
                <span>support@nova.com</span>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date().getFullYear()} NOVA. {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:justify-end">
            <Link to="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

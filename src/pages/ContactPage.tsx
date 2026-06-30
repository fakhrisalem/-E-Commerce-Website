import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/i18n';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (_data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Message sent successfully!');
    reset();
  };

  const contactInfo = [
    { icon: MapPin, title: t('contact.address'), content: '123 Fashion Street, New York, NY 10001' },
    { icon: Phone, title: t('contact.phone'), content: '+1 (555) 123-4567' },
    { icon: Mail, title: 'Email', content: 'support@nova.com' },
    { icon: Clock, title: 'Business Hours', content: 'Mon-Fri: 9AM-6PM EST' },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16">
      {/* Hero */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input {...register('name')} placeholder={t('contact.name')} error={errors.name?.message} />
                  <Input {...register('email')} type="email" placeholder={t('contact.email')} error={errors.email?.message} />
                </div>
                <Input {...register('subject')} placeholder={t('contact.subject')} error={errors.subject?.message} />
                <textarea {...register('message')} placeholder={t('contact.message')} rows={5}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 resize-none input-focus text-sm sm:text-base ${errors.message ? 'border-error-500' : ''}`} />
                {errors.message && <p className="text-sm text-error-500">{errors.message.message}</p>}
                <Button type="submit" size="lg" isLoading={isSubmitting} rightIcon={<Send className="w-5 h-5" />} className="w-full sm:w-auto">
                  {t('contact.send')}
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">{t('nav.contact')}</h2>
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div key={info.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="p-2 sm:p-3 rounded-lg bg-gray-900 dark:bg-white shrink-0">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{info.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{info.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src="https://images.pexels.com/photos/207681/pexels-photo-207681.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Location" className="w-full h-full object-cover opacity-80" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

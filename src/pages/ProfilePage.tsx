import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Settings, Heart } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useUserStore } from '@/stores';
import { useTranslation } from '@/i18n';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tabs = [
    { id: 'profile', label: t('profile.title'), icon: User },
    { id: 'orders', label: t('profile.orders'), icon: Package },
    { id: 'wishlist', label: t('nav.wishlist'), icon: Heart },
    { id: 'settings', label: t('profile.settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800">
              <div className="text-center mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden mb-3 sm:mb-4">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{user?.name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 no-scrollbar">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          
          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-800">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6">{t('profile.editProfile')}</h2>
                  <form className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Full Name" defaultValue={user?.name} placeholder="John Doe" />
                      <Input label="Email" type="email" defaultValue={user?.email} placeholder="john@example.com" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Phone" defaultValue={user?.phone} placeholder="+1 (555) 123-4567" />
                      <Input label="Birthday" type="date" />
                    </div>
                    <Button>Save Changes</Button>
                  </form>
                </div>
              )}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6">{t('profile.orders')}</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {[1, 2].map((order) => (
                      <div key={order} className="p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Order #{order}001</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">$199.99</p>
                          <span className="text-xs sm:text-sm text-success-600">Delivered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6">{t('nav.wishlist')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">View and manage your saved items from your wishlist page.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6">{t('profile.settings')}</h2>
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { title: 'Email Notifications', desc: 'Receive updates about orders and promotions', defaultChecked: true },
                      { title: 'SMS Notifications', desc: 'Receive order updates via SMS', defaultChecked: false },
                    ].map((setting) => (
                      <div key={setting.title} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{setting.title}</p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{setting.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked={setting.defaultChecked} className="toggle" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
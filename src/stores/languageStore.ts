import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language } from '@/types';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: () => boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: language => {
        const html = document.documentElement;
        if (language === 'ar') {
          html.setAttribute('dir', 'rtl');
          html.setAttribute('lang', 'ar');
        } else {
          html.setAttribute('dir', 'ltr');
          html.setAttribute('lang', 'en');
        }
        set({ language });
      },
      isRTL: () => get().language === 'ar',
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          const html = document.documentElement;
          if (state.language === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
          } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
          }
        }
      },
    }
  )
);

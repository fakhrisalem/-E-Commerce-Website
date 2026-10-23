import { useLanguageStore } from '@/stores';
import translations from './translations';

type TranslationValue = string | { readonly [key: string]: TranslationValue };

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    for (const k of keys) {
      if (typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

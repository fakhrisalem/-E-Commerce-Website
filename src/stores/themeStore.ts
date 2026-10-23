import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      setTheme: mode => {
        const effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
        if (effectiveTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ mode });
      },
      toggleTheme: () => {
        const currentMode = get().mode;
        const currentEffective = currentMode === 'system' ? getSystemTheme() : currentMode;
        const newMode = currentEffective === 'dark' ? 'light' : 'dark';
        get().setTheme(newMode);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persistedMode = (persistedState as { mode?: unknown } | undefined)?.mode;
        const mode: ThemeMode = persistedMode === 'light' || persistedMode === 'dark'
          ? persistedMode
          : 'dark';
        return { ...currentState, mode };
      },
      onRehydrateStorage: () => state => {
        if (state) {
          const effectiveTheme = state.mode === 'system' ? getSystemTheme() : state.mode;
          if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);


if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const state = useThemeStore.getState();
    if (state.mode === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

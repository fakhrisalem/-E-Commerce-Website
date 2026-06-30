import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WishlistItem, Product } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: product => {
        if (!get().isInWishlist(product.id)) {
          set({ items: [...get().items, { productId: product.id, product }] });
        }
      },
      removeItem: productId => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },
      toggleItem: product => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      isInWishlist: productId => get().items.some(item => item.productId === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

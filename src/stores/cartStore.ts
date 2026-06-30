import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, color: string, size: string, quantity?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, color, size, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.productId === product.id && item.color === color && item.size === size
        );
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({
            items: [...items, { productId: product.id, quantity, color, size, product }],
          });
        }
      },
      removeItem: (productId, color, size) => {
        set({
          items: get().items.filter(
            item => !(item.productId === productId && item.color === color && item.size === size)
          ),
        });
      },
      updateQuantity: (productId, color, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }
        set({
          items: get().items.map(item =>
            item.productId === productId && item.color === color && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      isInCart: (productId, color?, size?) => {
        const items = get().items;
        if (color && size) {
          return items.some(
            item => item.productId === productId && item.color === color && item.size === size
          );
        }
        return items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

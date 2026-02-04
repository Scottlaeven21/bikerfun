'use client';

import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTax: () => number;
  getTotal: () => number;
  hydrate: () => void;
}

const SHIPPING_COST = 7.50;
const FREE_SHIPPING_THRESHOLD = 75;
const TAX_RATE = 0.21; // 21% BTW
const STORAGE_KEY = 'bikerfun-cart';

// Load initial state from localStorage (only on client)
const getInitialState = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

export const useCart = create<CartState>()((set, get) => ({
      items: [],
      
      hydrate: () => {
        set({ items: getInitialState() });
      },

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === newItem.product_id
          );

          let newItems;
          if (existingItem) {
            // Update quantity
            newItems = state.items.map((item) =>
              item.product_id === newItem.product_id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            );
          } else {
            // Add new item
            newItems = [...state.items, newItem];
          }
          
          saveToStorage(newItems);
          return { items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.product_id !== productId);
          saveToStorage(newItems);
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          );
          saveToStorage(newItems);
          return { items: newItems };
        });
      },

      clearCart: () => {
        saveToStorage([]);
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unit_price * item.quantity,
          0
        );
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * TAX_RATE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const tax = get().getTax();
        return subtotal + shipping + tax;
      },
    }));

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateQuantity as updateQuantityUtil, clearCart as clearCartUtil, getCartTotal, getCartItemCount } from '@/lib/woocommerce/cart';
import { WooCommerceProduct } from '@/types/woocommerce';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: WooCommerceProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart on mount
  useEffect(() => {
    loadCart();
    
    // Listen for cart updates from other tabs/windows
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const loadCart = () => {
    const currentCart = getCart();
    setCart(currentCart);
    setItemCount(getCartItemCount());
    setTotal(getCartTotal());
  };

  const addToCart = (product: WooCommerceProduct, quantity: number = 1) => {
    addToCartUtil(product, quantity);
    loadCart();
  };

  const removeFromCart = (productId: number) => {
    removeFromCartUtil(productId);
    loadCart();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    updateQuantityUtil(productId, quantity);
    loadCart();
  };

  const clearCart = () => {
    clearCartUtil();
    loadCart();
  };

  return (
    <CartContext.Provider value={{ cart, itemCount, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

'use client';

import { WooCommerceProduct } from '@/types/woocommerce';

export interface CartItem {
  product: WooCommerceProduct;
  quantity: number;
}

const CART_STORAGE_KEY = 'bikerfun_cart';

/**
 * Get cart from localStorage
 */
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Failed to get cart:', error);
    return [];
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Trigger custom event for cart updates
    window.dispatchEvent(new Event('cart-updated'));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

/**
 * Add product to cart
 */
export function addToCart(product: WooCommerceProduct, quantity: number = 1): void {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  saveCart(cart);
}

/**
 * Remove product from cart
 */
export function removeFromCart(productId: number): void {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.product.id !== productId);
  saveCart(filteredCart);
}

/**
 * Update product quantity in cart
 */
export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  saveCart([]);
}

/**
 * Get cart total
 */
export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const price = parseFloat(item.product.price || '0');
    return total + (price * item.quantity);
  }, 0);
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Build WooCommerce cart URL with products
 */
export function buildWooCommerceCartUrl(baseUrl: string): string {
  const cart = getCart();
  
  if (cart.length === 0) {
    return `${baseUrl}/cart`;
  }
  
  // Build URL with product IDs and quantities
  const params = cart.map(item => 
    `add-to-cart=${item.product.id}&quantity=${item.quantity}`
  ).join('&');
  
  return `${baseUrl}/?${params}`;
}

/**
 * Redirect to WooCommerce checkout with cart items
 */
export function redirectToCheckout(baseUrl: string): void {
  const url = buildWooCommerceCartUrl(baseUrl);
  window.location.href = url;
}

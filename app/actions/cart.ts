'use server';

// Server Actions for Cart Operations with WooCommerce

import { redirect } from 'next/navigation';
import { wooCommerce } from '@/lib/woocommerce/client';
import { getAddToCartUrl } from '@/lib/woocommerce/utils';

/**
 * Add product to WooCommerce cart and redirect
 * This redirects the user to WooCommerce where the cart is managed
 */
export async function addToCart(productId: number, quantity: number = 1) {
  try {
    // Check if WooCommerce is configured
    if (!wooCommerce.isConfigured()) {
      return {
        success: false,
        error: 'Webshop is momenteel niet beschikbaar. Probeer het later opnieuw.',
      };
    }

    // Get the product to verify it exists
    const product = await wooCommerce.getProduct(productId);

    if (!product) {
      return {
        success: false,
        error: 'Product niet gevonden.',
      };
    }

    // Check if product is in stock
    if (product.stock_status === 'outofstock') {
      return {
        success: false,
        error: 'Dit product is momenteel niet op voorraad.',
      };
    }

    // Build add-to-cart URL
    const wooUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '';
    const addToCartUrl = getAddToCartUrl(wooUrl, productId, quantity);

    // Redirect to WooCommerce with add-to-cart
    redirect(addToCartUrl);
  } catch (error) {
    console.error('Add to cart error:', error);
    return {
      success: false,
      error: 'Er is iets misgegaan bij het toevoegen aan winkelwagen.',
    };
  }
}

/**
 * Redirect to WooCommerce cart
 */
export async function goToCart() {
  const cartUrl = wooCommerce.getCartUrl();
  redirect(cartUrl);
}

/**
 * Redirect to WooCommerce checkout
 */
export async function goToCheckout() {
  const checkoutUrl = wooCommerce.getCheckoutUrl();
  redirect(checkoutUrl);
}

/**
 * Buy product now (add to cart and go to checkout)
 */
export async function buyNow(productId: number, quantity: number = 1) {
  try {
    if (!wooCommerce.isConfigured()) {
      return {
        success: false,
        error: 'Webshop is momenteel niet beschikbaar.',
      };
    }

    // Get the product
    const product = await wooCommerce.getProduct(productId);

    if (!product) {
      return {
        success: false,
        error: 'Product niet gevonden.',
      };
    }

    // Check stock
    if (product.stock_status === 'outofstock') {
      return {
        success: false,
        error: 'Dit product is momenteel niet op voorraad.',
      };
    }

    // Build URL: add to cart and redirect to checkout
    const wooUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '';
    const buyNowUrl = `${getAddToCartUrl(wooUrl, productId, quantity)}&redirect=checkout`;

    // Redirect to WooCommerce
    redirect(buyNowUrl);
  } catch (error) {
    console.error('Buy now error:', error);
    return {
      success: false,
      error: 'Er is iets misgegaan. Probeer het opnieuw.',
    };
  }
}

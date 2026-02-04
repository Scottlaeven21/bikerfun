import Stripe from 'stripe';

// Only initialize Stripe if API key is provided and valid
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isValidStripeKey = stripeSecretKey && stripeSecretKey.startsWith('sk_');

export const stripe = isValidStripeKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  : null;

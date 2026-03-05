import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting configuration
 * Ruime limieten om API functionaliteit te behouden
 */

// Initialize Redis (gebruik environment variables)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Auth endpoints (login, register) - 5 pogingen per 10 minuten
export const authLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
}) : null;

// Checkout endpoint - 10 orders per uur (ruim voor normale gebruik)
export const checkoutLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'ratelimit:checkout',
}) : null;

// Admin sync endpoint - 5 syncs per uur (handmatige syncs)
export const syncLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'ratelimit:sync',
}) : null;

// Generic API limiter - 100 requests per minuut (zeer ruim)
export const apiLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
}) : null;

/**
 * Helper function to get client IP
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

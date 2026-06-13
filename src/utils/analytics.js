import { track } from '@vercel/analytics';

/**
 * Utility to track custom events using Vercel Analytics.
 * Handles environment checks and safe logs in development.
 */
export const trackEvent = (eventName, properties = {}) => {
  try {
    // Vercel Analytics custom tracking
    track(eventName, properties);
    
    // Log to console in development mode
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Tracked: "${eventName}"`, properties);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Failed to track event:', error);
    }
  }
};

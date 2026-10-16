/**
 * Application Routes Constants
 * 
 * Centralized route definitions for the entire application.
 * Use these constants instead of hardcoded strings for better maintainability.
 */

// Public Routes
export const ROUTES = {
  // Home & misc
  HOME: '/',
  ERROR: '/error',
  EVENTS: '/events',
  CONTACT: '/contact',
  DONATE: '/donate',

  // Membership
  MEMBERSHIP_SIGNUP: '/membership/signup',
  MEMBERSHIP_FORM: '/membership/form',
  MEMBERSHIP_CONFIRMATION: '/membership/confirmation',
  MEMBERSHIP_DASHBOARD: '/membership/dashboard',
  MEMBERSHIP_RENEW: '/membership/renew',

  // Auth pages
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_APPLICATION_DETAIL: (id: string) => `/admin/dashboard/${id}`,
} as const;

// Type helper for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES]

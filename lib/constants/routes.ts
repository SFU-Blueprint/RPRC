/**
 * Application Routes Constants
 * 
 * Centralized route definitions for the entire application.
 * Use these constants instead of hardcoded strings for better maintainability.
 */

// Public Routes
export const ROUTES = {
  // Home & Auth
  HOME: '/',
  ERROR: '/error',
  
  // Membership
  MEMBERSHIP_SIGNUP: '/membership/signup',
  MEMBERSHIP_FORM: '/membership/form',
  MEMBERSHIP_CONFIRMATION: '/membership/confirmation',
  MEMBERSHIP_DASHBOARD: '/membership/dashboard',
  
  // Auth
  AUTH_CALLBACK: '/auth/callback',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_APPLICATION_DETAIL: (id: string) => `/admin/dashboard/${id}`,
  
  // API
  API_APPLICATION: '/api/application',
  API_APPLICATION_BY_ID: (id: string) => `/api/application/${id}`,
  API_AUTH_LOGIN: '/api/auth/log-in',
} as const

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.MEMBERSHIP_FORM,
  ROUTES.MEMBERSHIP_CONFIRMATION,
  ROUTES.MEMBERSHIP_DASHBOARD,
] as const

// Admin routes that require admin role
export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
] as const

// Public routes accessible without authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ERROR,
  ROUTES.MEMBERSHIP_SIGNUP,
  ROUTES.AUTH_CALLBACK,
  ROUTES.AUTH_FORGOT_PASSWORD,
  ROUTES.AUTH_RESET_PASSWORD,
] as const

// Type helper for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES]

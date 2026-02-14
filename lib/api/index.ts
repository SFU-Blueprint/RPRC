/**
 * API Utilities Export
 * Single point of import for all API utilities
 * 
 * Note: Import directly from services/ or helpers/ to avoid naming conflicts
 * - Services: Authentication and business logic
 * - Helpers: Validation and utility functions
 */

// Services can be imported via: import { createUser } from '@/lib/api/services/auth'
export * from './services/auth';

// Helpers can be imported via: import { validateStep1 } from '@/lib/api/helpers/signup-validation'
// Not exported here to avoid naming conflicts with services

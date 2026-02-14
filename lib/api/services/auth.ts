/**
 * Authentication API utilities
 * Handles user creation, email validation, and authentication
 */

import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/lib/constants/enums';
import bcrypt from 'bcryptjs';

export type CreateUserInput = {
  email: string;
  password: string;
  role: UserRole;
};

export type CreateUserResult = {
  success: boolean;
  userId?: string;
  error?: string;
  errorCode?: 'EMAIL_EXISTS' | 'INVALID_INPUT' | 'DATABASE_ERROR';
};

export type CheckEmailResult = {
  exists: boolean;
  error?: string;
};

/**
 * Check if an email already exists in the database
 */
export async function checkEmailExists(email: string): Promise<CheckEmailResult> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error('Error checking email:', error);
      return { exists: false, error: error.message };
    }

    return { exists: !!data };
  } catch (error) {
    console.error('Unexpected error checking email:', error);
    return { exists: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new user in the database
 * Note: This creates a user in the public.users table, not Supabase Auth
 */
export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  try {
    // Validate input
    if (!input.email || !input.password || !input.role) {
      return {
        success: false,
        error: 'Email, password, and role are required',
        errorCode: 'INVALID_INPUT',
      };
    }

    // Normalize email
    const email = input.email.toLowerCase().trim();

    // Check if email already exists
    const emailCheck = await checkEmailExists(email);
    if (emailCheck.error) {
      return {
        success: false,
        error: emailCheck.error,
        errorCode: 'DATABASE_ERROR',
      };
    }
    
    if (emailCheck.exists) {
      return {
        success: false,
        error: 'Email already exists. Please login instead.',
        errorCode: 'EMAIL_EXISTS',
      };
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    // Create user
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: input.role,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: 'Failed to create user account',
        errorCode: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
      userId: data.id,
    };
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      errorCode: 'DATABASE_ERROR',
    };
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one symbol (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// app/api/auth/sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

// Validation schema matching acceptance criteria
const signInSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .transform((val) => val.toLowerCase().trim()),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        'Password must contain at least 1 uppercase letter and 1 special symbol',
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords must match exactly',
    path: ['confirm_password'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = signInSchema.parse(body);

    // Create Supabase client
    const supabase = createServerClient();

    // Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: (error as z.ZodError).errors,
        },
        { status: 400 },
      );
    }

    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

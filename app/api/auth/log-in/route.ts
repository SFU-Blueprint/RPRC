// app/api/auth/log-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Validation schema for log-in
const logInSchema = z.object({
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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = logInSchema.parse(body);

    // Create Supabase client
    const supabase = await createClient();

    // Log in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        session: {
          access_token: data.session?.access_token,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: (error as z.ZodError).issues,
        },
        { status: 400 },
      );
    }

    console.error('Log-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

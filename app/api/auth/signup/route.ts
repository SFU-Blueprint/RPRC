import { NextRequest, NextResponse } from 'next/server';
import { createUser, validateEmail, validatePassword } from '@/lib/api/services/auth';
import { UserRole, isValidEnumValue } from '@/lib/constants/enums';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Validate role
    if (!isValidEnumValue(UserRole, role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({
      email,
      password,
      role: role as UserRole,
    });

    if (!result.success) {
      if (result.errorCode === 'EMAIL_EXISTS') {
        return NextResponse.json(
          { error: result.error, errorCode: result.errorCode },
          { status: 409 } // Conflict
        );
      }
      return NextResponse.json(
        { error: result.error, errorCode: result.errorCode },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, userId: result.userId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

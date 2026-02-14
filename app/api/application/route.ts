import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/application?userId=xxx
 * Get user's application
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get user's application
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching application:', error);
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      application: data,
    });
  } catch (error) {
    console.error('Error in application route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/application
 * Create a new application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, ...applicationData } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and application type are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Create application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        type,
        status: 'to_review',
        ...applicationData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      application: data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in application POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

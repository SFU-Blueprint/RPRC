import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startMembershipCheckout } from '@/lib/api/services/server/payment-service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to pay for your membership.' },
      { status: 401 },
    );
  }

  try {
    const result = await startMembershipCheckout({
      userId: user.id,
      email: user.email,
      requestOrigin: new URL(request.url).origin,
    });
    if (!result.ok)
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('[stripe checkout] unexpected error:', error);
    return NextResponse.json(
      { error: 'Checkout could not be started. Please try again.' },
      { status: 500 },
    );
  }
}

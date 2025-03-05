import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, stripeSessionId } = body;
    
    // Get the most recent event of the specified type
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('event_type', eventType)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      throw new Error('No matching event found');
    }
    
    // Update the event with the Stripe session ID
    const { error: updateError } = await supabase
      .from('user_events')
      .update({ stripe_session_id: stripeSessionId })
      .eq('id', data[0].id);
    
    if (updateError) {
      throw updateError;
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error updating tracking:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking', message: error.message },
      { status: 500 }
    );
  }
} 
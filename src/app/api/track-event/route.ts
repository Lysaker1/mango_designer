import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, metadata } = body;
    
    // Generate a session ID if not present in cookies
    let sessionId = request.headers.get('cookie')?.match(/session_id=([^;]+)/)?.[1];
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      // In a real implementation, you'd set this as a cookie
    }
    
    // Insert event into database
    const { data, error } = await supabase
      .from('user_events')
      .insert([
        {
          event_type: eventType,
          session_id: sessionId,
          metadata: metadata
        }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    // If this is an add_to_cart event with bike config, store in cart_items
    if (eventType === 'add_to_cart' && metadata.bikeConfig) {
      const { error: cartError } = await supabase
        .from('cart_items')
        .insert([
          {
            event_id: data[0].id,
            bike_config: metadata.bikeConfig,
            price: metadata.totalPrice || 0
          }
        ]);
      
      if (cartError) {
        console.error('Error storing cart item:', cartError);
      }
    }
    
    return NextResponse.json({ success: true, eventId: data?.[0]?.id });
    
  } catch (error: any) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Failed to track event', message: error.message },
      { status: 500 }
    );
  }
} 
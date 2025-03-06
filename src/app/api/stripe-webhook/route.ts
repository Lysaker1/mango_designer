import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppNotification } from '@/utils/whatsapp';
import { getAndUpdateTotalRevenue } from '@/utils/revenue-tracker';

// Initialize Stripe with the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    
    let event: Stripe.Event;
    
    try {
      // Verify the event came from Stripe
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Multi-factor check to determine if this is from our configurator
    // We use OR logic - if any check passes, we consider it our transaction
    let isFromOurApp = false;
    let bikeDetails = null;
    let bikeDescription = null;
    
    // Step 1: Check cancel_url (primary indicator)
    if (session.cancel_url?.includes('mango.spinlio.com') || 
        session.cancel_url?.includes('localhost')) {
      isFromOurApp = true;
      
      // Flag if this is from a test environment
      const isTestEnvironment = session.cancel_url?.includes('localhost');
      if (isTestEnvironment) {
        console.log('Test environment transaction detected via cancel_url');
      }
    }
    
    // Step 3: If we have line items, check product name (most reliable indicator)
    if (session.id && !isFromOurApp && (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_failed')) {
      try {
        // Retrieve the session with line items expanded
        const expandedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ['line_items'] }
        );
        
        // Check if any product contains "Custom" in the name or description
        if (expandedSession.line_items?.data) {
          for (const item of expandedSession.line_items.data) {
            const productName = item.description || '';
            // Check for "Custom Moosher" or any of our bike models
            if (productName.includes('Custom Moosher') || 
                productName.includes('Custom DOG') || 
                productName.includes('Custom OG') || 
                productName.includes('Custom OSS')) {
              isFromOurApp = true;
              bikeDetails = productName;
              bikeDescription = item.description;
              break;
            }
          }
        }
      } catch (err) {
        console.warn('Could not retrieve line items:', err);
        // Continue with the other checks
      }
    }
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(session, isFromOurApp, bikeDetails, bikeDescription);
        break;
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(session, isFromOurApp);
        break;
      
      case 'checkout.session.async_payment_failed':
        await handlePaymentFailed(session, isFromOurApp);
        break;
    }
    
    // Return 200 to acknowledge receipt of the event
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session, 
  isFromOurApp: boolean,
  bikeDetails?: string | null,
  bikeDescription?: string | null
) {
  try {
    // Only process if it appears to be from our app
    if (!isFromOurApp) return;
    
    // Check if we have a tracking event for this session
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();
    
    if (error) {
      console.log('No related checkout event found. This might be from another source.');
      // We'll still record the purchase, but won't send a notification
    }
    
    // Record the completed purchase
    const { error: insertError } = await supabase
      .from('user_events')
      .insert([
        {
          event_type: 'purchase_completed',
          session_id: data?.session_id || Math.random().toString(36).substring(2, 15), // Generate a new session ID if not found
          source_url: data?.source_url || 'stripe_webhook_direct',
          stripe_session_id: session.id,
          metadata: {
            amount: session.amount_total ? session.amount_total / 100 : 0,
            customerEmail: session.customer_details?.email,
            customerName: session.customer_details?.name,
            bikeDetails: bikeDetails || 'Custom Bike',
            bikeDescription: bikeDescription,
            checkoutEventId: data?.id // Link to the original checkout event
          }
        }
      ]);
    
    if (insertError) {
      console.error('Error recording purchase completion:', insertError);
    }
    
    // Only send notification for production transactions
    const isTestTransaction = session.cancel_url?.includes('localhost') || 
                              !session.livemode ||
                              process.env.NODE_ENV !== 'production';
    
    if (!isTestTransaction) {
      try {
        await sendWhatsAppNotification({
          sessionId: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          customerEmail: session.customer_details?.email || 'Unknown',
          customerName: session.customer_details?.name || 'Unknown',
          bikeType: bikeDetails || 'Custom Bike'
        });
      } catch (notifyError) {
        console.error('Error sending notification:', notifyError);
      }
    } else {
      console.log('Skipping notification for test transaction:', session.id);
    }
    
    // Update the total revenue counter
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    await getAndUpdateTotalRevenue(amount);
  } catch (err) {
    console.error('Error processing webhook:', err);
  }
}

// Handle expired checkout session (abandoned cart)
async function handleCheckoutExpired(session: Stripe.Checkout.Session, isFromOurApp: boolean) {
  try {
    // Only record if it appears to be from our app
    if (!isFromOurApp) return;
    
    // Check if we have a tracking event for this session
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();
    
    // Record the expired checkout
    const { error: insertError } = await supabase
      .from('user_events')
      .insert([
        {
          event_type: 'checkout_expired',
          session_id: data?.session_id || Math.random().toString(36).substring(2, 15),
          stripe_session_id: session.id,
          source_url: data?.source_url || 'stripe_webhook_direct',
          metadata: {
            amount: session.amount_total ? session.amount_total / 100 : 0,
            customerEmail: session.customer_details?.email,
            checkoutEventId: data?.id // Link to the original event if available
          }
        }
      ]);
    
    if (insertError) {
      console.error('Error recording checkout expiration:', insertError);
    }
  } catch (err) {
    console.error('Error processing expired checkout:', err);
  }
}

// Handle failed payment
async function handlePaymentFailed(session: Stripe.Checkout.Session, isFromOurApp: boolean) {
  try {
    // Only record if it appears to be from our app
    if (!isFromOurApp) return;
    
    // Check if we have a tracking event for this session
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();
    
    // Record the payment failure
    const { error: insertError } = await supabase
      .from('user_events')
      .insert([
        {
          event_type: 'payment_failed',
          session_id: data?.session_id || Math.random().toString(36).substring(2, 15),
          stripe_session_id: session.id,
          source_url: data?.source_url || 'stripe_webhook_direct',
          metadata: {
            amount: session.amount_total ? session.amount_total / 100 : 0,
            customerEmail: session.customer_details?.email,
            errorMessage: 'Payment failed',
            checkoutEventId: data?.id // Link to the original event if available
          }
        }
      ]);
    
    if (insertError) {
      console.error('Error recording payment failure:', insertError);
    }
  } catch (err) {
    console.error('Error processing payment failure:', err);
  }
} 
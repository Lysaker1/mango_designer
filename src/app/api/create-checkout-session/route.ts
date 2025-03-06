import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Sjekk om API-nøkkelen er tilgjengelig
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    // Verifiser at Stripe er konfigurert riktig
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured correctly on the server' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { cartItems } = body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item: any) => {        
        return {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: item.frameName,
              description: 
                `Frame: ${item.frameSize || 'N/A'} (${item.frameColor || 'N/A'}) | Fork: ${item.forkColor || 'N/A'} | ` +
                `Handlebar: ${item.handlebarType || 'N/A'} (${item.handlebarColor || 'N/A'}) | ` +
                `Stem: ${item.stemColor || 'N/A'} | Grip: ${item.gripColor || 'N/A'} | ` +
                `Wheels: Front ${item.frontWheelType || 'N/A'} (${item.frontWheelColor || 'N/A'}), ` +
                `Rear ${item.rearWheelType || 'N/A'} (${item.rearWheelColor || 'N/A'}) | ` +
                `Front Tyre: ${item.frontTyreType || 'N/A'} (${item.frontTyreColor || 'N/A'}) | ` +
                `Rear Tyre: ${item.rearTyreType || 'N/A'} (${item.rearTyreColor || 'N/A'}) | ` +
                `Saddle: ${item.saddleColor || 'N/A'} | Seat Post: ${item.seatPostColor || 'N/A'} | ` +
                `Pedals: ${item.pedalType || 'N/A'} (${item.pedalColor || 'N/A'}) | ` +
                `Chain: ${item.chainColor || 'N/A'}`
            },
            unit_amount: Math.round(item.totalPrice * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `https://mangobikes.com/`,
      cancel_url: `${request.headers.get('origin')}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: 'Could not create checkout session', message: err.message },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if the Stripe secret key is set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    // Verify that Stripe is configured correctly
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured correctly on the server' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { cartItems, payment_method, is_international } = body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: payment_method === 'paypal' ? ['paypal'] : ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: is_international ? [
          "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ",
          "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ",
          "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ",
          "DE", "DJ", "DK", "DM", "DO", "DZ",
          "EC", "EE", "EG", "EH", "ER", "ES", "ET",
          "FI", "FJ", "FK", "FO", "FR",
          "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY",
          "HK", "HN", "HR", "HT", "HU",
          "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT",
          "JE", "JM", "JO", "JP",
          "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ",
          "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
          "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
          "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ",
          "OM",
          "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY",
          "QA",
          "RE", "RO", "RS", "RU", "RW",
          "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ",
          "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
          "UA", "UG", "US", "UY", "UZ",
          "VA", "VC", "VE", "VG", "VN", "VU",
          "WF", "WS",
          "XK",
          "YE", "YT",
          "ZA", "ZM", "ZW", "ZZ",
        ] : ["GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: is_international ? 15000 : 0, // 150 GBP in pence
              currency: 'gbp',
            },
            display_name: is_international ? 'International Shipping' : 'Domestic Shipping',
          },
        },
      ],
      line_items: cartItems.filter(item => !item.isShipping).map((item: any) => ({
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
      })),
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
import axios from 'axios';
import { getAndUpdateTotalRevenue } from '@/utils/revenue-tracker';

// Send WhatsApp notification about new orders
export async function sendWhatsAppNotification(orderDetails: any) {
  try {
    // Calculate 5% transaction fee
    const amount = parseFloat(orderDetails.amount);
    const transactionFee = amount * 0.05;
    
    // Check if this is a test transaction
    const isTestTransaction = orderDetails.isTestEnvironment || 
                              process.env.NODE_ENV !== 'production' || 
                              !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
    
    const testPrefix = isTestTransaction ? '🧪 TEST TRANSACTION - ' : '';
    
    const message = `${testPrefix}🎉 New Custom Bike Order!\n\n` + 
      `💰 Amount: £${amount.toFixed(2)}\n` +
      `💸 Your 5% Fee: £${transactionFee.toFixed(2)}\n` +
      `👤 Customer: ${orderDetails.customerName}\n` +
      `📧 Email: ${orderDetails.customerEmail}\n` +
      `🆔 Order ID: ${orderDetails.sessionId.slice(-6)}\n\n` +
      `🚲 Bike: ${orderDetails.bikeType || 'Custom'}\n` +
      `🗓️ Date: ${new Date().toLocaleString()}`;

    // Send to your number
    await sendTwilioMessage(process.env.NOTIFICATION_PHONE_NUMBER!, message);
    
    // Send to co-founder if configured
    if (process.env.JACK_PHONE_NUMBER) {
      await sendTwilioMessage(process.env.JACK_PHONE_NUMBER, message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
}

// Enhanced sendDailySummary function with visitor counts and bike preferences
export async function sendDailySummary() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get today's date range (UTC)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0)).toISOString();
    const endOfDay = new Date(today.setHours(23,59,59,999)).toISOString();
    
    // Modified query to count distinct session IDs that exist
    const { data: uniqueSessionIds } = await supabase
      .from('user_events')
      .select('session_id')
      .gte('timestamp', startOfDay)
      .lte('timestamp', endOfDay)
      .not('session_id', 'is', null);

    // Count unique session IDs
    const visitorCount = new Set(uniqueSessionIds?.map(event => event.session_id)).size;
    
    // 2. Count events by type
    const { data: eventData } = await supabase
      .from('user_events')
      .select('event_type, metadata')
      .gte('timestamp', startOfDay)
      .lte('timestamp', endOfDay);
      
    const eventCounts: Record<string, number> = {};
    let totalRevenue = 0;
    
    eventData?.forEach(event => {
      eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
      
      // Calculate revenue from successful purchases
      if (event.event_type === 'purchase_completed' && event.metadata?.amount) {
        totalRevenue += parseFloat(event.metadata.amount);
      }
    });
    
    // Define all possible bike types
    const allBikeTypes = ['Moosher', 'DOG', 'OG', 'OSS'];
    // Get most popular bike frames
    const { data: bikeSelections } = await supabase
      .from('user_events')
      .select('metadata')
      .eq('event_type', 'bike_selected')
      .gte('timestamp', startOfDay)
      .lte('timestamp', endOfDay);

    // Count selections by bike type
    const bikePopularity: Record<string, number> = {};

    // Initialize with all bike types (so we show even those with 0 counts)
    allBikeTypes.forEach(type => {
      bikePopularity[type] = 0;
    });

    // Count the actual selections
    bikeSelections?.forEach(event => {
      if (event.metadata?.bikeType) {
        bikePopularity[event.metadata.bikeType] = (bikePopularity[event.metadata.bikeType] || 0) + 1;
      }
    });

    // Format all bike types for the message, sorted by popularity
    const bikeStats = Object.entries(bikePopularity)
      .sort((a, b) => b[1] - a[1])
      .map(([bikeType, count]) => `${bikeType}: ${count}`);

    // Calculate 5% of total revenue
    const transactionFeeTotal = totalRevenue * 0.05;
    
    // Get cookie consent statistics
    const { data: cookieChoices } = await supabase
      .from('user_events')
      .select('metadata')
      .eq('event_type', 'cookie_choice')
      .gte('timestamp', startOfDay)
      .lte('timestamp', endOfDay);

    let acceptCount = 0;
    let rejectCount = 0;

    cookieChoices?.forEach(event => {
      if (event.metadata?.choice === 'accepted') {
        acceptCount++;
      } else if (event.metadata?.choice === 'rejected') {
        rejectCount++;
      }
    });

    // Get banner view count but didn't make a choice
    const { count: bannerViewCount } = await supabase
      .from('user_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'cookie_banner_view')
      .gte('timestamp', startOfDay)
      .lte('timestamp', endOfDay);

    const noChoiceCount = (bannerViewCount || 0) - acceptCount - rejectCount;

    // Format the message with fee information
    const allTimeTotal = await getAndUpdateTotalRevenue(0); // Just retrieve without updating
    const allTimeFee = allTimeTotal * 0.05;

    const message = `📊 Daily Summary: ${new Date().toLocaleDateString()}\n\n` +
      `👥 Unique Visitors: ${visitorCount || 0}\n\n` +
      `🍪 Cookie Consent:\n` +
      `  ✅ Accepted: ${acceptCount}\n` +
      `  ❌ Rejected: ${rejectCount}\n` +
      `  ⏱️ No Choice: ${noChoiceCount > 0 ? noChoiceCount : 0}\n\n` +
      `🛒 Add to Cart: ${eventCounts['add_to_cart'] || 0}\n` +
      `💳 Checkout Started: ${eventCounts['checkout_initiated'] || 0}\n` +
      `✅ Purchases Completed: ${eventCounts['purchase_completed'] || 0}\n` +
      `❌ Payment Failed: ${eventCounts['payment_failed'] || 0}\n` +
      `⏰ Checkout Expired: ${eventCounts['checkout_expired'] || 0}\n\n` +
      `💰 Daily Revenue: £${totalRevenue.toFixed(2)}\n` +
      `💸 Daily 5% Fee: £${transactionFeeTotal.toFixed(2)}\n` +
      `💰 All-Time Revenue: £${allTimeTotal.toFixed(2)}\n` +
      `💸 All-Time 5% Fee: £${allTimeFee.toFixed(2)}\n` +
      `📈 Conversion Rate: ${calculateConversionRate(eventCounts)}%\n\n` +
      `🚲 Bike Type Popularity:\n${bikeStats.join('\n')}\n`;
    
    // Send the WhatsApp message
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: `whatsapp:${process.env.NOTIFICATION_PHONE_NUMBER}`,
        From: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        Body: message
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID!,
          password: process.env.TWILIO_AUTH_TOKEN!
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error sending daily summary:', error);
    throw error;
  }
}

// Helper function to calculate conversion rate
function calculateConversionRate(counts: Record<string, number>): string {
  const addToCart = counts['add_to_cart'] || 0;
  const completed = counts['purchase_completed'] || 0;
  
  if (addToCart === 0) return '0.00';
  return ((completed / addToCart) * 100).toFixed(2);
}

// Helper function to send a WhatsApp message via Twilio
async function sendTwilioMessage(to: string, body: string) {
  return axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    new URLSearchParams({
      To: `whatsapp:${to}`,
      From: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      Body: body
    }),
    {
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID!,
        password: process.env.TWILIO_AUTH_TOKEN!
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
} 
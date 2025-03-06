import { NextResponse } from 'next/server';
import { sendDailySummary } from '@/utils/whatsapp';

export async function POST(request: Request) {
  try {
    // This check allows both authorized API calls and Vercel cron calls
    const { authorization } = Object.fromEntries(request.headers);
    
    // When called by Vercel Cron, it includes a special header
    const isVercelCron = request.headers.get('x-vercel-cron') === 'true';
    
    // Also allow manual triggering with API key
    const body = isVercelCron ? {} : await request.json();
    const hasValidApiKey = body.apiKey === process.env.DAILY_SUMMARY_API_KEY;
    
    if (!isVercelCron && !hasValidApiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await sendDailySummary();
    
    // If the summary was skipped because already sent today, return 200 but with skipped flag
    if (result.skipped) {
      return NextResponse.json({ 
        success: true, 
        skipped: true, 
        reason: result.reason 
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending daily summary:', error);
    return NextResponse.json(
      { error: 'Failed to send summary', message: error.message },
      { status: 500 }
    );
  }
} 
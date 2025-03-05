import { NextResponse } from 'next/server';
import { sendDailySummary } from '@/utils/whatsapp';

// Only for development/testing
export async function GET(request: Request) {
  try {
    await sendDailySummary();
    return NextResponse.json({ success: true, message: 'Daily summary sent' });
  } catch (error: any) {
    console.error('Error sending daily summary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
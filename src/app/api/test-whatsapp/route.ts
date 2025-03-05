import { NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/utils/whatsapp';

export async function GET(request: Request) {
  try {
    await sendWhatsAppNotification({
      sessionId: 'test_session_123',
      amount: 479.00,
      customerEmail: 'jack@isgay.com',
      customerName: 'Jack',
      bikeType: 'Custom sMoosher',
      isTestEnvironment: true
    });
    
    return NextResponse.json({ success: true, message: 'WhatsApp notification sent' });
  } catch (error: any) {
    console.error('Error sending WhatsApp notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
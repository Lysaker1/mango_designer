// Create a new file for tracking utilities

export async function trackEvent(eventType: string, metadata: any) {
  try {
    // Always track events regardless of cookie consent
    const response = await fetch('/api/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        metadata
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to track ${eventType} event:`, error);
    // Fail silently in production to not disrupt user experience
    return { success: false };
  }
} 
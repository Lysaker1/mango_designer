// Get or create a session ID
export function getSessionId(request: Request): string {
  // Try to get from cookie
  const cookies = request.headers.get('cookie') || '';
  const sessionIdMatch = cookies.match(/session_id=([^;]+)/);
  
  if (sessionIdMatch && sessionIdMatch[1]) {
    return sessionIdMatch[1];
  }
  
  // Generate a new random ID
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Set a session cookie in the response
export function setSessionCookie(response: Response, sessionId: string): Response {
  // Set as HttpOnly for security, SameSite=Lax for cross-site protection
  // Expires in 30 days
  response.headers.append('Set-Cookie', 
    `session_id=${sessionId}; Max-Age=${60*60*24*30}; Path=/; HttpOnly; SameSite=Lax`);
  
  return response;
} 
"use client";

import { useState, useEffect } from 'react';
import { trackEvent } from '@/utils/tracking';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieChoice = localStorage.getItem('cookie_choice');
    
    if (!cookieChoice) {
      setShowBanner(true);
      // Track cookie banner view
      trackEvent('cookie_banner_view', {
        timestamp: new Date().toISOString()
      });
    }
    
    // Add event listener for customize buttons - using delegation
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Only handle customize buttons, not cookie banner buttons
      if (
        (target.textContent?.includes('Customize now') || 
        target.classList.contains('customize-button')) &&
        !target.closest('.cookie-banner')
      ) {
        setShowBanner(false);
        localStorage.setItem('cookie_choice', 'implied');
        trackEvent('cookie_choice', {
          choice: 'implied',
          timestamp: new Date().toISOString()
        });
      }
    };
    
    document.addEventListener('click', clickHandler);
    
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);
  
  const handleCookieChoice = (e: React.MouseEvent, choice: string) => {
    // CRITICAL: Stop propagation to prevent the click from affecting other components
    e.stopPropagation();
    
    // Store the choice and hide banner
    localStorage.setItem('cookie_choice', choice);
    trackEvent('cookie_choice', {
      choice,
      timestamp: new Date().toISOString()
    });
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 cookie-banner"
      onClick={e => e.stopPropagation()} // Stop clicks on the banner from propagating
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0">
          This site uses cookies to improve the 3D models. 
          By continuing to use this site, you consent to our use of cookies.
        </p>
        <div className="flex gap-2 cookie-banner-controls">
          <button
            onClick={(e) => handleCookieChoice(e, 'rejected')}
            className="px-4 py-2 bg-gray-600 text-white rounded"
            type="button"
          >
            Reject
          </button>
          <button
            onClick={(e) => handleCookieChoice(e, 'accepted')}
            className="px-4 py-2 bg-mangoOrange text-white rounded"
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
} 
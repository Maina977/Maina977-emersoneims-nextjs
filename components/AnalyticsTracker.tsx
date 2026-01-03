'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const tracked = useRef(false);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'pageview',
            page: pathname,
            referrer: document.referrer,
          }),
        });
      } catch (e) {
        // Silent fail
      }
    };

    // Send heartbeat to keep user active
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'heartbeat',
            page: pathname,
          }),
        });
      } catch (e) {
        // Silent fail
      }
    };

    // Track on mount and pathname change
    if (!tracked.current) {
      trackPageView();
      tracked.current = true;
    }

    // Set up heartbeat every 30 seconds
    heartbeatInterval.current = setInterval(sendHeartbeat, 30000);

    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [pathname]);

  // Reset tracking on pathname change
  useEffect(() => {
    tracked.current = false;
  }, [pathname]);

  return null; // This component doesn't render anything
}

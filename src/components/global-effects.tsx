
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the MouseTrail component to ensure it only runs on the client.
const MouseTrail = dynamic(() => import('@/components/mouse-trail'), {
  ssr: false,
});

/**
 * A component to house all global, client-side visual effects.
 * This ensures they are cleanly separated and only loaded in the browser.
 */
export function GlobalEffects() {
  return <MouseTrail />;
}

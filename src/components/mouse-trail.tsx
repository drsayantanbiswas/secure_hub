
'use client';

import { useMouseTrail } from '@/hooks/use-mouse-trail';

/**
 * A client component that activates the site-wide mouse trail effect.
 * It should be dynamically imported and rendered only on the client side.
 */
export default function MouseTrail() {
  useMouseTrail();
  return null;
}

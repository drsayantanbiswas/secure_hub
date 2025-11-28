
'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * A custom React hook to create a mind-blowing cursor trail effect.
 * @param maxTrails - The maximum number of trail particles to display at once.
 */
export const useMouseTrail = (maxTrails = 20) => {
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const createTrail = useCallback((x: number, y: number) => {
    // Check if a trail element already exists at this exact spot to avoid clutter
    if (trailsRef.current.some(t => t.style.left === `${x}px` && t.style.top === `${y}px`)) {
      return;
    }

    const trail = document.createElement('div');
    trail.className = 'trail';
    // Position it at the center of the cursor
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    trail.style.background = `hsl(${Math.random() * 360}, 90%, 70%)`;
    document.body.appendChild(trail);
    
    trailsRef.current.push(trail);
    if (trailsRef.current.length > maxTrails) {
      const oldTrail = trailsRef.current.shift();
      if(oldTrail) {
        document.body.removeChild(oldTrail);
      }
    }
    
    // Animate trail using the Web Animations API for performance
    requestAnimationFrame(() => {
      trail.animate([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        try {
          trail.remove();
        } catch (e) {
          // It might have been removed already if maxTrails is exceeded
        }
      };
    });
  }, [maxTrails]);

  useEffect(() => {
    // This effect should only run on the client
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { x, y } = lastMousePosRef.current;
      
      // Throttle trail creation based on distance to avoid excessive particles
      if (Math.hypot(clientX - x, clientY - y) > 15) {
        lastMousePosRef.current = { x: clientX, y: clientY };
        createTrail(clientX, clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function to remove event listener and any remaining trails
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      trailsRef.current.forEach(trail => {
        try {
          trail.remove();
        } catch (e) {
          // Failsafe in case element is already gone
        }
      });
      trailsRef.current = [];
    };
  }, [createTrail]);

  // This hook does not render anything itself
  return null;
};

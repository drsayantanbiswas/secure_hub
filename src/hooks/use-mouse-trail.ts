
'use client';

import { useCallback, useEffect, useRef } from 'react';

const NUM_PARTICLES = 8;
const LERP_FACTOR = 0.1;

class Particle {
  x: number;
  y: number;
  element: HTMLDivElement;

  constructor(x: number, y: number, index: number) {
    this.x = x;
    this.y = y;
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 will-change-transform';
    this.element.style.transition = `opacity 0.5s ${index * 0.03}s, transform 0.2s ${index * 0.03}s`;
    document.body.appendChild(this.element);
  }

  move(targetX: number, targetY: number) {
    this.x += (targetX - this.x) * LERP_FACTOR;
    this.y += (targetY - this.y) * LERP_FACTOR;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = Math.min(Math.max(0.8, 1 - dist / 200), 1.2);

    this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${scale})`;
    this.element.style.opacity = '0.6';
  }

  destroy() {
    this.element.remove();
  }
}

export const useMouseTrail = () => {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef(0);
  const isTabActiveRef = useRef(true);

  const createParticles = useCallback(() => {
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particlesRef.current.push(new Particle(-100, -100, i));
    }
  }, []);

  const destroyParticles = useCallback(() => {
    particlesRef.current.forEach(p => p.destroy());
    particlesRef.current = [];
  }, []);

  const animate = useCallback(() => {
    let targetX = mouseRef.current.x;
    let targetY = mouseRef.current.y;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const particle = particlesRef.current[i];
      if (particle) {
        particle.move(targetX, targetY);
        targetX = particle.x;
        targetY = particle.y;
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastUpdateTimeRef.current > 16) { // Throttle to ~60fps
            mouseRef.current = { x: e.clientX, y: e.clientY };
            lastUpdateTimeRef.current = now;
        }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        const now = performance.now();
        if (e.touches[0] && now - lastUpdateTimeRef.current > 16) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            lastUpdateTimeRef.current = now;
        }
    };

    const handleVisibilityChange = () => {
        isTabActiveRef.current = !document.hidden;
        if (document.hidden) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        } else {
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    };

    // Initialize only on the client
    if (typeof window !== 'undefined') {
        createParticles();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      destroyParticles();
    };
  }, [animate, createParticles, destroyParticles]);

  return null;
};

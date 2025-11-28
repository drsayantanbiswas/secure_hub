
'use client';

import { useCallback, useEffect, useRef } from 'react';

const NUM_PARTICLES = 10;
const CLICK_PARTICLES = 20;
const LERP_FACTOR = 0.1;

class Particle {
  x: number;
  y: number;
  element: HTMLDivElement;
  vx: number;
  vy: number;
  life: number;
  isBurst: boolean;

  constructor(x: number, y: number, index: number, isBurst = false) {
    this.x = x;
    this.y = y;
    this.isBurst = isBurst;
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-none fixed left-0 top-0 z-[9999] rounded-full will-change-transform';
    
    if (isBurst) {
        this.element.style.width = `${Math.random() * 5 + 2}px`;
        this.element.style.height = this.element.style.width;
        this.element.style.background = `hsl(${Math.random() * 60 + 280}, 90%, 70%)`; // Pinks, Purples
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
    } else {
        this.element.style.width = '12px';
        this.element.style.height = '12px';
        this.element.style.background = 'radial-gradient(circle, rgba(147,51,234,0.6) 0%, rgba(147,51,234,0) 60%)';
        this.element.style.transition = `opacity 0.5s ${index * 0.03}s, transform 0.2s ${index * 0.03}s`;
        this.vx = 0;
        this.vy = 0;
        this.life = -1; // Infinite life for trail
    }

    document.body.appendChild(this.element);
  }

  move(targetX: number, targetY: number) {
    if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.life -= 0.02;
        this.element.style.opacity = `${this.life}`;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    } else {
        this.x += (targetX - this.x) * LERP_FACTOR;
        this.y += (targetY - this.y) * LERP_FACTOR;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.min(Math.max(0.8, 1 - dist / 200), 1.2);

        this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${scale})`;
        this.element.style.opacity = '1';
    }
  }

  isDead() {
    return this.isBurst && this.life <= 0;
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

  const createBurst = (x: number, y: number) => {
    for(let i = 0; i < CLICK_PARTICLES; i++) {
        particlesRef.current.push(new Particle(x, y, i, true));
    }
  }

  const animate = useCallback(() => {
    let targetX = mouseRef.current.x;
    let targetY = mouseRef.current.y;

    // Filter out dead burst particles and update live ones
    particlesRef.current = particlesRef.current.filter(p => {
        if (p.isDead()) {
            p.destroy();
            return false;
        }
        if (!p.isBurst) {
            p.move(targetX, targetY);
            targetX = p.x;
            targetY = p.y;
        } else {
            p.move(0, 0); // Burst particles move on their own
        }
        return true;
    });

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

    const handleClick = (e: MouseEvent) => {
        createBurst(e.clientX, e.clientY);
    }
    
    // Initialize trail particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particlesRef.current.push(new Particle(-100, -100, i, false));
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current.forEach(p => p.destroy());
      particlesRef.current = [];
    };
  }, [animate]);

  return null;
};

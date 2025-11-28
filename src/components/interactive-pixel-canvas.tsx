
"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

const InteractivePixelCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef<any[]>([]);
  const { resolvedTheme } = useTheme();

  // --- Configuration ---
  const particleCount = 500; // Reduced particle count for performance
  const mouseInfluence = 120;
  const particleBaseSpeed = 0.3;

  useEffect(() => {
    if (typeof window !== 'undefined') {
        mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }, []);

  // --- Utility Functions ---
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

  // --- Particle Class ---
  class Particle {
    x: number;
    y: number;
    z: number;
    vz: number;
    
    constructor(width: number, height: number) {
        this.x = getRandom(-width, width);
        this.y = getRandom(-height, height);
        this.z = getRandom(0, width);
        this.vz = particleBaseSpeed;
    }

    getProjected(canvasWidth: number, canvasHeight: number) {
      const scale = canvasWidth / (canvasWidth + this.z);
      const x = this.x * scale + canvasWidth / 2;
      const y = this.y * scale + canvasHeight / 2;
      const r = Math.max(0, 1.5 * scale);
      return { x, y, r, scale };
    }

    draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
      const { x, y, r, scale } = this.getProjected(canvasWidth, canvasHeight);
      
      const dx = x - mouse.current.x;
      const dy = y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let opacity = scale * 0.8;
      let finalRadius = r;

      if (dist < mouseInfluence) {
          const proximity = 1 - (dist / mouseInfluence);
          opacity = Math.min(1, opacity + proximity * 0.3);
          finalRadius = r + proximity * 1.5;
      }
      
      const particleColor = resolvedTheme === 'light' ? `rgba(15, 23, 42, ${opacity})` : `rgba(224, 231, 255, ${opacity})`;

      ctx.beginPath();
      ctx.fillStyle = particleColor;
      ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    update(width: number) {
        this.z -= this.vz;

        if(this.z < 1) {
            this.z = width;
            this.x = getRandom(-width, width);
            this.y = getRandom(-width, width);
        }
    }
  }

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
        particles.current.push(new Particle(rect.width, rect.height));
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Create gradient based on theme
    let gradient;
    if (resolvedTheme === 'dark') {
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617'); // slate-950
      gradient.addColorStop(0.5, '#0f172a'); // slate-900
      gradient.addColorStop(1, '#1e293b'); // slate-800
    } else {
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#f1f5f9'); // slate-100
      gradient.addColorStop(1, '#e2e8f0'); // slate-200
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw particles
    particles.current.forEach(p => {
        p.update(width);
        p.draw(ctx, width, height);
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [resolvedTheme]);

  useEffect(() => {
    initCanvas();
    animationFrameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
        initCanvas();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if(e.touches.length > 0) {
            mouse.current.x = e.touches[0].clientX - rect.left;
            mouse.current.y = e.touches[0].clientY - rect.top;
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [initCanvas, animate]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 bg-background" />;
};

export default InteractivePixelCanvas;

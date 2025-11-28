
"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

const InteractivePixelCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef<any[]>([]);
  const { theme } = useTheme();

  // --- Configuration ---
  const particleCount = 1000;
  const particleColor = 'rgba(255, 255, 255, 0.8)';
  const connectionDistance = 100;
  const mouseInfluence = 150;
  const particleBaseSpeed = 0.5;

  useEffect(() => {
    // Initialize mouse position only on the client
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }, []);

  // --- Utility Functions ---
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

  // --- Particle Class ---
  class Particle {
    x: number;
    y: number;
    z: number;
    vz: number;
    vx: number;
    vy: number;
    radius: number;
    baseX: number;
    baseY: number;
    
    constructor(width: number, height: number) {
        this.x = getRandom(-width, width);
        this.y = getRandom(-height, height);
        this.z = getRandom(0, width);
        this.vz = particleBaseSpeed * 2;
        this.vx = getRandom(-0.5, 0.5);
        this.vy = getRandom(-0.5, 0.5);
        this.radius = getRandom(0.5, 2);
        this.baseX = this.x;
        this.baseY = this.y;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.beginPath();
      const scale = width / (width + this.z);
      const x = this.x * scale + width / 2;
      const y = this.y * scale + height / 2;
      const r = this.radius * scale;
      
      const particleColor = theme === 'light' ? `rgba(15, 23, 42, ${scale * 0.6})` : `rgba(34, 211, 238, ${scale * 0.8})`;
      ctx.fillStyle = particleColor;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    update(width: number, height: number) {
        this.z -= this.vz;

        if(this.z < 1) {
            this.z = width;
            this.x = getRandom(-width, width);
            this.y = getRandom(-height, height);
        }

        const dx = this.x - (mouse.current.x - width / 2);
        const dy = this.y - (mouse.current.y - height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInfluence) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouseInfluence - dist) / mouseInfluence;
            this.vx += forceDirectionX * force * 0.05;
            this.vy += forceDirectionY * force * 0.05;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.98;
        this.vy *= 0.98;
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

    // Create gradient
    let gradient;
    if (theme === 'dark') {
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#0f172a');
      gradient.addColorStop(1, '#4c1d95');
    } else {
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#e2e8f0');
    }


    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    particles.current.forEach(p => {
        p.update(width, height);
        p.draw(ctx, width, height);
    });
    ctx.restore();

    animationFrameId.current = requestAnimationFrame(animate);
  }, [theme]);

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


"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

const InteractivePixelCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: 0, y: 0, clicked: false });
  const particles = useRef<any[]>([]);
  const { resolvedTheme } = useTheme();

  // --- Configuration ---
  const particleCount = 1000;
  const mouseInfluence = 150;
  const particleBaseSpeed = 0.5;
  const connectionDistance = 100; // Max distance for lines between particles

  useEffect(() => {
    // Initialize mouse position only on the client
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2, clicked: false };
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

    // This method will now return the projected coordinates and scale
    getProjected() {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0, scale: 0, r: 0 };
      const { width, height } = canvas.getBoundingClientRect();
      const scale = width / (width + this.z);
      const x = this.x * scale + width / 2;
      const y = this.y * scale + height / 2;
      const r = this.radius * scale;
      return { x, y, scale, r };
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number, dx: number, dy: number, dist: number) {
      const { x, y, r, scale } = this.getProjected();
      
      let opacity = scale * 0.8;
      let finalRadius = r;

      // Glow and scale effect on mouse proximity
      if (dist < mouseInfluence) {
          const proximity = 1 - (dist / mouseInfluence);
          opacity = Math.min(1, opacity + proximity * 0.5);
          finalRadius = r + proximity * 2;
      }
      
      const particleColor = resolvedTheme === 'light' ? `rgba(15, 23, 42, ${opacity})` : `rgba(34, 211, 238, ${opacity})`;
      ctx.beginPath();
      ctx.fillStyle = particleColor;
      ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    update(width: number, height: number) {
        this.z -= this.vz;

        if(this.z < 1) {
            this.z = width;
            this.x = getRandom(-width, width);
            this.y = getRandom(-height, height);
        }

        const { x: projectedX, y: projectedY } = this.getProjected();
        const dx = projectedX - mouse.current.x;
        const dy = projectedY - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse attraction / repulsion
        if (dist < mouseInfluence) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouseInfluence - dist) / mouseInfluence;
            
            // If clicked, push away (explosion)
            if (mouse.current.clicked) {
              this.vx -= forceDirectionX * force * 2;
              this.vy -= forceDirectionY * force * 2;
            } else { // Otherwise, attract
              this.vx -= forceDirectionX * force * 0.2;
              this.vy -= forceDirectionY * force * 0.2;
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.96; // Damping
        this.vy *= 0.96; // Damping
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
      gradient.addColorStop(0, '#f8fafc'); // slate-50
      gradient.addColorStop(1, '#e2e8f0'); // slate-200
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    
    // Draw constellation lines
    for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
            const p1 = particles.current[i];
            const p2 = particles.current[j];
            const p1Coords = p1.getProjected();
            const p2Coords = p2.getProjected();
            
            const dist = Math.sqrt((p1Coords.x - p2Coords.x)**2 + (p1Coords.y - p2Coords.y)**2);

            if (dist < connectionDistance) {
                const opacity = 1 - (dist / connectionDistance);
                ctx.beginPath();
                ctx.strokeStyle = resolvedTheme === 'dark' ? `rgba(34, 211, 238, ${opacity * 0.2})` : `rgba(15, 23, 42, ${opacity * 0.1})`;
                ctx.moveTo(p1Coords.x, p1Coords.y);
                ctx.lineTo(p2Coords.x, p2Coords.y);
                ctx.stroke();
            }
        }
    }

    // Update and draw particles
    particles.current.forEach(p => {
        p.update(width, height);
        const {x, y} = p.getProjected();
        const dx = x - mouse.current.x;
        const dy = y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.draw(ctx, width, height, dx, dy, dist);
    });

    ctx.restore();

    // Reset click state after one frame
    if (mouse.current.clicked) {
        mouse.current.clicked = false;
    }

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
    
    const handleClick = () => {
      mouse.current.clicked = true;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, [initCanvas, animate]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 bg-background" />;
};

export default InteractivePixelCanvas;



    

"use client";
import React, { useRef, useEffect, useCallback } from 'react';

const FloatingParticleConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: 0, y: 0, isDown: false });

  // --- Configuration ---
  const particleCount = 2000;
  const particleSpeed = 0.5;
  const connectionDistance = 100;
  const mouseInfluence = 150;
  const particleColor = 'rgba(34, 211, 238, 0.7)'; // Cyan
  const lineColor = 'rgba(34, 211, 238, 0.2)';

  const particles = useRef<any[]>([]);

  // --- Utility Functions ---
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

  // --- Classes ---
  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;

    constructor(x: number, y: number, width: number, height: number) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.vx = getRandom(-particleSpeed, particleSpeed);
      this.vy = getRandom(-particleSpeed, particleSpeed);
      this.radius = getRandom(1, 2.5);
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }

    update(width: number, height: number) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Mouse gravity
        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInfluence) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouseInfluence - dist) / mouseInfluence;
            this.vx -= forceDirectionX * force * 0.1;
            this.vy -= forceDirectionY * force * 0.1;
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
        particles.current.push(new Particle(0, 0, rect.width, rect.height));
    }
  }, [particleCount]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Draw lines
    for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
            const p1 = particles.current[i];
            const p2 = particles.current[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1 - dist / connectionDistance;
                ctx.stroke();
            }
        }
    }

    // Update and draw particles
    particles.current.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
    });


    animationFrameId.current = requestAnimationFrame(animate);
  }, [connectionDistance, lineColor]);

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
    
    const handleClick = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = 0; i < 50; i++) {
            particles.current.push(new Particle(clickX, clickY, rect.width, rect.height));
        }
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#0d0d2b]" />;
};

export default FloatingParticleConstellation;

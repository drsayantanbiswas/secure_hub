"use client";
import React, { useRef, useEffect, useCallback } from 'react';

const InteractivePixelCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef<any[]>([]);
  let lastMouseTime = useRef(Date.now());

  // --- Configuration ---
  const particleCount = 75; // Number of particles in the stream
  const particleLife = 60; // Frames a particle lives
  const particleSpeed = 2;
  const particleColors = ['#22d3ee', '#6366f1', '#a5f3fc', '#ede9fe']; // Teal, Indigo, Light Cyan
  const idleTimeout = 2000; // 2 seconds

  // --- Utility Functions ---
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
  const getRandomColor = () => particleColors[Math.floor(Math.random() * particleColors.length)];

  // --- Particle Class ---
  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    radius: number;
    char: string | null;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * particleSpeed + getRandom(-0.5, 0.5);
      this.vy = Math.sin(angle) * particleSpeed + getRandom(-0.5, 0.5);
      this.maxLife = particleLife;
      this.life = this.maxLife;
      this.color = getRandomColor();
      this.radius = getRandom(1, 2.5);
      this.char = Math.random() > 0.95 ? ['🛡', '🔒', '✓'][Math.floor(Math.random() * 3)] : null;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.globalAlpha = this.life / this.maxLife;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      if (this.char) {
        ctx.font = `${this.radius * 6}px sans-serif`;
        ctx.fillText(this.char, this.x, this.y);
      } else {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.closePath();
      ctx.globalAlpha = 1.0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Add slight magnetic curve
      this.vx += (mouse.current.x - this.x) * 0.0001;
      this.vy += (mouse.current.y - this.y) * 0.0002;
      
      this.vx *= 0.98; // damping
      this.vy *= 0.98;

      this.life--;
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
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    // Draw subtle dot grid
    const spacing = 30;
    ctx.fillStyle = 'rgba(128, 128, 128, 0.1)';
    for (let x = 0; x < canvas.width / dpr; x += spacing) {
        for (let y = 0; y < canvas.height / dpr; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }


    if(Date.now() - lastMouseTime.current < idleTimeout) {
      // Add new particles if moving
      for(let i=0; i<3; i++) {
          particles.current.push(new Particle(mouse.current.x, mouse.current.y));
      }
    } else {
        // Idle animation: form a shield
        const shieldCenterX = mouse.current.x;
        const shieldCenterY = mouse.current.y;
        const shieldRadius = 40;
        
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(shieldCenterX, shieldCenterY - shieldRadius);
        ctx.lineTo(shieldCenterX - shieldRadius, shieldCenterY - shieldRadius * 0.5);
        ctx.lineTo(shieldCenterX - shieldRadius, shieldCenterY + shieldRadius * 0.5);
        ctx.arcTo(shieldCenterX, shieldCenterY + shieldRadius * 1.2, shieldCenterX + shieldRadius, shieldCenterY + shieldRadius * 0.5, shieldRadius);
        ctx.lineTo(shieldCenterX + shieldRadius, shieldCenterY - shieldRadius * 0.5);
        ctx.closePath();
        ctx.stroke();

    }

    particles.current = particles.current.filter(p => p.life > 0);
    particles.current.forEach(p => {
        p.update();
        p.draw(ctx);
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

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
      lastMouseTime.current = Date.now();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if(e.touches.length > 0) {
            mouse.current.x = e.touches[0].clientX - rect.left;
            mouse.current.y = e.touches[0].clientY - rect.top;
            lastMouseTime.current = Date.now();
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

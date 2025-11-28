"use client";
import React, { useRef, useEffect, useCallback } from 'react';

const InteractivePixelCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const mouse = useRef({ x: -1000, y: -1000, isDown: false });

  const dotGrid = useRef<any[]>([]);
  const particles = useRef<any[]>([]);

  // --- Configuration ---
  const dotRadius = 1.5;
  const dotSpacing = 15;
  const trailSize = 15;
  const particleCount = 40;
  const fadeSpeed = 0.04;
  const rainbowColors = [
    '#ff0000', '#ff7f00', '#ffff00', '#00ff00', 
    '#0000ff', '#4b0082', '#8b00ff'
  ];

  // --- Utility Functions ---
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
  const getRandomColor = () => rainbowColors[Math.floor(Math.random() * rainbowColors.length)];

  // --- Classes ---
  class Dot {
    x: number;
    y: number;
    radius: number;
    originalRadius: number;
    color: string;
    targetColor: string;
    isActive: boolean;
    life: number;
    shape: 'circle' | 'star' | 'square' | 'heart';

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.radius = dotRadius;
      this.originalRadius = dotRadius;
      this.color = 'rgba(255, 255, 255, 0.2)';
      this.targetColor = 'rgba(255, 255, 255, 0.2)';
      this.isActive = false;
      this.life = 0;
      this.shape = 'circle';
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      
      const shapes: Array<() => void> = [
        () => { // Circle
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        },
        () => { // Square
            ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        },
        () => { // Star
            const spikes = 5;
            let rot = Math.PI / 2 * 3;
            let x = this.x;
            let y = this.y;
            let step = Math.PI / spikes;

            ctx.moveTo(this.x, this.y - this.radius)
            for (let i = 0; i < spikes; i++) {
                x = this.x + Math.cos(rot) * this.radius;
                y = this.y + Math.sin(rot) * this.radius;
                ctx.lineTo(x, y)
                rot += step

                x = this.x + Math.cos(rot) * (this.radius * 0.5);
                y = this.y + Math.sin(rot) * (this.radius * 0.5);
                ctx.lineTo(x, y)
                rot += step
            }
            ctx.lineTo(this.x, this.y - this.radius);
        }
      ];

      shapes[Math.floor(this.life * 100) % shapes.length]();

      ctx.fill();
      ctx.closePath();
    }

    update() {
      if (this.isActive) {
        this.life = Math.min(1, this.life + fadeSpeed * 2);
        this.radius = this.originalRadius + (Math.sin(this.life * Math.PI)) * 4;
        this.color = this.targetColor;
      } else if (this.life > 0) {
        this.life = Math.max(0, this.life - fadeSpeed);
        this.radius = this.originalRadius + (Math.sin(this.life * Math.PI)) * 4;
        if(this.life === 0) {
            this.radius = this.originalRadius;
        }
      }
      
      const targetOpacity = this.life;
      const currentColor = this.color.match(/(\d+(\.\d+)?)/g);
      
      if(currentColor && currentColor.length === 4) {
          const r = parseInt(currentColor[0]);
          const g = parseInt(currentColor[1]);
          const b = parseInt(currentColor[2]);
          this.color = `rgba(${r}, ${g}, ${b}, ${targetOpacity})`;
      } else if(this.life <= 0) {
        this.color = 'rgba(255, 255, 255, 0.2)';
      }
    }

    activate() {
      this.isActive = true;
      this.targetColor = getRandomColor();
    }

    deactivate() {
      this.isActive = false;
    }
  }
  
  class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      life: number;

      constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
          this.radius = getRandom(2, 6);
          this.color = getRandomColor();
          const angle = Math.random() * Math.PI * 2;
          const speed = getRandom(2, 6);
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.life = 1;
      }

      draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.slice(1).match(/.{1,2}/g)?.map(v => parseInt(v, 16)).join(',')}, ${this.life})`;
          ctx.fill();
          ctx.closePath();
      }

      update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.96;
          this.vy *= 0.96;
          this.life -= 0.02;
      }
  }

  const createBurst = useCallback((x: number, y: number) => {
    for (let i = 0; i < particleCount; i++) {
        particles.current.push(new Particle(x, y));
    }
  }, [particleCount]);

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
    
    dotGrid.current = [];
    for (let x = dotSpacing; x < rect.width; x += dotSpacing) {
      for (let y = dotSpacing; y < rect.height; y += dotSpacing) {
        dotGrid.current.push(new Dot(x, y));
      }
    }
  }, [dotSpacing]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    dotGrid.current.forEach(dot => {
        const dist = Math.hypot(dot.x - mouse.current.x, dot.y - mouse.current.y);
        if (dist < trailSize) {
            dot.activate();
        } else {
            dot.deactivate();
        }
        dot.update();
        dot.draw(ctx);
    });
    
    particles.current = particles.current.filter(p => p.life > 0);
    particles.current.forEach(p => {
        p.update();
        p.draw(ctx);
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [trailSize]);

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
      createBurst(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    const handleTouchStart = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length > 0) {
        createBurst(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [initCanvas, animate, createBurst]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 bg-background" />;
};

export default InteractivePixelCanvas;

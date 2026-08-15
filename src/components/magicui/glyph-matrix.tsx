"use client";

import React, { useEffect, useRef } from 'react';

export function GlyphMatrix({ 
  className = "", 
  opacity = 0.05, 
  color = "34, 211, 238" // Cyan by default
}: { 
  className?: string; 
  opacity?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&*><{}[]'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    // Initialize drops at random heights
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * (canvas.height / fontSize)));

    let animationFrameId: number;
    let lastDrawTime = 0;

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      // Throttle framerate for a slightly choppy, digital feel (approx 20fps)
      if (timestamp - lastDrawTime < 50) return;
      lastDrawTime = timestamp;

      // Dark background trail to create fading effect
      ctx.fillStyle = `rgba(1, 4, 15, 0.15)`; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Randomize brightness for the falling effect
        const alpha = (Math.random() * 0.5 + 0.5) * opacity;
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset to top randomly to keep the flow organic
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        
        // Drops fall down
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`} 
    />
  );
}

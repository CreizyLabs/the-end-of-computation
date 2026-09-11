'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  twinkleSpeed: number;
}

export function StarsCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const STAR_COUNT = 300;
    const stars: Star[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // depth factor
        size: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.15 + 0.05) * 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    let isVisible = true;
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < STAR_COUNT; i++) {
        const star = stars[i];

        // Gentle upward drift
        star.y -= star.speed * star.z;
        if (star.y < -5) {
          star.y = height + 5;
          star.x = Math.random() * width;
        }

        // Twinkle calculation
        star.phase += star.twinkleSpeed;
        const alpha = Math.max(
          0.1,
          Math.min(1.0, star.baseAlpha + Math.sin(star.phase) * 0.35)
        );

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);

        // Soft white with subtle cyan-diamond tint
        if (star.size > 1.4) {
          // Larger stars have subtle radial glow
          const grad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 2.5
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grad.addColorStop(0.4, `rgba(200, 240, 255, ${alpha * 0.6})`);
          grad.addColorStop(1, 'rgba(200, 240, 255, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(
            star.x - star.size * 2.5,
            star.y - star.size * 2.5,
            star.size * 5,
            star.size * 5
          );
        } else {
          ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block', background: 'transparent' }}
    />
  );
}

export default StarsCanvas;

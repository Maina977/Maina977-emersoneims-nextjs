'use client';

import React from 'react';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };
    const loop = () => {
      tx += (x - tx) * 0.15;
      ty += (y - ty) * 0.15;
      ring.style.transform = `translate(${tx}px, ${ty}px)`;
      requestAnimationFrame(loop);
    };

    const enter = (e: Event) => {
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(255, 191, 71, 0.9)';
    };
    const leave = (e: Event) => {
      ring.style.width = '26px'; ring.style.height = '26px';
      ring.style.borderColor = 'rgba(255, 191, 71, 0.6)';
    };

    document.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [data-magnet]').forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    loop();

    return () => {
      document.removeEventListener('mousemove', move);
      document.querySelectorAll('a, button, [data-magnet]').forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[1000] pointer-events-none"
        style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'rgba(255,215,0,0.95)', boxShadow: '0 0 12px rgba(255,215,0,0.6)',
          transform: 'translate(-100px,-100px)'
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[999] pointer-events-none"
        style={{
          width: 26, height: 26, borderRadius: '50%',
          border: '2px solid rgba(255,191,71,0.6)',
          boxShadow: '0 0 20px rgba(255,191,71,0.25) inset',
          transform: 'translate(-100px,-100px)'
        }}
      />
    </>
  );
}

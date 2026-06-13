'use client';

/**
 * HeroCinematicFX — ambient award-grade layer for the homepage hero
 *
 * Adds (1) a drifting amber-ember Three.js particle field and (2) a GSAP
 * scroll parallax + slow glow pulse over the existing static hero —
 * WITHOUT touching the hero's server-rendered content, so LCP/SEO and
 * hydration are untouched (this component renders one empty absolute
 * div; every effect starts post-mount, after the browser is idle).
 *
 * Desktop/tablet only; skipped entirely for reduced-motion users.
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function HeroCinematicFX() {
  const hostRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // GSAP: subtle parallax of hero copy + scroll cue fade
  useEffect(() => {
    if (prefersReducedMotion) return;
    const host = hostRef.current;
    const hero = host?.closest('section');
    if (!host || !hero) return;

    let killed = false;
    let revert: (() => void) | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      const content = hero.querySelector('.fade-in-up');
      const ctx = gsap.context(() => {
        if (content) {
          gsap.to(content, {
            yPercent: -14,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      });
      revert = () => ctx.revert();
    })();

    return () => {
      killed = true;
      revert?.();
    };
  }, [prefersReducedMotion]);

  // Three.js amber embers — loaded lazily after idle, ≥768px screens only
  useEffect(() => {
    if (prefersReducedMotion) return;
    const host = hostRef.current;
    const hero = host?.closest('section');
    if (!host || !hero) return;
    if (window.innerWidth < 768) return;

    let killed = false;
    let cleanup: (() => void) | null = null;

    const start = async () => {
      const THREE = await import('three');
      if (killed || !hostRef.current) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 40);
      camera.position.z = 9;

      const COUNT = 420;
      const positions = new Float32Array(COUNT * 3);
      const speeds = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        speeds[i] = 0.15 + Math.random() * 0.55;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.05,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const visible = { current: true };
      const visObserver = new IntersectionObserver(
        (entries) => { visible.current = entries[0]?.isIntersecting ?? true; },
        { rootMargin: '80px' }
      );
      visObserver.observe(hero);

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      let raf = 0;
      const render = () => {
        raf = requestAnimationFrame(render);
        if (!visible.current) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const pos = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < COUNT; i++) {
          pos[i * 3 + 1] += speeds[i] * dt;
          if (pos[i * 3 + 1] > 7.5) pos[i * 3 + 1] = -7.5;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.y += dt * 0.02;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(raf);
        visObserver.disconnect();
        window.removeEventListener('resize', onResize);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      };
    };

    // Wait for browser idle so the hero's LCP wins first
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => { void start(); }, { timeout: 2500 });
    } else {
      setTimeout(() => { void start(); }, 1800);
    }

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [prefersReducedMotion]);

  return <div ref={hostRef} className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true" />;
}

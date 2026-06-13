'use client';

/**
 * RingGallery — auto-rotating circular 3D project carousel (homepage)
 *
 * Sister piece to the About page SpiralGallery, in the same gold/black
 * visual language — but here the images GO ROUND: mounted on a circular
 * ring that rotates continuously and automatically. Scrolling and
 * pointer movement add subtle influence; captions follow whichever
 * frame is front-and-centre.
 *
 * Performance-first:
 *  - three.js is dynamically imported only when the section nears the
 *    viewport (zero cost to homepage first paint / LCP)
 *  - textures are 828px webp/avif via the Next image optimizer, never
 *    the raw multi-MB originals
 *  - rendering pauses whenever the section is off screen
 *  - falls back to a static editorial grid for reduced motion / no WebGL
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface RingGalleryItem {
  src: string;
  title: string;
  subtitle?: string;
}

interface RingGalleryProps {
  items: RingGalleryItem[];
  eyebrow?: string;
  heading?: string;
}

const PLANE_W = 3.4;
const PLANE_H = 2.26;
const AUTO_SPEED = 0.16; // rad/s — a fresh frame roughly every 2.8s
const textureUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;

export default function RingGallery({
  items,
  eyebrow = 'Proof in the Field — From Our Gallery',
  heading = 'Real Projects. All Around Kenya.',
}: RingGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [armed, setArmed] = useState(false); // true once section nears viewport
  const prefersReducedMotion = useReducedMotion();

  // Arm (and only then download three.js) when the section approaches
  useEffect(() => {
    if (prefersReducedMotion || armed) return;
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, armed]);

  useEffect(() => {
    if (!armed || prefersReducedMotion || webglFailed) return;
    const host = canvasHostRef.current;
    const section = sectionRef.current;
    if (!host || !section || items.length === 0) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !canvasHostRef.current) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        setWebglFailed(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const count = items.length;
      const angleStep = (Math.PI * 2) / count;
      // Ring radius sized so frames sit shoulder-to-shoulder with a gap
      const radius = ((PLANE_W + 0.7) * count) / (Math.PI * 2);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, radius + 2, radius * 2 + 9);

      const camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 80);
      const cameraZ = () => radius + 6.8 + Math.max(0, (1 - camera.aspect) * 7);
      camera.position.set(0, 1.7, cameraZ());

      const group = new THREE.Group();
      scene.add(group);

      // Gold ring guide — same spine language as the About spiral
      const ringPoints: import('three').Vector3[] = [];
      for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.05) {
        ringPoints.push(new THREE.Vector3(Math.sin(t) * (radius + 0.4), -1.55, Math.cos(t) * (radius + 0.4)));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35 });
      group.add(new THREE.Line(ringGeo, ringMat));

      const loader = new THREE.TextureLoader();
      const planeGeo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
      const frameGeo = new THREE.PlaneGeometry(PLANE_W + 0.12, PLANE_H + 0.12);
      const meshes: { material: import('three').MeshBasicMaterial; angle: number }[] = [];
      const disposables: { dispose: () => void }[] = [planeGeo, frameGeo, ringGeo, ringMat];

      items.forEach((item, i) => {
        const angle = i * angleStep;
        const material = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true });
        disposables.push(material);
        loader.load(textureUrl(item.src), (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          const planeAspect = PLANE_W / PLANE_H;
          const imgAspect = tex.image.width / tex.image.height;
          if (imgAspect > planeAspect) {
            tex.repeat.set(planeAspect / imgAspect, 1);
            tex.offset.set((1 - planeAspect / imgAspect) / 2, 0);
          } else {
            tex.repeat.set(1, imgAspect / planeAspect);
            tex.offset.set(0, (1 - imgAspect / planeAspect) / 2);
          }
          material.map = tex;
          material.color.set(0xffffff);
          material.needsUpdate = true;
          disposables.push(tex);
        });

        const frameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.32 });
        disposables.push(frameMat);
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(Math.sin(angle) * (radius - 0.015), 0, Math.cos(angle) * (radius - 0.015));
        frame.rotation.y = angle;
        group.add(frame);

        const mesh = new THREE.Mesh(planeGeo, material);
        mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
        mesh.rotation.y = angle;
        group.add(mesh);
        meshes.push({ material, angle });
      });

      const pointer = { x: 0, y: 0 };
      const state = { lastIndex: -1, scrollBoost: 0, lastScrollY: window.scrollY };
      const visible = { current: true };

      const onPointerMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      // Scrolling spins the ring a touch faster — no pinning, content flows
      const onScroll = () => {
        const dy = window.scrollY - state.lastScrollY;
        state.lastScrollY = window.scrollY;
        state.scrollBoost += dy * 0.0011;
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.position.z = cameraZ();
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', onResize);

      const visObserver = new IntersectionObserver(
        (entries) => { visible.current = entries[0]?.isIntersecting ?? true; },
        { rootMargin: '120px' }
      );
      visObserver.observe(section);

      const clock = new THREE.Clock();
      let rotation = 0;
      let raf = 0;
      const render = () => {
        raf = requestAnimationFrame(render);
        if (!visible.current) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        state.scrollBoost *= 0.94; // decay the scroll impulse
        rotation += dt * AUTO_SPEED + state.scrollBoost * dt * 18;
        group.rotation.y = -rotation;

        camera.position.x += (pointer.x * 1.0 - camera.position.x) * 0.04;
        camera.position.y += (1.7 + -pointer.y * 0.55 - camera.position.y) * 0.04;
        camera.lookAt(0, -0.15, 0);

        // Which frame faces the camera right now?
        const TAU = Math.PI * 2;
        const norm = ((rotation % TAU) + TAU) % TAU;
        const idx = Math.round(norm / angleStep) % count;
        if (idx !== state.lastIndex) {
          state.lastIndex = idx;
          setActiveIndex(idx);
        }

        meshes.forEach(({ material, angle }) => {
          const worldAngle = (((angle - rotation) % TAU) + TAU) % TAU;
          const distFromFront = Math.min(worldAngle, TAU - worldAngle);
          material.opacity = Math.min(1, Math.max(0.3, 1.15 - distFromFront * 0.42));
        });

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(raf);
        visObserver.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [armed, prefersReducedMotion, webglFailed, items]);

  // ——— Fallback: static editorial grid ———
  if (prefersReducedMotion || webglFailed) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.35em] uppercase text-amber-400/80 text-center mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">{heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.slice(0, 8).map((item) => (
              <figure key={item.src} className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10">
                <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-xs text-white">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="inline-block px-8 py-4 border border-amber-400/60 text-amber-300 font-bold rounded-full hover:bg-amber-400/10 transition-all">
              View Full Project Gallery →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const active = items[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden h-[100svh] min-h-[620px] content-auto"
      aria-label={heading}
    >
      {/* Canvas host */}
      <div ref={canvasHostRef} className="absolute inset-0" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.88)_100%)]" />

      {/* Heading */}
      <div className="pointer-events-none absolute inset-x-0 top-0 pt-16 md:pt-20 text-center px-4">
        <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-amber-400/90 mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">{heading}</h2>
      </div>

      {/* Live caption + gallery CTA */}
      <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14 text-center px-4">
        <div key={activeIndex} className="ring-caption-in pointer-events-none">
          <p className="text-lg md:text-2xl font-semibold text-white">{active?.title}</p>
          {active?.subtitle && (
            <p className="text-sm md:text-base text-amber-300/90 mt-1 tracking-wide">{active.subtitle}</p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 pointer-events-none">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-7 bg-amber-400' : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>
        <Link
          href="/gallery"
          className="mt-6 inline-block px-7 py-3 border border-amber-400/60 text-amber-300 text-sm font-bold rounded-full hover:bg-amber-400/10 transition-all"
        >
          View Full Project Gallery →
        </Link>
      </div>

      <style>{`
        @keyframes ringCaptionIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ring-caption-in { animation: ringCaptionIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>
    </section>
  );
}

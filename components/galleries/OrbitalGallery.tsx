'use client';

/**
 * OrbitalGallery — "rotate like the universe" 3D showcase
 *
 * Project images are mounted on several tilted elliptical orbits and
 * revolve around a glowing core like planets in a galaxy: different
 * radii, inclinations and speeds, all turning automatically. Pointer
 * movement tilts the whole system; the frame nearest the camera is
 * spotlit and its caption shown.
 *
 * Same engineering rules as the rest of the gallery system
 * (see [[webgl-gallery-system]]): three.js is dynamically imported only
 * when the section nears the viewport, textures are 828px webp/avif via
 * the Next image optimizer, rendering pauses off-screen, and it falls
 * back to a static grid for reduced-motion / no-WebGL.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface OrbitalItem {
  src: string;
  title: string;
  subtitle?: string;
}

interface OrbitalGalleryProps {
  items: OrbitalItem[];
  eyebrow?: string;
  heading?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const PLANE_W = 3.0;
const PLANE_H = 2.0;
const textureUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;

export default function OrbitalGallery({
  items,
  eyebrow = 'Every Service We Deliver',
  heading = 'One Universe of Engineering',
  ctaHref = '/services',
  ctaLabel = 'Explore All Services',
}: OrbitalGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [armed, setArmed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || armed) return;
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') { setArmed(true); return; }
    const obs = new IntersectionObserver((e) => {
      if (e[0]?.isIntersecting) { setArmed(true); obs.disconnect(); }
    }, { rootMargin: '600px' });
    obs.observe(section);
    return () => obs.disconnect();
  }, [prefersReducedMotion, armed]);

  useEffect(() => {
    if (!armed || prefersReducedMotion || webglFailed) return;
    const host = hostRef.current;
    const section = sectionRef.current;
    if (!host || !section || items.length === 0) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !hostRef.current) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch { setWebglFailed(true); return; }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Softer/pushed-back fog so orbiting images stay clear far longer instead
      // of fading to black on the back of their orbit.
      scene.fog = new THREE.Fog(0x000000, 22, 52);

      const camera = new THREE.PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 100);
      const camZ = () => 15 + Math.max(0, (1 - camera.aspect) * 9);
      camera.position.set(0, 3.5, camZ());

      const system = new THREE.Group();
      scene.add(system);

      // Glowing core (the "sun") — kept smaller and softer so it never washes
      // out images that orbit across the centre of the view.
      const coreMat = new THREE.SpriteMaterial({
        color: 0xfbbf24, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Sprite(coreMat);
      core.scale.set(2.6, 2.6, 1);
      system.add(core);
      const coreGlowMat = new THREE.SpriteMaterial({ color: 0xff8c2a, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending });
      const coreGlow = new THREE.Sprite(coreGlowMat);
      coreGlow.scale.set(5.5, 5.5, 1);
      system.add(coreGlow);

      // Star field
      const starCount = 700;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 20 + Math.random() * 20;
        const t = Math.random() * Math.PI * 2;
        const p = (Math.random() - 0.5) * Math.PI;
        starPos[i*3] = Math.cos(t) * Math.cos(p) * r;
        starPos[i*3+1] = Math.sin(p) * r * 0.6;
        starPos[i*3+2] = Math.sin(t) * Math.cos(p) * r;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.5, depthWrite: false });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      const loader = new THREE.TextureLoader();
      const planeGeo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
      const frameGeo = new THREE.PlaneGeometry(PLANE_W + 0.1, PLANE_H + 0.1);
      const disposables: { dispose: () => void }[] = [planeGeo, frameGeo, starGeo, starMat, coreMat, coreGlowMat];

      // Distribute items across 3 tilted orbits
      const orbitDefs = [
        { radius: 6.5, tilt: 0.18, speed: 0.22, y: 0 },
        { radius: 9.5, tilt: -0.32, speed: 0.15, y: 0.6 },
        { radius: 12.5, tilt: 0.45, speed: 0.1, y: -0.8 },
      ];
      // draw faint orbit rings
      orbitDefs.forEach((o) => {
        const pts: import('three').Vector3[] = [];
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.06) {
          pts.push(new THREE.Vector3(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius));
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const m = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.12 });
        const line = new THREE.Line(g, m);
        line.rotation.x = o.tilt;
        line.position.y = o.y;
        system.add(line);
        disposables.push(g, m);
      });

      const bodies: { pivot: import('three').Group; material: import('three').MeshBasicMaterial; speed: number; orbitIndex: number }[] = [];

      items.forEach((item, i) => {
        const o = orbitDefs[i % orbitDefs.length];
        const startAngle = (i / items.length) * Math.PI * 2 + (i % orbitDefs.length) * 0.7;

        const pivot = new THREE.Group();
        pivot.rotation.x = o.tilt;
        pivot.position.y = o.y;
        pivot.rotation.y = startAngle;
        system.add(pivot);

        const material = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, side: THREE.DoubleSide });
        disposables.push(material);
        loader.load(textureUrl(item.src), (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          const pa = PLANE_W / PLANE_H, ia = tex.image.width / tex.image.height;
          if (ia > pa) { tex.repeat.set(pa/ia, 1); tex.offset.set((1-pa/ia)/2, 0); }
          else { tex.repeat.set(1, ia/pa); tex.offset.set(0, (1-ia/pa)/2); }
          material.map = tex; material.color.set(0xffffff); material.needsUpdate = true;
          disposables.push(tex);
        });

        const frameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
        disposables.push(frameMat);
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(o.radius, 0, 0.01);
        pivot.add(frame);

        const mesh = new THREE.Mesh(planeGeo, material);
        mesh.position.set(o.radius, 0, 0);
        pivot.add(mesh);

        bodies.push({ pivot, material, speed: o.speed, orbitIndex: i % orbitDefs.length });
      });

      const pointer = { x: 0, y: 0 };
      const state = { lastIndex: -1 };
      const visible = { current: true };

      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onPointer, { passive: true });

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.position.z = camZ();
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', onResize);

      const visObs = new IntersectionObserver((e) => { visible.current = e[0]?.isIntersecting ?? true; }, { rootMargin: '120px' });
      visObs.observe(section);

      const clock = new THREE.Clock();
      let raf = 0;
      const tmp = new THREE.Vector3();
      const render = () => {
        raf = requestAnimationFrame(render);
        if (!visible.current) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        bodies.forEach((b) => { b.pivot.rotation.y += dt * b.speed; });
        system.rotation.y += dt * 0.03;
        stars.rotation.y += dt * 0.01;
        coreGlow.material.opacity = 0.16 + Math.sin(t * 1.5) * 0.05;

        // gentle whole-system tilt from pointer
        system.rotation.z += ((pointer.x * 0.12) - system.rotation.z) * 0.04;
        camera.position.y += ((3.5 - pointer.y * 1.5) - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        // find frame nearest camera + face-camera billboard-ish + spotlight
        let nearest = -1, nearestDist = Infinity;
        bodies.forEach((b, idx) => {
          const mesh = b.pivot.children[b.pivot.children.length - 1];
          mesh.getWorldPosition(tmp);
          const d = tmp.distanceTo(camera.position);
          // softly turn each image toward the camera
          const frame = b.pivot.children[b.pivot.children.length - 2];
          mesh.lookAt(camera.position);
          (frame as import('three').Mesh).lookAt(camera.position);
          if (d < nearestDist) { nearestDist = d; nearest = idx; }
          // Gentler depth fade with a higher floor so EVERY image stays clearly
          // visible as it orbits (was fading to 0.3 and disappearing).
          const op = THREE.MathUtils.clamp(1.3 - (d - (camZ() - 12)) * 0.03, 0.72, 1);
          b.material.opacity = op;
        });
        if (nearest !== state.lastIndex && nearest >= 0) {
          state.lastIndex = nearest; setActiveIndex(nearest);
        }

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(raf);
        visObs.disconnect();
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('resize', onResize);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, [armed, prefersReducedMotion, webglFailed, items]);

  // Fallback grid
  if (prefersReducedMotion || webglFailed) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.35em] uppercase text-amber-400/80 text-center mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">{heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((it) => (
              <figure key={it.src} className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10">
                <Image src={it.src} alt={it.title} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-xs text-white">{it.title}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={ctaHref} className="inline-block px-8 py-4 border border-amber-400/60 text-amber-300 font-bold rounded-full hover:bg-amber-400/10 transition-all">{ctaLabel} →</Link>
          </div>
        </div>
      </section>
    );
  }

  const active = items[activeIndex];

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden h-[100svh] min-h-[640px] content-auto" aria-label={heading}>
      <div ref={hostRef} className="absolute inset-0" />
      {/* Lighter edge vignette so images near the orbit edges stay visible
          (was a near-opaque 90% black ring that swallowed peripheral images). */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(0,0,0,0.55)_100%)]" />
      {/* Slim scrims only behind the headline and caption keep text legible
          without darkening the middle band where the images orbit. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 pt-16 md:pt-20 text-center px-4">
        <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-amber-400/90 mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">{heading}</h2>
      </div>

      <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14 text-center px-4">
        <div key={activeIndex} className="orbital-cap pointer-events-none">
          <p className="text-lg md:text-2xl font-semibold text-white">{active?.title}</p>
          {active?.subtitle && <p className="text-sm md:text-base text-amber-300/90 mt-1 tracking-wide">{active.subtitle}</p>}
        </div>
        <Link href={ctaHref} className="mt-6 inline-block px-7 py-3 border border-amber-400/60 text-amber-300 text-sm font-bold rounded-full hover:bg-amber-400/10 transition-all">{ctaLabel} →</Link>
      </div>

      <style>{`
        @keyframes orbitalCap { from { opacity:0; transform:translateY(12px);} to {opacity:1; transform:translateY(0);} }
        .orbital-cap { animation: orbitalCap 0.5s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </section>
  );
}

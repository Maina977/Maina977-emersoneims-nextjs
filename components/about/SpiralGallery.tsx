'use client';

/**
 * SpiralGallery — Awwwards-style 3D helix image gallery
 *
 * Project photographs are mounted on planes arranged in a descending
 * spiral (helix) around the Y axis. Scrolling scrubs the helix rotation
 * + elevation with GSAP ScrollTrigger so each image sweeps through the
 * camera's focal point, pacomepertant.com style. Pointer movement adds
 * a subtle camera parallax. Pure three.js (no R3F) for tight control
 * and guaranteed cleanup.
 *
 * Falls back to a static editorial grid when WebGL is unavailable or
 * the visitor prefers reduced motion.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SpiralGalleryItem {
  src: string;
  title: string;
  subtitle?: string;
}

interface SpiralGalleryProps {
  items: SpiralGalleryItem[];
  /** Section heading rendered above the canvas */
  heading?: string;
  eyebrow?: string;
  reducedMotion?: boolean;
}

const RADIUS = 6;
const ANGLE_STEP = (Math.PI * 2) / 9; // 40° between frames — several visible per turn
const Y_SPACING = 1.5;
const PLANE_W = 3.6;
const PLANE_H = 2.4;
const AUTO_TOUR_SECONDS = 20; // full automatic sweep through every image

/**
 * GPU-friendly texture URL — serves an 828px webp/avif through the Next.js
 * image optimizer instead of the raw multi-MB original. Critical for
 * keeping the galleries fast on every device.
 */
const textureUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;

export default function SpiralGallery({
  items,
  heading = 'Our Work in Pictures',
  eyebrow = 'Field Proof — Across Kenya',
  reducedMotion = false,
}: SpiralGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (reducedMotion || webglFailed) return;
    const host = canvasHostRef.current;
    const section = sectionRef.current;
    if (!host || !section || items.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 12, 26);

    const camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 60);
    // Raised + pulled back so the helix visibly winds downward through frame;
    // portrait screens push the camera further out so the spiral stays in view
    const cameraZ = () => RADIUS + 6.5 + Math.max(0, (1 - camera.aspect) * 7);
    camera.position.set(0, 2, cameraZ());

    const group = new THREE.Group();
    scene.add(group);

    // Gold helix guide line — the spiral's "spine"
    const helixPoints: THREE.Vector3[] = [];
    const totalAngle = (items.length + 2) * ANGLE_STEP;
    for (let t = -ANGLE_STEP * 1.5; t <= totalAngle; t += 0.08) {
      helixPoints.push(
        new THREE.Vector3(Math.sin(t) * (RADIUS + 0.45), -(t / ANGLE_STEP) * Y_SPACING, Math.cos(t) * (RADIUS + 0.45))
      );
    }
    const helixGeo = new THREE.BufferGeometry().setFromPoints(helixPoints);
    const helixMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4 });
    const helixLine = new THREE.Line(helixGeo, helixMat);
    group.add(helixLine);

    const loader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    const frameGeo = new THREE.PlaneGeometry(PLANE_W + 0.12, PLANE_H + 0.12);
    const meshes: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; angle: number }[] = [];
    const disposables: { dispose: () => void }[] = [planeGeo, frameGeo, helixGeo, helixMat];

    items.forEach((item, i) => {
      const angle = i * ANGLE_STEP;
      const material = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true });
      disposables.push(material);
      loader.load(textureUrl(item.src), (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        // cover-fit the texture inside the 3:2 plane
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

      const frameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35 });
      disposables.push(frameMat);
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(Math.sin(angle) * (RADIUS - 0.015), -i * Y_SPACING, Math.cos(angle) * (RADIUS - 0.015));
      frame.rotation.y = angle;
      group.add(frame);

      const mesh = new THREE.Mesh(planeGeo, material);
      mesh.position.set(Math.sin(angle) * RADIUS, -i * Y_SPACING, Math.cos(angle) * RADIUS);
      mesh.rotation.y = angle;
      group.add(mesh);
      meshes.push({ mesh, material, angle });
    });

    // The spiral tours automatically (ping-pong sweep through every frame);
    // scrolling layers extra rotation on top. rAF lerps for silk.
    const state = { progress: 0, scroll: 0, lastIndex: -1 };
    const pointer = { x: 0, y: 0 };
    const visible = { current: true };
    const maxIndex = items.length - 1;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        state.scroll = self.progress;
      },
    });

    // Render only while on screen — keeps the rest of the site lag-free
    const visObserver = new IntersectionObserver(
      (entries) => { visible.current = entries[0]?.isIntersecting ?? true; },
      { rootMargin: '120px' }
    );
    visObserver.observe(section);

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.position.z = cameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible.current) return;

      // Automatic ping-pong tour through all frames + scroll influence
      const t = clock.getElapsedTime();
      const autoP = (1 - Math.cos((t * Math.PI * 2) / AUTO_TOUR_SECONDS)) / 2;
      const target = Math.min(1, Math.max(0, autoP * 0.75 + state.scroll * 0.45));
      state.progress += (target - state.progress) * 0.06;
      const p = state.progress;

      const idx = Math.min(maxIndex, Math.round(p * maxIndex));
      if (idx !== state.lastIndex) {
        state.lastIndex = idx;
        setActiveIndex(idx);
      }

      group.rotation.y = -p * maxIndex * ANGLE_STEP;
      group.position.y = p * maxIndex * Y_SPACING;

      camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.04;
      camera.position.y += (2 + -pointer.y * 0.7 - camera.position.y) * 0.04;
      camera.lookAt(0, -0.6, 0);

      // Spotlight the frame closest to the camera, gently dim the rest so
      // the winding spiral of images stays visible all around
      meshes.forEach(({ material, angle }) => {
        const worldAngle = ((angle + group.rotation.y) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const distFromFront = Math.min(worldAngle, Math.PI * 2 - worldAngle);
        material.opacity = THREE.MathUtils.clamp(1.15 - distFromFront * 0.3, 0.35, 1);
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      visObserver.disconnect();
      trigger.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, [items, reducedMotion, webglFailed]);

  // ——— Fallback: editorial grid (reduced motion / no WebGL) ———
  if (reducedMotion || webglFailed) {
    return (
      <section className="py-24 bg-black">
        <div className="eims-shell py-0">
          <p className="text-xs tracking-[0.35em] uppercase text-amber-400/80 text-center mb-4">{eyebrow}</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-14">{heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <figure key={item.src} className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10">
                <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-sm text-white">
                  {item.title}
                  {item.subtitle && <span className="block text-xs text-gray-400">{item.subtitle}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const active = items[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${Math.max(items.length * 30, 220)}vh` }}
      aria-label={heading}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Canvas host */}
        <div ref={canvasHostRef} className="absolute inset-0" />

        {/* Vignette + heading overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-0 pt-20 md:pt-24 text-center px-4">
          <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-amber-400/90 mb-3">{eyebrow}</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none">
            {heading}
          </h2>
        </div>

        {/* Live caption for the frame in focus */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-12 md:pb-16 text-center px-4">
          <div key={activeIndex} className="spiral-caption-in">
            <p className="text-xl md:text-3xl font-semibold text-white">{active?.title}</p>
            {active?.subtitle && (
              <p className="text-sm md:text-base text-amber-300/90 mt-1 tracking-wide">{active.subtitle}</p>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === activeIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/25'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-[10px] tracking-[0.35em] uppercase text-white/40">Scroll to rotate</p>
        </div>

        <style>{`
          @keyframes spiralCaptionIn {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .spiral-caption-in { animation: spiralCaptionIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        `}</style>
      </div>
    </section>
  );
}

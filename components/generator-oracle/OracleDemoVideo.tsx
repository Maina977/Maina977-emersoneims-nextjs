'use client';

/**
 * Oracle Demo Video - Cinematic Animated Preview
 * Hollywood-style color grading with teal/orange cinema look
 * Showcases Generator Oracle features in an engaging way
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 */

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

// Demo sequence scenes
const DEMO_SCENES = [
  {
    id: 'intro',
    title: 'GENERATOR ORACLE',
    subtitle: 'Professional Diagnostic System',
    duration: 3000,
  },
  {
    id: 'search',
    title: 'INSTANT FAULT LOOKUP',
    subtitle: 'manufacturer-curated fault codes at your fingertips',
    duration: 4000,
  },
  {
    id: 'diagnosis',
    title: 'REAL-TIME DIAGNOSTICS',
    subtitle: 'Aircraft-grade instrument panels',
    duration: 4000,
  },
  {
    id: 'reset',
    title: 'STEP-BY-STEP RESET',
    subtitle: 'Clear errors like a pro technician',
    duration: 4000,
  },
  {
    id: 'brands',
    title: 'COMPATIBLE WITH 10 CONTROLLER TYPES',
    subtitle: 'Works with DSE • ComAp • Woodward • SmartGen • PowerWizard • Datakom • Lovato • Siemens • ENKO • VODIA',
    duration: 4000,
  },
  {
    id: 'offline',
    title: 'WORKS OFFLINE',
    subtitle: 'Install as app • No internet required',
    duration: 3500,
  },
  {
    id: 'cta',
    title: 'TRY FREE NOW',
    subtitle: 'Full access until April 2026',
    duration: 4000,
  },
];

// Simulated gauge component
function AnimatedGauge({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  const percentage = (value / max) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius * 0.75;
  const offset = circumference * (1 - percentage / 100);

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="relative w-24 h-24"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <m.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <m.span
          className="text-lg font-mono font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {value}
        </m.span>
      </div>
    </m.div>
  );
}

// Simulated fault code result
function FaultCodeResult({ code, title, severity, delay }: { code: string; title: string; severity: string; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-lg border border-cyan-500/30"
    >
      <span className="px-2 py-1 bg-cyan-500/20 rounded font-mono text-cyan-400 text-sm">{code}</span>
      <span className="text-white text-sm flex-1 truncate">{title}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
        severity === 'critical' ? 'bg-red-500/30 text-red-400' : 'bg-amber-500/30 text-amber-400'
      }`}>
        {severity.toUpperCase()}
      </span>
    </m.div>
  );
}

// Reset step component
function ResetStep({ step, text, delay, active }: { step: number; text: string; delay: number; active: boolean }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`flex items-center gap-3 p-2 rounded-lg ${active ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-900/50'}`}
    >
      <m.div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
          active ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
        }`}
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: active ? Infinity : 0, repeatDelay: 1 }}
      >
        {step}
      </m.div>
      <span className={`text-sm ${active ? 'text-cyan-300' : 'text-slate-400'}`}>{text}</span>
    </m.div>
  );
}

// Main Demo Video Component
function OracleDemoVideoInner({ autoPlay = true }: { autoPlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance scenes
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setTimeout(() => {
        setCurrentScene((prev) => {
          if (prev >= DEMO_SCENES.length - 1) {
            // Loop back to start
            return 0;
          }
          return prev + 1;
        });
      }, DEMO_SCENES[currentScene].duration);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentScene]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false);
        setIsPlaying(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const handlePlay = () => {
    setShowOverlay(false);
    setIsPlaying(true);
    setCurrentScene(0);
  };

  const scene = DEMO_SCENES[currentScene];

  return (
    <div className="relative w-full aspect-video max-w-2xl mx-auto overflow-hidden rounded-2xl">
      {/* Cinematic background with Hollywood color grading */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a0f1a]">
        {/* Teal/Orange cinema grade overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/10 via-transparent to-cyan-900/20" />

        {/* Film grain effect */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

        {/* Animated light beams */}
        <m.div
          className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-cyan-500/5 via-cyan-500/10 to-transparent"
          animate={{ x: [-50, 50], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'skewX(-15deg)' }}
        />
        <m.div
          className="absolute top-0 right-1/4 w-24 h-full bg-gradient-to-b from-orange-500/5 via-orange-500/8 to-transparent"
          animate={{ x: [50, -50], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ transform: 'skewX(15deg)' }}
        />
      </div>

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-20" />

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <m.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          {/* Intro Scene */}
          {scene.id === 'intro' && (
            <div className="text-center">
              <m.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 60px rgba(6,182,212,0.5)' }}
              >
                <span className="text-4xl">⚡</span>
              </m.div>
              <m.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2"
              >
                {scene.title}
              </m.h2>
              <m.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-slate-400"
              >
                {scene.subtitle}
              </m.p>
            </div>
          )}

          {/* Search Scene */}
          {scene.id === 'search' && (
            <div className="w-full max-w-md space-y-4">
              <m.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-xl border border-cyan-500/30"
              >
                <span className="text-cyan-500">🔍</span>
                <m.span
                  className="text-cyan-300 font-mono"
                  initial={{ width: 0 }}
                  animate={{ width: 'auto' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  over speed...
                </m.span>
                <m.div
                  className="w-0.5 h-5 bg-cyan-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </m.div>

              <div className="space-y-2">
                <FaultCodeResult code="E1234" title="Over Speed Shutdown" severity="critical" delay={1.2} />
                <FaultCodeResult code="W2045" title="Over Speed Warning" severity="warning" delay={1.5} />
                <FaultCodeResult code="E1235" title="Over Speed Trip" severity="critical" delay={1.8} />
              </div>

              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="text-center text-sm text-cyan-400"
              >
                {scene.subtitle}
              </m.p>
            </div>
          )}

          {/* Diagnosis Scene */}
          {scene.id === 'diagnosis' && (
            <div className="w-full">
              <m.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center text-lg font-bold text-cyan-400 mb-6"
              >
                {scene.title}
              </m.h3>

              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <AnimatedGauge value={1500} max={2000} color="#f59e0b" delay={0.2} />
                  <span className="text-xs text-slate-500 mt-1 block">RPM</span>
                </div>
                <div className="text-center">
                  <AnimatedGauge value={45} max={100} color="#22c55e" delay={0.4} />
                  <span className="text-xs text-slate-500 mt-1 block">OIL PSI</span>
                </div>
                <div className="text-center">
                  <AnimatedGauge value={85} max={120} color="#06b6d4" delay={0.6} />
                  <span className="text-xs text-slate-500 mt-1 block">COOLANT</span>
                </div>
                <div className="text-center">
                  <AnimatedGauge value={72} max={100} color="#a855f7" delay={0.8} />
                  <span className="text-xs text-slate-500 mt-1 block">LOAD %</span>
                </div>
              </div>

              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center text-sm text-slate-400"
              >
                {scene.subtitle}
              </m.p>
            </div>
          )}

          {/* Reset Scene */}
          {scene.id === 'reset' && (
            <div className="w-full max-w-sm space-y-3">
              <m.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center text-lg font-bold text-green-400 mb-4"
              >
                🔄 {scene.title}
              </m.h3>

              <ResetStep step={1} text="Press STOP button" delay={0.3} active={false} />
              <ResetStep step={2} text="Wait 30 seconds" delay={0.6} active={false} />
              <ResetStep step={3} text="Press RESET" delay={0.9} active={true} />
              <ResetStep step={4} text="Verify fault cleared" delay={1.2} active={false} />

              <m.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center pt-2"
              >
                <span className="text-2xl">✅</span>
                <p className="text-green-400 text-sm mt-1">Fault Cleared!</p>
              </m.div>
            </div>
          )}

          {/* Brands Scene */}
          {scene.id === 'brands' && (
            <div className="text-center">
              <m.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold text-white mb-6"
              >
                {scene.title}
              </m.h3>

              <div className="flex justify-center gap-4">
                {['⚡', '🔴', '🟢', '🟣', '🟡'].map((icon, idx) => (
                  <m.div
                    key={idx}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.15, type: 'spring' }}
                    className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl"
                    style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                  >
                    {icon}
                  </m.div>
                ))}
              </div>

              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-sm text-slate-400 mt-4"
              >
                {scene.subtitle}
              </m.p>
            </div>
          )}

          {/* Offline Scene */}
          {scene.id === 'offline' && (
            <div className="text-center">
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-6xl mb-4"
              >
                📴
              </m.div>
              <m.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white mb-2"
              >
                {scene.title}
              </m.h3>
              <m.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400"
              >
                {scene.subtitle}
              </m.p>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center gap-4 mt-6"
              >
                {['📱', '💻', '🖥️'].map((device, idx) => (
                  <m.span
                    key={idx}
                    className="text-3xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  >
                    {device}
                  </m.span>
                ))}
              </m.div>
            </div>
          )}

          {/* CTA Scene */}
          {scene.id === 'cta' && (
            <div className="text-center">
              <m.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <span className="text-5xl">🎉</span>
              </m.div>

              <m.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-green-400 mb-2"
              >
                {scene.title}
              </m.h3>

              <m.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 mb-6"
              >
                {scene.subtitle}
              </m.p>

              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <a
                  href="/generator-oracle"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                  style={{ boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
                >
                  Launch Oracle →
                </a>
              </m.div>
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {/* Progress bar */}
      {isPlaying && (
        <div className="absolute bottom-8 left-8 right-8 z-30">
          <div className="flex gap-1">
            {DEMO_SCENES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full overflow-hidden ${
                  idx <= currentScene ? 'bg-cyan-500/30' : 'bg-slate-700/30'
                }`}
              >
                {idx === currentScene && (
                  <m.div
                    className="h-full bg-cyan-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: DEMO_SCENES[currentScene].duration / 1000, ease: 'linear' }}
                    style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
                  />
                )}
                {idx < currentScene && <div className="h-full w-full bg-cyan-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Play overlay */}
      <AnimatePresence>
        {showOverlay && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <m.button
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
              style={{ boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
            >
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </m.button>
            <m.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-1/3 text-white font-medium"
            >
              Watch Demo
            </m.span>
          </m.div>
        )}
      </AnimatePresence>

      {/* Corner branding */}
      <div className="absolute top-8 left-4 z-30 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <span className="text-xs">⚡</span>
        </div>
        <span className="text-xs text-slate-400 font-medium tracking-wider">GENERATOR ORACLE</span>
      </div>

      {/* Time indicator */}
      <div className="absolute top-8 right-4 z-30 text-xs text-slate-500 font-mono">
        {String(Math.floor((currentScene + 1) / 60)).padStart(2, '0')}:{String((currentScene + 1) % 60).padStart(2, '0')} / 00:28
      </div>
    </div>
  );
}

/*
 * LIGHT ANIMATION MODE — 2026-09-11, for mobile speed.
 *
 * `motion.*` pulls in framer-motion's whole engine, including drag and
 * layout-projection code this component never uses. Every homepage section
 * did this, and because sections pre-mount within 200px of the viewport, the
 * first one below the hero dragged that engine onto every phone's first load.
 * `m.*` inside LazyMotion with `domAnimation` keeps every animation used here
 * (enter/exit, variants, hover, tap, whileInView) and drops the rest. Features
 * are synchronous so no animation can be missed while code is still loading.
 * The component body is unchanged — renamed OracleDemoVideoInner and wrapped here.
 */
export default function OracleDemoVideo(props: Parameters<typeof OracleDemoVideoInner>[0]) {
  return (
    <LazyMotion features={domAnimation}>
      <OracleDemoVideoInner {...props} />
    </LazyMotion>
  );
}

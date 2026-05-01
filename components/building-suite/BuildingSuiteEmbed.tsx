'use client';

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from 'react';

function normalizeBase(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/** Focused feature policy (avoid huge wildcard lists on every frame tick). */
const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; microphone; payment *';

function BuildingSuiteEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const src = useMemo(() => {
    const raw =
      process.env.NEXT_PUBLIC_EIMS_BUILDING_SUITE_URL ||
      'http://127.0.0.1:5000';
    return `${normalizeBase(raw)}/`;
  }, []);

  const onFrameLoad = useCallback(() => {
    startTransition(() => setLoaded(true));
  }, []);

  const onFrameError = useCallback(() => {
    startTransition(() =>
      setLoadError(
        'Iframe failed to load. Check Flask is running and CSP allows this origin.',
      ),
    );
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!loaded) {
        setLoadError(
          'Still loading… If this stays blank, start the Flask suite (port 5000) ' +
            'and restart Next after setting NEXT_PUBLIC_EIMS_BUILDING_SUITE_URL.',
        );
      }
    }, 10000);
    return () => window.clearTimeout(t);
  }, [loaded]);

  return (
    <div className="relative w-full bg-slate-950" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="absolute right-3 top-3 z-20 flex flex-wrap items-center justify-end gap-2">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-cyan-300 underline-offset-2 hover:text-cyan-100 hover:underline"
        >
          Open suite in new tab
        </a>
      </div>
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <div
            className="h-10 w-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"
            style={{ animationDuration: '0.75s' }}
          />
          <h1 className="mt-5 text-lg font-semibold text-white sm:text-xl">
            EIMS PRO
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Connecting to your suite (default{' '}
            <span className="font-mono text-slate-300">http://127.0.0.1:5000</span> when
            env is unset)…
          </p>
          {loadError && (
            <p className="mt-4 max-w-lg text-xs text-amber-200/90">{loadError}</p>
          )}
        </div>
      )}
      <iframe
        title="EIMS PRO workspace"
        src={src}
        className="w-full border-0 bg-white"
        style={{
          minHeight: 'calc(100vh - 4rem)',
          height: 'calc(100vh - 4rem)',
          opacity: loaded ? 1 : 0.01,
        }}
        onLoad={onFrameLoad}
        onError={onFrameError}
        allow={IFRAME_ALLOW}
        referrerPolicy="strict-origin-when-cross-origin"
        loading="eager"
      />
    </div>
  );
}

export default memo(BuildingSuiteEmbed);

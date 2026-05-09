'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { RGBELoader } from 'three-stdlib';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';

type HdriEnvironmentProps = {
	primaryUrl?: string;
	fallbackUrl?: string;
	resolution?: number;
};

function ProceduralEnvironment({ resolution = 64 }: { resolution?: number }) {
	return (
		<Environment resolution={resolution}>
			<Lightformer
				intensity={1.5}
				position={[0, 5, -10]}
				scale={[20, 20, 1]}
				color="#fbbf24"
			/>
			<Lightformer
				intensity={1.2}
				position={[0, -5, -10]}
				scale={[20, 20, 1]}
				color="#00ffff"
			/>
		</Environment>
	);
}

function HdriMap({ url }: { url: string }) {
	const texture = useLoader(RGBELoader, url);
	return <Environment map={texture} />;
}

export default function HdriEnvironment({
	primaryUrl = '/hdr/potsdamer_platz_1k.hdr',
	fallbackUrl = '/hdr/fallback.hdr',
	resolution = 64,
}: HdriEnvironmentProps) {
	const [activeUrl, setActiveUrl] = useState<string | null>(null);
	const [, setFailedUrls] = useState<Set<string>>(() => new Set());

	const urls = useMemo(() => [primaryUrl, fallbackUrl].filter(Boolean), [primaryUrl, fallbackUrl]);

	useEffect(() => {
		let cancelled = false;
		setFailedUrls(new Set());
		setActiveUrl(null);

		(async () => {
			for (const url of urls) {
				// Only preflight same-origin paths; cross-origin HEAD often fails on CORS.
				const isSameOriginPath = url.startsWith('/') && !url.startsWith('//');
				if (!isSameOriginPath) {
					if (!cancelled) setActiveUrl(url);
					return;
				}

				try {
					const res = await fetchWithRetry(url, { method: 'HEAD', timeoutMs: 3_000, retries: 2 });
					if (res.ok) {
						if (!cancelled) setActiveUrl(url);
						return;
					}
				} catch {
					// ignore and try next
				}
			}

			if (!cancelled) setActiveUrl(null);
		})();

		return () => {
			cancelled = true;
		};
	}, [urls]);

	if (!activeUrl) {
		return <ProceduralEnvironment resolution={resolution} />;
	}

	// When the HDR load fails, switch to the next URL; if all fail, fall back to procedural.
	const handleError = () => {
		setFailedUrls((prev) => {
			const next = new Set(prev);
			next.add(activeUrl);
			const nextUrl = urls.find((u) => !next.has(u) && u !== activeUrl);
			setActiveUrl(nextUrl ?? null);
			return next;
		});
	};

	return (
		<ErrorBoundary onError={handleError} fallback={<ProceduralEnvironment resolution={resolution} />}>
			<Suspense fallback={null}>
				<HdriMap url={activeUrl} />
			</Suspense>
		</ErrorBoundary>
	);
}

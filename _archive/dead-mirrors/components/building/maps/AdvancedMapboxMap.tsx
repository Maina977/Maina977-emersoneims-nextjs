'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Advanced Mapbox GL JS Map with Deck.gl Integration
 * Features: 3D terrain, interactive markers, data visualization
 */

interface MapMarker {
  id: string;
  coordinates: [number, number];
  name: string;
  projects: number;
  type: 'office' | 'project' | 'service';
}

const KENYA_CENTER: [number, number] = [36.8219, -1.2921]; // Nairobi

const MARKERS: MapMarker[] = [
  { id: 'nairobi', coordinates: [36.8219, -1.2921], name: 'Nairobi HQ', projects: 142, type: 'office' },
  { id: 'mombasa', coordinates: [39.6682, -4.0435], name: 'Mombasa', projects: 89, type: 'office' },
  { id: 'kisumu', coordinates: [34.7520, -0.0917], name: 'Kisumu', projects: 67, type: 'office' },
  { id: 'nakuru', coordinates: [36.0737, -0.3031], name: 'Nakuru', projects: 112, type: 'project' },
];

export default function AdvancedMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!mapContainer.current || map.current) return;

      const mapboxglModule = await import('mapbox-gl');
      const mapboxgl = mapboxglModule.default;
      if (cancelled || !mapContainer.current || map.current) return;

      // Initialize Mapbox
      mapboxgl.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: KENYA_CENTER,
        zoom: 6,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      map.current.on('load', () => {
        setIsLoaded(true);

        // Add 3D terrain
        if (map.current) {
          map.current.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 256,
            maxzoom: 14,
          });

          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

          // Add markers
          MARKERS.forEach((marker) => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor =
              marker.type === 'office' ? 'oklch(0.75 0.20 200)' : 'oklch(0.85 0.15 85)';
            el.style.border = '2px solid white';
            el.style.cursor = 'pointer';
            el.style.boxShadow = `0 0 10px ${
              marker.type === 'office' ? 'oklch(0.75 0.20 200)' : 'oklch(0.85 0.15 85)'
            }`;

            el.addEventListener('click', () => setSelectedMarker(marker));

            new mapboxgl.Marker(el).setLngLat(marker.coordinates).addTo(map.current!);
          });
        }
      });
    };

    init();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-cyan-500/20">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-300 font-mono">LOADING MAP...</p>
          </div>
        </div>
      )}

      {/* Marker Info Panel */}
      {selectedMarker && (
        <motion.div
          className="absolute top-4 left-4 bg-black/90 backdrop-blur-xl border border-cyan-500/50 rounded-lg p-4 z-20 max-w-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-cyan-300 font-bold font-mono text-lg">{selectedMarker.name}</h3>
              <p className="text-gray-400 text-sm font-mono">
                {selectedMarker.projects} Active Projects
              </p>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-cyan-500/20">
            <p className="text-xs text-gray-500 font-mono uppercase mb-1">Type</p>
            <p className="text-cyan-400 font-mono">{selectedMarker.type.toUpperCase()}</p>
          </div>
        </motion.div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-2 z-20">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => map.current?.zoomIn()}
            className="w-8 h-8 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-cyan-300 font-mono text-sm transition-all"
          >
            +
          </button>
          <button
            onClick={() => map.current?.zoomOut()}
            className="w-8 h-8 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-cyan-300 font-mono text-sm transition-all"
          >
            −
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4 z-20">
        <h4 className="text-cyan-300 font-bold font-mono text-xs mb-3 uppercase tracking-wider">
          Legend
        </h4>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-gray-400">Office</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.85 0.15 85)' }} />
            <span className="text-gray-400">Project</span>
          </div>
        </div>
      </div>
    </div>
  );
}









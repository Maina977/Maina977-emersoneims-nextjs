/**
 * Satellite Map Generator for PDF Report Embedding
 *
 * Generates three map images for the borehole analysis report:
 *   1. Water / Surface Water Map   (NASA GIBS MODIS + OpenTopoMap)
 *   2. Soil Type Map               (ISRIC SoilGrids WMS)
 *   3. Vegetation / NDVI Map       (NASA GIBS MODIS NDVI)
 *
 * Each map is rendered on an off-screen canvas at 1024×700px, then exported
 * as a PNG data URL for embedding via jsPDF.addImage().
 *
 * Tile sources (all free, CORS-enabled, no API key):
 *   - OpenStreetMap      : https://tile.openstreetmap.org/{z}/{x}/{y}.png
 *   - OpenTopoMap        : https://tile.opentopomap.org/{z}/{x}/{y}.png
 *   - NASA GIBS WMTS     : https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/...
 *   - ISRIC SoilGrids WMS: https://maps.isric.org/mapserv?map=/map/...
 *
 * If tile fetching fails (CORS, network, timeout), a programmatic fallback
 * map is rendered using analysis data — the report ALWAYS gets maps.
 */

// ═══════════════════════════════════════════════════════════════
// TILE MATH — Web Mercator (EPSG:3857)
// ═══════════════════════════════════════════════════════════════

const TILE_SIZE = 256;

function latLonToTile(lat: number, lon: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) };
}

function tileToLatLon(x: number, y: number, zoom: number): { lat: number; lon: number } {
  const n = Math.pow(2, zoom);
  const lon = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  return { lat: (latRad * 180) / Math.PI, lon };
}

/** Pixel position of lat/lon within a tile grid canvas */
function latLonToPixel(
  lat: number, lon: number, zoom: number,
  originTileX: number, originTileY: number,
): { px: number; py: number } {
  const n = Math.pow(2, zoom);
  const px = ((lon + 180) / 360) * n * TILE_SIZE - originTileX * TILE_SIZE;
  const latRad = (lat * Math.PI) / 180;
  const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE_SIZE - originTileY * TILE_SIZE;
  return { px, py };
}

// ═══════════════════════════════════════════════════════════════
// IMAGE FETCHING
// ═══════════════════════════════════════════════════════════════

async function fetchImage(url: string, timeout = 10000): Promise<HTMLImageElement | null> {
  try {
    const res = await fetch(url, { mode: 'cors', signal: AbortSignal.timeout(timeout) });
    if (!res.ok) return null;
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { URL.revokeObjectURL(blobUrl); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(null); };
      img.src = blobUrl;
    });
  } catch {
    return null;
  }
}

/** Fetch a grid of map tiles and composite onto a canvas */
async function fetchTileGrid(
  lat: number, lon: number, zoom: number,
  urlFn: (z: number, x: number, y: number) => string,
  gridSize = 4,
): Promise<{ canvas: HTMLCanvasElement; originX: number; originY: number; tilesLoaded: number }> {
  const center = latLonToTile(lat, lon, zoom);
  const half = Math.floor(gridSize / 2);
  const canvasW = gridSize * TILE_SIZE;
  const canvasH = gridSize * TILE_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, canvasW, canvasH);

  const originX = center.x - half;
  const originY = center.y - half;

  const promises: Promise<{ img: HTMLImageElement | null; dx: number; dy: number }>[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tx = originX + col;
      const ty = originY + row;
      const url = urlFn(zoom, tx, ty);
      promises.push(
        fetchImage(url).then((img) => ({ img, dx: col * TILE_SIZE, dy: row * TILE_SIZE })),
      );
    }
  }

  const results = await Promise.all(promises);
  let tilesLoaded = 0;
  for (const { img, dx, dy } of results) {
    if (img) {
      ctx.drawImage(img, dx, dy, TILE_SIZE, TILE_SIZE);
      tilesLoaded++;
    }
  }

  return { canvas, originX, originY, tilesLoaded };
}

// ═══════════════════════════════════════════════════════════════
// MAP DECORATIONS — marker, labels, legend, scale bar, border
// ═══════════════════════════════════════════════════════════════

function drawSiteMarker(ctx: CanvasRenderingContext2D, px: number, py: number) {
  // Outer glow
  ctx.beginPath();
  ctx.arc(px, py, 18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.fill();
  // Crosshair
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(px - 14, py); ctx.lineTo(px + 14, py); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(px, py + 14); ctx.stroke();
  // Center dot
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawMapFrame(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  title: string,
  subtitle: string,
  lat: number, lon: number,
  legendItems?: { color: string; label: string }[],
) {
  // Title bar
  ctx.fillStyle = 'rgba(13, 17, 23, 0.92)';
  ctx.fillRect(0, 0, w, 48);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, 48, w, 3);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px Helvetica, Arial, sans-serif';
  ctx.fillText(title, 14, 22);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px Helvetica, Arial, sans-serif';
  ctx.fillText(subtitle, 14, 40);

  // Coordinates badge (top right)
  const coordStr = `${lat.toFixed(5)}°, ${lon.toFixed(5)}°`;
  ctx.font = 'bold 11px monospace';
  const cw = ctx.measureText(coordStr).width + 16;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(w - cw - 10, 8, cw, 22);
  ctx.fillStyle = '#22c55e';
  ctx.fillText(coordStr, w - cw - 2, 23);

  // Bottom info bar
  ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
  ctx.fillRect(0, h - 40, w, 40);

  // Scale bar (approximate)
  const scaleBarX = 14;
  const scaleBarY = h - 24;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scaleBarX, scaleBarY);
  ctx.lineTo(scaleBarX + 80, scaleBarY);
  ctx.moveTo(scaleBarX, scaleBarY - 4);
  ctx.lineTo(scaleBarX, scaleBarY + 4);
  ctx.moveTo(scaleBarX + 80, scaleBarY - 4);
  ctx.lineTo(scaleBarX + 80, scaleBarY + 4);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '10px Helvetica, Arial, sans-serif';
  ctx.fillText('≈ 5 km', scaleBarX + 25, scaleBarY - 6);

  // Attribution
  ctx.fillStyle = '#64748b';
  ctx.font = '9px Helvetica, Arial, sans-serif';
  ctx.fillText('EMERSON EIMS AquaScan Pro  •  Sources: NASA GIBS, ISRIC SoilGrids, OpenStreetMap', 14, h - 8);

  // Legend (right side of bottom bar)
  if (legendItems && legendItems.length > 0) {
    let lx = w - 14;
    ctx.font = '10px Helvetica, Arial, sans-serif';
    for (let i = legendItems.length - 1; i >= 0; i--) {
      const item = legendItems[i];
      const tw = ctx.measureText(item.label).width;
      lx -= tw + 20;
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, h - 28, 12, 12);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeRect(lx, h - 28, 12, 12);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(item.label, lx + 16, h - 18);
    }
  }

  // Border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
}

// ═══════════════════════════════════════════════════════════════
// FALLBACK PROGRAMMATIC MAP — when tiles fail
// ═══════════════════════════════════════════════════════════════

function drawFallbackMap(
  lat: number, lon: number,
  title: string, subtitle: string,
  mapType: 'water' | 'soil' | 'vegetation',
  analysisData?: any,
): string {
  const W = 1024, H = 700;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient based on map type
  const grad = ctx.createLinearGradient(0, 0, W, H);
  if (mapType === 'water') {
    grad.addColorStop(0, '#0c1929'); grad.addColorStop(1, '#0a2540');
  } else if (mapType === 'soil') {
    grad.addColorStop(0, '#1a1408'); grad.addColorStop(1, '#2d1f0a');
  } else {
    grad.addColorStop(0, '#0a1f0a'); grad.addColorStop(1, '#0c2910');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Coordinate grid
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  const gridStep = 60;
  for (let gx = 0; gx < W; gx += gridStep) {
    ctx.beginPath(); ctx.moveTo(gx, 51); ctx.lineTo(gx, H - 40); ctx.stroke();
  }
  for (let gy = 51; gy < H - 40; gy += gridStep) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  // Grid coordinate labels
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '9px monospace';
  const latRange = 0.12;
  const lonRange = 0.18;
  for (let i = 0; i <= 5; i++) {
    const gridLat = (lat + latRange - (i * 2 * latRange) / 5).toFixed(3);
    const gridLon = (lon - lonRange + (i * 2 * lonRange) / 5).toFixed(3);
    ctx.fillText(`${gridLat}°`, 4, 70 + i * ((H - 100) / 5));
    ctx.fillText(`${gridLon}°`, 20 + i * ((W - 40) / 5), H - 44);
  }

  // Thematic data visualization
  const cx = W / 2, cy = (H - 40 + 51) / 2;
  if (mapType === 'water') {
    // Draw concentric water potential zones
    const colors = ['rgba(56, 189, 248, 0.15)', 'rgba(34, 197, 94, 0.12)', 'rgba(251, 191, 36, 0.10)', 'rgba(239, 68, 68, 0.08)'];
    const radii = [180, 140, 100, 60];
    const labels = ['High Potential Zone', 'Moderate Zone', 'Low Potential', 'Site'];
    for (let i = 0; i < colors.length; i++) {
      ctx.beginPath(); ctx.ellipse(cx, cy, radii[i] * 1.4, radii[i], 0, 0, Math.PI * 2);
      ctx.fillStyle = colors[i]; ctx.fill();
      ctx.strokeStyle = colors[i].replace(/[\d.]+\)$/, '0.5)');
      ctx.lineWidth = 1.5; ctx.stroke();
    }
    // Water table depth label
    const wtDepth = analysisData?.waterTableDepth || analysisData?.recommendedDepth || '?';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
    ctx.fillText(`Estimated Water Table: ${typeof wtDepth === 'number' ? wtDepth.toFixed(0) + 'm' : wtDepth + 'm'}`, cx - 120, cy + 220);
  } else if (mapType === 'soil') {
    // Draw soil type zones
    const soilType = analysisData?.soil?.type || 'Unknown';
    const zones = [
      { x: cx - 200, y: cy - 120, w: 180, h: 140, color: 'rgba(139, 92, 46, 0.3)', label: soilType },
      { x: cx + 20, y: cy - 100, w: 200, h: 120, color: 'rgba(101, 67, 33, 0.3)', label: 'Adjacent' },
      { x: cx - 100, y: cy + 40, w: 240, h: 100, color: 'rgba(160, 120, 60, 0.25)', label: 'Transitional' },
    ];
    for (const z of zones) {
      ctx.fillStyle = z.color;
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeStyle = z.color.replace(/[\d.]+\)$/, '0.6)');
      ctx.lineWidth = 1.5; ctx.strokeRect(z.x, z.y, z.w, z.h);
      ctx.fillStyle = '#d4a574';
      ctx.font = '12px Helvetica, Arial, sans-serif';
      ctx.fillText(z.label, z.x + 10, z.y + 20);
    }
  } else {
    // Vegetation — draw NDVI gradient zones
    const ndviVal = analysisData?.vegetationGWProxy?.ndviMean || analysisData?.site?.vegetationDensity || 0.4;
    const ndviColors = ['#8B0000', '#CD853F', '#DAA520', '#6B8E23', '#228B22', '#006400'];
    const ndviLabels = ['Bare', 'Sparse', 'Low', 'Moderate', 'Dense', 'Very Dense'];
    const bandH = Math.floor((H - 100) / ndviColors.length);
    for (let i = 0; i < ndviColors.length; i++) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = ndviColors[i];
      ctx.fillRect(W - 50, 55 + i * bandH, 36, bandH - 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#a0a0a0';
      ctx.font = '9px Helvetica, Arial, sans-serif';
      ctx.fillText(ndviLabels[i], W - 48 - ctx.measureText(ndviLabels[i]).width, 55 + i * bandH + bandH / 2 + 3);
    }
    // NDVI value label
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
    ctx.fillText(`Site NDVI: ${typeof ndviVal === 'number' ? ndviVal.toFixed(2) : ndviVal}`, cx - 50, cy + 200);
  }

  // Site marker
  drawSiteMarker(ctx, cx, cy);

  // API source note
  ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
  ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
  ctx.fillText('⚠ Satellite tile service unavailable — showing schematic from analysis data', 14, H - 55);

  // Frame and labels
  drawMapFrame(ctx, W, H, title, subtitle, lat, lon);

  return canvas.toDataURL('image/png', 0.92);
}

// ═══════════════════════════════════════════════════════════════
// TILE URL BUILDERS
// ═══════════════════════════════════════════════════════════════

function osmTileUrl(z: number, x: number, y: number): string {
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

function topoTileUrl(z: number, x: number, y: number): string {
  return `https://tile.opentopomap.org/${z}/${x}/${y}.png`;
}

/** NASA GIBS WMTS — MODIS NDVI 8-day composite (EPSG:3857, GoogleMapsCompatible) */
function gibsNdviTileUrl(z: number, x: number, y: number, date: string): string {
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${date}/GoogleMapsCompatible_Level9/${z}/${y}/${x}.png`;
}

/** NASA GIBS WMTS — MODIS True Color for water visibility */
function gibsTrueColorTileUrl(z: number, x: number, y: number, date: string): string {
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/${z}/${y}/${x}.jpg`;
}

/** Recent valid GIBS date — MODIS NDVI uses 8-day composites */
function getRecentGibsDate(): string {
  const now = new Date();
  // Go back 20 days to ensure the composite is available
  now.setDate(now.getDate() - 20);
  // Align to 8-day boundary (NDVI composites start on day 1, 9, 17, 25 of each month approximately)
  const day = now.getDate();
  const alignedDay = Math.floor((day - 1) / 8) * 8 + 1;
  now.setDate(alignedDay);
  return now.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════
// WMS MAP FETCHING — single-image request for exact bounding box
// ═══════════════════════════════════════════════════════════════

/** ISRIC SoilGrids WMS — World Reference Base soil classification */
async function fetchSoilGridsWMS(lat: number, lon: number, width = 512, height = 512): Promise<HTMLImageElement | null> {
  const delta = 0.15; // ~15km radius
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const url = `https://maps.isric.org/mapserv?map=/map/wrb.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap`
    + `&LAYERS=MostProbable&SRS=EPSG:4326&BBOX=${bbox}&WIDTH=${width}&HEIGHT=${height}`
    + `&FORMAT=image/png&TRANSPARENT=true`;
  return fetchImage(url, 15000);
}

// ═══════════════════════════════════════════════════════════════
// DRILL HERE ANCHOR MAP — programmatic canvas (no tile dependency)
// ═══════════════════════════════════════════════════════════════

/**
 * Renders a prominent "DRILL HERE" anchor map onto an off-screen canvas.
 * Displays: coordinate grid, concentric potential zones, large crosshair
 * with pin, callout boxes (depth, yield, probability), north arrow, scale bar.
 * Always succeeds — no network calls.
 */
export function renderDrillHereMap(
  lat: number, lon: number,
  successProbability: number,  // 0-1
  recommendedDepth: number,    // metres
  estimatedYield: number,      // m3/hr
  waterTableDepth: number,     // metres
  analysisData?: any,
): string {
  const W = 1024, H = 700;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ──────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0d1b2a');
  bgGrad.addColorStop(0.5, '#0f2940');
  bgGrad.addColorStop(1, '#0b1e33');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const mapTop = 55;
  const mapBot = H - 45;
  const cx = W / 2;
  const cy = (mapTop + mapBot) / 2;

  // ── Coordinate grid ─────────────────────────────────────────
  const latSpan = 0.10;  // ~11 km N-S
  const lonSpan = 0.14;  // ~11 km E-W
  const gridCols = 7, gridRows = 5;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCols; i++) {
    const x = (i / gridCols) * W;
    ctx.beginPath(); ctx.moveTo(x, mapTop); ctx.lineTo(x, mapBot); ctx.stroke();
    // lon label
    const labelLon = lon - lonSpan + (i / gridCols) * 2 * lonSpan;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.font = '8px monospace';
    ctx.fillText(labelLon.toFixed(3) + '\u00b0', x + 2, mapBot + 12);
  }
  for (let j = 0; j <= gridRows; j++) {
    const y = mapTop + (j / gridRows) * (mapBot - mapTop);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    const labelLat = lat + latSpan - (j / gridRows) * 2 * latSpan;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.font = '8px monospace';
    ctx.fillText(labelLat.toFixed(3) + '\u00b0', 2, y - 2);
  }

  // ── Potential zone halos ─────────────────────────────────────
  const pct = Math.max(0, Math.min(1, successProbability));
  const zoneColors: [number, number, number][] = [
    [56, 189, 248],   // sky-blue outer
    [34, 197, 94],    // green mid
    [251, 191, 36],   // amber inner
  ];
  const zoneRadii = [260, 170, 90];
  const zoneLabels = ['Outer Study Area', 'High Potential Zone', 'Target Aquifer'];
  for (let i = 0; i < zoneRadii.length; i++) {
    const [r, g, b] = zoneColors[i];
    const grad = ctx.createRadialGradient(cx, cy, zoneRadii[i] * 0.1, cx, cy, zoneRadii[i]);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.03)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, zoneRadii[i] * 1.3, zoneRadii[i], 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, zoneRadii[i] * 1.3, zoneRadii[i], 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // zone label along ellipse top
    ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
    ctx.font = '10px Helvetica, Arial, sans-serif';
    ctx.fillText(zoneLabels[i], cx - zoneRadii[i] * 1.3 + 6, cy - zoneRadii[i] + 12);
  }

  // ── Large crosshair + pin ────────────────────────────────────
  // Outer pulsing ring
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Crosshair arms
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  // Horizontal
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cx - 30, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 30, cy); ctx.lineTo(W, cy); ctx.stroke();
  // Vertical
  ctx.beginPath(); ctx.moveTo(cx, mapTop); ctx.lineTo(cx, cy - 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + 30); ctx.lineTo(cx, mapBot); ctx.stroke();
  // Center pin
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ── "DRILL HERE" label ───────────────────────────────────────
  ctx.font = 'bold 22px Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('PROPOSED DRILL SITE', cx, cy - 52);
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`${lat.toFixed(5)}\u00b0 N,  ${lon.toFixed(5)}\u00b0 E`, cx, cy - 36);
  ctx.textAlign = 'left';

  // ── Callout boxes ────────────────────────────────────────────
  const boxData = [
    { label: 'DEPTH TARGET', value: `${recommendedDepth.toFixed(0)} m`, sub: 'Recommended drill depth', color: '#38bdf8' },
    { label: 'EST. YIELD',   value: `${estimatedYield.toFixed(1)} m\u00b3/hr`, sub: 'At target aquifer', color: '#22c55e' },
    { label: 'WATER TABLE',  value: `${waterTableDepth.toFixed(0)} m`, sub: 'Estimated depth to water', color: '#818cf8' },
    { label: 'SUCCESS PROB', value: `${(pct * 100).toFixed(0)}%`, sub: 'AI model estimate', color: pct >= 0.6 ? '#22c55e' : pct >= 0.4 ? '#fbbf24' : '#ef4444' },
  ];
  const boxW = 170, boxH = 70;
  const boxPositions = [
    { x: 30,          y: mapTop + 20 },
    { x: 30,          y: mapTop + 105 },
    { x: W - boxW - 30, y: mapTop + 20 },
    { x: W - boxW - 30, y: mapTop + 105 },
  ];
  for (let i = 0; i < boxData.length; i++) {
    const { x, y } = boxPositions[i];
    const d = boxData[i];
    // Box background
    ctx.fillStyle = 'rgba(13, 17, 23, 0.88)';
    roundRect(ctx, x, y, boxW, boxH, 6);
    ctx.fill();
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, boxW, boxH, 6);
    ctx.stroke();
    // Label
    ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
    ctx.font = 'bold 9px Helvetica, Arial, sans-serif';
    ctx.fillText(d.label, x + 10, y + 16);
    // Value
    ctx.fillStyle = d.color;
    ctx.font = 'bold 22px Helvetica, Arial, sans-serif';
    ctx.fillText(d.value, x + 10, y + 42);
    // Sub-label
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '9px Helvetica, Arial, sans-serif';
    ctx.fillText(d.sub, x + 10, y + 58);
  }

  // Connector lines from boxes to center
  const boxCenters = boxPositions.map((p) => ({ x: p.x + boxW / 2, y: p.y + boxH / 2 }));
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  for (const bc of boxCenters) {
    ctx.beginPath(); ctx.moveTo(bc.x, bc.y); ctx.lineTo(cx, cy); ctx.stroke();
  }
  ctx.setLineDash([]);

  // ── North arrow ──────────────────────────────────────────────
  const naX = W - 50, naY = mapBot - 70;
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  // Arrow
  ctx.beginPath();
  ctx.moveTo(naX, naY - 22);
  ctx.lineTo(naX - 7, naY + 2);
  ctx.lineTo(naX, naY - 6);
  ctx.lineTo(naX + 7, naY + 2);
  ctx.closePath();
  ctx.fill();
  ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('N', naX, naY - 26);
  ctx.textAlign = 'left';

  // ── Scale bar ────────────────────────────────────────────────
  const sbX = W - 200, sbY = mapBot - 16;
  // 1 degree lat at equator ~= 111km; at our latSpan across 1024px:
  // (2*lonSpan * 111000 * cos(lat)) / 1024 metres per pixel
  const metresPerPixel = (2 * lonSpan * 111000 * Math.cos((lat * Math.PI) / 180)) / W;
  const scaleBarKm = Math.round(metresPerPixel * 100) / 1000; // 100px in km, rounded
  const scaleLabel = scaleBarKm >= 1 ? `${scaleBarKm.toFixed(1)} km` : `${(scaleBarKm * 1000).toFixed(0)} m`;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sbX, sbY); ctx.lineTo(sbX + 100, sbY);
  ctx.moveTo(sbX, sbY - 4); ctx.lineTo(sbX, sbY + 4);
  ctx.moveTo(sbX + 100, sbY - 4); ctx.lineTo(sbX + 100, sbY + 4);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '10px Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(scaleLabel, sbX + 50, sbY - 6);
  ctx.textAlign = 'left';

  // ── Frame ────────────────────────────────────────────────────
  drawMapFrame(ctx, W, H,
    'DRILL SITE LOCATION MAP -- PROPOSED BOREHOLE',
    `EMERSON EIMS AquaScan Pro  •  Canvas-generated  •  AI model-based estimate -- ERT survey recommended before drilling`,
    lat, lon,
    [
      { color: '#38bdf8', label: 'Outer Study Area' },
      { color: '#22c55e', label: 'High Potential' },
      { color: '#fbbf24', label: 'Target Aquifer' },
      { color: '#ef4444', label: 'Proposed Drill Site' },
    ],
  );

  return canvas.toDataURL('image/png', 0.92);
}

/** Helper: rounded rectangle path (Canvas 2D API compat) */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════
// WATER TABLE DEPTH MAP — programmatic canvas depth-contour viz
// ═══════════════════════════════════════════════════════════════

/**
 * Renders a water table depth contour map onto an off-screen canvas.
 * Color-coded depth zones, contour rings, depth profile bar, drill marker.
 * Always succeeds — no network calls.
 */
export function renderWaterTableDepthMap(
  lat: number, lon: number,
  waterTableDepth: number,   // metres (primary estimate)
  seasonalVariation: number, // metres (wet/dry swing; 0 if unknown)
  maxExpectedDepth: number,  // metres (deepest extent)
  analysisData?: any,
): string {
  const W = 1024, H = 700;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const mapTop = 55;
  const mapBot = H - 45;
  const cx = W / 2;
  const cy = (mapTop + mapBot) / 2;

  // ── Background ──────────────────────────────────────────────
  ctx.fillStyle = '#0b1d2e';
  ctx.fillRect(0, 0, W, H);

  // Depth colour mapping (shallow=blue, mid=green, deep=yellow, very deep=red)
  function depthColor(d: number): string {
    if (d < 10)  return '#1d4ed8';   // very shallow — dark blue
    if (d < 20)  return '#2563eb';
    if (d < 30)  return '#3b82f6';   // blue
    if (d < 50)  return '#22c55e';   // green
    if (d < 80)  return '#84cc16';
    if (d < 120) return '#fbbf24';   // amber
    if (d < 180) return '#f97316';   // orange
    return '#ef4444';                 // deep red
  }

  // ── Depth contour rings ──────────────────────────────────────
  // Rings represent depth zones radiating from drill point
  // Innermost = estimated water table, outer rings = deeper
  const contourDepths = [5, 10, 20, 30, 50, 80, 120, 160, 200].filter(d => d <= maxExpectedDepth * 1.5 + 10);
  const maxRadius = 280;
  // Map depth -> radius: shallower = larger radius (shallower groundwater = wider extent)
  const depthToRadius = (d: number) => maxRadius * Math.min(1, d / (maxExpectedDepth * 1.2 + 10));

  for (let i = contourDepths.length - 1; i >= 0; i--) {
    const d = contourDepths[i];
    const r = depthToRadius(d);
    const hex = depthColor(d);
    // Fill zone
    const gr = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    gr.addColorStop(0, hex + '40');
    gr.addColorStop(1, hex + '08');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.4, r, 0, 0, Math.PI * 2);
    ctx.fill();
    // Contour ring
    ctx.strokeStyle = hex + 'a0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.4, r, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Depth label on the ring
    const labelX = cx + r * 1.4 + 6;
    const labelY = cy;
    ctx.fillStyle = hex;
    ctx.font = '10px monospace';
    ctx.fillText(`${d}m`, labelX, labelY + 3);
  }

  // ── Water table contour highlight ────────────────────────────
  const wtR = depthToRadius(waterTableDepth);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, wtR * 1.4, wtR, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // Label
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px Helvetica, Arial, sans-serif';
  ctx.fillText(`Water table: ~${waterTableDepth.toFixed(0)}m`, cx - wtR * 1.4 - 130, cy + 16);
  ctx.font = '10px Helvetica, Arial, sans-serif';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  if (seasonalVariation > 0) {
    ctx.fillText(`Seasonal swing: +/-${(seasonalVariation / 2).toFixed(1)}m`, cx - wtR * 1.4 - 130, cy + 30);
  }

  // ── Depth profile bar (right side) ───────────────────────────
  const barX = W - 90, barTop2 = mapTop + 20, barBot = mapBot - 20;
  const barH = barBot - barTop2;
  const barW = 24;
  // Gradient bar
  const barGrad = ctx.createLinearGradient(0, barTop2, 0, barBot);
  barGrad.addColorStop(0,   '#1d4ed8');
  barGrad.addColorStop(0.15,'#3b82f6');
  barGrad.addColorStop(0.35,'#22c55e');
  barGrad.addColorStop(0.55,'#84cc16');
  barGrad.addColorStop(0.70,'#fbbf24');
  barGrad.addColorStop(0.85,'#f97316');
  barGrad.addColorStop(1,   '#ef4444');
  ctx.fillStyle = barGrad;
  ctx.fillRect(barX, barTop2, barW, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barTop2, barW, barH);

  // Tick marks and labels on bar
  const maxD = Math.max(200, maxExpectedDepth * 1.2);
  const barTicks = [0, 20, 50, 100, 150, 200].filter(d => d <= maxD);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px monospace';
  for (const t of barTicks) {
    const ty2 = barTop2 + (t / maxD) * barH;
    ctx.beginPath(); ctx.moveTo(barX - 4, ty2); ctx.lineTo(barX, ty2); ctx.stroke();
    ctx.fillText(`${t}m`, barX - 34, ty2 + 3);
  }
  // Bar title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9px Helvetica, Arial, sans-serif';
  ctx.save();
  ctx.translate(barX + barW + 12, barTop2 + barH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('DEPTH (metres)', 0, 0);
  ctx.restore();
  ctx.textAlign = 'left';

  // Marker on bar at water table depth
  const markerY = barTop2 + (waterTableDepth / maxD) * barH;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(barX - 8, markerY);
  ctx.lineTo(barX - 2, markerY - 5);
  ctx.lineTo(barX - 2, markerY + 5);
  ctx.closePath();
  ctx.fill();

  // ── Information box ──────────────────────────────────────────
  const infoX = 20, infoY = mapBot - 105;
  ctx.fillStyle = 'rgba(13, 17, 23, 0.90)';
  roundRect(ctx, infoX, infoY, 310, 90, 6);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  roundRect(ctx, infoX, infoY, 310, 90, 6);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
  ctx.fillText('GROUNDWATER DEPTH SUMMARY', infoX + 10, infoY + 18);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '10px Helvetica, Arial, sans-serif';
  ctx.fillText(`Estimated water table depth:  ${waterTableDepth.toFixed(0)} m`, infoX + 10, infoY + 36);
  if (seasonalVariation > 0) {
    ctx.fillText(`Seasonal variation (wet/dry):  +/-${(seasonalVariation / 2).toFixed(1)} m`, infoX + 10, infoY + 50);
    ctx.fillText(`Wet season depth:  ~${Math.max(0, waterTableDepth - seasonalVariation / 2).toFixed(0)} m`, infoX + 10, infoY + 64);
    ctx.fillText(`Dry season depth:  ~${(waterTableDepth + seasonalVariation / 2).toFixed(0)} m`, infoX + 160, infoY + 64);
  } else {
    ctx.fillText('Seasonal variation: not available', infoX + 10, infoY + 50);
  }
  ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
  ctx.font = '9px Helvetica, Arial, sans-serif';
  ctx.fillText('(regional est.) -- verify with ERT geophysical survey', infoX + 10, infoY + 80);

  // ── Site marker ──────────────────────────────────────────────
  drawSiteMarker(ctx, cx, cy);

  // ── Coordinate label at center ───────────────────────────────
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText(`${lat.toFixed(5)}\u00b0, ${lon.toFixed(5)}\u00b0`, cx, cy + 28);
  ctx.textAlign = 'left';

  // ── Legend ───────────────────────────────────────────────────
  drawMapFrame(ctx, W, H,
    'WATER TABLE DEPTH CONTOUR MAP',
    `Programmatic contour model  •  Sources: AI analysis + regional hydrogeology  •  (regional est.) -- confirm with ERT`,
    lat, lon,
    [
      { color: '#1d4ed8', label: '<10m (Shallow)' },
      { color: '#22c55e', label: '30-50m' },
      { color: '#fbbf24', label: '80-120m' },
      { color: '#ef4444', label: '>160m (Deep)' },
      { color: '#38bdf8', label: 'Estimated Water Table' },
    ],
  );

  return canvas.toDataURL('image/png', 0.92);
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API — Generate all three map images
// ═══════════════════════════════════════════════════════════════

export interface ReportMapImages {
  waterMap: string;       // data URL (PNG)
  soilMap: string;        // data URL (PNG)
  vegetationMap: string;  // data URL (PNG)
  drillHereMap: string;   // data URL (PNG) -- large "Drill Here" anchor map
  waterTableMap: string;  // data URL (PNG) -- water table depth contour map
}

/**
 * Generate satellite map images for the PDF report.
 *
 * @param lat  Site latitude
 * @param lon  Site longitude
 * @param analysisData  Full analysis result for fallback rendering
 * @returns Three PNG data URLs for water, soil, and vegetation maps
 */
export async function generateReportMaps(
  lat: number, lon: number,
  analysisData?: any,
): Promise<ReportMapImages> {
  const zoom = 10; // ~30km area with 4×4 tile grid
  const gridSize = 4;
  const CANVAS_W = 1024;
  const CANVAS_H = 700;
  const gibsDate = getRecentGibsDate();

  console.log(`[ReportMaps] Generating maps for ${lat.toFixed(4)}, ${lon.toFixed(4)} (zoom ${zoom}, date ${gibsDate})`);

  // ── 1. WATER / SURFACE WATER MAP ──
  let waterMap: string;
  try {
    // Fetch NASA GIBS True Color (shows water bodies as dark blue/black)
    const trueColorGrid = await fetchTileGrid(lat, lon, zoom,
      (z, x, y) => gibsTrueColorTileUrl(z, x, y, gibsDate), gridSize);
    // Also fetch OpenTopoMap as base for water features (rivers, lakes labeled)
    const topoGrid = await fetchTileGrid(lat, lon, zoom, topoTileUrl, gridSize);

    if (trueColorGrid.tilesLoaded >= gridSize || topoGrid.tilesLoaded >= gridSize) {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W; canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d')!;

      // Use whichever loaded better as the primary
      const primary = trueColorGrid.tilesLoaded >= topoGrid.tilesLoaded ? trueColorGrid : topoGrid;
      const originX = primary.originX;
      const originY = primary.originY;

      // Draw scaled to fit canvas (excluding title/footer areas)
      const mapAreaY = 51;
      const mapAreaH = CANVAS_H - 91;
      const srcSize = gridSize * TILE_SIZE;
      ctx.drawImage(primary.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);

      // If true color loaded, overlay topo with low opacity for labels
      if (trueColorGrid.tilesLoaded >= gridSize && topoGrid.tilesLoaded >= gridSize / 2) {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(topoGrid.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);
        ctx.globalAlpha = 1;
      }

      // Site marker
      const { px, py } = latLonToPixel(lat, lon, zoom, originX, originY);
      const scaledPx = (px / srcSize) * CANVAS_W;
      const scaledPy = mapAreaY + (py / srcSize) * mapAreaH;
      drawSiteMarker(ctx, scaledPx, scaledPy);

      drawMapFrame(ctx, CANVAS_W, CANVAS_H,
        'WATER & SURFACE HYDROLOGY MAP',
        `NASA MODIS True Color + OpenTopoMap  •  Area: ~${(30).toFixed(0)}km radius  •  Date: ${gibsDate}`,
        lat, lon,
        [
          { color: '#1e40af', label: 'Water Bodies' },
          { color: '#22c55e', label: 'Vegetation' },
          { color: '#d4a574', label: 'Bare Soil' },
          { color: '#ef4444', label: 'Drill Site' },
        ],
      );
      waterMap = canvas.toDataURL('image/png', 0.92);
      console.log(`[ReportMaps] Water map: ${trueColorGrid.tilesLoaded + topoGrid.tilesLoaded} tiles loaded`);
    } else {
      throw new Error('Insufficient tiles');
    }
  } catch (err) {
    console.log('[ReportMaps] Water map tile fetch failed, using fallback:', err);
    waterMap = drawFallbackMap(lat, lon,
      'WATER & SURFACE HYDROLOGY MAP',
      'Schematic — satellite tiles unavailable  •  Based on analysis data',
      'water', analysisData);
  }

  // ── 2. SOIL TYPE MAP ──
  let soilMap: string;
  try {
    // Try ISRIC SoilGrids WMS first (single image)
    const soilWmsImg = await fetchSoilGridsWMS(lat, lon, 800, 800);

    // Also fetch OSM base for context
    const osmGrid = await fetchTileGrid(lat, lon, zoom, osmTileUrl, gridSize);

    if (soilWmsImg || osmGrid.tilesLoaded >= gridSize) {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W; canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d')!;

      const mapAreaY = 51;
      const mapAreaH = CANVAS_H - 91;
      const srcSize = gridSize * TILE_SIZE;

      // Draw OSM base
      if (osmGrid.tilesLoaded >= 1) {
        ctx.drawImage(osmGrid.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);
      }

      // Overlay soil classification with transparency
      if (soilWmsImg) {
        ctx.globalAlpha = 0.7;
        ctx.drawImage(soilWmsImg, 0, mapAreaY, CANVAS_W, mapAreaH);
        ctx.globalAlpha = 1;
      }

      // Site marker
      if (osmGrid.tilesLoaded >= 1) {
        const { px, py } = latLonToPixel(lat, lon, zoom, osmGrid.originX, osmGrid.originY);
        const scaledPx = (px / srcSize) * CANVAS_W;
        const scaledPy = mapAreaY + (py / srcSize) * mapAreaH;
        drawSiteMarker(ctx, scaledPx, scaledPy);
      } else {
        drawSiteMarker(ctx, CANVAS_W / 2, CANVAS_H / 2);
      }

      drawMapFrame(ctx, CANVAS_W, CANVAS_H,
        'SOIL CLASSIFICATION MAP',
        `ISRIC SoilGrids v2.0 (World Reference Base) + OpenStreetMap  •  250m resolution`,
        lat, lon,
        [
          { color: '#8B4513', label: 'Ferralsol/Nitisol' },
          { color: '#D2B48C', label: 'Cambisol/Luvisol' },
          { color: '#F5DEB3', label: 'Arenosol/Regosol' },
          { color: '#556B2F', label: 'Vertisol/Gleysol' },
          { color: '#ef4444', label: 'Drill Site' },
        ],
      );
      soilMap = canvas.toDataURL('image/png', 0.92);
      console.log(`[ReportMaps] Soil map: WMS=${!!soilWmsImg}, OSM tiles=${osmGrid.tilesLoaded}`);
    } else {
      throw new Error('Insufficient data');
    }
  } catch (err) {
    console.log('[ReportMaps] Soil map fetch failed, using fallback:', err);
    soilMap = drawFallbackMap(lat, lon,
      'SOIL CLASSIFICATION MAP',
      'Schematic — ISRIC SoilGrids unavailable  •  Based on analysis data',
      'soil', analysisData);
  }

  // ── 3. VEGETATION / NDVI MAP ──
  let vegetationMap: string;
  try {
    const ndviGrid = await fetchTileGrid(lat, lon, Math.min(zoom, 9),
      (z, x, y) => gibsNdviTileUrl(z, x, y, gibsDate), gridSize);
    // OSM base for context
    const osmGrid2 = await fetchTileGrid(lat, lon, Math.min(zoom, 9), osmTileUrl, gridSize);

    if (ndviGrid.tilesLoaded >= gridSize || osmGrid2.tilesLoaded >= gridSize) {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W; canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d')!;

      const mapAreaY = 51;
      const mapAreaH = CANVAS_H - 91;
      const srcSize = gridSize * TILE_SIZE;
      const useZoom = Math.min(zoom, 9);

      // Choose primary based on what loaded
      if (ndviGrid.tilesLoaded >= gridSize / 2) {
        // Draw NDVI as primary
        ctx.drawImage(ndviGrid.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);
        // Overlay OSM faintly for context
        if (osmGrid2.tilesLoaded >= gridSize / 2) {
          ctx.globalAlpha = 0.18;
          ctx.drawImage(osmGrid2.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);
          ctx.globalAlpha = 1;
        }
      } else {
        // OSM only with vegetation color tint
        ctx.drawImage(osmGrid2.canvas, 0, 0, srcSize, srcSize, 0, mapAreaY, CANVAS_W, mapAreaH);
      }

      // Site marker
      const bestGrid = ndviGrid.tilesLoaded >= osmGrid2.tilesLoaded ? ndviGrid : osmGrid2;
      const { px, py } = latLonToPixel(lat, lon, useZoom, bestGrid.originX, bestGrid.originY);
      const scaledPx = (px / srcSize) * CANVAS_W;
      const scaledPy = mapAreaY + (py / srcSize) * mapAreaH;
      drawSiteMarker(ctx, scaledPx, scaledPy);

      // NDVI color scale bar (vertical, right side)
      const barX = CANVAS_W - 60;
      const barTop = mapAreaY + 20;
      const barH = mapAreaH - 60;
      const ndviGrad = ctx.createLinearGradient(0, barTop, 0, barTop + barH);
      ndviGrad.addColorStop(0, '#006400');
      ndviGrad.addColorStop(0.25, '#228B22');
      ndviGrad.addColorStop(0.5, '#6B8E23');
      ndviGrad.addColorStop(0.75, '#DAA520');
      ndviGrad.addColorStop(1, '#8B0000');
      ctx.fillStyle = ndviGrad;
      ctx.fillRect(barX, barTop, 20, barH);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barTop, 20, barH);
      // Scale labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Helvetica, Arial, sans-serif';
      const ndviScaleLabels = ['1.0 (Dense)', '0.75', '0.5', '0.25', '0.0 (Bare)'];
      for (let i = 0; i < ndviScaleLabels.length; i++) {
        const ly = barTop + (i / (ndviScaleLabels.length - 1)) * barH;
        ctx.fillText(ndviScaleLabels[i], barX - ctx.measureText(ndviScaleLabels[i]).width - 4, ly + 4);
      }

      drawMapFrame(ctx, CANVAS_W, CANVAS_H,
        'VEGETATION INDEX (NDVI) MAP',
        `NASA MODIS Terra NDVI 8-Day Composite  •  250m resolution  •  Date: ${gibsDate}`,
        lat, lon,
        [
          { color: '#006400', label: 'Dense Vegetation' },
          { color: '#6B8E23', label: 'Moderate' },
          { color: '#DAA520', label: 'Sparse' },
          { color: '#8B0000', label: 'Bare/Water' },
          { color: '#ef4444', label: 'Drill Site' },
        ],
      );
      vegetationMap = canvas.toDataURL('image/png', 0.92);
      console.log(`[ReportMaps] Vegetation map: NDVI=${ndviGrid.tilesLoaded}, OSM=${osmGrid2.tilesLoaded}`);
    } else {
      throw new Error('Insufficient tiles');
    }
  } catch (err) {
    console.log('[ReportMaps] Vegetation map fetch failed, using fallback:', err);
    vegetationMap = drawFallbackMap(lat, lon,
      'VEGETATION INDEX (NDVI) MAP',
      'Schematic — NASA GIBS unavailable  •  Based on analysis data',
      'vegetation', analysisData);
  }

  console.log('[ReportMaps] All 3 satellite maps generated successfully');

  // ── 4. DRILL HERE ANCHOR MAP (programmatic — no network) ──
  const successProb = analysisData?.successProbability ?? analysisData?.drillPoint?.successProbability ?? 0.5;
  const recDepth    = analysisData?.recommendedDepth   ?? analysisData?.drillPoint?.targetDepth_m     ?? 60;
  const estYield    = analysisData?.estimatedYield     ?? analysisData?.drillPoint?.estimatedYield_m3hr ?? 2;
  const wtDepth     = analysisData?.waterTableDepth    ?? analysisData?.drillPoint?.waterTableDepth_m  ?? 30;

  const drillHereMap = renderDrillHereMap(
    lat, lon,
    typeof successProb === 'number' ? successProb : 0.5,
    typeof recDepth    === 'number' ? recDepth    : 60,
    typeof estYield    === 'number' ? estYield    : 2,
    typeof wtDepth     === 'number' ? wtDepth     : 30,
    analysisData,
  );

  // ── 5. WATER TABLE DEPTH MAP (programmatic — no network) ──
  const seasonalVar  = analysisData?.seasonalVariation ?? analysisData?.dynamicRecharge?.seasonalVariation_m ?? 0;
  const maxDepth     = Math.max(recDepth * 1.5, 100, typeof wtDepth === 'number' ? wtDepth * 2 : 60);

  const waterTableMap = renderWaterTableDepthMap(
    lat, lon,
    typeof wtDepth     === 'number' ? wtDepth     : 30,
    typeof seasonalVar === 'number' ? seasonalVar : 0,
    typeof maxDepth    === 'number' ? maxDepth    : 120,
    analysisData,
  );

  return { waterMap, soilMap, vegetationMap, drillHereMap, waterTableMap };
}

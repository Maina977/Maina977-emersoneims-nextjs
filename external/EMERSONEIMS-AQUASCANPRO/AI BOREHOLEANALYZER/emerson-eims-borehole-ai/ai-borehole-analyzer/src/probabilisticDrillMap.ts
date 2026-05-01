/* ═══════════════════════════════════════════════════════════════════════
   PROBABILISTIC DRILLING MAP ENGINE
   Heatmap of probability + Top 3 ranked drilling points
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface DrillMapInput {
  centerLat: number;
  centerLon: number;
  radiusKm: number;          // search radius (default 2km)

  // Core prediction at center
  baseProbability: number;   // 0-1
  baseDepth_m: number;
  baseYield_m3hr: number;

  // Modifiers
  slopeMap?: number;          // degrees at center
  twiAtCenter?: number;       // topographic wetness index
  fractureDensity?: number;   // lineaments per km²
  drainageDensity?: number;   // km/km²
  vegetationIndex?: number;   // NDVI 0-1
  soilMoisture?: number;      // 0-1
  elevationCenter_m?: number;

  // Nearby borehole results (from intelligence DB)
  nearbyBoreholes?: {
    latitude: number;
    longitude: number;
    success: boolean;
    yield_m3hr: number;
    depth_m: number;
  }[];

  // Fracture intersections (from fractureLineamentAI)
  fractureIntersections?: {
    latitude: number;
    longitude: number;
    permeabilityScore: number;
  }[];

  // Geophysics fusion result
  geophysicsConfidence?: number;
}

export interface DrillPoint {
  latitude: number;
  longitude: number;
  rank: number;
  probability: number;        // 0-1
  expectedDepth_m: number;
  expectedYield_m3hr: number;
  score: number;               // composite score 0-100
  distanceFromCenter_m: number;
  reasoning: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface HeatmapCell {
  latitude: number;
  longitude: number;
  probability: number;
  score: number;
  rowIdx: number;
  colIdx: number;
}

export interface DrillMapResult {
  // Top ranked points
  topPoints: DrillPoint[];     // top 3-5 ranked
  allCandidates: DrillPoint[]; // all evaluated

  // Heatmap grid
  heatmap: HeatmapCell[];
  gridRows: number;
  gridCols: number;
  cellSizeM: number;

  // Statistics
  avgProbability: number;
  maxProbability: number;
  minProbability: number;
  highProbabilityArea_km2: number;  // area with prob > 0.7
  coverageRadius_km: number;

  // Rendered map (canvas data URL)
  mapImageDataUrl?: string;

  methodology: string;
  confidence: number;
}

/* ── Grid Generation ──────────────────────────────────────── */

const EARTH_RADIUS_M = 6371000;

function offsetLatLon(lat: number, lon: number, dNorthM: number, dEastM: number): [number, number] {
  const dLat = dNorthM / EARTH_RADIUS_M * 180 / Math.PI;
  const dLon = dEastM / (EARTH_RADIUS_M * Math.cos(lat * Math.PI / 180)) * 180 / Math.PI;
  return [lat + dLat, lon + dLon];
}

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Probability Modifier Functions ───────────────────────── */

function slopeModifier(slopeDeg: number): number {
  // Flat areas accumulate more groundwater; steep slopes = runoff
  if (slopeDeg < 2) return 1.1;
  if (slopeDeg < 5) return 1.05;
  if (slopeDeg < 10) return 1.0;
  if (slopeDeg < 20) return 0.9;
  if (slopeDeg < 30) return 0.75;
  return 0.6;
}

function twiModifier(twi: number): number {
  // Higher TWI = more water accumulation
  if (twi > 12) return 1.15;
  if (twi > 9) return 1.08;
  if (twi > 6) return 1.0;
  if (twi > 3) return 0.9;
  return 0.8;
}

function fractureModifier(fractureDensity: number, distToFracture_m: number): number {
  // Closer to fracture intersection = higher probability
  const densityBonus = Math.min(0.15, fractureDensity * 0.03);
  const proximityBonus = distToFracture_m < 50 ? 0.2 : distToFracture_m < 200 ? 0.1 : distToFracture_m < 500 ? 0.05 : 0;
  return 1 + densityBonus + proximityBonus;
}

function drainageModifier(drainageDensity: number): number {
  if (drainageDensity > 3) return 1.1;
  if (drainageDensity > 1.5) return 1.05;
  return 1.0;
}

function vegetationModifier(ndvi: number): number {
  // High vegetation in dry landscape = groundwater indicator
  if (ndvi > 0.6) return 1.12;
  if (ndvi > 0.4) return 1.05;
  if (ndvi > 0.2) return 1.0;
  return 0.9;
}

function boreholeProximityModifier(lat: number, lon: number, boreholes: NonNullable<DrillMapInput['nearbyBoreholes']>): number {
  let modifier = 1.0;
  for (const bh of boreholes) {
    const dist = haversineM(lat, lon, bh.latitude, bh.longitude);
    if (dist < 100) {
      // Very close: strong influence
      modifier *= bh.success ? 1.15 : 0.7;
    } else if (dist < 500) {
      modifier *= bh.success ? 1.05 : 0.9;
    } else if (dist < 1000) {
      modifier *= bh.success ? 1.02 : 0.95;
    }
  }
  return modifier;
}

/* ── Main Map Generation ──────────────────────────────────── */

export function generateProbabilisticDrillMap(input: DrillMapInput): DrillMapResult {
  const radiusM = input.radiusKm * 1000;
  // Cell size: ~50m for small radius, ~200m for large radius
  const cellSizeM = Math.max(50, Math.min(200, radiusM / 15));
  const gridSize = Math.ceil(radiusM * 2 / cellSizeM);
  const halfGrid = gridSize / 2;

  const heatmap: HeatmapCell[] = [];
  const candidates: DrillPoint[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const dNorth = (row - halfGrid) * cellSizeM;
      const dEast = (col - halfGrid) * cellSizeM;
      const [lat, lon] = offsetLatLon(input.centerLat, input.centerLon, dNorth, dEast);

      const distFromCenter = Math.sqrt(dNorth * dNorth + dEast * dEast);
      if (distFromCenter > radiusM) continue;

      // Start with base probability, apply distance decay
      let prob = input.baseProbability * (1 - 0.15 * (distFromCenter / radiusM));

      // Apply modifiers
      // Slope variation: add random local slope variation
      const localSlope = (input.slopeMap ?? 5) + (Math.sin(row * 0.5) + Math.cos(col * 0.3)) * 3;
      prob *= slopeModifier(localSlope);

      // TWI variation
      if (input.twiAtCenter) {
        const localTwi = input.twiAtCenter + (Math.sin(row * 0.3 + col * 0.2) * 2);
        prob *= twiModifier(localTwi);
      }

      // Fracture influence
      if (input.fractureIntersections && input.fractureIntersections.length > 0) {
        let minFracDist = Infinity;
        for (const fi of input.fractureIntersections) {
          const d = haversineM(lat, lon, fi.latitude, fi.longitude);
          minFracDist = Math.min(minFracDist, d);
        }
        prob *= fractureModifier(input.fractureDensity ?? 1, minFracDist);
      } else if (input.fractureDensity) {
        prob *= fractureModifier(input.fractureDensity, 500);
      }

      // Drainage
      if (input.drainageDensity) {
        prob *= drainageModifier(input.drainageDensity);
      }

      // Vegetation
      if (input.vegetationIndex != null) {
        const localNdvi = input.vegetationIndex + (Math.sin(row * 0.4 + col * 0.6) * 0.1);
        prob *= vegetationModifier(localNdvi);
      }

      // Nearby boreholes
      if (input.nearbyBoreholes && input.nearbyBoreholes.length > 0) {
        prob *= boreholeProximityModifier(lat, lon, input.nearbyBoreholes);
      }

      // Clamp
      prob = Math.max(0.05, Math.min(0.98, prob));
      const score = prob * 100;

      heatmap.push({ latitude: lat, longitude: lon, probability: prob, score, rowIdx: row, colIdx: col });

      // Store as candidate
      const expectedDepth = input.baseDepth_m * (0.85 + 0.3 * (1 - prob));
      const expectedYield = input.baseYield_m3hr * (0.5 + prob);

      const reasoning: string[] = [];
      if (prob > input.baseProbability * 1.1) reasoning.push('Above-average favorability zone');
      if (localSlope < 5) reasoning.push('Low slope (good water accumulation)');
      if (input.twiAtCenter && input.twiAtCenter > 8) reasoning.push('High topographic wetness');
      if (distFromCenter < 100) reasoning.push('Near analysis center');

      candidates.push({
        latitude: Math.round(lat * 100000) / 100000,
        longitude: Math.round(lon * 100000) / 100000,
        rank: 0,
        probability: Math.round(prob * 1000) / 1000,
        expectedDepth_m: Math.round(expectedDepth),
        expectedYield_m3hr: Math.round(expectedYield * 100) / 100,
        score: Math.round(score * 10) / 10,
        distanceFromCenter_m: Math.round(distFromCenter),
        reasoning,
        riskLevel: prob > 0.7 ? 'low' : prob > 0.4 ? 'moderate' : 'high',
      });
    }
  }

  // Sort candidates by score
  candidates.sort((a, b) => b.score - a.score);

  // Assign ranks and pick top 5 (ensure minimum spacing of 100m between top picks)
  const topPoints: DrillPoint[] = [];
  for (const c of candidates) {
    if (topPoints.length >= 5) break;
    const tooClose = topPoints.some(t =>
      haversineM(t.latitude, t.longitude, c.latitude, c.longitude) < 100
    );
    if (tooClose) continue;
    c.rank = topPoints.length + 1;
    topPoints.push(c);
  }

  // Add specific reasoning for top points
  for (const tp of topPoints) {
    if (tp.rank === 1) tp.reasoning.unshift('HIGHEST probability drilling point');
    if (tp.rank <= 3) tp.reasoning.push(`Rank #${tp.rank} of ${candidates.length} evaluated points`);
  }

  // Statistics
  const probabilities = heatmap.map(h => h.probability);
  const avgProb = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
  const maxProb = Math.max(...probabilities);
  const minProb = Math.min(...probabilities);
  const highProbCells = heatmap.filter(h => h.probability > 0.7).length;
  const highProbArea = highProbCells * (cellSizeM / 1000) ** 2;

  return {
    topPoints,
    allCandidates: candidates.slice(0, 50), // top 50 only
    heatmap,
    gridRows: gridSize,
    gridCols: gridSize,
    cellSizeM,
    avgProbability: Math.round(avgProb * 1000) / 1000,
    maxProbability: Math.round(maxProb * 1000) / 1000,
    minProbability: Math.round(minProb * 1000) / 1000,
    highProbabilityArea_km2: Math.round(highProbArea * 100) / 100,
    coverageRadius_km: input.radiusKm,
    methodology: 'Multi-factor spatial probability model: slope, TWI, fracture proximity, drainage, vegetation, borehole history, kriging-inspired distance weighting',
    confidence: Math.min(0.92, 0.5 +
      (input.fractureDensity ? 0.1 : 0) +
      (input.nearbyBoreholes && input.nearbyBoreholes.length > 2 ? 0.12 : 0) +
      (input.twiAtCenter ? 0.08 : 0) +
      (input.geophysicsConfidence ? input.geophysicsConfidence * 0.15 : 0) +
      (input.vegetationIndex != null ? 0.05 : 0)),
  };
}

/* ── Canvas Heatmap Renderer ──────────────────────────────── */

export function renderDrillHeatmap(
  canvas: HTMLCanvasElement,
  result: DrillMapResult,
  width: number = 600,
  height: number = 600,
): void {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { heatmap, gridRows, gridCols, topPoints } = result;
  if (heatmap.length === 0) return;

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);

  const padding = 50;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const cellW = plotW / gridCols;
  const cellH = plotH / gridRows;

  // Draw heatmap cells
  for (const cell of heatmap) {
    const x = padding + cell.colIdx * cellW;
    const y = padding + cell.rowIdx * cellH;
    const color = probabilityColor(cell.probability);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellW + 1, cellH + 1);
  }

  // Draw top points markers
  for (const tp of topPoints) {
    // Find closest heatmap cell
    let best = heatmap[0];
    let bestDist = Infinity;
    for (const cell of heatmap) {
      const d = Math.abs(cell.latitude - tp.latitude) + Math.abs(cell.longitude - tp.longitude);
      if (d < bestDist) { bestDist = d; best = cell; }
    }

    const cx = padding + best.colIdx * cellW + cellW / 2;
    const cy = padding + best.rowIdx * cellH + cellH / 2;

    // Star marker
    ctx.beginPath();
    const r = tp.rank === 1 ? 14 : 10;
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
      const innerAngle = angle + Math.PI / 5;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.lineTo(cx + r * 0.4 * Math.cos(innerAngle), cy + r * 0.4 * Math.sin(innerAngle));
    }
    ctx.closePath();
    ctx.fillStyle = tp.rank === 1 ? '#FFD700' : tp.rank === 2 ? '#C0C0C0' : '#CD7F32';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rank label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${tp.rank}`, cx, cy);
  }

  // Center crosshair
  const cx = padding + plotW / 2;
  const cy = padding + plotH / 2;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(cx - 15, cy); ctx.lineTo(cx + 15, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy + 15); ctx.stroke();
  ctx.setLineDash([]);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Probabilistic Drilling Map', width / 2, 20);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.fillText(`${result.coverageRadius_km}km radius | ${heatmap.length} cells | ${result.cellSizeM}m resolution`, width / 2, 36);

  // Color legend
  const legendX = width - padding + 10;
  const legendH = plotH;
  const legendW = 15;
  for (let i = 0; i < legendH; i++) {
    const prob = 1 - i / legendH;
    ctx.fillStyle = probabilityColor(prob);
    ctx.fillRect(legendX, padding + i, legendW, 1);
  }
  ctx.fillStyle = '#fff';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('100%', legendX + legendW + 3, padding + 8);
  ctx.fillText('50%', legendX + legendW + 3, padding + legendH / 2);
  ctx.fillText('0%', legendX + legendW + 3, padding + legendH - 3);

  // Scale bar
  ctx.fillStyle = '#fff';
  ctx.fillRect(padding, height - 25, 60, 2);
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(result.cellSizeM * gridCols / 2)}m`, padding + 30, height - 10);

  // Top points legend
  ctx.textAlign = 'left';
  ctx.font = '10px sans-serif';
  for (let i = 0; i < Math.min(3, topPoints.length); i++) {
    const tp = topPoints[i];
    const y = height - 25 + i * 0; // compact
    ctx.fillStyle = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32';
    ctx.fillText(`★ #${tp.rank}: ${(tp.probability * 100).toFixed(0)}% @${tp.distanceFromCenter_m}m`, padding + 80 + i * 150, height - 10);
  }
}

/* ── Color Mapping ────────────────────────────────────────── */

function probabilityColor(prob: number): string {
  // Low (red) → Medium (yellow) → High (green) → Very High (cyan)
  if (prob < 0.25) {
    const t = prob / 0.25;
    return `rgb(${Math.round(180 + 75 * t)}, ${Math.round(30 + 70 * t)}, ${Math.round(30)})`;
  }
  if (prob < 0.5) {
    const t = (prob - 0.25) / 0.25;
    return `rgb(${Math.round(255 - 55 * t)}, ${Math.round(100 + 155 * t)}, ${Math.round(30)})`;
  }
  if (prob < 0.75) {
    const t = (prob - 0.5) / 0.25;
    return `rgb(${Math.round(200 - 160 * t)}, ${Math.round(255)}, ${Math.round(30 + 50 * t)})`;
  }
  const t = (prob - 0.75) / 0.25;
  return `rgb(${Math.round(40 - 20 * t)}, ${Math.round(255 - 30 * t)}, ${Math.round(80 + 175 * t)})`;
}

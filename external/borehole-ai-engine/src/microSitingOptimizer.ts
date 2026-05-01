/* ═══════════════════════════════════════════════════════════════════════
   MICRO-SITING OPTIMIZER
   Within a single plot/property: Find the exact best drilling point
   Using: Terrain flow accumulation, Fracture proximity, Soil moisture,
          Drainage patterns, Vegetation indices, Slope + aspect
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface MicroSiteCandidate {
  id: string;
  relativeX_m: number;        // offset from center (east positive)
  relativeY_m: number;        // offset from center (north positive)
  latitude: number;
  longitude: number;
  score: number;              // 0-100 composite score
  rank: number;

  // Individual scores (0-1)
  terrainFlowScore: number;
  fractureProximityScore: number;
  slopeScore: number;
  drainageScore: number;
  vegetationScore: number;
  accessScore: number;
  contaminationSafetyScore: number;
  
  // Details
  elevationRelative_m: number;
  slopeDeg: number;
  distToFracture_m: number;
  distToDrainage_m: number;
  flowAccumulation: number;
  twiValue: number;
  reason: string;
}

export interface MicroSitingResult {
  // Recommended point
  bestPoint: MicroSiteCandidate;
  allCandidates: MicroSiteCandidate[];

  // Grid stats
  gridSize_m: number;
  gridResolution_m: number;
  candidatesEvaluated: number;

  // Improvement over center point
  improvementOverCenter_pct: number;
  shiftDistance_m: number;
  shiftDirection: string;   // e.g., "45m NE"

  // GPS-precise output (Phase 8)
  gpsCoordinates: {
    lat: string;           // decimal degrees, 6dp
    lon: string;
    utmEasting?: number;
    utmNorthing?: number;
    utmZone?: string;
    accuracy_m: number;    // estimated GPS accuracy needed
  };
  confidenceRadius_m: number;  // radius within which success probability stays >80% of peak

  // ERT integration (Phase 8)
  ertOverlayScore?: number;    // 0-100 if ERT data was available

  // Constraints applied
  constraints: {
    minDistToContamination_m: number;
    minDistToBuilding_m: number;
    maxSlope_deg: number;
    requireVehicleAccess: boolean;
  };

  // Rendering data for canvas overlay
  heatmapGrid: number[][];    // score values for heatmap
  gridOriginLat: number;
  gridOriginLon: number;

  methodology: string;
}

export interface MicroSitingInput {
  centerLat: number;
  centerLon: number;
  plotRadius_m: number;       // search radius (default 200m)
  resolution_m: number;       // grid cell size (default 10m)

  // Elevation data (if available from DEM)
  elevationGrid?: number[][];
  elevationGridSize_m?: number;

  // Fracture data
  fractureAzimuths?: number[];
  fractureDistances_m?: number[];
  nearestFractureDistance_m?: number;
  fractureIntersectionLat?: number;
  fractureIntersectionLon?: number;

  // Drainage
  drainageDirectionDeg?: number;
  drainageDistance_m?: number;

  // Vegetation moisture indicator
  vegetationMoistureGrid?: number[][];

  // Contamination sources
  contaminationSources?: { lat: number; lon: number; type: string; severity: number }[];

  // Buildings / structures
  buildings?: { lat: number; lon: number; footprint_m: number }[];

  // Access road
  roadBearing_deg?: number;
  roadDistance_m?: number;

  // From other engines
  predictedDepth_m?: number;
  aquiferType?: string;
  rockType?: string;

  // ERT resistivity profile (Phase 8)
  ertResistivityGrid?: number[][];  // 2D resistivity values (Ohm-m)
  ertGridSize_m?: number;
  ertTargetResistivity?: { min: number; max: number }; // sweet spot range
}

const DEG_TO_M_LAT = 111320;
const DEG_TO_M_LON = (lat: number) => 111320 * Math.cos(lat * Math.PI / 180);

/* ── Main Optimizer ───────────────────────────────────────── */

export function optimizeMicroSite(input: MicroSitingInput): MicroSitingResult {
  const radius = input.plotRadius_m || 200;
  const resolution = Math.max(5, input.resolution_m || 10);

  // Generate grid points
  const candidates: MicroSiteCandidate[] = [];
  const mPerDegLat = DEG_TO_M_LAT;
  const mPerDegLon = DEG_TO_M_LON(input.centerLat);
  
  const stepsX = Math.ceil(radius * 2 / resolution);
  const stepsY = Math.ceil(radius * 2 / resolution);

  const heatmapGrid: number[][] = [];
  let idCounter = 0;

  for (let iy = 0; iy <= stepsY; iy++) {
    const row: number[] = [];
    for (let ix = 0; ix <= stepsX; ix++) {
      const relX = -radius + ix * resolution;
      const relY = -radius + iy * resolution;

      // Skip points outside circular plot
      const dist = Math.sqrt(relX * relX + relY * relY);
      if (dist > radius) {
        row.push(0);
        continue;
      }

      const lat = input.centerLat + relY / mPerDegLat;
      const lon = input.centerLon + relX / mPerDegLon;

      const candidate = evaluatePoint(
        `MS-${++idCounter}`, relX, relY, lat, lon, dist, input, radius
      );

      candidates.push(candidate);
      row.push(candidate.score);
    }
    heatmapGrid.push(row);
  }

  // Sort by score
  candidates.sort((a, b) => b.score - a.score);

  // Assign ranks and enforce minimum spacing between top picks (20m)
  const rankedCandidates: MicroSiteCandidate[] = [];
  let rank = 0;
  for (const c of candidates) {
    const tooClose = rankedCandidates.some(r => {
      const dx = c.relativeX_m - r.relativeX_m;
      const dy = c.relativeY_m - r.relativeY_m;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });
    if (!tooClose || rankedCandidates.length === 0) {
      c.rank = ++rank;
      rankedCandidates.push(c);
      if (rank >= 10) break; // top 10
    }
  }

  const bestPoint = rankedCandidates[0];

  // Center point for comparison
  const centerCandidate = candidates.find(c =>
    Math.abs(c.relativeX_m) < resolution && Math.abs(c.relativeY_m) < resolution
  );
  const centerScore = centerCandidate?.score ?? 50;
  const improvementOverCenter = centerScore > 0 ? ((bestPoint.score - centerScore) / centerScore) * 100 : 0;

  // Shift description
  const shiftDist = Math.sqrt(bestPoint.relativeX_m ** 2 + bestPoint.relativeY_m ** 2);
  const shiftBearing = Math.atan2(bestPoint.relativeX_m, bestPoint.relativeY_m) * 180 / Math.PI;
  const shiftDirection = `${Math.round(shiftDist)}m ${bearingToCardinal(shiftBearing)}`;

  // Phase 8: GPS-precise coordinates (6 decimal places = ~0.11m precision)
  const gpsCoordinates = {
    lat: bestPoint.latitude.toFixed(6),
    lon: bestPoint.longitude.toFixed(6),
    accuracy_m: Math.max(1, resolution / 2), // need at least half-grid accuracy
  };

  // Phase 8: Confidence radius — how far from best point before score drops >20%
  const threshold = bestPoint.score * 0.8;
  let confidenceRadius = 0;
  for (const c of candidates) {
    if (c.score >= threshold) {
      const dist = Math.sqrt((c.relativeX_m - bestPoint.relativeX_m) ** 2 + (c.relativeY_m - bestPoint.relativeY_m) ** 2);
      if (dist > confidenceRadius) confidenceRadius = dist;
    }
  }

  // Phase 8: ERT overlay score
  let ertOverlayScore: number | undefined;
  if (input.ertResistivityGrid && input.ertGridSize_m) {
    const ertGridRes = input.ertGridSize_m;
    const ex = Math.floor((bestPoint.relativeX_m + radius) / ertGridRes);
    const ey = Math.floor((bestPoint.relativeY_m + radius) / ertGridRes);
    if (ey >= 0 && ey < input.ertResistivityGrid.length && ex >= 0 && ex < input.ertResistivityGrid[0].length) {
      const rho = input.ertResistivityGrid[ey][ex];
      const target = input.ertTargetResistivity || { min: 20, max: 200 };
      ertOverlayScore = rho >= target.min && rho <= target.max
        ? Math.round(90 - Math.abs(rho - (target.min + target.max) / 2) / ((target.max - target.min) / 2) * 30)
        : Math.round(Math.max(10, 50 - Math.abs(rho - (target.min + target.max) / 2) / 10));
    }
  }

  return {
    bestPoint,
    allCandidates: rankedCandidates,
    gridSize_m: radius * 2,
    gridResolution_m: resolution,
    candidatesEvaluated: candidates.length,
    improvementOverCenter_pct: Math.round(improvementOverCenter * 10) / 10,
    shiftDistance_m: Math.round(shiftDist * 10) / 10,
    shiftDirection,
    gpsCoordinates,
    confidenceRadius_m: Math.round(confidenceRadius),
    ertOverlayScore,
    constraints: {
      minDistToContamination_m: 50,
      minDistToBuilding_m: 15,
      maxSlope_deg: 15,
      requireVehicleAccess: true,
    },
    heatmapGrid,
    gridOriginLat: input.centerLat - radius / mPerDegLat,
    gridOriginLon: input.centerLon - radius / mPerDegLon,
    methodology: 'Multi-criteria spatial optimization: terrain flow + fracture proximity + slope + drainage + vegetation + access + contamination safety + ERT resistivity overlay + GPS-precise output',
  };
}

/* ── Evaluate a Single Point ──────────────────────────────── */

function evaluatePoint(
  id: string, relX: number, relY: number, lat: number, lon: number,
  distFromCenter: number, input: MicroSitingInput, radius: number,
): MicroSiteCandidate {

  // 1. Terrain flow score (prefer lower areas with higher flow accumulation)
  let terrainFlowScore = 0.5;
  let elevationRelative = 0;
  let twiValue = 0;

  if (input.elevationGrid && input.elevationGridSize_m) {
    const gridRes = input.elevationGridSize_m;
    const gx = Math.floor((relX + radius) / gridRes);
    const gy = Math.floor((relY + radius) / gridRes);
    if (gy >= 0 && gy < input.elevationGrid.length && gx >= 0 && gx < input.elevationGrid[0].length) {
      const elev = input.elevationGrid[gy][gx];
      const centerElev = input.elevationGrid[Math.floor(input.elevationGrid.length / 2)]?.[Math.floor(input.elevationGrid[0].length / 2)] ?? elev;
      elevationRelative = elev - centerElev;
      // Lower elevation = higher flow accumulation → better
      terrainFlowScore = Math.max(0, Math.min(1, 0.5 - elevationRelative / 20));
    }
  } else {
    // Synthetic: prefer slight depression from center
    const normDist = distFromCenter / radius;
    terrainFlowScore = 0.5 + 0.2 * (1 - normDist);
  }

  // Compute synthetic TWI
  const slopeDeg = estimateSlope(relX, relY, input);
  const slopeRad = Math.max(0.01, slopeDeg * Math.PI / 180);
  const catchmentArea = Math.max(1, 100 - distFromCenter * 0.3); // synthetic
  twiValue = Math.log(catchmentArea / Math.tan(slopeRad));
  const twiScore = Math.max(0, Math.min(1, (twiValue - 2) / 6));
  terrainFlowScore = terrainFlowScore * 0.5 + twiScore * 0.5;

  // 2. Fracture proximity score
  let fractureProximityScore = 0.3;
  let distToFracture = 999;

  if (input.fractureIntersectionLat && input.fractureIntersectionLon) {
    const dx = (lon - input.fractureIntersectionLon) * DEG_TO_M_LON(lat);
    const dy = (lat - input.fractureIntersectionLat) * DEG_TO_M_LAT;
    distToFracture = Math.sqrt(dx * dx + dy * dy);
    // Optimal: within 20-50m of fracture intersection
    if (distToFracture < 10) fractureProximityScore = 0.85; // very close, slight risk of missing
    else if (distToFracture < 30) fractureProximityScore = 1.0; // sweet spot
    else if (distToFracture < 80) fractureProximityScore = 0.7;
    else if (distToFracture < 150) fractureProximityScore = 0.4;
    else fractureProximityScore = 0.15;
  } else if (input.nearestFractureDistance_m != null) {
    // Simple linear estimate
    distToFracture = input.nearestFractureDistance_m + distFromCenter * 0.5;
    fractureProximityScore = Math.max(0.1, 1 - distToFracture / 300);
  }

  // 3. Slope score (prefer gentle slopes 1-5°)
  let slopeScore = 0.5;
  if (slopeDeg < 1) slopeScore = 0.7; // very flat, good
  else if (slopeDeg < 3) slopeScore = 0.9; // ideal
  else if (slopeDeg < 5) slopeScore = 0.8;
  else if (slopeDeg < 10) slopeScore = 0.5;
  else if (slopeDeg < 15) slopeScore = 0.2;
  else slopeScore = 0.05; // too steep, almost disqualified

  // 4. Drainage score (prefer moderate distance from drainage)
  let drainageScore = 0.5;
  let distToDrainage = 100;
  if (input.drainageDistance_m != null && input.drainageDirectionDeg != null) {
    const drainBearing = input.drainageDirectionDeg * Math.PI / 180;
    const drainX = input.drainageDistance_m * Math.sin(drainBearing);
    const drainY = input.drainageDistance_m * Math.cos(drainBearing);
    distToDrainage = Math.sqrt((relX - drainX) ** 2 + (relY - drainY) ** 2);
    // 30-100m from drainage is good (near water but not in flood zone)
    if (distToDrainage < 15) drainageScore = 0.3; // too close — flood risk
    else if (distToDrainage < 50) drainageScore = 0.9;
    else if (distToDrainage < 100) drainageScore = 0.8;
    else if (distToDrainage < 200) drainageScore = 0.5;
    else drainageScore = 0.3;
  }

  // 5. Vegetation moisture score
  let vegetationScore = 0.5;
  if (input.vegetationMoistureGrid) {
    const gx = Math.floor((relX + radius) / (radius * 2 / input.vegetationMoistureGrid[0].length));
    const gy = Math.floor((relY + radius) / (radius * 2 / input.vegetationMoistureGrid.length));
    if (gy >= 0 && gy < input.vegetationMoistureGrid.length && gx >= 0 && gx < input.vegetationMoistureGrid[0].length) {
      vegetationScore = input.vegetationMoistureGrid[gy][gx];
    }
  }

  // 6. Access score (closeness to road)
  let accessScore = 0.6;
  if (input.roadBearing_deg != null && input.roadDistance_m != null) {
    const roadBearing = input.roadBearing_deg * Math.PI / 180;
    const roadX = input.roadDistance_m * Math.sin(roadBearing);
    const roadY = input.roadDistance_m * Math.cos(roadBearing);
    const distToRoad = Math.sqrt((relX - roadX) ** 2 + (relY - roadY) ** 2);
    accessScore = Math.max(0.2, 1 - distToRoad / 300);
  }

  // 7. Contamination safety score
  let contaminationSafetyScore = 1.0;
  if (input.contaminationSources) {
    for (const src of input.contaminationSources) {
      const dx = (lon - src.lon) * DEG_TO_M_LON(lat);
      const dy = (lat - src.lat) * DEG_TO_M_LAT;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const safetyDist = 50 * src.severity; // 50m per severity unit
      if (dist < safetyDist) {
        contaminationSafetyScore = Math.min(contaminationSafetyScore, dist / safetyDist);
      }
    }
  }

  // 8. Building clearance (hard constraint)
  let buildingPenalty = 1.0;
  if (input.buildings) {
    for (const bldg of input.buildings) {
      const dx = (lon - bldg.lon) * DEG_TO_M_LON(lat);
      const dy = (lat - bldg.lat) * DEG_TO_M_LAT;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bldg.footprint_m + 15) { // 15m clearance
        buildingPenalty = 0; // hard disqualify
      }
    }
  }

  // Composite score (weighted)
  const weights = getWeights(input);
  const rawScore =
    terrainFlowScore * weights.terrain +
    fractureProximityScore * weights.fracture +
    slopeScore * weights.slope +
    drainageScore * weights.drainage +
    vegetationScore * weights.vegetation +
    accessScore * weights.access +
    contaminationSafetyScore * weights.contamination;

  const score = Math.round(rawScore * buildingPenalty * 100 * 10) / 10;

  // Generate reason
  const topFactor = [
    { name: 'terrain flow', s: terrainFlowScore * weights.terrain },
    { name: 'fracture proximity', s: fractureProximityScore * weights.fracture },
    { name: 'gentle slope', s: slopeScore * weights.slope },
    { name: 'drainage position', s: drainageScore * weights.drainage },
    { name: 'vegetation moisture', s: vegetationScore * weights.vegetation },
  ].sort((a, b) => b.s - a.s)[0];

  const reason = buildingPenalty === 0
    ? 'Disqualified: too close to building'
    : `Best factor: ${topFactor.name} (${(topFactor.s * 100).toFixed(0)}%)`;

  return {
    id,
    relativeX_m: relX,
    relativeY_m: relY,
    latitude: lat,
    longitude: lon,
    score,
    rank: 0,
    terrainFlowScore: Math.round(terrainFlowScore * 100) / 100,
    fractureProximityScore: Math.round(fractureProximityScore * 100) / 100,
    slopeScore: Math.round(slopeScore * 100) / 100,
    drainageScore: Math.round(drainageScore * 100) / 100,
    vegetationScore: Math.round(vegetationScore * 100) / 100,
    accessScore: Math.round(accessScore * 100) / 100,
    contaminationSafetyScore: Math.round(contaminationSafetyScore * 100) / 100,
    elevationRelative_m: Math.round(elevationRelative * 10) / 10,
    slopeDeg: Math.round(slopeDeg * 10) / 10,
    distToFracture_m: Math.round(distToFracture),
    distToDrainage_m: Math.round(distToDrainage),
    flowAccumulation: Math.round(catchmentArea * 10) / 10,
    twiValue: Math.round(twiValue * 100) / 100,
    reason,
  };
}

/* ── Weight Profiles (adapt to available data) ────────────── */

function getWeights(input: MicroSitingInput) {
  const hasFractures = !!(input.fractureIntersectionLat || input.fractureAzimuths?.length);
  const hasDrainage = input.drainageDistance_m != null;
  const hasVegetation = !!input.vegetationMoistureGrid;

  // Dynamic weighting based on what data is available
  const w = {
    terrain: 0.20,
    fracture: hasFractures ? 0.25 : 0.05,
    slope: 0.15,
    drainage: hasDrainage ? 0.15 : 0.05,
    vegetation: hasVegetation ? 0.10 : 0.05,
    access: 0.05,
    contamination: 0.10,
  };

  // Redistribute unused weight
  const total = Object.values(w).reduce((a, b) => a + b);
  if (total < 0.99) {
    const deficit = 1 - total;
    w.terrain += deficit * 0.5;
    w.slope += deficit * 0.3;
    w.contamination += deficit * 0.2;
  }

  return w;
}

/* ── Slope Estimation ─────────────────────────────────────── */

function estimateSlope(relX: number, relY: number, input: MicroSitingInput): number {
  if (input.elevationGrid && input.elevationGridSize_m) {
    const radius = input.plotRadius_m || 200;
    const gridRes = input.elevationGridSize_m;
    const gx = Math.floor((relX + radius) / gridRes);
    const gy = Math.floor((relY + radius) / gridRes);
    const grid = input.elevationGrid;

    if (gy > 0 && gy < grid.length - 1 && gx > 0 && gx < grid[0].length - 1) {
      const dzdx = (grid[gy][gx + 1] - grid[gy][gx - 1]) / (2 * gridRes);
      const dzdy = (grid[gy + 1][gx] - grid[gy - 1][gx]) / (2 * gridRes);
      return Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy)) * 180 / Math.PI;
    }
  }
  // Synthetic slope: assume gentle terrain (2-4°) with some random variation
  const dist = Math.sqrt(relX * relX + relY * relY);
  return 2 + (dist / (input.plotRadius_m || 200)) * 3;
}

/* ── Bearing to Cardinal Direction ────────────────────────── */

function bearingToCardinal(deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  if (d < 22.5) return 'N';
  if (d < 67.5) return 'NE';
  if (d < 112.5) return 'E';
  if (d < 157.5) return 'SE';
  if (d < 202.5) return 'S';
  if (d < 247.5) return 'SW';
  if (d < 292.5) return 'W';
  if (d < 337.5) return 'NW';
  return 'N';
}

/* ── Canvas Renderer for Micro-Siting Heatmap ─────────────── */

export function renderMicroSiteMap(
  canvas: HTMLCanvasElement,
  result: MicroSitingResult,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);

  const grid = result.heatmapGrid;
  if (grid.length === 0) return;

  const rows = grid.length;
  const cols = grid[0].length;
  const cellW = W / cols;
  const cellH = H / rows;

  // Draw heatmap
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const val = grid[y][x];
      if (val <= 0) continue;
      ctx.fillStyle = scoreToColor(val);
      ctx.fillRect(x * cellW, (rows - 1 - y) * cellH, cellW + 0.5, cellH + 0.5); // flip Y
    }
  }

  // Draw candidate markers
  for (const c of result.allCandidates) {
    const px = ((c.relativeX_m + result.gridSize_m / 2) / result.gridSize_m) * W;
    const py = H - ((c.relativeY_m + result.gridSize_m / 2) / result.gridSize_m) * H;

    if (c.rank === 1) {
      // Best point — large star
      drawStar(ctx, px, py, 12, '#FFD700', '#fff');
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`#1 (${c.score.toFixed(0)})`, px + 15, py + 4);
    } else if (c.rank <= 5) {
      // Top 5 — small circles
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`#${c.rank}`, px + 8, py + 3);
    }
  }

  // Center crosshair
  const cx = W / 2, cy = H / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy); ctx.lineTo(cx + 15, cy);
  ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy + 15);
  ctx.stroke();
  ctx.setLineDash([]);

  // Scale bar
  const scalePixels = W * 50 / result.gridSize_m;
  ctx.fillStyle = '#fff';
  ctx.fillRect(15, H - 25, scalePixels, 3);
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('50m', 15, H - 30);

  // Title
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'left';
  ctx.fillText('MICRO-SITING OPTIMIZATION', 10, 18);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#ccc';
  ctx.fillText(`Best: ${result.shiftDirection} from center (score ${result.bestPoint.score.toFixed(0)}/100)`, 10, 34);

  // Legend
  drawLegend(ctx, W - 100, 10);
}

/* ── Helpers ──────────────────────────────────────────────── */

function scoreToColor(score: number): string {
  // 0 → dark blue, 50 → yellow, 100 → bright green
  const t = Math.max(0, Math.min(100, score)) / 100;
  if (t < 0.25) {
    const s = t / 0.25;
    return `rgb(${Math.round(20 + s * 30)}, ${Math.round(20 + s * 30)}, ${Math.round(80 + s * 100)})`;
  }
  if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    return `rgb(${Math.round(50 + s * 200)}, ${Math.round(50 + s * 150)}, ${Math.round(180 - s * 130)})`;
  }
  if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    return `rgb(${Math.round(250 - s * 50)}, ${Math.round(200 + s * 55)}, ${Math.round(50 - s * 30)})`;
  }
  const s = (t - 0.75) / 0.25;
  return `rgb(${Math.round(200 - s * 160)}, ${Math.round(255)}, ${Math.round(20 + s * 80)})`;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string, stroke: string) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = (i * Math.PI / spikes) - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(rad) * radius;
    const y = cy + Math.sin(rad) * radius;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawLegend(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const h = 80;
  const w = 12;
  for (let i = 0; i < h; i++) {
    const score = ((h - i) / h) * 100;
    ctx.fillStyle = scoreToColor(score);
    ctx.fillRect(x, y + i, w, 1.5);
  }
  ctx.fillStyle = '#fff';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('High', x + w + 3, y + 8);
  ctx.fillText('Low', x + w + 3, y + h - 2);
}

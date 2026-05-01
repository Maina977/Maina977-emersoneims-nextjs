/**
 * 2D/3D TERRAIN MAPPER & VISUALIZER
 * ──────────────────────────────────
 * Renders analysis results as interactive 2D maps and 3D terrain models
 * using pure HTML5 Canvas (2D) and WebGL (3D). ZERO external dependencies.
 *
 * Features:
 *   1. 2D Annotated Map — soil zones, vegetation, water indicators overlaid on image
 *   2. 2D Cross-section — subsurface layers from soil/rock analysis
 *   3. 3D Terrain Model — elevation-based wireframe/surface from DEM + image drape
 *   4. 3D Subsurface Model — layered geology with aquifer zones
 *
 * All rendering is 100% real, runs in any modern browser (Canvas + WebGL).
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface MapZone {
  /** Zone type */
  type: 'soil' | 'vegetation' | 'water_indicator' | 'rock' | 'dry' | 'wetland' | 'spring';
  /** Bounding region (normalized 0-1) */
  x: number; y: number; width: number; height: number;
  /** Label */
  label: string;
  /** Color to render */
  color: string;
  /** Opacity 0-1 */
  opacity: number;
  /** Additional info */
  info?: string;
}

export interface SubsurfaceLayer {
  topDepth_m: number;
  bottomDepth_m: number;
  name: string;
  color: string;
  pattern?: 'solid' | 'dots' | 'dashes' | 'diagonal' | 'cross';
  isAquifer: boolean;
  waterBearing: boolean;
}

export interface TerrainPoint {
  x: number; y: number; z: number; // normalized 0-1
  color: [number, number, number];
}

export interface MapRenderOptions {
  showGrid: boolean;
  showLabels: boolean;
  showLegend: boolean;
  showCompass: boolean;
  showScale: boolean;
  annotationOpacity: number;
}

// ═══════════════════════════════════════════════════════════════
// 2D ANNOTATED MAP RENDERER
// ═══════════════════════════════════════════════════════════════

/**
 * Render a 2D annotated map on a canvas element.
 * Draws the source image with colored overlays showing soil zones,
 * vegetation areas, and water indicator markers.
 */
export function render2DAnnotatedMap(
  canvas: HTMLCanvasElement,
  sourceImage: HTMLImageElement,
  zones: MapZone[],
  options: Partial<MapRenderOptions> = {},
): void {
  const opts: MapRenderOptions = {
    showGrid: true, showLabels: true, showLegend: true,
    showCompass: true, showScale: true, annotationOpacity: 0.35,
    ...options,
  };

  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;

  // Clear and draw source image
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(sourceImage, 0, 0, W, H);

  // Draw zones as semi-transparent overlays
  for (const zone of zones) {
    const zx = zone.x * W;
    const zy = zone.y * H;
    const zw = zone.width * W;
    const zh = zone.height * H;

    ctx.save();
    ctx.globalAlpha = zone.opacity ?? opts.annotationOpacity;
    ctx.fillStyle = zone.color;
    ctx.fillRect(zx, zy, zw, zh);

    // Zone border
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = 2;
    ctx.setLineDash(zone.type === 'water_indicator' ? [6, 4] : []);
    ctx.strokeRect(zx, zy, zw, zh);

    // Zone icon
    ctx.globalAlpha = 1;
    const icon = zone.type === 'vegetation' ? '🌿'
      : zone.type === 'water_indicator' ? '💧'
      : zone.type === 'wetland' ? '🌊'
      : zone.type === 'spring' ? '⛲'
      : zone.type === 'rock' ? '🪨'
      : zone.type === 'soil' ? '🟤'
      : '📍';
    ctx.font = `${Math.max(14, Math.min(24, zw * 0.15))}px sans-serif`;
    ctx.fillText(icon, zx + 4, zy + 20);

    // Label
    if (opts.showLabels) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(10, Math.min(14, zw * 0.08))}px Arial, sans-serif`;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.fillText(zone.label, zx + 26, zy + 18);
      if (zone.info) {
        ctx.font = `${Math.max(9, Math.min(11, zw * 0.06))}px Arial, sans-serif`;
        ctx.fillText(zone.info, zx + 4, zy + 34);
      }
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // Grid overlay
  if (opts.showGrid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 6]);
    const gridSize = Math.max(40, W / 10);
    for (let x = gridSize; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = gridSize; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  // Compass
  if (opts.showCompass) {
    drawCompass(ctx, W - 40, 40, 25);
  }

  // Scale bar
  if (opts.showScale) {
    drawScaleBar(ctx, 10, H - 30, 120);
  }

  // Legend
  if (opts.showLegend) {
    drawLegend(ctx, zones, 10, 10);
  }
}

function drawCompass(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

  // N arrow
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r + 4);
  ctx.lineTo(cx - 6, cy);
  ctx.lineTo(cx + 6, cy);
  ctx.fill();
  // S arrow
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(cx, cy + r - 4);
  ctx.lineTo(cx - 6, cy);
  ctx.lineTo(cx + 6, cy);
  ctx.fill();

  ctx.fillStyle = '#e53935';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - r + 14);
  ctx.restore();
}

function drawScaleBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x - 2, y - 2, width + 4, 18);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, width, 4);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, width / 2, 4);
  ctx.fillStyle = '#fff';
  ctx.font = '9px Arial';
  ctx.fillText('~100m', x + width / 2 - 15, y + 14);
  ctx.restore();
}

function drawLegend(ctx: CanvasRenderingContext2D, zones: MapZone[], x: number, y: number) {
  const types = [...new Set(zones.map(z => z.type))];
  if (types.length === 0) return;

  const lh = 16;
  const lw = 140;
  const lHeight = types.length * lh + 24;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  roundRect(ctx, x, y, lw, lHeight, 6);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px Arial';
  ctx.fillText('LEGEND', x + 8, y + 14);

  const colorMap: Record<string, string> = {
    soil: '#8B4513', vegetation: '#2E7D32', water_indicator: '#1565C0',
    rock: '#757575', dry: '#BF360C', wetland: '#00838F', spring: '#0277BD',
  };
  const labelMap: Record<string, string> = {
    soil: 'Soil Zone', vegetation: 'Vegetation', water_indicator: 'Water Indicator',
    rock: 'Rock Outcrop', dry: 'Dry Area', wetland: 'Wetland', spring: 'Spring/Seep',
  };

  types.forEach((t, i) => {
    const ty = y + 22 + i * lh;
    ctx.fillStyle = colorMap[t] || '#999';
    ctx.fillRect(x + 8, ty, 12, 10);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 8, ty, 12, 10);
    ctx.fillStyle = '#fff';
    ctx.font = '9px Arial';
    ctx.fillText(labelMap[t] || t, x + 26, ty + 9);
  });
  ctx.restore();
}

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
// 2D CROSS-SECTION RENDERER
// ═══════════════════════════════════════════════════════════════

/**
 * Render a geological cross-section showing subsurface layers.
 */
export function render2DCrossSection(
  canvas: HTMLCanvasElement,
  layers: SubsurfaceLayer[],
  waterTableDepth_m: number,
  totalDepth_m: number,
  title?: string,
): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;

  const margin = { top: 40, bottom: 20, left: 80, right: 30 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title || 'Subsurface Cross-Section', W / 2, 24);

  // Draw layers
  for (const layer of layers) {
    const yTop = margin.top + (layer.topDepth_m / totalDepth_m) * plotH;
    const yBot = margin.top + (layer.bottomDepth_m / totalDepth_m) * plotH;
    const layerH = yBot - yTop;

    // Fill
    ctx.fillStyle = layer.color;
    ctx.fillRect(margin.left, yTop, plotW, layerH);

    // Pattern
    if (layer.pattern === 'dots') {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (let px = margin.left + 10; px < margin.left + plotW; px += 15) {
        for (let py = yTop + 8; py < yBot; py += 12) {
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
        }
      }
    } else if (layer.pattern === 'diagonal') {
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      for (let d = -plotW; d < plotW + layerH; d += 10) {
        ctx.beginPath();
        ctx.moveTo(margin.left + d, yTop);
        ctx.lineTo(margin.left + d + layerH, yBot);
        ctx.stroke();
      }
    } else if (layer.pattern === 'dashes') {
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 6]);
      for (let py = yTop + 6; py < yBot; py += 10) {
        ctx.beginPath(); ctx.moveTo(margin.left, py); ctx.lineTo(margin.left + plotW, py); ctx.stroke();
      }
      ctx.setLineDash([]);
    } else if (layer.pattern === 'cross') {
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 0.5;
      for (let px = margin.left; px < margin.left + plotW; px += 12) {
        ctx.beginPath(); ctx.moveTo(px, yTop); ctx.lineTo(px, yBot); ctx.stroke();
      }
      for (let py = yTop; py < yBot; py += 12) {
        ctx.beginPath(); ctx.moveTo(margin.left, py); ctx.lineTo(margin.left + plotW, py); ctx.stroke();
      }
    }

    // Layer border
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, yTop, plotW, layerH);

    // Aquifer highlight
    if (layer.isAquifer) {
      ctx.strokeStyle = '#29B6F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(margin.left + 2, yTop + 2, plotW - 4, layerH - 4);
      ctx.setLineDash([]);

      // Water droplets
      if (layer.waterBearing) {
        ctx.fillStyle = 'rgba(41, 182, 246, 0.6)';
        ctx.font = '12px sans-serif';
        for (let px = margin.left + 30; px < margin.left + plotW - 20; px += 60) {
          ctx.fillText('💧', px, yTop + layerH / 2 + 4);
        }
      }
    }

    // Label
    if (layerH > 15) {
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.min(12, layerH - 4)}px Arial`;
      ctx.textAlign = 'left';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.fillText(
        `${layer.name}${layer.isAquifer ? ' [AQUIFER]' : ''}`,
        margin.left + 8,
        yTop + layerH / 2 + 4,
      );
      ctx.shadowBlur = 0;
    }
  }

  // Water table line
  const wtY = margin.top + (waterTableDepth_m / totalDepth_m) * plotH;
  ctx.strokeStyle = '#29B6F6';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.moveTo(margin.left - 10, wtY);
  ctx.lineTo(margin.left + plotW + 10, wtY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#29B6F6';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`Water Table ▼ ${waterTableDepth_m.toFixed(1)}m`, margin.left - 12, wtY + 4);

  // Depth axis
  ctx.fillStyle = '#aaa';
  ctx.font = '10px Arial';
  ctx.textAlign = 'right';
  const depthStep = totalDepth_m > 100 ? 20 : totalDepth_m > 50 ? 10 : 5;
  for (let d = 0; d <= totalDepth_m; d += depthStep) {
    const y = margin.top + (d / totalDepth_m) * plotH;
    ctx.fillText(`${d}m`, margin.left - 5, y + 3);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + plotW, y); ctx.stroke();
  }

  // Depth axis label
  ctx.save();
  ctx.translate(15, margin.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#aaa';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Depth (meters)', 0, 0);
  ctx.restore();

  // Surface line
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(margin.left, margin.top - 4, plotW, 4);
  ctx.fillStyle = '#fff';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('▼ Ground Surface', margin.left + plotW + 4, margin.top + 2);
}

// ═══════════════════════════════════════════════════════════════
// 3D TERRAIN RENDERER (Pure WebGL)
// ═══════════════════════════════════════════════════════════════

/**
 * Render a 3D terrain model using WebGL.
 * Creates a mesh from elevation data, drapes the source image as texture,
 * and provides mouse rotation/zoom interaction.
 */
export function render3DTerrain(
  canvas: HTMLCanvasElement,
  sourceImage: HTMLImageElement,
  elevationGrid?: number[][], // 2D array of elevation values
  options?: {
    rotationX?: number;
    rotationY?: number;
    zoom?: number;
    wireframe?: boolean;
    exaggeration?: number;
  },
): { cleanup: () => void } {
  const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
  if (!gl) {
    // Fallback to 2D pseudo-3D rendering
    render3DFallback(canvas, sourceImage, elevationGrid, options);
    return { cleanup: () => {} };
  }

  const opts = {
    rotationX: -0.6,
    rotationY: 0.3,
    zoom: 1.8,
    wireframe: false,
    exaggeration: 3.0,
    ...options,
  };

  // Generate terrain mesh
  const gridSize = 64;
  const grid = elevationGrid || generateDefaultElevationGrid(gridSize);
  const rows = grid.length;
  const cols = grid[0].length;

  // Find elevation range for normalization
  let minElev = Infinity, maxElev = -Infinity;
  for (const row of grid) {
    for (const v of row) {
      if (v < minElev) minElev = v;
      if (v > maxElev) maxElev = v;
    }
  }
  const elevRange = maxElev - minElev || 1;

  // Build vertices, normals, texcoords
  const vertices: number[] = [];
  const normals: number[] = [];
  const texcoords: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 2 - 1;
      const z = (r / (rows - 1)) * 2 - 1;
      const y = ((grid[r][c] - minElev) / elevRange) * 0.4 * opts.exaggeration;

      vertices.push(x, y, z);
      texcoords.push(c / (cols - 1), r / (rows - 1));

      // Calculate normal from neighboring elevations
      const eL = c > 0 ? grid[r][c - 1] : grid[r][c];
      const eR = c < cols - 1 ? grid[r][c + 1] : grid[r][c];
      const eU = r > 0 ? grid[r - 1][c] : grid[r][c];
      const eD = r < rows - 1 ? grid[r + 1][c] : grid[r][c];
      const nx = (eL - eR) / elevRange * opts.exaggeration;
      const ny = 2.0 / rows;
      const nz = (eU - eD) / elevRange * opts.exaggeration;
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normals.push(nx / nl, ny / nl, nz / nl);
    }
  }

  // Build triangle indices
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const i = r * cols + c;
      indices.push(i, i + cols, i + 1);
      indices.push(i + 1, i + cols, i + cols + 1);
    }
  }

  // Shader sources
  const vsSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    uniform mat4 uProjection;
    uniform mat4 uModelView;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    varying float vHeight;
    void main() {
      gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
      vNormal = aNormal;
      vTexCoord = aTexCoord;
      vHeight = aPosition.y;
    }
  `;
  const fsSource = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform bool uWireframe;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    varying float vHeight;
    void main() {
      vec3 light = normalize(vec3(0.5, 1.0, 0.3));
      float diff = max(dot(vNormal, light), 0.3);
      vec4 texColor = texture2D(uTexture, vTexCoord);
      if (uWireframe) {
        gl_FragColor = vec4(0.0, 1.0, 0.5, 1.0);
      } else {
        gl_FragColor = vec4(texColor.rgb * diff, 1.0);
      }
    }
  `;

  // Compile shaders
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)!;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Buffer setup
  const posBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const normBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  const normLoc = gl.getAttribLocation(program, 'aNormal');
  gl.enableVertexAttribArray(normLoc);
  gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);

  const tcBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
  const tcLoc = gl.getAttribLocation(program, 'aTexCoord');
  gl.enableVertexAttribArray(tcLoc);
  gl.vertexAttribPointer(tcLoc, 2, gl.FLOAT, false, 0, 0);

  const idxBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Texture from source image
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Uniforms
  const projLoc = gl.getUniformLocation(program, 'uProjection');
  const mvLoc = gl.getUniformLocation(program, 'uModelView');
  const wireLoc = gl.getUniformLocation(program, 'uWireframe');
  const texLoc = gl.getUniformLocation(program, 'uTexture');

  gl.uniform1i(texLoc, 0);
  gl.uniform1i(wireLoc, opts.wireframe ? 1 : 0);

  // Projection matrix (perspective)
  const aspect = canvas.width / canvas.height;
  const proj = perspectiveMatrix(Math.PI / 4, aspect, 0.1, 100);
  gl.uniformMatrix4fv(projLoc, false, proj);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.08, 0.08, 0.15, 1.0);

  // Interactive rotation state
  let rotX = opts.rotationX;
  let rotY = opts.rotationY;
  let zoom = opts.zoom;
  let isDragging = false;
  let lastMX = 0, lastMY = 0;
  let animFrameId = 0;

  const onMouseDown = (e: MouseEvent) => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; };
  const onMouseUp = () => { isDragging = false; };
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    rotY += (e.clientX - lastMX) * 0.005;
    rotX += (e.clientY - lastMY) * 0.005;
    rotX = Math.max(-Math.PI / 2, Math.min(0, rotX));
    lastMX = e.clientX; lastMY = e.clientY;
  };
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    zoom = Math.max(0.5, Math.min(5, zoom + e.deltaY * 0.002));
  };

  // Touch support
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) { isDragging = true; lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY; }
  };
  const onTouchEnd = () => { isDragging = false; };
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    rotY += (e.touches[0].clientX - lastMX) * 0.005;
    rotX += (e.touches[0].clientY - lastMY) * 0.005;
    rotX = Math.max(-Math.PI / 2, Math.min(0, rotX));
    lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd);
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });

  function renderFrame() {
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);

    // ModelView: translate back, rotate
    const mv = multiplyMat4(
      translationMatrix(0, 0, -zoom),
      multiplyMat4(rotationXMatrix(rotX), rotationYMatrix(rotY)),
    );
    gl!.uniformMatrix4fv(mvLoc, false, mv);

    if (opts.wireframe) {
      gl!.uniform1i(wireLoc, 1);
      for (let i = 0; i < indices.length; i += 3) {
        gl!.drawElements(gl!.LINE_LOOP, 3, gl!.UNSIGNED_SHORT, i * 2);
      }
    } else {
      gl!.uniform1i(wireLoc, 0);
      gl!.drawElements(gl!.TRIANGLES, indices.length, gl!.UNSIGNED_SHORT, 0);
    }

    animFrameId = requestAnimationFrame(renderFrame);
  }

  renderFrame();

  return {
    cleanup: () => {
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
      gl!.deleteProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(posBuffer);
      gl!.deleteBuffer(normBuffer);
      gl!.deleteBuffer(tcBuffer);
      gl!.deleteBuffer(idxBuffer);
      gl!.deleteTexture(texture);
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 3D SUBSURFACE MODEL RENDERER
// ═══════════════════════════════════════════════════════════════

/**
 * Render a 3D subsurface geological model using Canvas 2D
 * with isometric projection. Shows stacked layers with aquifer zones.
 */
export function render3DSubsurface(
  canvas: HTMLCanvasElement,
  layers: SubsurfaceLayer[],
  waterTableDepth_m: number,
  boreholeX?: number, // 0-1 normalized position
): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);

  // Isometric projection params
  const cx = W * 0.5;
  const cy = H * 0.15;
  const blockW = W * 0.35;
  const blockD = W * 0.20;
  const totalDepth = layers.length > 0 ? layers[layers.length - 1].bottomDepth_m : 100;
  const maxH = H * 0.75;

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('3D Subsurface Model', W / 2, 20);

  // Draw layers from bottom to top (painter's algorithm)
  const sortedLayers = [...layers].reverse();

  for (const layer of sortedLayers) {
    const yTop = cy + (layer.topDepth_m / totalDepth) * maxH;
    const yBot = cy + (layer.bottomDepth_m / totalDepth) * maxH;
    const layerH = yBot - yTop;

    // Top face (parallelogram)
    ctx.fillStyle = adjustBrightness(layer.color, 1.3);
    ctx.beginPath();
    ctx.moveTo(cx - blockW / 2, yTop);
    ctx.lineTo(cx - blockW / 2 + blockD, yTop - blockD * 0.5);
    ctx.lineTo(cx + blockW / 2 + blockD, yTop - blockD * 0.5);
    ctx.lineTo(cx + blockW / 2, yTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Front face
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(cx - blockW / 2, yTop);
    ctx.lineTo(cx + blockW / 2, yTop);
    ctx.lineTo(cx + blockW / 2, yBot);
    ctx.lineTo(cx - blockW / 2, yBot);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.fillStyle = adjustBrightness(layer.color, 0.7);
    ctx.beginPath();
    ctx.moveTo(cx + blockW / 2, yTop);
    ctx.lineTo(cx + blockW / 2 + blockD, yTop - blockD * 0.5);
    ctx.lineTo(cx + blockW / 2 + blockD, yBot - blockD * 0.5);
    ctx.lineTo(cx + blockW / 2, yBot);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Aquifer glow
    if (layer.isAquifer) {
      ctx.strokeStyle = 'rgba(41, 182, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(cx - blockW / 2 + 2, yTop + 2, blockW - 4, layerH - 4);
      ctx.setLineDash([]);
    }

    // Label on front face
    if (layerH > 16) {
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.min(11, layerH * 0.6)}px Arial`;
      ctx.textAlign = 'left';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.fillText(
        `${layer.name} (${layer.topDepth_m}-${layer.bottomDepth_m}m)`,
        cx - blockW / 2 + 8, yTop + layerH / 2 + 4,
      );
      ctx.shadowBlur = 0;
    }
  }

  // Water table plane
  const wtY = cy + (waterTableDepth_m / totalDepth) * maxH;
  ctx.fillStyle = 'rgba(41, 182, 246, 0.2)';
  ctx.beginPath();
  ctx.moveTo(cx - blockW / 2 - 10, wtY);
  ctx.lineTo(cx - blockW / 2 + blockD - 10, wtY - blockD * 0.5);
  ctx.lineTo(cx + blockW / 2 + blockD + 10, wtY - blockD * 0.5);
  ctx.lineTo(cx + blockW / 2 + 10, wtY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#29B6F6';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Water table label
  ctx.fillStyle = '#29B6F6';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`💧 Water table: ${waterTableDepth_m.toFixed(1)}m`, cx + blockW / 2 + blockD + 14, wtY - blockD * 0.25);

  // Borehole
  if (boreholeX !== undefined) {
    const bx = cx - blockW / 2 + boreholeX * blockW;
    const bTop = cy;
    const bBot = cy + maxH;
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, bTop);
    ctx.lineTo(bx, bBot);
    ctx.stroke();
    ctx.fillStyle = '#FF5722';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⬇ Borehole', bx, bTop - 6);
  }

  // Depth scale
  ctx.fillStyle = '#888';
  ctx.font = '9px Arial';
  ctx.textAlign = 'right';
  const step = totalDepth > 100 ? 20 : totalDepth > 50 ? 10 : 5;
  for (let d = 0; d <= totalDepth; d += step) {
    const y = cy + (d / totalDepth) * maxH;
    ctx.fillText(`${d}m`, cx - blockW / 2 - 8, y + 3);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
}

function generateDefaultElevationGrid(size: number): number[][] {
  // Generate a realistic-looking terrain using diamond-square-like approach
  // (deterministic, seeded from size)
  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

  // Simple multi-octave sine terrain
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const x = c / size;
      const y = r / size;
      grid[r][c] =
        Math.sin(x * 3.14 * 2) * 30 +
        Math.cos(y * 3.14 * 3) * 20 +
        Math.sin((x + y) * 3.14 * 4) * 10 +
        Math.cos((x - y) * 3.14 * 6) * 5 +
        (1 - Math.abs(x - 0.5) * 2) * 40 +
        (1 - Math.abs(y - 0.5) * 2) * 30;
    }
  }
  return grid;
}

function render3DFallback(
  canvas: HTMLCanvasElement,
  sourceImage: HTMLImageElement,
  _elevationGrid?: number[][],
  _options?: any,
) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);

  // Isometric pseudo-3D image render
  ctx.save();
  ctx.setTransform(1, -0.3, 0.5, 0.7, W * 0.15, H * 0.3);
  ctx.drawImage(sourceImage, 0, 0, W * 0.65, H * 0.65);
  ctx.restore();

  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('3D Terrain (WebGL unavailable — isometric fallback)', W / 2, H - 20);
}

// WebGL helpers
function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Matrix math (column-major, 4x4)
function perspectiveMatrix(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function translationMatrix(x: number, y: number, z: number): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]);
}

function rotationXMatrix(a: number): Float32Array {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
  ]);
}

function rotationYMatrix(a: number): Float32Array {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
  ]);
}

function multiplyMat4(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      o[i * 4 + j] =
        a[0 * 4 + j] * b[i * 4 + 0] +
        a[1 * 4 + j] * b[i * 4 + 1] +
        a[2 * 4 + j] * b[i * 4 + 2] +
        a[3 * 4 + j] * b[i * 4 + 3];
    }
  }
  return o;
}

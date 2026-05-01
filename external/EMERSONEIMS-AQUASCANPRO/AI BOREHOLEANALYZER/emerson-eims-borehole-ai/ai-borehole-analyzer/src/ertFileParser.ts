// ═══════════════════════════════════════════════════════════════════
// ERT FILE PARSER
// Parses standard geophysical resistivity data formats:
//   - RES2DINV (.dat) — most common ERT inversion format
//   - AGI SuperSting (.stg) — Advanced Geosciences instruments
//   - ABEM Terrameter (.amp) — ABEM instruments
//   - Generic CSV — manual data entry
//
// Returns parsed electrode configurations + apparent resistivities
// for use in the Field Calibration Engine.
// ═══════════════════════════════════════════════════════════════════

import type { FieldValidationData } from './types';

type ErtFileResult = NonNullable<FieldValidationData['ertDataFile']>;

/**
 * Parse an uploaded resistivity data file.
 * Auto-detects format from file content and extension.
 */
export function parseERTFile(
  fileName: string,
  content: string,
): ErtFileResult {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  if (ext === 'dat' || detectRES2DINV(lines)) {
    return parseRES2DINV(fileName, lines);
  } else if (ext === 'stg') {
    return parseAGI(fileName, lines);
  } else if (ext === 'csv' || ext === 'txt') {
    return parseGenericCSV(fileName, lines);
  }

  // Fallback: try generic CSV
  return parseGenericCSV(fileName, lines);
}

function detectRES2DINV(lines: string[]): boolean {
  // RES2DINV .dat files typically start with a title line, then number of electrode positions
  return lines.length > 5 && !isNaN(Number(lines[1])) && !isNaN(Number(lines[2]));
}

/**
 * Parse RES2DINV .dat format
 * Format:
 *   Line 1: Title
 *   Line 2: Electrode spacing
 *   Line 3: Array type (1=Wenner, 2=Pole-Pole, 3=Dipole-Dipole, 4=Wenner-Schlumberger, 6=Pole-Dipole, 7=Schlumberger)
 *   Line 4: Number of data points
 *   Line 5+: x, a, n, rhoA (midpoint, spacing, level, apparent resistivity)
 */
function parseRES2DINV(fileName: string, lines: string[]): ErtFileResult {
  const electrodeSpacing = parseFloat(lines[1]) || 1;
  const arrayCode = parseInt(lines[2]) || 1;
  const numPoints = parseInt(lines[3]) || 0;

  const arrayType = mapArrayType(arrayCode);
  const dataPoints: ErtFileResult['apparentResistivities'] = [];

  let maxX = 0;
  let maxN = 0;

  for (let i = 4; i < Math.min(4 + numPoints, lines.length); i++) {
    const parts = lines[i].split(/[\s,;]+/).map(Number);
    if (parts.length >= 4 && !isNaN(parts[0]) && !isNaN(parts[3])) {
      const x = parts[0];
      const a = parts[1]; // electrode spacing for this datum
      const n = parts[2]; // depth level
      const rhoA = parts[3];
      if (rhoA > 0 && rhoA < 100000) {
        dataPoints.push({ a: x, n, rhoA });
        maxX = Math.max(maxX, x);
        maxN = Math.max(maxN, n);
      }
    }
  }

  return {
    fileName,
    format: 'RES2DINV',
    electrodeSpacing_m: electrodeSpacing,
    arrayType,
    dataPoints: dataPoints.length,
    apparentResistivities: dataPoints,
    profileLength_m: maxX > 0 ? maxX : dataPoints.length * electrodeSpacing,
    maxDepth_m: maxN * electrodeSpacing * 0.5 || electrodeSpacing * 10,
  };
}

/**
 * Parse AGI SuperSting .stg format
 * Comma-separated with header: A,B,M,N,Vp,I,Rho
 */
function parseAGI(fileName: string, lines: string[]): ErtFileResult {
  const dataPoints: ErtFileResult['apparentResistivities'] = [];
  let headerSkipped = false;
  let maxPos = 0;
  let spacing = 1;

  for (const line of lines) {
    if (!headerSkipped && (line.startsWith('A') || line.startsWith('#') || line.startsWith('/'))) {
      headerSkipped = true;
      continue;
    }
    headerSkipped = true;
    const parts = line.split(/[\s,;]+/).map(Number);
    if (parts.length >= 7 && !isNaN(parts[6])) {
      const a = (parts[0] + parts[1]) / 2; // midpoint of A-B
      const n = Math.abs(parts[1] - parts[0]); // pseudo-depth proxy
      const rhoA = parts[6];
      if (rhoA > 0 && rhoA < 100000) {
        dataPoints.push({ a, n, rhoA });
        maxPos = Math.max(maxPos, parts[1], parts[3]);
        if (spacing === 1 && parts.length >= 2) spacing = Math.abs(parts[1] - parts[0]) || 1;
      }
    }
  }

  return {
    fileName,
    format: 'AGI_STG',
    electrodeSpacing_m: spacing,
    arrayType: 'DipoleDipole',
    dataPoints: dataPoints.length,
    apparentResistivities: dataPoints,
    profileLength_m: maxPos || dataPoints.length * spacing,
    maxDepth_m: Math.max(...dataPoints.map(d => d.n)) * spacing * 0.5 || 50,
  };
}

/**
 * Parse generic CSV/TXT: expects columns for position, depth/level, resistivity
 * Accepted headers: x/position/midpoint, n/level/depth, rho/resistivity/rhoA
 */
function parseGenericCSV(fileName: string, lines: string[]): ErtFileResult {
  const dataPoints: ErtFileResult['apparentResistivities'] = [];
  let spacing = 1;
  let colA = 0, colN = 1, colRho = 2;

  // Try to detect header
  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('rho') || firstLine.includes('resist') || firstLine.includes('position')) {
    const headers = firstLine.split(/[\s,;\t]+/);
    headers.forEach((h, i) => {
      if (h.match(/^(x|pos|mid|station)/)) colA = i;
      if (h.match(/^(n|level|depth|pseudo)/)) colN = i;
      if (h.match(/^(rho|resist|appa)/)) colRho = i;
    });
    lines = lines.slice(1);
  }

  for (const line of lines) {
    const parts = line.split(/[\s,;\t]+/).map(Number);
    if (parts.length > colRho && !isNaN(parts[colRho]) && parts[colRho] > 0) {
      dataPoints.push({
        a: parts[colA] || 0,
        n: parts[colN] || 1,
        rhoA: parts[colRho],
      });
    }
  }

  if (dataPoints.length > 1) {
    const positions = dataPoints.map(d => d.a).filter(v => v > 0);
    if (positions.length > 1) {
      const sorted = [...new Set(positions)].sort((a, b) => a - b);
      if (sorted.length > 1) spacing = sorted[1] - sorted[0];
    }
  }

  return {
    fileName,
    format: 'CSV_GENERIC',
    electrodeSpacing_m: spacing || 1,
    arrayType: 'Wenner',
    dataPoints: dataPoints.length,
    apparentResistivities: dataPoints,
    profileLength_m: Math.max(...dataPoints.map(d => d.a), 1),
    maxDepth_m: Math.max(...dataPoints.map(d => d.n), 1) * (spacing || 1) * 0.5 || 50,
  };
}

function mapArrayType(code: number): ErtFileResult['arrayType'] {
  switch (code) {
    case 1: return 'Wenner';
    case 3: return 'DipoleDipole';
    case 7: return 'Schlumberger';
    default: return 'Wenner';
  }
}

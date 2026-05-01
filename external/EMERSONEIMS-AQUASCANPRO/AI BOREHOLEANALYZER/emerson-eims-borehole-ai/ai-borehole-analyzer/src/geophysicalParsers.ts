/**
 * GEOPHYSICAL FILE PARSERS
 * 
 * Parses field geophysics data files uploaded by contractors:
 * 1. SEG-Y / SEG2 — seismic refraction/MASW data
 * 2. GSSI .DZT — Ground Penetrating Radar
 * 3. Magnetometer .CSV / .MAG — Total field magnetic surveys
 * 4. Gravity .CSV — Bouguer anomaly data
 * 
 * These parsers extract HEADER/METADATA only — full waveform processing
 * (migration, inversion, etc.) is done in the Python backend.
 */

/* ─── SEISMIC (SEG-Y / SEG2) ─── */

export interface SeismicFileData {
  format: 'SEG-Y' | 'SEG2' | 'CSV';
  fileName: string;
  traceCount: number;
  sampleCount: number;
  sampleIntervalUs: number;
  recordLengthMs: number;
  sourceCount: number;
  geophoneSpacingM: number;
  profileLengthM: number;
  datumElevationM?: number;
  acquisitionDate?: string;
  /** First-break picks if available in header extension */
  firstBreaks?: { offset_m: number; time_ms: number }[];
  /** Interpreted velocity layers */
  velocityLayers?: { depth_m: number; velocity_ms: number }[];
}

/**
 * Parse a SEG-Y file header (binary format, SEGY Rev 1/2).
 * Only reads the 3200-byte EBCDIC header + 400-byte binary header + first trace header.
 * Full trace data processing requires backend Python with ObsPy/Segyio.
 */
export async function parseSeismicFile(file: File): Promise<SeismicFileData | null> {
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'csv' || ext === 'txt') {
      return parseSeismicCSV(file, fileName);
    }

    if (ext === 'seg2' || ext === 'sg2' || ext === 'dat') {
      return parseSEG2(view, fileName);
    }

    // Default: SEG-Y format
    return parseSEGY(view, fileName);
  } catch {
    return null;
  }
}

function parseSEGY(view: DataView, fileName: string): SeismicFileData {
  // SEG-Y Binary File Header starts at byte 3200 (after EBCDIC text header)
  const bfhOffset = 3200;
  
  // Bytes 3212-3213: Number of data traces per ensemble
  const tracesPerEnsemble = view.getInt16(bfhOffset + 12, false);
  // Bytes 3216-3217: Sample interval in microseconds
  const sampleIntervalUs = view.getInt16(bfhOffset + 16, false);
  // Bytes 3220-3221: Number of samples per data trace
  const samplesPerTrace = view.getInt16(bfhOffset + 20, false);
  // Bytes 3224-3225: Data sample format code (1=IBM float, 5=IEEE float)
  const formatCode = view.getInt16(bfhOffset + 24, false);
  
  // Calculate record length
  const recordLengthMs = (sampleIntervalUs * samplesPerTrace) / 1000;

  // First Trace Header starts at byte 3600
  const thOffset = 3600;
  // Bytes 3600-3603: Trace sequence number
  // Bytes 3612-3615: Source point number
  const sourcePoint = view.getInt32(thOffset + 12, false);
  // Bytes 3636-3639: Source-receiver offset (distance)
  const offset = view.getInt32(thOffset + 36, false);
  // Bytes 3648-3651: Receiver group elevation
  const elevation = view.getInt32(thOffset + 48, false);

  // Estimate total traces from file size
  const bytesPerSample = formatCode === 1 || formatCode === 5 ? 4 : formatCode === 3 ? 2 : 4;
  const traceDataSize = samplesPerTrace * bytesPerSample;
  const traceSize = 240 + traceDataSize; // 240-byte trace header + data
  const totalTraces = Math.floor((view.byteLength - 3600) / traceSize);

  return {
    format: 'SEG-Y',
    fileName,
    traceCount: totalTraces || tracesPerEnsemble || 1,
    sampleCount: samplesPerTrace || 0,
    sampleIntervalUs: sampleIntervalUs || 1000,
    recordLengthMs: recordLengthMs || 0,
    sourceCount: Math.max(1, sourcePoint),
    geophoneSpacingM: Math.abs(offset) || 2, // Default 2m if not specified
    profileLengthM: (totalTraces || tracesPerEnsemble) * (Math.abs(offset) || 2),
    datumElevationM: elevation !== 0 ? elevation : undefined,
  };
}

function parseSEG2(view: DataView, fileName: string): SeismicFileData {
  // SEG2 file descriptor block
  // Bytes 0-1: File descriptor ID (0x3A55 for SEG2)
  // Bytes 2-3: Revision number
  // Bytes 4-5: Size of trace pointer sub-block in bytes
  // Bytes 6-7: Number of traces

  const traceCount = view.getUint16(6, true); // SEG2 is little-endian
  const tracePointerSize = view.getUint16(4, true);

  // Read first trace descriptor to get sample info
  // Trace pointer at offset 32 (after file descriptor)
  const firstTraceOffset = view.getUint32(32, true);
  
  let sampleCount = 0;
  let sampleIntervalUs = 1000;
  
  if (firstTraceOffset < view.byteLength - 32) {
    // Trace descriptor: bytes 0-1 = trace descriptor ID
    // Bytes 4-7: Size of trace data block
    // Bytes 8-11: Number of samples in trace
    sampleCount = view.getUint32(firstTraceOffset + 8, true);
  }

  return {
    format: 'SEG2',
    fileName,
    traceCount: traceCount || 1,
    sampleCount,
    sampleIntervalUs,
    recordLengthMs: (sampleIntervalUs * sampleCount) / 1000,
    sourceCount: 1,
    geophoneSpacingM: 2, // Default, read from string header if available
    profileLengthM: traceCount * 2,
  };
}

async function parseSeismicCSV(file: File, fileName: string): Promise<SeismicFileData> {
  const text = await file.text();
  const lines = text.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const header = lines[0].toLowerCase();
  
  // Expect columns like: offset_m, time_ms (first break picks) or depth_m, velocity_ms
  const isVelocity = header.includes('velocity') || header.includes('vp') || header.includes('vs');
  const isFirstBreak = header.includes('offset') && header.includes('time');

  const data = lines.slice(1).map(l => l.split(/[,\t]+/).map(Number));
  
  const result: SeismicFileData = {
    format: 'CSV',
    fileName,
    traceCount: data.length,
    sampleCount: 0,
    sampleIntervalUs: 0,
    recordLengthMs: 0,
    sourceCount: 1,
    geophoneSpacingM: data.length > 1 ? Math.abs(data[1][0] - data[0][0]) : 2,
    profileLengthM: data.length > 0 ? Math.max(...data.map(d => d[0])) : 0,
  };

  if (isFirstBreak) {
    result.firstBreaks = data.map(d => ({ offset_m: d[0], time_ms: d[1] }));
  }
  if (isVelocity) {
    result.velocityLayers = data.map(d => ({ depth_m: d[0], velocity_ms: d[1] }));
  }

  return result;
}


/* ─── GPR (.DZT GSSI format) ─── */

export interface GPRFileData {
  format: 'DZT' | 'RD3' | 'CSV';
  fileName: string;
  antennaFrequencyMHz: number;
  samplesPerTrace: number;
  traceCount: number;
  timeWindowNs: number;
  traceSpacingM: number;
  profileLengthM: number;
  estimatedMaxDepthM: number;
  dielectricConstant: number;
  /** System type (e.g., SIR-3000, SIR-4000) */
  systemType?: string;
  acquisitionDate?: string;
}

/**
 * Parse GSSI .DZT file header.
 * DZT is the native format for GSSI ground penetrating radar systems.
 */
export async function parseGPRFile(file: File): Promise<GPRFileData | null> {
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'csv' || ext === 'txt') {
      return parseGPRCSV(file, fileName);
    }

    if (ext === 'rd3') {
      return parseRD3(view, fileName);
    }

    // Default: DZT format
    return parseDZT(view, fileName);
  } catch {
    return null;
  }
}

function parseDZT(view: DataView, fileName: string): GPRFileData {
  // DZT Header (1024 bytes per channel)
  // Byte 0: Tag (0x00FF for valid DZT)
  // Bytes 2-3: Number of samples per scan (trace)
  const samplesPerTrace = view.getUint16(2, true);
  // Bytes 4-5: Bits per sample (16 or 32)
  // Bytes 6-7: Zero flag
  // Bytes 8-11: Scans per second (float)
  const scansPerSec = view.getFloat32(8, true);
  // Bytes 12-15: Scans per meter (float) 
  const scansPerMeter = view.getFloat32(12, true);
  // Bytes 26-29: Time window in nanoseconds (float)
  const timeWindowNs = view.getFloat32(26, true);
  // Bytes 36-37: Number of data points
  // Bytes 38-39: Number of channels
  // Bytes 40-41: Antenna frequency (closest match)

  // Estimate antenna frequency from time window
  const antennaFreq = estimateAntennaFreqFromWindow(timeWindowNs);
  
  // Dielectric constant (default for typical soil)
  const dielectric = 9; // Average soil
  
  // Max depth = (c × timeWindow) / (2 × sqrt(dielectric))
  // c = 0.3 m/ns
  const maxDepth = (0.3 * timeWindowNs) / (2 * Math.sqrt(dielectric));
  
  // Estimate trace count from file size
  const bitsPerSample = view.getUint16(4, true) || 16;
  const bytesPerTrace = (samplesPerTrace * bitsPerSample) / 8;
  const headerSize = 1024;
  const traceCount = bytesPerTrace > 0 ? Math.floor((view.byteLength - headerSize) / bytesPerTrace) : 0;
  
  const traceSpacing = scansPerMeter > 0 ? 1 / scansPerMeter : 0.02;
  
  return {
    format: 'DZT',
    fileName,
    antennaFrequencyMHz: antennaFreq,
    samplesPerTrace: samplesPerTrace || 512,
    traceCount,
    timeWindowNs: timeWindowNs || 50,
    traceSpacingM: traceSpacing,
    profileLengthM: traceCount * traceSpacing,
    estimatedMaxDepthM: Math.round(maxDepth * 10) / 10,
    dielectricConstant: dielectric,
  };
}

function parseRD3(view: DataView, fileName: string): GPRFileData {
  // Malå RD3 format — binary trace data, header in companion .RAD file
  // Without .RAD header, estimate from file size assuming 16-bit samples, 512 samples/trace
  const samplesPerTrace = 512;
  const bytesPerTrace = samplesPerTrace * 2;
  const traceCount = Math.floor(view.byteLength / bytesPerTrace);
  
  return {
    format: 'RD3',
    fileName,
    antennaFrequencyMHz: 250, // Common Malå frequency
    samplesPerTrace,
    traceCount,
    timeWindowNs: 100,
    traceSpacingM: 0.02,
    profileLengthM: traceCount * 0.02,
    estimatedMaxDepthM: 5, // Conservative for unknown dielectric
    dielectricConstant: 9,
  };
}

async function parseGPRCSV(file: File, fileName: string): Promise<GPRFileData> {
  const text = await file.text();
  const lines = text.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
  
  return {
    format: 'CSV',
    fileName,
    antennaFrequencyMHz: 400,
    samplesPerTrace: 0,
    traceCount: lines.length - 1,
    timeWindowNs: 0,
    traceSpacingM: 0.05,
    profileLengthM: (lines.length - 1) * 0.05,
    estimatedMaxDepthM: 0,
    dielectricConstant: 9,
  };
}

function estimateAntennaFreqFromWindow(windowNs: number): number {
  // Common GSSI antennas and their typical time windows
  if (windowNs <= 15) return 1600;  // 1.6 GHz
  if (windowNs <= 30) return 900;
  if (windowNs <= 60) return 400;
  if (windowNs <= 100) return 270;
  if (windowNs <= 200) return 200;
  if (windowNs <= 500) return 100;
  return 40; // Low frequency, deep penetration
}


/* ─── MAGNETOMETER DATA ─── */

export interface MagnetometerFileData {
  format: 'CSV' | 'MAG';
  fileName: string;
  stationCount: number;
  totalFieldRange_nT: [number, number];
  meanTotalField_nT: number;
  /** Residual anomaly after regional removal */
  anomalies: { x_m: number; y_m: number; anomaly_nT: number }[];
  profileLengthM: number;
  stationSpacingM: number;
}

/**
 * Parse magnetometer survey data (CSV or proprietary .MAG format).
 */
export async function parseMagnetometerFile(file: File): Promise<MagnetometerFileData | null> {
  try {
    const text = await file.text();
    const lines = text.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
    if (lines.length < 2) return null;

    const fileName = file.name;
    const header = lines[0].toLowerCase();
    const data = lines.slice(1).map(l => l.split(/[,\t]+/).map(Number));

    // Expect columns: x/easting, y/northing, total_field_nT
    // Or: station, reading_nT
    const xCol = header.includes('x') || header.includes('east') ? 0 : 0;
    const yCol = header.includes('y') || header.includes('north') ? 1 : 1;
    const fieldCol = data[0].length > 2 ? 2 : 1;

    const readings = data.map(d => d[fieldCol]).filter(v => !isNaN(v) && v > 0);
    const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
    
    // Simple regional removal: subtract mean → residual anomaly
    const anomalies = data.map(d => ({
      x_m: d[xCol] || 0,
      y_m: d[yCol] || 0,
      anomaly_nT: d[fieldCol] - mean,
    }));

    const xs = data.map(d => d[xCol] || 0);
    const ys = data.map(d => d[yCol] || 0);
    const profileLength = Math.sqrt(
      (Math.max(...xs) - Math.min(...xs)) ** 2 + 
      (Math.max(...ys) - Math.min(...ys)) ** 2
    );

    const spacings = xs.slice(1).map((x, i) => Math.sqrt((x - xs[i]) ** 2 + ((data[i + 1][yCol] || 0) - ys[i]) ** 2));
    const avgSpacing = spacings.length > 0 ? spacings.reduce((a, b) => a + b, 0) / spacings.length : 5;

    return {
      format: file.name.endsWith('.mag') ? 'MAG' : 'CSV',
      fileName,
      stationCount: data.length,
      totalFieldRange_nT: [Math.min(...readings), Math.max(...readings)],
      meanTotalField_nT: Math.round(mean * 10) / 10,
      anomalies,
      profileLengthM: Math.round(profileLength),
      stationSpacingM: Math.round(avgSpacing * 10) / 10,
    };
  } catch {
    return null;
  }
}


/* ─── GRAVITY DATA ─── */

export interface GravityFileData {
  format: 'CSV';
  fileName: string;
  stationCount: number;
  bouguerAnomalyRange_mGal: [number, number];
  meanBouguerAnomaly_mGal: number;
  stations: { x_m: number; y_m: number; bouguer_mGal: number; freeAir_mGal?: number; elevation_m?: number }[];
  profileLengthM: number;
}

/**
 * Parse gravity survey data (CSV with Bouguer anomaly values).
 */
export async function parseGravityFile(file: File): Promise<GravityFileData | null> {
  try {
    const text = await file.text();
    const lines = text.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
    if (lines.length < 2) return null;

    const fileName = file.name;
    const data = lines.slice(1).map(l => l.split(/[,\t]+/).map(Number));
    
    // Expect: x, y, bouguer_mGal [, freeAir_mGal, elevation_m]
    const stations = data.map(d => ({
      x_m: d[0] || 0,
      y_m: d[1] || 0,
      bouguer_mGal: d[2] || 0,
      freeAir_mGal: d.length > 3 ? d[3] : undefined,
      elevation_m: d.length > 4 ? d[4] : undefined,
    }));

    const bouguerVals = stations.map(s => s.bouguer_mGal);
    
    const xs = stations.map(s => s.x_m);
    const ys = stations.map(s => s.y_m);
    const profileLength = Math.sqrt(
      (Math.max(...xs) - Math.min(...xs)) ** 2 + 
      (Math.max(...ys) - Math.min(...ys)) ** 2
    );

    return {
      format: 'CSV',
      fileName,
      stationCount: stations.length,
      bouguerAnomalyRange_mGal: [Math.min(...bouguerVals), Math.max(...bouguerVals)],
      meanBouguerAnomaly_mGal: Math.round((bouguerVals.reduce((a, b) => a + b, 0) / bouguerVals.length) * 100) / 100,
      stations,
      profileLengthM: Math.round(profileLength),
    };
  } catch {
    return null;
  }
}

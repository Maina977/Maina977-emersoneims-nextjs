// ═══════════════════════════════════════════════════════════════════════════
// DATA COVERAGE ENGINE — "what do we actually know here, and how well?"
// ═══════════════════════════════════════════════════════════════════════════
// For a location, enumerates which real datasets cover it, at what native
// resolution, and what each can and CANNOT tell you. Turns "the data exists
// somewhere" into an honest, per-site coverage statement.
//
// HONESTY — the point of this module:
//   • Three properties are LOCAL and heterogeneous below the resolution of any
//     national/satellite dataset: the exact water-table depth, point water
//     chemistry, and aquifer/fracture geometry at the spot. These are ALWAYS
//     listed as field_required from remote data — remote coverage never
//     "fills them in". Only uploaded field data flips them to measured.
//   • desktopCoveragePct measures the REMOTE picture only; the field-only items
//     are tracked separately so the tool never implies a site visit is optional.
// ═══════════════════════════════════════════════════════════════════════════

export type CoverageStatus =
  | 'measured' | 'measured_reanalysis' | 'modelled' | 'regional_estimate'
  | 'field_required' | 'not_available';

export interface CoverageItem {
  domain: string;
  dataset: string;
  nativeResolution: string;
  status: CoverageStatus;
  confidencePct: number;   // support for a decision AT THIS SITE (0-100)
  tells: string;
  limit: string;
  fieldOnly: boolean;      // true = inherently requires an on-site measurement
}

export interface DataCoverageInput {
  lat?: number; lon?: number;
  hasClimate?: boolean;
  hasSoil?: boolean;
  hasGeology?: boolean;
  hasVegetation?: boolean;
  hasDEM?: boolean;
  hasGraceStorage?: boolean;
  hasSatelliteET?: boolean;
  nearbyBoreholeCount?: number;
  nearbyFieldMeasuredCount?: number;
  /** Real field-surveyed functionality (WPDx/registry) — data-backed base rate. */
  functionalRatePct?: number | null;
  surveyedBoreholeCount?: number;
  hasFieldERT?: boolean;     // real ERT/VES inversion present
  hasPumpTest?: boolean;
  hasLabChem?: boolean;
}

export interface DataCoverageResult {
  items: CoverageItem[];
  desktopCoveragePct: number;         // completeness of the REMOTE picture
  fieldItemsOutstanding: string[];    // inherently field-only items still open
  confidenceTier: 'PRE-FEASIBILITY' | 'TARGETED-SURVEY-READY' | 'FIELD-VALIDATED';
  overallStatement: string;
}

const clampPct = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function assessDataCoverage(input: DataCoverageInput): DataCoverageResult {
  const nB = Math.max(0, input.nearbyBoreholeCount ?? 0);
  const nFM = Math.max(0, input.nearbyFieldMeasuredCount ?? 0);

  const items: CoverageItem[] = [];

  // ── REMOTE-KNOWABLE DOMAINS ──
  items.push({
    domain: 'Rainfall, weather & wind', dataset: 'ERA5 / NASA POWER (reanalysis)',
    nativeResolution: '~30-50 km grid', status: input.hasClimate ? 'measured_reanalysis' : 'not_available',
    confidencePct: input.hasClimate ? 85 : 0,
    tells: 'Long-term rainfall, temperature, ET drivers and recharge potential.',
    limit: 'Regional averages — not the microclimate of a single plot.', fieldOnly: false,
  });
  items.push({
    domain: 'Soil type & properties', dataset: 'ISRIC SoilGrids v2',
    nativeResolution: '250 m', status: input.hasSoil ? 'modelled' : 'not_available',
    confidencePct: input.hasSoil ? 72 : 0,
    tells: 'Texture, depth and infiltration class for recharge and drilling method.',
    limit: 'A 250 m model cell — a machine-learning estimate, not a soil pit.', fieldOnly: false,
  });
  items.push({
    domain: 'Geology & rock mapping', dataset: 'Macrostrat / USGS / BGS Africa Atlas',
    nativeResolution: 'map-scale (1:250k-1:1M)', status: input.hasGeology ? 'regional_estimate' : 'not_available',
    confidencePct: input.hasGeology ? 60 : 0,
    tells: 'Aquifer province, lithology and expected borehole behaviour.',
    limit: 'Map-scale — does not resolve local fractures that control yield.', fieldOnly: false,
  });
  items.push({
    domain: 'Vegetation & land cover', dataset: 'Sentinel-2 / MODIS NDVI',
    nativeResolution: '10-250 m', status: input.hasVegetation ? 'measured' : 'not_available',
    confidencePct: input.hasVegetation ? 80 : 0,
    tells: 'Groundwater-dependent vegetation is a real shallow-water proxy.',
    limit: 'An indirect proxy — greenness is not a water table.', fieldOnly: false,
  });
  items.push({
    domain: 'Drainage & topography', dataset: 'SRTM DEM / HydroSHEDS',
    nativeResolution: '30-90 m', status: input.hasDEM ? 'measured' : 'not_available',
    confidencePct: input.hasDEM ? 80 : 0,
    tells: 'Slope, wetness index, streams and structural lineaments.',
    limit: 'Surface morphology — infers, not measures, the subsurface.', fieldOnly: false,
  });
  items.push({
    domain: 'Groundwater storage trend', dataset: 'GRACE / GRACE-FO',
    nativeResolution: '~150-300 km', status: input.hasGraceStorage ? 'measured_reanalysis' : 'not_available',
    confidencePct: input.hasGraceStorage ? 55 : 0,
    tells: 'Whether the regional aquifer is being depleted or replenished.',
    limit: 'Very coarse — a basin signal, never a single well.', fieldOnly: false,
  });
  items.push({
    domain: 'Actual evapotranspiration', dataset: 'NASA POWER / MERRA-2 (EVLAND)',
    nativeResolution: '~50 km', status: input.hasSatelliteET ? 'measured_reanalysis' : 'not_available',
    confidencePct: input.hasSatelliteET ? 70 : 0,
    tells: 'Measured ET makes the recharge water balance empirical.',
    limit: 'Grid-scale regional ET — not the plot.', fieldOnly: false,
  });

  // Nearby real boreholes — the strongest desktop evidence
  const boreholeConf = nB === 0 ? 0 : clampPct(35 + Math.min(45, nB * 4) + Math.min(20, nFM * 6));
  const surveyed = input.surveyedBoreholeCount ?? 0;
  const funcRate = input.functionalRatePct;
  const funcNote = surveyed > 0 && funcRate != null
    ? ` Field-surveyed functionality: ${funcRate}% of ${surveyed} nearby boreholes with a known status are working (real WPDx/registry outcomes).`
    : '';
  items.push({
    domain: 'Nearby drilled boreholes', dataset: 'WPDx / UNESCO / WRA / OSM registries',
    nativeResolution: 'point records', status: nB === 0 ? 'not_available' : nFM > 0 ? 'measured' : 'regional_estimate',
    confidencePct: boreholeConf,
    tells: nB === 0 ? 'No proven neighbours found.' : `${nB} nearby borehole record(s), ${nFM} with measured depth/yield — the strongest desktop predictor of success.${funcNote}`,
    limit: 'Analog wells prove the aquifer regionally, not the fracture under THIS pad.', fieldOnly: false,
  });

  // ── INHERENTLY FIELD-ONLY DOMAINS (always shown) ──
  items.push({
    domain: 'Exact water-table depth', dataset: input.hasFieldERT || input.hasPumpTest ? 'Field ERT/VES + pump test' : 'No remote dataset resolves this',
    nativeResolution: 'local (metres)', status: (input.hasFieldERT || input.hasPumpTest) ? 'measured' : 'field_required',
    confidencePct: (input.hasFieldERT || input.hasPumpTest) ? 90 : 30,
    tells: (input.hasFieldERT || input.hasPumpTest) ? 'Water level measured on site.' : 'Only a regional estimate is possible from remote data.',
    limit: 'Water table varies over tens of metres in fractured terrain.', fieldOnly: true,
  });
  items.push({
    domain: 'Water chemistry (F, salinity, As, NO3)', dataset: input.hasLabChem ? 'ISO 17025 lab analysis' : 'Point samples only — cannot be mapped',
    nativeResolution: 'point sample', status: input.hasLabChem ? 'measured' : 'field_required',
    confidencePct: input.hasLabChem ? 95 : 25,
    tells: input.hasLabChem ? 'Certified lab values on the actual water.' : 'Unsampled points can only be modelled from regional hydrochemistry.',
    limit: 'Chemistry at an unsampled site is an estimate, never a measurement.', fieldOnly: true,
  });
  items.push({
    domain: 'Aquifer / fracture geometry', dataset: input.hasFieldERT ? 'Field ERT/VES inversion' : 'Below any dataset resolution',
    nativeResolution: 'local (metres)', status: input.hasFieldERT ? 'measured' : 'field_required',
    confidencePct: input.hasFieldERT ? 85 : 20,
    tells: input.hasFieldERT ? 'Subsurface layering interpreted from on-site resistivity.' : 'The controlling variable for yield — invisible to remote sensing.',
    limit: 'This is why one on-site VES/ERT still matters.', fieldOnly: true,
  });

  // ── Scores ──
  const remote = items.filter(i => !i.fieldOnly);
  const desktopCoveragePct = clampPct(remote.reduce((s, i) => s + i.confidencePct, 0) / remote.length);
  const fieldItemsOutstanding = items.filter(i => i.fieldOnly && i.status === 'field_required').map(i => i.domain);

  const allFieldDone = items.filter(i => i.fieldOnly).every(i => i.status === 'measured');
  const confidenceTier: DataCoverageResult['confidenceTier'] =
    allFieldDone ? 'FIELD-VALIDATED'
    : desktopCoveragePct >= 60 ? 'TARGETED-SURVEY-READY'
    : 'PRE-FEASIBILITY';

  const overallStatement =
    confidenceTier === 'FIELD-VALIDATED'
      ? 'Remote datasets AND on-site field data are present — this is a field-validated assessment.'
      : confidenceTier === 'TARGETED-SURVEY-READY'
      ? `The remote picture is strong (${desktopCoveragePct}% desktop coverage). The tool can rank the best spot, but ${fieldItemsOutstanding.length} field-only item(s) — ${fieldItemsOutstanding.join(', ')} — still require ONE targeted on-site survey to confirm before drilling.`
      : `Desktop coverage is limited (${desktopCoveragePct}%). Treat this as an early pre-feasibility screen; more regional data and a field survey are needed before any drill decision.`;

  return { items, desktopCoveragePct, fieldItemsOutstanding, confidenceTier, overallStatement };
}

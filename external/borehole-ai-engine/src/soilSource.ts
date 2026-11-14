/**
 * Soil data source for AquaScan (P0-C 2026-11-14; local dataset P1-C 2026-11-14).
 *
 * The ISRIC SoilGrids REST API is disabled in the analysis path. ISRIC's own
 * documentation (read 13 Nov 2026) says the service is "temporarily paused",
 * is a beta with no uptime guarantee, and has a fair-use limit of 5 calls per
 * minute. Results depended on whether it happened to answer (Kitale: 70 m vs
 * 61 m in two runs of the same inputs).
 *
 * Soil now comes from a self-hosted, versioned extract of the official
 * SoilGrids 2.0 1 km aggregated maps for Kenya (data/aquascan/soil/,
 * /api/aquascan/soil): no live dependency, identical inputs give identical
 * outputs. Outside Kenya, or where no soil is mapped: INSUFFICIENT EVIDENCE.
 *
 * Soil properties are shown as regional context only. They are NOT used to
 * infer rock type, drilling depth or yield (smartSiteSelector keeps those at
 * INSUFFICIENT EVIDENCE) until the historical borehole validation shows that
 * any such inference beats simple regional baselines.
 */
export const SOILGRIDS_REST_ENABLED = false;

export const LOCAL_SOIL_DATASET = 'kenya-soilgrids-2.0-1km-v1';

export const SOIL_SOURCE_VERSION = `soil-source 2026-11-14 (SoilGrids REST disabled; local ${LOCAL_SOIL_DATASET})`;

export const SITE_INFERENCE_WITHHELD =
  'INSUFFICIENT EVIDENCE: rock type, weathering depth, drilling depth and yield are not inferred from soil maps. Topsoil texture at 1 km does not establish the geology below, and no soil-based estimate has yet been validated against drilled boreholes.';

export const SOIL_INSUFFICIENT_EVIDENCE =
  'INSUFFICIENT EVIDENCE: no soil data for this point. The local Kenya soil dataset covers Kenya only, and some cells (water, rock, urban) have no mapped soil. Soil is confirmed only by drilling or a site soil test.';

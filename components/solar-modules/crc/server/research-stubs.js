// Tier-3 catalogue. Each entry says whether it's implemented (free tools) or
// genuinely needs paid/hardware/blockchain that this deployment does not have.
// Per data policy: never fabricate. Stubs return HTTP 501.
const REGISTRY = {
  'satellite-shading': {
    feature: 'Satellite-derived rooftop shading & obstruction detection',
    implemented: true,
    endpoint: 'POST /api/research/satellite-shading/run',
    method: 'OpenStreetMap Overpass API building footprints + Michalsky 1988 sun geometry',
    free_tools: ['OpenStreetMap (ODbL)', 'Overpass API (free)']
  },
  'lidar-roof-extraction': {
    feature: 'LiDAR-based 3D roof plane extraction',
    implemented: false,
    requires: 'LiDAR point clouds (USGS 3DEP exists for US only). No free coverage for Africa.',
    free_alternative: 'Use POST /api/research/panel-counter/run with measured roof area instead.'
  },
  'ai-fault-prediction': {
    feature: 'Anomaly detection on inverter telemetry',
    implemented: true,
    endpoint: 'POST /api/research/ai-fault-prediction/run',
    method: 'EWMA + rolling z-score (Hunter 1986; NIST e-Handbook 6.3.2.4) — deterministic, no training needed',
    free_tools: ['Pure JS statistics']
  },
  'nlp-solar-advisor': {
    feature: 'Natural-language solar advisor',
    implemented: true,
    endpoint: 'POST /api/research/nlp-advisor/run',
    method: 'Keyword-intent rule engine routing to existing endpoints (no LLM needed)',
    free_tools: ['Rule engine']
  },
  'satellite-soiling-detection': {
    feature: 'Soiling estimation from precipitation history',
    implemented: true,
    endpoint: 'POST /api/research/satellite-soiling/run',
    method: 'Open-Meteo daily precip → natural cleaning detection → Kimber NREL 2006 soiling',
    free_tools: ['Open-Meteo (CC-BY 4.0)', 'Kimber methodology']
  },
  'computer-vision-bom': {
    feature: 'BOM extraction from invoice images',
    implemented: true,
    endpoint: 'POST /api/research/cv-bom/run',
    method: 'tesseract.js OCR (LSTM, eng) + regex parser',
    free_tools: ['tesseract.js (Apache-2.0)']
  },
  'drone-thermal-inspection': {
    feature: 'Hotspot detection from thermal imagery',
    implemented: false,
    requires: 'Radiometric thermal camera + labelled training data. Cannot be done in software alone.',
    free_alternative: 'Manual upload + visual inspection workflow.'
  },
  'time-series-load-forecast': {
    feature: 'Load forecasting from historical kWh',
    implemented: true,
    endpoint: 'POST /api/research/load-forecast/run',
    method: 'Holt-Winters triple exponential smoothing (Winters 1960; Hyndman & Athanasopoulos)',
    free_tools: ['Pure JS']
  },
  'satellite-yield-validation': {
    feature: 'Validate measured production against satellite GHI',
    implemented: true,
    endpoint: 'POST /api/research/yield-validation/run',
    method: 'NASA POWER monthly GHI climatology × kWp × performance ratio, comparison vs measured',
    free_tools: ['NASA POWER (public domain)']
  },
  'voice-assistant': {
    feature: 'Voice-controlled solar configurator',
    implemented: false,
    requires: 'Frontend wiring (Web Speech API is free in browser; not implemented in React UI yet).',
    free_alternative: 'Use POST /api/research/nlp-advisor/run with typed query.'
  },
  'image-roof-segmentation': {
    feature: 'Roof segmentation from photo',
    implemented: false,
    requires: 'Trained U-Net/Mask R-CNN model on rooftop dataset.',
    free_alternative: 'POST /api/research/panel-counter/run + manual roof area input.'
  },
  'ev-route-optimization': {
    feature: 'EV route + charging energy estimate',
    implemented: true,
    endpoint: 'POST /api/research/ev-route/run',
    method: 'OSRM public router (driving distance) × EV-Database 2024 efficiency',
    free_tools: ['OSRM router.project-osrm.org (ODbL OSM)']
  },
  'blockchain-credit-registry': {
    feature: 'On-chain carbon credit registry',
    implemented: false,
    requires: 'Smart contract deployment + wallet + gas fees. Requires real blockchain infrastructure.',
    free_alternative: 'Off-chain valuation at /api/sustain/carbon-credits.'
  },
  'reinforcement-learning-dispatch': {
    feature: 'Battery dispatch scheduler',
    implemented: true,
    endpoint: 'POST /api/research/tou-dispatch/run',
    method: 'Time-of-use rule scheduler (deterministic; NREL REopt heuristic)',
    free_tools: ['Pure JS']
  },
  'iot-direct-integration': {
    feature: 'Live MQTT subscription to inverter broker',
    implemented: true,
    endpoint: 'POST /api/research/iot-mqtt/connect, GET /api/research/iot-mqtt/status',
    method: 'mqtt.js subscriber to user-supplied broker URL (works with Mosquitto, HiveMQ, EMQX free brokers)',
    free_tools: ['mqtt.js (MIT)', 'Free public test brokers: broker.hivemq.com, test.mosquitto.org']
  },
  'ar-roof-overlay': {
    feature: 'AR panel placement via phone camera',
    implemented: false,
    requires: 'WebXR frontend implementation; significant additional work in React UI.',
    free_alternative: 'Static 2D overlay — could be added to ProToolsPage later.'
  },
  'auto-permit-document-pack': {
    feature: 'Country-specific permit pack',
    implemented: true,
    endpoint: 'POST /api/research/permit-pack/run',
    method: 'Country checklist (KE/UG/TZ/RW) — manually maintained from regulator websites',
    free_tools: ['Public regulator publications']
  },
  'dynamic-pricing-scraper': {
    feature: 'Live supplier price feed',
    implemented: false,
    requires: 'Per-supplier scrapers + legal review (most catalogues forbid scraping).',
    free_alternative: 'Curated catalogue at /api/market/prices, refreshed manually.'
  },
  'computer-vision-panel-counter': {
    feature: 'Panel count estimate',
    implemented: true,
    endpoint: 'POST /api/research/panel-counter/run',
    method: 'Geometric packing-factor (IEC TS 62548 Annex C)',
    free_tools: ['Pure JS']
  }
};

function listAll() {
  return Object.entries(REGISTRY).map(([key, v]) => ({ key, ...v }));
}
function describe(key) { return REGISTRY[key] || null; }
function summary() {
  const all = Object.values(REGISTRY);
  return {
    total: all.length,
    implemented: all.filter(x => x.implemented).length,
    notYetImplemented: all.filter(x => !x.implemented).length
  };
}
module.exports = { REGISTRY, listAll, describe, summary };

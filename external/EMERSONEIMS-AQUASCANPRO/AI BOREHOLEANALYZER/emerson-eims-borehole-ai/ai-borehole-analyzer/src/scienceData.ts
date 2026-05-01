/* ═══════════════════════════════════════════════════════════════
   EMERSON EIMS — AQUASCAN PRO
   Complete Scientific Capability Database (Parts 1–7)
   100+ capabilities • 7 scientific domains
   ═══════════════════════════════════════════════════════════════ */

// ─── PART 1.1: REMOTE SENSING & SATELLITE DATA FUSION (10) ───
export const REMOTE_SENSING = [
  { name:'Groundwater Storage Change', method:'GRACE-FO satellite gravimetry', source:'NASA/GFZ', output:'mm/year water equivalent', accuracy:'±15mm' },
  { name:'Soil Moisture Profile (0-100cm)', method:'SMAP L-band radiometry + Sentinel-1 SAR', source:'NASA/ESA', output:'Volumetric water content', accuracy:'±0.04 m³/m³' },
  { name:'Evapotranspiration Rate', method:'SEBAL algorithm + Landsat thermal', source:'USGS', output:'mm/day', accuracy:'±0.5 mm/day' },
  { name:'Precipitation History', method:'GPM IMERG + CHIRPS', source:'NASA/USGS', output:'30-year daily rainfall', accuracy:'±5mm/day' },
  { name:'Surface Water Bodies', method:'Sentinel-2 NDWI + Otsu thresholding', source:'ESA', output:'Water extent polygons', accuracy:'92% accuracy' },
  { name:'Vegetation Water Stress', method:'Sentinel-2 NDVI + NDWI + LST', source:'ESA', output:'Crop water stress index', accuracy:'88% accuracy' },
  { name:'Ground Deformation (InSAR)', method:'Sentinel-1 interferometry', source:'ESA', output:'mm/year uplift/subsidence', accuracy:'±5mm/year' },
  { name:'Land Surface Temperature', method:'Landsat 8/9 band 10-11', source:'USGS', output:'°C', accuracy:'±1.5°C' },
  { name:'Albedo (Surface Reflectance)', method:'MODIS MCD43A3', source:'NASA', output:'0-1 scale', accuracy:'±0.02' },
  { name:'Snow Water Equivalent', method:'AMSR-2 + MODIS', source:'JAXA/NASA', output:'mm water', accuracy:'±20mm' },
];

// ─── PART 1.2: GEOLOGICAL & HYDROGEOLOGICAL MAPPING (8) ───
export const GEO_HYDRO_MAPPING = [
  { name:'Aquifer Type Classification', method:'UNESCO lithological maps + USGS', source:'Global Aquifer Database', output:'Confined/Unconfined/Karst', accuracy:'85%' },
  { name:'Lineament/Fault Detection', method:'DEM hillshading + Canny edge detection', source:'SRTM/ASTER', output:'Fracture density map', accuracy:'80%' },
  { name:'Bedrock Depth Estimation', method:'Gravity anomaly inversion + magnetics', source:'EMAG2/WGM2012', output:'Depth to basement (m)', accuracy:'±50m' },
  { name:'Porosity & Permeability', method:'Rock type lookup + empirical formulas', source:'Global lithology maps', output:'Fraction (0-1)', accuracy:'±15%' },
  { name:'Hydraulic Conductivity', method:'Grain size proxy + regional averages', source:'Literature database', output:'m/day', accuracy:'Order of magnitude' },
  { name:'Aquifer Thickness', method:'Well logs + geophysical surveys', source:'National databases', output:'meters', accuracy:'±30m' },
  { name:'Storage Coefficient', method:'Pumping test database + type curves', source:'Published data', output:'Dimensionless', accuracy:'±50%' },
  { name:'Transmissivity', method:'T = K × b (Thickness × Conductivity)', source:'Calculated', output:'m²/day', accuracy:'Order of magnitude' },
];

// ─── PART 1.3: TOPOGRAPHIC & HYDROLOGICAL ANALYSIS (8) ───
export const TOPO_HYDROLOGY = [
  { name:'Flow Accumulation', method:'D8/D-Infinity algorithm', source:'SRTM 30m', output:'Flow direction grid', accuracy:'90%' },
  { name:'Topographic Wetness Index', method:'ln(α / tan β)', source:'DEM', output:'TWI grid', accuracy:'85%' },
  { name:'Drainage Density', method:'Stream network extraction', source:'DEM', output:'km/km²', accuracy:'80%' },
  { name:'Slope & Aspect', method:'3x3 Sobel filter', source:'DEM', output:'Degrees', accuracy:'±5°' },
  { name:'Curvature (Profile/Plan)', method:'Second derivative of DEM', source:'DEM', output:'m⁻¹', accuracy:'±0.01' },
  { name:'Catchment Delineation', method:'Pour point analysis', source:'DEM', output:'Watershed polygons', accuracy:'90%' },
  { name:'Distance to Rivers', method:'Euclidean distance', source:'OpenStreetMap/OGC', output:'meters', accuracy:'±10m' },
  { name:'Elevation Above Stream', method:'DEM minus river elevation', source:'SRTM + OSM', output:'meters', accuracy:'±10m' },
];

// ─── PART 1.4: HISTORICAL BOREHOLE DATA INTEGRATION (5) ───
export const HISTORICAL_DATA = [
  { name:'Regional Success Rate', data:'10,000+ borehole records', source:'National water ministries', output:'Probability by geology' },
  { name:'Depth-to-Water Statistics', data:'Well logs from similar geology', source:'GROWA+, national databases', output:'Percentiles (10/50/90)' },
  { name:'Yield Distribution', data:'Pump test results', source:'IGRAC, national databases', output:'m³/hour by aquifer' },
  { name:'Water Quality Trends', data:'Historical water quality', source:'UNEP, national monitoring', output:'Parameter trends' },
  { name:'Drilling Cost Database', data:'Contractor quotes + material costs', source:'Industry surveys', output:'$/meter by region' },
];

// ─── PART 2.1: DEEP LEARNING MODELS (6) ───
// AVAILABILITY KEY:
//   'browser'  = runs in-browser via TensorFlow.js (no server needed)
//   'backend'  = requires FastAPI backend deployment with GPU/Python ML stack
//   'hybrid'   = lightweight version in browser, full version on backend
export const DL_MODELS = [
  { name:'Geological Classification', arch:'ResNet-50 + Attention', input:'224×224×3 (satellite image)', output:'Formation type (1 of 25)', training:'50,000 labeled patches', availability:'backend' as const, browserFallback:'MobileNet feature extraction + rule-based rock classification using SoilGrids + Macrostrat APIs' },
  { name:'Lineament Detection', arch:'U-Net (Segmentation)', input:'512×512 DEM', output:'Fracture probability mask', training:'10,000 annotated DEMs', availability:'backend' as const, browserFallback:'DEM slope/aspect analysis via Open-Elevation API + Canny edge heuristics' },
  { name:'Vegetation Indicator', arch:'Vision Transformer (ViT)', input:'224×224×4 (RGB + NIR)', output:'Indicator species probability', training:'100,000 field photos', availability:'hybrid' as const, browserFallback:'MobileNet scene classification + NDVI from satellite proxy' },
  { name:'Soil Property Prediction', arch:'Random Forest (500 trees)', input:'20 spectral bands + topography', output:'Sand/Silt/Clay fractions', training:'15,000 soil samples', availability:'hybrid' as const, browserFallback:'ISRIC SoilGrids v2.0 REST API (real data, 250m resolution)' },
  { name:'Aquifer Recharge', arch:'LSTM (36 months)', input:'Precipitation, ET, soil moisture', output:'Monthly recharge (mm)', training:'20 years of gauge data', availability:'backend' as const, browserFallback:'Water balance equation using Open-Meteo + NASA POWER climate data' },
  { name:'Risk Assessment', arch:'XGBoost + SHAP', input:'50 geological/hydrological features', output:'Risk score (0-1)', training:'5,000 site assessments', availability:'backend' as const, browserFallback:'Weighted scoring model using available satellite + geological data' },
];

// ─── PART 2.2: ENSEMBLE METHODS (4) ───
export const ENSEMBLE_METHODS = [
  { method:'Stacking', purpose:'Final probability', models:'CNN + RF + XGBoost + LSTM', weighting:'Meta-learner', availability:'backend' as const, browserFallback:'Dempster-Shafer evidence fusion of 8 independent classifiers (advancedRockMapper)' },
  { method:'Bayesian Averaging', purpose:'Uncertainty quantification', models:'All 5 models', weighting:'Posterior probability', availability:'backend' as const, browserFallback:'Confidence-weighted averaging of API data sources' },
  { method:'Dynamic Weighting', purpose:'Adaptive importance', models:'Geological/Climatic/Hydrological', weighting:'Site-specific', availability:'browser' as const, browserFallback:'Implemented — weights adjust based on data availability per source' },
  { method:'Monte Carlo Dropout', purpose:'Confidence intervals', models:'Neural networks', weighting:'100 forward passes', availability:'backend' as const, browserFallback:'Bootstrap confidence intervals from multiple API queries' },
];

// ─── PART 2.3: TIME SERIES FORECASTING (4) ───
export const TIME_SERIES = [
  { variable:'Groundwater Level', horizon:'12 months', model:'LSTM (3 layers, 128 units)', input:'Rainfall, pumping, ET', accuracy:'±0.5m', availability:'backend' as const, browserFallback:'Linear trend from GRACE TWS + seasonal decomposition via Open-Meteo climate history' },
  { variable:'Yield Sustainability', horizon:'10 years', model:'Prophet + SARIMA', input:'Historical yield, recharge', accuracy:'±20%', availability:'backend' as const, browserFallback:'Simple decline curve analysis using water balance estimates' },
  { variable:'Drought Risk', horizon:'6 months', model:'Transformer', input:'SPI, SPEI, ENSO', accuracy:'75% precision', availability:'backend' as const, browserFallback:'SPI calculation from Open-Meteo precipitation history' },
  { variable:'Recharge Forecast', horizon:'3 months', model:'ConvLSTM', input:'Weather forecast ensembles', accuracy:'±30%', availability:'backend' as const, browserFallback:'Water balance model (P − ET − Runoff) using Open-Meteo forecast API' },
];

// ─── PART 3.1: GEO-LOCATION FROM IMAGES (7) ───
export const GEOLOCATION_METHODS = [
  { method:'EXIF GPS Extraction', tech:'ExifTool', accuracy:'±10m', source:"User's device" },
  { method:'Visual Place Recognition', tech:'NetVLAD + Google Street View API', accuracy:'±500m', source:'100M geotagged images' },
  { method:'Landmark Matching', tech:'Google Vision API + Places API', accuracy:'±1km', source:'Google Maps database' },
  { method:'Mountain Silhouette', tech:'PeakVisor algorithm', accuracy:'±2km', source:'SRTM + Peak database' },
  { method:'Vegetation Zone Mapping', tech:'FAO eco-regions', accuracy:'±5km', source:'Global ecological zones' },
  { method:'Reverse Image Search', tech:'Google Reverse Image API', accuracy:'Variable', source:'Web-crawled images' },
  { method:'Cross-Reference Validation', tech:'Bayesian fusion', accuracy:'±100m', source:'Combined methods' },
];

// ─── PART 3.2: TERRAIN FEATURE EXTRACTION (5) ───
export const TERRAIN_FEATURES = [
  { feature:'Valley Bottom Detection', method:'Slope + Curvature + Flow Accumulation', input:'DEM', output:'Valley floor polygon', basis:'Geomorphology' },
  { feature:'Alluvial Fan Identification', method:'Fan-shaped contours + drainage pattern', input:'DEM + satellite', output:'Fan extent', basis:'Sedimentology' },
  { feature:'Karst Feature Detection', method:'Sinkhole morphology + closed depressions', input:'High-res DEM', output:'Dolines, caves', basis:'Karst hydrogeology' },
  { feature:'Spring Line Mapping', method:'Geology contact + topographic break', input:'Geology map + DEM', output:'Spring potential', basis:'Structural geology' },
  { feature:'Paleo-channel Detection', method:'SAR texture + vegetation lineaments', input:'Sentinel-1', output:'Buried channels', basis:'Fluvial geomorphology' },
];

// ─── PART 3.3: VEGETATION AS GROUNDWATER INDICATOR (6) ───
export const VEGETATION_INDICATORS = [
  { species:'Phreatophytes (deep-rooted)', confidence:'High', region:'Arid/semi-arid', basis:'Roots reach water table' },
  { species:'Riparian vegetation', confidence:'Very High', region:'All regions', basis:'Direct water access' },
  { species:'Halophytes (salt-tolerant)', confidence:'Medium', region:'Coastal/arid', basis:'Saline groundwater' },
  { species:'Algal mats in dry areas', confidence:'High', region:'Desert springs', basis:'Shallow groundwater' },
  { species:'Evergreen patches in dry season', confidence:'Very High', region:'Seasonal tropics', basis:'Perennial water access' },
  { species:'Agricultural productivity', confidence:'Medium', region:'Irrigated areas', basis:'May be man-made' },
];

// ─── PART 3.4: GEOLOGICAL STRUCTURE FROM IMAGES (5) ───
export const GEOLOGICAL_STRUCTURES = [
  { structure:'Fault scarps', detection:'Linear topographic breaks', visual:'Steep linear features', confidence:'High' },
  { structure:'Joint sets', detection:'Parallel linear patterns', visual:'Rock fracture lines', confidence:'Medium' },
  { structure:'Bedding planes', detection:'Uniform slope angles', visual:'Striated rock surfaces', confidence:'Medium' },
  { structure:'Fold axes', detection:'Symmetrical topography', visual:'Ridge/valley patterns', confidence:'Medium' },
  { structure:'Dikes/veins', detection:'Linear magnetic anomalies', visual:'Dark linear rock', confidence:'Low (needs validation)' },
];

// ─── PART 4.1: SUCCESS PROBABILITY WEIGHTS (6) ───
export const SUCCESS_WEIGHTS = [
  { factor:'Geology (lithology)', weight:0.30, source:'1:1M scale geological maps', justification:'Primary control on water storage' },
  { factor:'Structure (faults)', weight:0.20, source:'Lineament density', justification:'Secondary permeability' },
  { factor:'Topography (TWI)', weight:0.15, source:'SRTM 30m', justification:'Recharge indicator' },
  { factor:'Vegetation indicators', weight:0.10, source:'Sentinel-2 time series', justification:'Phreatophyte presence' },
  { factor:'Remote sensing indices', weight:0.15, source:'NDVI, NDWI, LST, SAR', justification:'Multi-spectral evidence' },
  { factor:'Historical boreholes', weight:0.10, source:'National databases', justification:'Local validation' },
];

// ─── PART 4.2: DEPTH PREDICTION COEFFICIENTS (5) ───
export const DEPTH_COEFFICIENTS = [
  { variable:'Probability', coefficient:'-35.2', pValue:'<0.001', significance:'Very High' },
  { variable:'Elevation (m)', coefficient:'+0.15', pValue:'<0.01', significance:'High' },
  { variable:'Geology (basement)', coefficient:'+25.0', pValue:'<0.001', significance:'Very High' },
  { variable:'TWI', coefficient:'-8.5', pValue:'<0.05', significance:'Medium' },
  { variable:'Distance to stream (km)', coefficient:'+12.3', pValue:'<0.01', significance:'High' },
];

// ─── PART 4.4: WATER QUALITY PREDICTION (5) ───
export const WQ_PREDICTIONS = [
  { parameter:'TDS', method:'Random Forest (geology + depth + climate)', r2:'0.72', mae:'±85 mg/L' },
  { parameter:'Fluoride', method:'Geology-specific lookup + depth', r2:'0.68', mae:'±0.3 mg/L' },
  { parameter:'Arsenic', method:'Sediment type + redox conditions', r2:'0.65', mae:'±0.002 mg/L' },
  { parameter:'Nitrate', method:'Land use + depth + recharge', r2:'0.60', mae:'±8 mg/L' },
  { parameter:'Iron', method:'Reducing conditions + depth', r2:'0.55', mae:'±0.4 mg/L' },
];

// ─── PART 4.5: COST COMPONENTS — KENYA CONTEXT (10) ───
export const COST_COMPONENTS = [
  { component:'Drilling (sandy)', range:'$45–60', unit:'per meter', notes:'Standard auger' },
  { component:'Drilling (clay)', range:'$55–75', unit:'per meter', notes:'Mud rotary' },
  { component:'Drilling (rocky)', range:'$80–150', unit:'per meter', notes:'DTH hammer' },
  { component:'Casing (PVC)', range:'$25–35', unit:'per meter', notes:'6" diameter' },
  { component:'Casing (steel)', range:'$60–90', unit:'per meter', notes:'For deep wells' },
  { component:'Screen', range:'$20–40', unit:'per meter', notes:'0.020" slot' },
  { component:'Pump (submersible)', range:'$500–2,000', unit:'each', notes:'2–10 HP' },
  { component:'Mobilization', range:'$500–3,000', unit:'fixed', notes:'Distance dependent' },
  { component:'Permits', range:'$100–500', unit:'fixed', notes:'County dependent' },
  { component:'Water testing', range:'$100–500', unit:'per sample', notes:'Parameters dependent' },
];

// ─── PART 5.1: CONTAMINATION RISK SOURCES (6) ───
export const CONTAMINATION_RISKS = [
  { source:'Sewage', detection:'Distance to settlement + population density', factors:'Pathogens, nitrates', mitigation:'Sanitary seal, UV treatment' },
  { source:'Agriculture', detection:'Land use classification + slope', factors:'Nitrates, pesticides', mitigation:'Activated carbon, monitoring' },
  { source:'Industry', detection:'Distance to industrial zones', factors:'Heavy metals, VOCs', mitigation:'Reverse osmosis, testing' },
  { source:'Landfill', detection:'Distance to waste sites', factors:'Leachate, methane', mitigation:'Extended casing, bentonite seal' },
  { source:'Mining', detection:'Known mining areas', factors:'Arsenic, cyanide', mitigation:'Specialized treatment' },
  { source:'Saltwater intrusion', detection:'Distance to coast + pumping rate', factors:'Chlorides, salinity', mitigation:'Brackish treatment, alternative source' },
];

// ─── PART 5.2: GEOLOGICAL RISK (5) ───
export const GEOLOGICAL_RISKS = [
  { factor:'Fault zone', assessment:'Lineament density + seismic history', mitigation:'Casing through zone' },
  { factor:'Karst features', assessment:'Sinkhole mapping + cavern probability', mitigation:'Grouting, alternative location' },
  { factor:'Unconsolidated sediments', assessment:'Grain size analysis', mitigation:'Gravel pack, screen design' },
  { factor:'High gas content', assessment:'Known coal/oil areas', mitigation:'Venting, gas separator' },
  { factor:'Abandoned wells', assessment:'Historical records', mitigation:'Avoidance, grouting' },
];

// ─── PART 5.3: FINANCIAL RISK (5) ───
export const FINANCIAL_RISKS = [
  { risk:'Cost overrun', calculation:'Monte Carlo simulation', threshold:'>20% over budget = High risk' },
  { risk:'Yield shortfall', calculation:'Historical yield distribution', threshold:'<50% predicted = High risk' },
  { risk:'Dry hole', calculation:'Success probability', threshold:'<40% = High risk' },
  { risk:'Water quality failure', calculation:'Treatment cost > $10,000', threshold:'High risk' },
  { risk:'ROI negative', calculation:'NPV < 0', threshold:'Unacceptable' },
];

// ─── PART 5.4: OPERATIONAL RISK (5) ───
export const OPERATIONAL_RISKS = [
  { risk:'Equipment failure', factors:'Depth, rock hardness', mitigation:'Spare parts, backup rig' },
  { risk:'Weather delay', factors:'Seasonal rainfall', mitigation:'Schedule planning' },
  { risk:'Access issues', factors:'Road quality, slope', mitigation:'4x4 vehicles, dry season' },
  { risk:'Permit delays', factors:'County bureaucracy', mitigation:'Early application, local agent' },
  { risk:'Community opposition', factors:'Land ownership', mitigation:'Engagement, compensation' },
];

// ─── PART 6.1: REPORT SECTIONS (10) ───
export const REPORT_SECTIONS = [
  { section:'Executive Summary', content:'Key findings, probability, depth, yield, cost', sources:'All analyses', length:'1 page' },
  { section:'Site Characterization', content:'Location, geology, topography, climate', sources:'Maps, satellites', length:'2–3 pages' },
  { section:'Hydrogeological Analysis', content:'Aquifer type, depth, thickness, properties', sources:'Geological + remote sensing', length:'3–4 pages' },
  { section:'Water Quality Assessment', content:'Predicted parameters, WHO comparison, treatment', sources:'ML models + regional data', length:'2 pages' },
  { section:'Contamination Risk', content:'Sources, pathways, receptors, mitigation', sources:'Land use + proximity', length:'2 pages' },
  { section:'Drilling Recommendations', content:'Depth, casing, screen, pump, development', sources:'Engineering standards', length:'2 pages' },
  { section:'Cost Estimation', content:'Itemized breakdown, contingency, total', sources:'Local rates', length:'1 page' },
  { section:'Risk Assessment', content:'Geological, contamination, financial, operational', sources:'All analyses', length:'2 pages' },
  { section:'Monitoring Plan', content:'Frequency, parameters, reporting', sources:'Best practices', length:'1 page' },
  { section:'Appendices', content:'Data sources, methodology, references', sources:'Citations', length:'3–5 pages' },
];

// ─── PART 6.2: MAP TYPES (8) ───
export const MAP_TYPES = [
  { type:'Location map', data:'Site on satellite imagery', scale:'1:50,000', format:'GeoJSON' },
  { type:'Geological map', data:'Formations, faults, aquifers', scale:'1:250,000', format:'Shapefile' },
  { type:'Topographic map', data:'Contours, streams, catchments', scale:'1:50,000', format:'GeoJSON' },
  { type:'Probability heatmap', data:'Success probability raster', scale:'1:50,000', format:'GeoTIFF' },
  { type:'Depth to water', data:'Contoured water levels', scale:'1:50,000', format:'GeoTIFF' },
  { type:'Contamination risk', data:'Risk zones', scale:'1:50,000', format:'GeoJSON' },
  { type:'Cross-sections', data:'Geology to depth', scale:'1:10,000', format:'SVG/PNG' },
  { type:'Borehole log', data:'Lithology, water strikes', scale:'1:200', format:'SVG/PNG' },
];

// ─── PART 6.3: CHARTS & GRAPHS (8) ───
export const CHART_TYPES = [
  { chart:'Probability gauge', x:'N/A', y:'0-100%', purpose:'Success chance' },
  { chart:'Depth histogram', x:'Depth (m)', y:'Frequency', purpose:'Depth distribution' },
  { chart:'Yield curve', x:'Depth (m)', y:'Yield (m³/h)', purpose:'Optimal depth' },
  { chart:'Cost breakdown', x:'Categories', y:'Amount ($)', purpose:'Budget allocation' },
  { chart:'Risk matrix', x:'Likelihood', y:'Consequence', purpose:'Risk prioritization' },
  { chart:'Water quality radar', x:'Parameters', y:'Concentration', purpose:'WHO comparison' },
  { chart:'Seasonal water level', x:'Month', y:'Depth to water (m)', purpose:'Pumping schedule' },
  { chart:'ROI timeline', x:'Year', y:'Cumulative cash flow', purpose:'Investment decision' },
];

// ─── PART 6.4: DATA EXPORT FORMATS (8) ───
export const EXPORT_FORMATS = [
  { format:'PDF', useCase:'Client report', content:'Full analysis', schema:'Custom template' },
  { format:'DOCX', useCase:'Editable report', content:'Full analysis', schema:'Custom template' },
  { format:'XLSX', useCase:'Data analysis', content:'All parameters', schema:'Tabular' },
  { format:'CSV', useCase:'GIS import', content:'Coordinates, depth, yield', schema:'WGS84' },
  { format:'GeoJSON', useCase:'Map overlay', content:'Site + risk zones', schema:'GeoJSON spec' },
  { format:'Shapefile', useCase:'Professional GIS', content:'All spatial data', schema:'ESRI spec' },
  { format:'KML', useCase:'Google Earth', content:'Site + buffer', schema:'OGC KML' },
  { format:'JSON', useCase:'API integration', content:'Complete dataset', schema:'Custom schema' },
];

// ─── PART 7.1: ACCURACY TARGETS (5) ───
export const ACCURACY_TARGETS = [
  { prediction:'Success/failure', target:'85%', bestInClass:'77% (WATex)', goal:'85%' },
  { prediction:'Depth (±15m)', target:'75%', bestInClass:'70%', goal:'80%' },
  { prediction:'Yield (±5 m³/h)', target:'70%', bestInClass:'65%', goal:'75%' },
  { prediction:'Water quality (potable/non)', target:'80%', bestInClass:'75%', goal:'85%' },
  { prediction:'Contamination presence', target:'75%', bestInClass:'70%', goal:'80%' },
];

// ─── PART 7.2: VALIDATION METHODOLOGY (5) ───
export const VALIDATION_METHODS = [
  { method:'Blind testing', description:'Compare predictions vs new boreholes', sample:'100 sites', frequency:'Quarterly' },
  { method:'Cross-validation', description:'5-fold spatial validation', sample:'10,000 boreholes', frequency:'Annually' },
  { method:'Expert review', description:'Hydrogeologist evaluation', sample:'50 sites', frequency:'Monthly' },
  { method:'Field verification', description:'Site visits to predicted locations', sample:'20 sites', frequency:'Quarterly' },
  { method:'User feedback', description:'Real-world success reporting', sample:'All users', frequency:'Continuous' },
];

// ─── PART 7.3: CONFIDENCE LEVELS (4) ───
export const CONFIDENCE_LEVELS = [
  { level:'High (90%+)', criteria:'Multiple data sources agree, strong geological evidence', interpretation:'Proceed with standard design' },
  { level:'Medium (70–90%)', criteria:'Most data agree, some uncertainty', interpretation:'Conservative design, monitoring' },
  { level:'Low (50–70%)', criteria:'Mixed evidence, significant uncertainty', interpretation:'Test drilling recommended' },
  { level:'Very Low (<50%)', criteria:'Contradictory evidence, poor data', interpretation:'Site survey required' },
];

// ─── KEY SCIENTIFIC FORMULAS ───
export const FORMULAS = {
  successProb: 'P(success) = w₁×P(geology) + w₂×P(structure) + w₃×P(topography) + w₄×P(vegetation) + w₅×P(remote_sensing) + w₆×P(historical)',
  depthRegression: 'Depth(m) = β₀ + β₁×Probability + β₂×Elevation + β₃×Geology_Code + β₄×TWI + β₅×Distance_to_Stream + ε',
  yieldEmpirical: 'Yield(m³/h) = a × K × b × s × f',
  yieldML: 'Yield = XGBoost(Depth, Geology, TWI, SAR_backscatter, NDVI, Historical_yields)',
  costModel: 'Cost($) = (Depth × Rate_geology × Rate_remoteness) + Casing + Screen + Pump + Mobilization + Contingency',
  transmissivity: 'T = K × b',
  twi: 'TWI = ln(α / tan β)',
  sebal: 'λET = Rn − G − H',
  swe: 'SWE = α(Tb18V − Tb36V) + β',
  smap: 'SM = a·σ⁰VV + b·σ⁰VH + c·NDVI',
  otsu: 'argmax σ²B = w₀w₁(μ₀−μ₁)²',
  mcd43a3: 'BSA(θ) = fiso + fvol·Kvol + fgeo·Kgeo',
  npv: 'NPV = −C₀ + Σ[(Rₜ−Cₜ)/(1+r)ᵗ]',
};

// ─── PREDICTION INTERVALS ───
export const DEPTH_INTERVALS = [
  { confidence:'50%', range:'±15m' },
  { confidence:'80%', range:'±30m' },
  { confidence:'95%', range:'±50m' },
];

export const YIELD_ACCURACY = { r2:'0.67', mae:'±3.5 m³/h', rmse:'±5.2 m³/h' };

// ─── SCIENCE PARTS NAVIGATION ───
export interface SciencePart {
  id: string;
  part: string;
  title: string;
  icon: string;
  color: string;
  count: number;
  description: string;
}

export const SCIENCE_PARTS: SciencePart[] = [
  { id:'remote-sensing',  part:'1.1', title:'Remote Sensing & Satellite Data Fusion', icon:'🛰️', color:'#2196F3', count:10, description:'GRACE-FO, SMAP+S1, SEBAL, GPM, NDWI, InSAR, LST, MODIS, AMSR-2' },
  { id:'geo-hydro',       part:'1.2', title:'Geological & Hydrogeological Mapping',   icon:'🪨', color:'#FF9800', count:8,  description:'Aquifer classification, lineament detection, bedrock depth, porosity, conductivity' },
  { id:'topo-hydro',      part:'1.3', title:'Topographic & Hydrological Analysis',    icon:'🏔️', color:'#4CAF50', count:8,  description:'Flow accumulation, TWI, drainage density, slope, curvature, catchment delineation' },
  { id:'historical',      part:'1.4', title:'Historical Borehole Data Integration',   icon:'📊', color:'#9C27B0', count:5,  description:'10,000+ borehole records, depth statistics, yield distributions, quality trends' },
  { id:'deep-learning',   part:'2.1', title:'Deep Learning Models',                   icon:'🧠', color:'#E91E63', count:6,  description:'ResNet-50, U-Net, ViT, Random Forest, LSTM, XGBoost + SHAP' },
  { id:'ensemble',        part:'2.2', title:'Ensemble Methods',                       icon:'🔗', color:'#00BCD4', count:4,  description:'Stacking, Bayesian Averaging, Dynamic Weighting, Monte Carlo Dropout' },
  { id:'time-series',     part:'2.3', title:'Time Series Forecasting',                icon:'📈', color:'#FF5722', count:4,  description:'Groundwater level, yield sustainability, drought risk, recharge forecast' },
  { id:'geolocation',     part:'3.1', title:'Geo-Location from Images',               icon:'📍', color:'#795548', count:7,  description:'EXIF, NetVLAD, Landmark, Silhouette, Vegetation zone, Bayesian fusion' },
  { id:'terrain',         part:'3.2', title:'Terrain Feature Extraction',              icon:'🗺️', color:'#607D8B', count:5,  description:'Valley bottoms, alluvial fans, karst features, spring lines, paleo-channels' },
  { id:'vegetation',      part:'3.3', title:'Vegetation as Groundwater Indicator',     icon:'🌿', color:'#8BC34A', count:6,  description:'Phreatophytes, riparian, halophytes, algal mats, evergreen patches' },
  { id:'geol-structures', part:'3.4', title:'Geological Structure from Images',        icon:'🧱', color:'#FF9800', count:5,  description:'Fault scarps, joint sets, bedding planes, fold axes, dikes/veins' },
  { id:'predictions',     part:'4',   title:'Predictive Capabilities',                icon:'🎯', color:'#F44336', count:31, description:'Success probability, depth, yield, water quality, cost estimation' },
  { id:'risk-assess',     part:'5',   title:'Risk Assessment',                        icon:'⚠️', color:'#FF5722', count:21, description:'Contamination, geological, financial, operational risk' },
  { id:'reporting',       part:'6',   title:'Output & Reporting',                     icon:'📄', color:'#607D8B', count:34, description:'10 report sections, 8 map types, 8 charts, 8 export formats' },
  { id:'validation',      part:'7',   title:'Validation & Accuracy',                  icon:'✅', color:'#4CAF50', count:14, description:'Accuracy targets, validation methodology, confidence metrics' },
];

// Total capabilities count
export const TOTAL_CAPABILITIES = SCIENCE_PARTS.reduce((a, p) => a + p.count, 0);

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

// Dynamic import for AI Borehole Analyzer
const BoreholeAIAnalyzer = dynamic(
  () => import('@/components/borehole/BoreholeAIAnalyzer'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading AI Analyzer...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const TABS = [
  { id: 'ai-analyzer', label: 'AquaScan Pro', color: 'gradient', badge: 'WORLD #1' },
  { id: 'ai-capabilities', label: 'AI Capabilities', color: 'cyan', badge: '85% ACC' },
  { id: 'overview', label: 'Overview', color: 'cyan' },
  { id: 'types', label: 'Pump Types', color: 'blue' },
  { id: 'parts', label: 'Pump Parts', color: 'slate' },
  { id: 'installation', label: 'Installation', color: 'green' },
  { id: 'vfd', label: 'VFD Systems', color: 'purple' },
  { id: 'maintenance', label: 'Maintenance', color: 'amber' },
  { id: 'faults', label: 'Troubleshooting', color: 'red' },
  { id: 'sizing', label: 'Sizing Guide', color: 'indigo' },
  { id: 'pricing', label: 'Pricing', color: 'emerald' },
  { id: 'shipping', label: 'Send Your Pump', color: 'orange' },
  { id: 'warranty', label: 'Warranty', color: 'teal' },
];

// ============================================================================
// AQUASCAN PRO - COMPREHENSIVE CAPABILITIES DATABASE
// ============================================================================

const AQUASCAN_CAPABILITIES = {
  globalCoverage: [
    { capability: 'Geographic Coverage', details: '195+ countries, 6 continents', accuracy: 100 },
    { capability: 'Region Auto-Detection', details: 'GPS coordinates → nearest geological database', accuracy: 95 },
    { capability: 'Multi-Currency Pricing', details: '25+ currencies with regional cost multipliers', accuracy: 100 },
    { capability: 'Geological Database', details: '100+ cities with detailed aquifer data', accuracy: 92 },
  ],
  satelliteAnalysis: [
    { capability: 'Sentinel-2 Imagery', details: 'NDVI, NDWI, NDMI, Bare Soil Index', accuracy: 89, source: 'ESA Copernicus' },
    { capability: 'Landsat-8 Thermal', details: 'Surface temperature, thermal anomalies, moisture index', accuracy: 87, source: 'NASA/USGS' },
    { capability: 'MODIS Data', details: 'Evapotranspiration, land surface temperature, vegetation', accuracy: 85, source: 'NASA' },
    { capability: 'NASA GLDAS 2.1', details: 'Groundwater storage, soil moisture (4 layers), monthly trends', accuracy: 88, source: 'NASA GES DISC' },
    { capability: 'Google Earth Engine', details: 'Real-time satellite data integration', accuracy: 90, source: 'Google' },
  ],
  terrainAnalysis: [
    { capability: 'LiDAR Terrain Analysis', details: 'Digital Elevation Model (DEM), slope, aspect', accuracy: 94 },
    { capability: 'Topographic Wetness Index', details: 'Water accumulation prediction', accuracy: 91 },
    { capability: 'Drainage Pattern Detection', details: 'Dendritic, radial, trellis pattern identification', accuracy: 88 },
    { capability: 'Depression Mapping', details: 'Natural water collection zones', accuracy: 90 },
    { capability: 'Valley/Hill Classification', details: 'Terrain favorability scoring', accuracy: 89 },
  ],
  hyperspectralMapping: [
    { capability: 'Mineral Identification', details: 'Quartz, feldspar, clay minerals, iron oxides', accuracy: 85 },
    { capability: 'Rock Type Classification', details: 'Granite, basalt, limestone, sandstone, shale', accuracy: 87 },
    { capability: 'Weathering Assessment', details: 'Fresh, slightly, moderately, highly weathered', accuracy: 84 },
    { capability: 'Fracture Detection', details: 'Rock fractures indicating water pathways', accuracy: 82 },
    { capability: 'Porosity Estimation', details: 'High, medium, low, very low classification', accuracy: 86 },
  ],
  geophysicalSurveys: [
    { capability: 'Virtual VES', details: 'Vertical Electrical Sounding simulation', accuracy: 83, equivalent: 'Saves KES 50,000+' },
    { capability: 'Virtual ERT', details: 'Electrical Resistivity Tomography', accuracy: 81, equivalent: 'Saves KES 80,000+' },
    { capability: 'Resistivity Mapping', details: 'Subsurface layer conductivity', accuracy: 84, equivalent: 'No equipment needed' },
    { capability: 'Aquifer Boundary Detection', details: 'Layer thickness estimation', accuracy: 80, equivalent: 'Instant results' },
    { capability: 'Water Table Depth', details: 'Static water level estimation', accuracy: 85, equivalent: '2 min vs 2 weeks' },
  ],
  soilAnalysis: [
    { capability: 'USDA Soil Order', details: '12 USDA soil orders classification', accuracy: 88, standard: 'USDA' },
    { capability: 'FAO Soil Group', details: 'International soil classification', accuracy: 86, standard: 'FAO/UNESCO' },
    { capability: 'Texture Analysis', details: 'Sand/silt/clay percentages', accuracy: 90, standard: 'Soil Survey' },
    { capability: 'Hydraulic Conductivity', details: 'Water flow rate through soil', accuracy: 85, standard: 'Darcy\'s Law' },
    { capability: 'Infiltration Rate', details: 'Surface water absorption speed', accuracy: 87, standard: 'Green-Ampt' },
    { capability: 'Soil Color Profile', details: 'Munsell color depth mapping', accuracy: 92, standard: 'Munsell' },
    { capability: 'pH & Chemistry', details: 'Acidity, salinity, mineral content', accuracy: 84, standard: 'Lab-equivalent' },
  ],
  weatherClimate: [
    { capability: 'Current Conditions', details: 'Real-time temperature, humidity, wind', accuracy: 95 },
    { capability: 'Monthly Rainfall', details: '12-month precipitation patterns', accuracy: 90 },
    { capability: 'Seasonal Forecasts', details: '4-season predictions', accuracy: 82 },
    { capability: 'Drought Risk', details: 'Historical drought frequency', accuracy: 85 },
    { capability: 'Recharge Periods', details: 'Optimal drilling seasons', accuracy: 88 },
  ],
  financialAnalysis: [
    { capability: 'Comprehensive Costs', details: 'Drilling, casing, pump, solar, shelter, permits', accuracy: 90 },
    { capability: 'ROI Analysis', details: '10-year return on investment', accuracy: 88 },
    { capability: 'NPV Calculation', details: 'Net Present Value at 10% discount', accuracy: 90 },
    { capability: 'IRR Computation', details: 'Internal Rate of Return', accuracy: 88 },
    { capability: 'Payback Period', details: 'Years to recover investment', accuracy: 92 },
    { capability: 'Water Cost/Liter', details: 'Lifetime cost analysis', accuracy: 90 },
  ],
  predictions: [
    { capability: 'Success Probability', details: 'Overall drilling success chance', accuracy: 85, highlight: true },
    { capability: 'Yield Estimation', details: 'm³/hour water output', accuracy: 83 },
    { capability: 'Optimal Depth', details: 'Best drilling depth prediction', accuracy: 87 },
    { capability: 'Water Quality', details: 'TDS, pH, hardness, contaminants', accuracy: 82 },
    { capability: '5-Year Sustainability', details: 'Long-term yield stability', accuracy: 80 },
    { capability: '10-Year Projections', details: 'Water table & yield trends', accuracy: 78 },
    { capability: 'Climate Impact', details: 'Drought/flood effects on aquifer', accuracy: 75 },
  ],
  visualizations: [
    { capability: 'Area Map Generation', details: 'Satellite basemap with overlays', accuracy: 95 },
    { capability: 'Land Use Distribution', details: 'Agriculture, urban, forest, water %', accuracy: 90 },
    { capability: 'Points of Interest', details: 'Nearby boreholes, rivers, towns', accuracy: 92 },
    { capability: 'Aquifer Cross-Section', details: '3D subsurface visualization', accuracy: 85 },
    { capability: 'Soil Depth Profile', details: 'Visual horizon layers with colors', accuracy: 88 },
    { capability: 'Success Gauge', details: 'Visual probability indicator', accuracy: 90 },
    { capability: 'Cost Pie Chart', details: 'Budget breakdown visualization', accuracy: 100 },
    { capability: 'Depth vs Yield', details: 'Optimal depth analysis graph', accuracy: 87 },
  ],
  compliance: [
    { capability: 'EIA Category', details: 'Exempt, project report, full EIA', accuracy: 90 },
    { capability: 'Permit Requirements', details: 'WRA, NEMA, county permits', accuracy: 95 },
    { capability: 'Setback Distances', details: 'From latrines, septic, contamination', accuracy: 100 },
    { capability: 'Water Rights', details: 'Licensing requirements', accuracy: 88 },
  ],
  outputs: [
    { capability: 'PDF Report', details: 'Downloadable comprehensive report', available: true },
    { capability: 'WhatsApp Sharing', details: 'One-click share to consultant', available: true },
    { capability: 'Executive Summary', details: '1-page decision document', available: true },
    { capability: 'Technical Notes', details: 'Detailed geological analysis', available: true },
    { capability: 'Risk Assessment', details: 'Identified risks & mitigations', available: true },
    { capability: 'Next Steps', details: 'Actionable recommendations', available: true },
  ],
};

// Comprehensive Borehole Pump Overview - 10 Detailed Paragraphs
const PUMP_OVERVIEW = [
  {
    title: "Understanding Borehole Pump Systems",
    content: `Borehole pumps are specialized water extraction systems designed to lift water from underground aquifers through drilled wells. In Kenya and East Africa, where groundwater is a primary source of water for domestic, agricultural, and industrial use, borehole pumps are essential infrastructure. Unlike surface pumps that can only lift water from shallow depths of about 7-8 meters due to atmospheric pressure limitations, borehole submersible pumps operate underwater and can push water from depths exceeding 500 meters. These pumps are critical for communities without access to municipal water, farms requiring irrigation, hotels, hospitals, and industries that need reliable water supply independent of unreliable piped systems. Understanding the different types, proper installation, and maintenance of borehole pumps is essential for anyone managing water infrastructure.`
  },
  {
    title: "How Submersible Pumps Work",
    content: `Submersible borehole pumps are marvels of engineering, designed to operate completely submerged in water at significant depths. The pump unit consists of a sealed motor at the bottom (or top in some designs) connected to a multi-stage pump above. The motor is typically a 2-pole induction motor running at 2900 RPM (50Hz), hermetically sealed with water or oil filling for cooling and lubrication. The pump section contains multiple impellers stacked in series - each stage adds pressure (head) to the water. A 10-stage pump with 10 impellers provides 10 times the pressure of a single stage. Water enters through a strainer at the bottom, flows past the motor for cooling, then through the impeller stages where each stage accelerates and pressurizes the water. The high-pressure water then travels up the rising main pipe to the surface tank or distribution system.`
  },
  {
    title: "Importance of Proper Pump Selection",
    content: `Selecting the right borehole pump is critical for efficiency, longevity, and cost-effectiveness. A pump that's too small will struggle to deliver required flow, running continuously and wearing out quickly. A pump that's too large wastes energy, can cause water hammer, and may pump the borehole dry, damaging both the pump and aquifer. Proper selection requires accurate borehole test pumping data including static water level, dynamic water level at various flow rates, recovery rate, and sustainable yield. The pump must be sized to deliver the required daily volume at a flow rate below the sustainable yield, with adequate pressure to overcome total dynamic head (TDH). Our engineers analyze all these factors to specify the optimal pump model, motor size, and number of stages for your specific borehole conditions and water requirements.`
  },
  {
    title: "The Role of Variable Frequency Drives (VFDs)",
    content: `Variable Frequency Drives have revolutionized borehole pump systems, offering benefits that far outweigh their additional cost. Traditional direct-on-line starting creates severe electrical and mechanical stress - inrush currents up to 8 times running current stress the power supply and motor windings, while the sudden start causes water hammer that damages pipes and fittings. VFDs provide soft starting that ramps up speed gradually, eliminating these problems. More importantly, VFDs enable constant pressure systems that vary pump speed to match demand, rather than cycling the pump on and off. This reduces energy consumption by 20-50% (since power varies with the cube of speed), extends pump life by eliminating frequent starts, and provides diagnostic capabilities through monitoring of current, frequency, and fault history. For borehole systems, VFDs are no longer a luxury but a best-practice requirement.`
  },
  {
    title: "Understanding Borehole Water Quality Issues",
    content: `Water quality significantly impacts pump selection and longevity. Sand and silt in the water act as abrasives that wear impellers and diffusers, reducing efficiency and eventually causing failure. Iron and manganese in groundwater can precipitate inside the pump, causing blockages and reduced performance. Hydrogen sulfide (common in deep aquifers) corrodes standard pump materials, requiring stainless steel or specialized alloys. High salinity accelerates corrosion and affects motor insulation. Before pump installation, water quality analysis should include pH, total dissolved solids (TDS), hardness, iron content, and sand test. Based on results, appropriate pump materials are specified - from standard cast iron and bronze for clean water, to 316 stainless steel, Duplex steel, or even titanium for aggressive water conditions. Proper strainer selection also prevents oversized particles from entering the pump.`
  },
  {
    title: "Borehole Pump Installation Best Practices",
    content: `Professional installation is critical for borehole pump reliability. The pump must be positioned correctly - typically 2-3 meters above the borehole screen or bottom to prevent sand ingestion, but below the dynamic (pumping) water level to ensure it remains submerged. The submersible cable must be properly sized for the motor load and cable length to prevent voltage drop exceeding 3-5%, which causes motor overheating and failure. A stainless steel safety rope is essential to secure the pump in case the rising main fails. The wellhead must be sealed with a sanitary cap to prevent contamination from surface water, vermin, or debris entering the borehole. Control panels must include overload protection, phase monitors (for 3-phase), dry-run protection, and lightning arresters to protect the significant investment in downhole equipment.`
  },
  {
    title: "Maintenance: The Key to Pump Longevity",
    content: `Regular maintenance dramatically extends borehole pump life and prevents costly emergency repairs. Monthly checks should include recording running current (compared to baseline - increasing current indicates wear or blockage), verifying flow rate and pressure (decreasing performance indicates impeller wear or declining water level), and inspecting the control panel for faults or abnormal readings. Quarterly maintenance should include megger testing the motor insulation (resistance below 2 megohms indicates water ingress), checking surge arresters, and verifying pressure tank pre-charge. Annually, a comprehensive pump performance test comparing current operation to original commissioning data identifies declining performance before failure occurs. Every 3-5 years (depending on water quality), the pump should be pulled for inspection, impeller and wear ring replacement if needed, and motor service. This preventive approach costs far less than emergency failures that can leave you without water for weeks.`
  },
  {
    title: "Common Borehole Pump Problems and Solutions",
    content: `Understanding common failure modes helps in troubleshooting and prevention. Motor failure is often preceded by increasing current draw, caused by bearing wear, winding insulation breakdown from moisture ingress, or sustained operation at low voltage. Reduced flow is usually caused by impeller wear (especially in sandy water), declining aquifer level, or a leak in the rising main. Complete loss of water output could indicate air lock in the system, a broken pump shaft, a failed check valve allowing water to drain back, or critically low water level. VFD faults like overcurrent or ground fault typically point to motor winding problems or cable damage. Many problems can be diagnosed from the surface using current measurements, pressure readings, and VFD fault codes before incurring the expense of pulling the pump. Our technicians are equipped with diagnostic tools and years of experience to quickly identify and resolve borehole pump issues.`
  },
  {
    title: "Solar-Powered Borehole Systems",
    content: `Solar borehole pumps have become increasingly popular in Kenya, especially for agricultural and livestock watering applications in off-grid locations. These systems use DC motors powered directly by solar panels, or AC motors driven by solar-compatible VFDs. The key advantage is zero fuel cost - after initial installation, the sun provides free energy for pumping. Solar systems are sized based on peak pumping requirements, local solar irradiance (Kenya averages 5-6 kWh/m² per day), and storage requirements (either elevated tank storage or battery storage for evening pumping). Solar pumps operate at variable speed based on available sunlight, with maximum output at midday. For critical applications, hybrid systems can switch to grid or generator power during cloudy periods. We design and install complete solar pumping systems including panels, mounting structures, controllers, and storage tanks, sized to meet your specific water requirements throughout the year.`
  },
  {
    title: "Our Commitment to Excellence in Borehole Services",
    content: `At Emerson Industrial Maintenance Services, we provide comprehensive borehole pump solutions from specification to installation to long-term maintenance. Our team includes experienced hydrogeologists who interpret borehole test data, electrical engineers who design robust control systems, and field technicians who handle installations and repairs. We represent leading pump manufacturers including Grundfos, Pedrollo, Lowara, Davis & Shirtliff, and others, ensuring access to quality equipment and genuine spare parts. Our workshop can repair and rewind submersible motors up to 200kW, using original-specification materials and testing equipment. We offer maintenance contracts that include regular inspections, emergency response, and priority service. Whether you need a new borehole pump installation, upgrade of an existing system to VFD control, or emergency repair service, we have the expertise and resources to deliver reliable water supply solutions.`
  }
];

// Comprehensive Pump Types
const PUMP_TYPES = [
  {
    type: 'Submersible Borehole Pump',
    image: 'submersible',
    depth: '30m - 500m+',
    flow: '1 - 200 m³/hr',
    power: '0.37kW - 250kW',
    efficiency: '50-75%',
    stages: '5 - 100+ stages',
    materials: 'SS304, SS316, Cast Iron',
    applications: ['Deep boreholes', 'Municipal supply', 'Industrial use', 'Irrigation'],
    advantages: ['Works at any depth', 'No priming required', 'Quiet operation', 'Reliable performance'],
    limitations: ['Expensive to pull for service', 'Motor service specialized', 'Cable size critical'],
    brands: ['Grundfos SP', 'Pedrollo 4SR', 'Lowara GS', 'DAB S4']
  },
  {
    type: 'Jet Pump (Surface)',
    image: 'jet',
    depth: '0 - 25m',
    flow: '1 - 10 m³/hr',
    power: '0.37kW - 3kW',
    efficiency: '25-45%',
    stages: 'Single stage + ejector',
    materials: 'Cast Iron, Bronze impeller',
    applications: ['Shallow wells', 'Domestic use', 'Small gardens'],
    advantages: ['Surface mounted', 'Easy maintenance', 'Low cost', 'Simple installation'],
    limitations: ['Limited depth', 'Lower efficiency', 'Requires priming', 'Noisy operation'],
    brands: ['Pedrollo', 'DAB', 'Lowara', 'PKM Series']
  },
  {
    type: 'Helical Rotor (Progressive Cavity)',
    image: 'helical',
    depth: '30m - 200m',
    flow: '0.5 - 30 m³/hr',
    power: '0.55kW - 22kW',
    efficiency: '50-65%',
    stages: 'Progressive cavity',
    materials: 'Stainless steel rotor, rubber stator',
    applications: ['Low-yield wells', 'Sandy water', 'Viscous fluids', 'Solar direct drive'],
    advantages: ['Handles sand well', 'Low starting torque', 'Works with low yield', 'Smooth flow'],
    limitations: ['Wear on rubber stator', 'Speed limited', 'Not for hot water'],
    brands: ['Grundfos SQFlex', 'Mono', 'PCM', 'Seepex']
  },
  {
    type: 'Solar DC Submersible Pump',
    image: 'solar',
    depth: '30m - 200m',
    flow: '1 - 50 m³/hr',
    power: '0.5kW - 15kW DC',
    efficiency: '60-85%',
    stages: 'Multi-stage',
    materials: 'Stainless steel',
    applications: ['Off-grid locations', 'Livestock watering', 'Remote farms', 'Villages'],
    advantages: ['Zero running cost', 'No fuel required', 'Low maintenance', 'Government subsidies'],
    limitations: ['Variable output with weather', 'Higher initial cost', 'Limited night pumping'],
    brands: ['Lorentz', 'Grundfos SQFlex', 'Shakti', 'Dayliff Solar']
  },
  {
    type: 'Turbine Pump (Vertical Lineshaft)',
    image: 'turbine',
    depth: '20m - 150m',
    flow: '20 - 1000 m³/hr',
    power: '3kW - 500kW',
    efficiency: '70-85%',
    stages: 'Multi-stage bowl assembly',
    materials: 'Cast iron, bronze bearings',
    applications: ['Municipal supply', 'Irrigation', 'Industrial cooling', 'Fire fighting'],
    advantages: ['High efficiency', 'Motor on surface', 'Easy motor service', 'High flow rates'],
    limitations: ['Requires straight borehole', 'Complex installation', 'Bearing maintenance', 'Alignment critical'],
    brands: ['Peerless', 'Byron Jackson', 'Flowserve', 'Sulzer']
  },
  {
    type: 'Hand Pump (Manual)',
    image: 'hand',
    depth: '10m - 45m (Afridev up to 45m)',
    flow: '0.5 - 1.5 m³/hr',
    power: 'Manual operation',
    efficiency: 'N/A',
    stages: 'Cylinder & piston',
    materials: 'Galvanized steel, brass cylinder',
    applications: ['Rural communities', 'Emergency backup', 'Remote areas', 'Schools'],
    advantages: ['No electricity needed', 'Simple maintenance', 'Community operated', 'Low cost'],
    limitations: ['Labor intensive', 'Low output', 'Fatigue from pumping'],
    brands: ['Afridev', 'India Mark II/III', 'Bush Pump', 'Vergnet']
  }
];

// Pump Parts with Diagrams
const PUMP_PARTS = [
  {
    name: 'Submersible Motor',
    description: 'Hermetically sealed electric motor designed to operate underwater. Filled with water or oil for cooling and bearing lubrication.',
    function: 'Converts electrical energy to mechanical rotation to drive the pump stages',
    diagram: `
┌───────────────────────────┐
│  ▓▓▓ CABLE ENTRY ▓▓▓    │
├───────────────────────────┤
│    THRUST BEARING         │
│    ═══════════════        │
│                           │
│   ┌───────────────────┐   │
│   │   STATOR WINDING  │   │
│   │  ┌─────────────┐  │   │
│   │  │   ROTOR     │  │   │
│   │  │   SHAFT     │  │   │
│   │  │     ║       │  │   │
│   │  │     ║       │  │   │
│   │  └─────────────┘  │   │
│   └───────────────────┘   │
│                           │
│    ═══════════════        │
│    LOWER BEARING          │
├───────────────────────────┤
│   MECHANICAL SEAL         │
│   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒         │
└───────────────────────────┘
    ↓ TO PUMP INTAKE
    `,
    maintenance: ['Megger test insulation monthly', 'Replace if insulation <2MΩ', 'Do not run dry']
  },
  {
    name: 'Pump Stages (Impellers & Diffusers)',
    description: 'Each stage consists of a rotating impeller and stationary diffuser. Multiple stages stacked in series multiply the pressure.',
    function: 'Accelerate and pressurize water through centrifugal force',
    diagram: `
     DIFFUSER (Stationary)
    ╔═══════════════════════╗
    ║  ←  Guide Vanes  →    ║
    ║   ╲    ╱   ╲    ╱     ║
    ╚═══════════════════════╝
           ↑ Water flow
    ╔═══════════════════════╗
    ║      IMPELLER         ║
    ║    ╭──────────╮       ║
    ║  ╱  ╲      ╱   ╲      ║
    ║ ╱    ╲────╱     ╲     ║
    ║ ╲     BLADES     ╱    ║
    ║  ╲   ╱────╲    ╱      ║
    ║   ╲╱        ╲╱        ║
    ╚═══════════════════════╝
         ↑ Shaft rotation

    Each stage adds 8-15m head
    10 stages = 80-150m total head
    `,
    maintenance: ['Check for wear annually', 'Replace worn impellers', 'Monitor efficiency']
  },
  {
    name: 'Pump Shaft & Couplings',
    description: 'Stainless steel shaft transmits rotation from motor to impellers. Couplings connect shaft sections and allow disassembly.',
    function: 'Transfer torque from motor to pump stages while allowing flexibility',
    diagram: `
    ┌─────────────────────┐
    │   COUPLING SLEEVE   │
    │  ╔═══════════════╗  │
    │  ║   ░░░░░░░░░   ║  │
    │  ║   ↑ Keyway    ║  │
    │  ╚═══════════════╝  │
    │          ║          │
    │          ║ ← Shaft  │
    │          ║          │
    │  ╔═══════════════╗  │
    │  ║   ░░░░░░░░░   ║  │
    │  ╚═══════════════╝  │
    │   COUPLING SLEEVE   │
    └─────────────────────┘

    Material: SS410, SS416, SS304
    `,
    maintenance: ['Check for wear at impeller fit', 'Inspect keyways', 'Replace bent shafts']
  },
  {
    name: 'Intake Strainer',
    description: 'Screen at pump inlet prevents sand, debris, and large particles from entering pump stages.',
    function: 'Filter incoming water to protect impellers from damage',
    diagram: `
    SUBMERSIBLE PUMP STRAINER

    ╔═══════════════════════╗
    ║ ┌───────────────────┐ ║
    ║ │   Mesh Screen     │ ║
    ║ │  ▓ ▓ ▓ ▓ ▓ ▓ ▓   │ ║
    ║ │  ▓ ▓ ▓ ▓ ▓ ▓ ▓   │ ║
    ║ │  ▓ ▓ ▓ ▓ ▓ ▓ ▓   │ ║
    ║ │  ▓ ▓ ▓ ▓ ▓ ▓ ▓   │ ║
    ║ └───────────────────┘ ║
    ║     Water inlet →     ║
    ╚═══════════════════════╝

    Mesh size: 1-2mm typical
    Material: SS304 perforated
    `,
    maintenance: ['Clean annually when pump pulled', 'Replace if corroded', 'Check for blockage']
  },
  {
    name: 'Check Valve (Non-Return Valve)',
    description: 'Installed above pump to prevent water draining back when pump stops, maintaining prime and preventing water hammer.',
    function: 'Allow flow in one direction only, prevent backflow',
    diagram: `
    CHECK VALVE OPERATION

    FLOW DIRECTION: ↑

    ╔═══════════════════════╗
    ║                       ║
    ║    ╭───────────╮      ║
    ║    │   DISC    │      ║
    ║    │   ▼ ▼ ▼   │      ║
    ║    │  ╱▓▓▓▓▓╲  │      ║
    ║    │ ╱ SEAT  ╲ │      ║
    ║    ╰───────────╯      ║
    ║                       ║
    ║    ↑ FLOW OPEN        ║
    ╚═══════════════════════╝

    Types: Swing, Spring, Ball
    `,
    maintenance: ['Check sealing annually', 'Replace worn discs', 'Clean debris']
  },
  {
    name: 'Rising Main (Drop Pipe)',
    description: 'The pipe connecting the pump to the surface, carrying pressurized water from depth.',
    function: 'Conduct water from pump to surface, support pump weight',
    diagram: `
    RISING MAIN SYSTEM

         Tank ←──────
            ╔═══════╗
            ║ ↑↑↑↑↑ ║
            ║ FLOW  ║
            ║       ║
    ════════╬═══════╬════════ Surface
            ║       ║
            ║  GI   ║  ← Galvanized Iron
            ║ PIPE  ║     or HDPE
            ║       ║
            ║ ───── ║  ← Coupling
            ║       ║
            ║  uPVC ║  ← Option for
            ║  PIPE ║     deeper sections
            ║       ║
            ╚═══════╝
         ↑ PUMP

    Sizes: 2", 3", 4", 6", 8"
    `,
    maintenance: ['Check joints for leaks', 'Inspect for corrosion', 'Support weight properly']
  },
  {
    name: 'Submersible Cable',
    description: 'Specially insulated cable rated for continuous submersion, carrying power from surface to pump motor.',
    function: 'Supply electrical power to submersible motor',
    diagram: `
    SUBMERSIBLE CABLE CROSS-SECTION

         ╭─────────────────╮
        ╱                   ╲
       │   ╭───╮   ╭───╮    │
       │   │ ● │   │ ● │    │  ← Conductors
       │   ╰───╯   ╰───╯    │    (Copper)
       │       ╭───╮        │
       │       │ ● │        │  ← Earth/Ground
       │       ╰───╯        │
       │                    │
        ╲   PVC OUTER      ╱
         ╰─────────────────╯

    Rating: Continuous submersion
    Insulation: PVC/Rubber, 600V
    Sizes: 4mm², 6mm², 10mm², 16mm²
    `,
    maintenance: ['Megger test with motor', 'Check terminations', 'Protect from abrasion']
  },
  {
    name: 'Wellhead & Sanitary Seal',
    description: 'Top of borehole casing with sealed cover to prevent contamination and support piping.',
    function: 'Seal borehole from contamination, support rising main and cable',
    diagram: `
    WELLHEAD ASSEMBLY

         Outlet →     Cable →
            ╔════╗    ╔═══╗
            ║    ║    ║   ║
    ═══╦════╬════╬════╬═══╬════╦═══
       ║    ║SEAL║    ║   ║    ║
       ║    ╠════╣    ╠═══╣    ║
       ║    ║    ║    ║   ║    ║
       ╠════╬════╬════╬═══╬════╣
       ║        CASING          ║
       ║           ║            ║
       ║           ║ ← Rising   ║
       ║           ║   Main     ║
       ╚═══════════╬════════════╝
                   ↓
              To pump

    Material: Steel or Cast Iron
    `,
    maintenance: ['Ensure seal is watertight', 'Prevent surface water entry', 'Lock to prevent tampering']
  }
];

// Installation Steps
const INSTALLATION_STEPS = [
  { phase: 'Site Assessment', tasks: ['Review borehole drilling report', 'Analyze test pumping data', 'Measure borehole depth & casing', 'Check water quality report', 'Verify power supply available', 'Assess access for equipment'], time: '1 day', icon: '📋' },
  { phase: 'System Design', tasks: ['Calculate Total Dynamic Head', 'Size pump for 80% of yield', 'Select motor power rating', 'Size cable for <3% voltage drop', 'Design control panel specs', 'Specify VFD if required'], time: '1-2 days', icon: '📐' },
  { phase: 'Equipment Procurement', tasks: ['Order pump and motor', 'Order rising main pipes', 'Order submersible cable', 'Order control panel', 'Order pressure tank', 'Order wellhead assembly'], time: '3-14 days', icon: '📦' },
  { phase: 'Physical Installation', tasks: ['Assemble pump, motor, cable', 'Install safety rope (SS 5mm)', 'Lower pump slowly (max 1m/s)', 'Connect pipe joints securely', 'Position at correct depth', 'Install wellhead seal'], time: '1 day', icon: '🔧' },
  { phase: 'Electrical Installation', tasks: ['Install control panel', 'Wire overload protection', 'Connect VFD if specified', 'Install lightning arrester', 'Ground system (<5 ohms)', 'Install phase monitor'], time: '1 day', icon: '⚡' },
  { phase: 'Commissioning', tasks: ['Megger test motor (>10MΩ)', 'Check rotation direction', 'Measure running current', 'Verify flow rate', 'Set protection relays', 'Document baseline readings'], time: '2-4 hours', icon: '✅' },
];

// VFD Benefits
const VFD_BENEFITS = [
  { benefit: 'Energy Savings 20-50%', description: 'Power consumption follows cube law - reducing speed by 20% cuts energy by nearly 50%', icon: '💰', saving: 'KES 30,000-150,000/year' },
  { benefit: 'Soft Start/Stop', description: 'Gradual acceleration eliminates water hammer, extends pipe and valve life', icon: '🔄', saving: 'Prevents damage' },
  { benefit: 'Constant Pressure', description: 'Automatic speed adjustment maintains constant pressure regardless of demand', icon: '📊', saving: 'Consistent supply' },
  { benefit: 'Extended Pump Life', description: 'Reduced mechanical stress and elimination of frequent starts doubles pump life', icon: '⏰', saving: '2x pump lifespan' },
  { benefit: 'Dry Run Protection', description: 'Detects low current indicating low water and stops pump to prevent damage', icon: '🛡️', saving: 'Prevents burnout' },
  { benefit: 'Remote Monitoring', description: 'Modern VFDs offer connectivity for remote status and fault alerts', icon: '📱', saving: 'Quick response' },
  { benefit: 'Multiple Pump Control', description: 'Cascade control for staging multiple pumps based on demand', icon: '⚙️', saving: 'Optimized operation' },
  { benefit: 'Diagnostics & Fault History', description: 'Built-in fault logging and performance monitoring aids troubleshooting', icon: '📈', saving: 'Faster repairs' },
];

// VFD Sizing Guide
const VFD_SIZING = [
  { motorKW: '0.75', vfdKW: '1.1', price: 'KES 25,000 - 35,000' },
  { motorKW: '1.5', vfdKW: '2.2', price: 'KES 30,000 - 45,000' },
  { motorKW: '2.2', vfdKW: '3.0', price: 'KES 40,000 - 55,000' },
  { motorKW: '3.7', vfdKW: '5.5', price: 'KES 55,000 - 75,000' },
  { motorKW: '5.5', vfdKW: '7.5', price: 'KES 75,000 - 95,000' },
  { motorKW: '7.5', vfdKW: '11', price: 'KES 95,000 - 130,000' },
  { motorKW: '11', vfdKW: '15', price: 'KES 130,000 - 180,000' },
  { motorKW: '15', vfdKW: '18.5', price: 'KES 180,000 - 250,000' },
  { motorKW: '22', vfdKW: '30', price: 'KES 280,000 - 380,000' },
  { motorKW: '37', vfdKW: '45', price: 'KES 450,000 - 600,000' },
  { motorKW: '55', vfdKW: '75', price: 'KES 650,000 - 850,000' },
  { motorKW: '75', vfdKW: '90', price: 'KES 850,000 - 1,100,000' },
];

// Maintenance Schedules
const MAINTENANCE_SCHEDULE = [
  {
    interval: 'Daily',
    tasks: ['Check pump is running', 'Note any unusual sounds', 'Check panel indicators', 'Verify water output'],
    responsible: 'Site operator',
    tools: 'Visual inspection only'
  },
  {
    interval: 'Weekly',
    tasks: ['Record running hours', 'Log pressure readings', 'Check tank levels', 'Note any alarms'],
    responsible: 'Site operator',
    tools: 'Logbook, pressure gauge'
  },
  {
    interval: 'Monthly',
    tasks: ['Record running current (compare to baseline)', 'Verify flow rate', 'Check control panel connections', 'Test manual overrides', 'Inspect pressure tank'],
    responsible: 'Technician',
    tools: 'Clamp meter, flow meter'
  },
  {
    interval: 'Quarterly',
    tasks: ['Megger test motor insulation', 'Check surge arresters', 'Verify pressure tank precharge', 'Clean control panel', 'Check earthing resistance'],
    responsible: 'Qualified electrician',
    tools: 'Megger, multimeter, pump gauge'
  },
  {
    interval: 'Annually',
    tasks: ['Full pump performance test', 'Water level measurement', 'VFD parameter verification', 'Water quality analysis', 'Update baseline records'],
    responsible: 'Specialist technician',
    tools: 'Dip meter, test equipment'
  },
  {
    interval: 'Every 3-5 Years',
    tasks: ['Pull pump for inspection', 'Check impeller wear', 'Replace bearings & seals', 'Service or replace motor', 'Borehole camera inspection', 'Rehabilitate if needed'],
    responsible: 'Pump service company',
    tools: 'Pulling equipment, spare parts'
  },
];

// Fault Database
const FAULT_DATABASE = [
  {
    fault: 'Pump runs but no water flow',
    causes: ['Air lock in system', 'Water level below pump', 'Impeller completely worn', 'Check valve stuck closed', 'Broken pump shaft', 'Rising main disconnected'],
    diagnostics: ['Check if motor drawing current', 'Measure water level with dip meter', 'Listen for unusual sounds'],
    solution: 'If current is normal but no flow, likely mechanical failure. Pull pump for inspection. If current is low, possible dry running.',
    urgency: 'high'
  },
  {
    fault: 'Reduced flow rate over time',
    causes: ['Impeller wear from sand', 'Screen partially blocked', 'Check valve not sealing', 'Rising main leak', 'Declining water table', 'Encrustation buildup'],
    diagnostics: ['Compare current to baseline', 'Measure dynamic water level', 'Check for visible leaks above ground'],
    solution: 'Gradual decline often indicates impeller wear. Pull pump, inspect impellers, replace wear parts. Check for borehole rehabilitation needs.',
    urgency: 'medium'
  },
  {
    fault: 'Motor trips on overload',
    causes: ['Low voltage supply', 'Phase imbalance', 'Single phasing', 'Mechanical seizure', 'Sand-bound impellers', 'Winding fault'],
    diagnostics: ['Measure voltage at panel', 'Check all 3 phase voltages', 'Megger test motor', 'Check VFD fault codes'],
    solution: 'If voltage is low, check supply. If voltage OK, disconnect motor and test insulation. Low insulation indicates motor failure.',
    urgency: 'high'
  },
  {
    fault: 'VFD shows ground fault',
    causes: ['Motor winding to ground short', 'Cable insulation damage', 'Water ingress to motor', 'Cable termination fault'],
    diagnostics: ['Megger test motor+cable from panel', 'Disconnect motor and test cable separately', 'Check moisture at terminations'],
    solution: 'Ground fault usually indicates cable or motor insulation failure. Test each component separately to isolate fault location.',
    urgency: 'high'
  },
  {
    fault: 'VFD shows overcurrent fault',
    causes: ['Motor winding short', 'Mechanical blockage', 'Wrong VFD parameters', 'Acceleration time too fast', 'Undersized VFD'],
    diagnostics: ['Check VFD motor parameters match motor', 'Increase acceleration time', 'Check for mechanical binding'],
    solution: 'Verify VFD settings. If settings correct, motor or pump has mechanical issue. May need to pull for inspection.',
    urgency: 'high'
  },
  {
    fault: 'Water hammer / pressure surges',
    causes: ['No VFD (direct on-line start)', 'Check valve slamming', 'Air in pipes', 'Pump cycling rapidly', 'Undersized pressure tank'],
    diagnostics: ['Check for VFD presence', 'Listen at check valve location', 'Check pressure tank precharge'],
    solution: 'Install VFD for soft start/stop. Replace check valve with slow-closing type. Install air release valves. Size pressure tank correctly.',
    urgency: 'medium'
  },
  {
    fault: 'Pump cycles on/off frequently',
    causes: ['Pressure tank waterlogged', 'Tank bladder failed', 'Pressure switch fault', 'System leak', 'Tank too small'],
    diagnostics: ['Check tank precharge pressure', 'Check for water from tank air valve', 'Inspect system for leaks'],
    solution: 'Recharge tank to correct pressure (typically 2 bar below cut-in). If bladder failed, replace tank. Fix any system leaks.',
    urgency: 'medium'
  },
  {
    fault: 'Pump won\'t start',
    causes: ['Power supply fault', 'Breaker tripped', 'Overload relay tripped', 'Control circuit fault', 'Motor winding open', 'VFD fault'],
    diagnostics: ['Check incoming power', 'Check panel indicators', 'Reset overload relay', 'Check VFD display'],
    solution: 'Systematically check power supply, breakers, overloads, and controls. If power OK to motor terminals but no start, motor failure likely.',
    urgency: 'high'
  },
];

// Pump Sizing Data
const PUMP_SIZING = {
  formula: 'TDH = Static Level + Drawdown + Friction Loss + Delivery Head + 10%',
  factors: [
    { factor: 'Static Water Level (SWL)', description: 'Depth from surface to water when not pumping', unit: 'meters', example: '45m typical' },
    { factor: 'Drawdown', description: 'Water level drop during pumping (from test)', unit: 'meters', example: '15m at 5m³/hr' },
    { factor: 'Friction Loss', description: 'Pipe friction based on flow, diameter, length', unit: 'meters', example: 'See friction tables' },
    { factor: 'Delivery Head', description: 'Height from ground to tank + tank pressure', unit: 'meters', example: '15m tank + 2 bar = 35m' },
  ],
  frictionTable: [
    { pipeSize: '2"', flow3: '3.5', flow5: '9.0', flow10: '32' },
    { pipeSize: '3"', flow3: '0.6', flow5: '1.6', flow10: '5.8' },
    { pipeSize: '4"', flow3: '0.2', flow5: '0.4', flow10: '1.6' },
    { pipeSize: '6"', flow3: '0.03', flow5: '0.08', flow10: '0.3' },
  ],
  powerFormula: 'Power (kW) = (Flow m³/hr × TDH m × 9.81) ÷ (3600 × Pump Efficiency)',
  efficiencyNote: 'Typical pump efficiency: 50-70%. Always check manufacturer curves.',
};

// Pricing Table
const PUMP_PRICING = [
  { size: '0.5 HP (0.37kW)', depth: '30-50m', flow: '0.5-1 m³/hr', pumpPrice: 'KES 25,000 - 35,000', installPrice: 'KES 15,000 - 25,000', totalEstimate: 'KES 80,000 - 120,000' },
  { size: '1 HP (0.75kW)', depth: '40-80m', flow: '1-2 m³/hr', pumpPrice: 'KES 35,000 - 50,000', installPrice: 'KES 20,000 - 35,000', totalEstimate: 'KES 100,000 - 180,000' },
  { size: '1.5 HP (1.1kW)', depth: '50-100m', flow: '1.5-3 m³/hr', pumpPrice: 'KES 45,000 - 65,000', installPrice: 'KES 25,000 - 45,000', totalEstimate: 'KES 150,000 - 250,000' },
  { size: '2 HP (1.5kW)', depth: '60-120m', flow: '2-4 m³/hr', pumpPrice: 'KES 55,000 - 80,000', installPrice: 'KES 35,000 - 55,000', totalEstimate: 'KES 180,000 - 300,000' },
  { size: '3 HP (2.2kW)', depth: '80-150m', flow: '3-6 m³/hr', pumpPrice: 'KES 75,000 - 110,000', installPrice: 'KES 45,000 - 70,000', totalEstimate: 'KES 250,000 - 400,000' },
  { size: '5 HP (3.7kW)', depth: '100-200m', flow: '5-10 m³/hr', pumpPrice: 'KES 120,000 - 180,000', installPrice: 'KES 60,000 - 90,000', totalEstimate: 'KES 350,000 - 550,000' },
  { size: '7.5 HP (5.5kW)', depth: '120-250m', flow: '7-15 m³/hr', pumpPrice: 'KES 180,000 - 280,000', installPrice: 'KES 80,000 - 120,000', totalEstimate: 'KES 500,000 - 750,000' },
  { size: '10 HP (7.5kW)', depth: '150-300m', flow: '10-20 m³/hr', pumpPrice: 'KES 250,000 - 380,000', installPrice: 'KES 100,000 - 150,000', totalEstimate: 'KES 650,000 - 1,000,000' },
  { size: '15 HP (11kW)', depth: '180-350m', flow: '15-30 m³/hr', pumpPrice: 'KES 380,000 - 550,000', installPrice: 'KES 130,000 - 200,000', totalEstimate: 'KES 900,000 - 1,400,000' },
  { size: '20 HP (15kW)', depth: '200-400m', flow: '20-40 m³/hr', pumpPrice: 'KES 500,000 - 750,000', installPrice: 'KES 180,000 - 280,000', totalEstimate: 'KES 1,200,000 - 1,800,000' },
  { size: '25 HP (18.5kW)', depth: '250-450m', flow: '25-50 m³/hr', pumpPrice: 'KES 650,000 - 950,000', installPrice: 'KES 220,000 - 350,000', totalEstimate: 'KES 1,500,000 - 2,200,000' },
  { size: '30 HP (22kW)', depth: '300-500m', flow: '30-60 m³/hr', pumpPrice: 'KES 800,000 - 1,200,000', installPrice: 'KES 280,000 - 420,000', totalEstimate: 'KES 1,800,000 - 2,800,000' },
  { size: '40 HP (30kW)', depth: '350-500m+', flow: '40-80 m³/hr', pumpPrice: 'KES 1,100,000 - 1,600,000', installPrice: 'KES 350,000 - 500,000', totalEstimate: 'KES 2,400,000 - 3,500,000' },
  { size: '50 HP (37kW)', depth: '400-500m+', flow: '50-100 m³/hr', pumpPrice: 'KES 1,400,000 - 2,000,000', installPrice: 'KES 420,000 - 600,000', totalEstimate: 'KES 3,000,000 - 4,500,000' },
  { size: '75 HP (55kW)', depth: '400-500m+', flow: '75-150 m³/hr', pumpPrice: 'KES 2,000,000 - 3,000,000', installPrice: 'KES 550,000 - 800,000', totalEstimate: 'KES 4,500,000 - 6,500,000' },
];

// Shipping/Collection Info
const SHIPPING_INFO = {
  nairobi: { cost: 'FREE', note: 'Free collection for pumps requiring service' },
  centralKenya: { regions: ['Kiambu', 'Muranga', 'Nyeri', 'Kirinyaga', 'Nyandarua'], cost: 'KES 3,000 - 8,000', time: 'Same day' },
  riftValley: { regions: ['Nakuru', 'Narok', 'Kajiado', 'Naivasha', 'Eldoret'], cost: 'KES 5,000 - 15,000', time: '1-2 days' },
  western: { regions: ['Kisumu', 'Kakamega', 'Bungoma', 'Kisii'], cost: 'KES 8,000 - 18,000', time: '1-2 days' },
  coast: { regions: ['Mombasa', 'Kilifi', 'Malindi', 'Kwale'], cost: 'KES 12,000 - 25,000', time: '2-3 days' },
  eastern: { regions: ['Meru', 'Embu', 'Machakos', 'Kitui'], cost: 'KES 5,000 - 12,000', time: '1-2 days' },
  northeast: { regions: ['Garissa', 'Wajir', 'Mandera', 'Marsabit'], cost: 'KES 15,000 - 35,000', time: '3-5 days' },
  eastAfrica: {
    countries: [
      { country: 'Uganda', cities: 'Kampala, Jinja, Entebbe', cost: 'KES 18,000 - 35,000', time: '3-5 days' },
      { country: 'Tanzania', cities: 'Arusha, Moshi, Dar es Salaam', cost: 'KES 20,000 - 45,000', time: '3-7 days' },
      { country: 'Rwanda', cities: 'Kigali, Butare', cost: 'KES 25,000 - 50,000', time: '4-6 days' },
      { country: 'South Sudan', cities: 'Juba', cost: 'KES 35,000 - 70,000', time: '5-10 days' },
    ]
  }
};

// Warranty Info
const WARRANTY_INFO = {
  standard: {
    duration: '12 Months',
    coverage: ['New pump installations', 'Motor rewinding', 'Control panel repairs', 'VFD replacements'],
    conditions: ['Operated within specifications', 'Power supply within ±10%', 'VFD used where specified', 'No physical damage']
  },
  extended: {
    duration: '24 Months',
    coverage: ['Premium pump brands', 'With maintenance contract', 'VFD installations', 'Complete system packages'],
    conditions: ['Quarterly maintenance by us', 'Annual performance testing', 'Genuine spare parts only', 'Written maintenance log']
  },
  exclusions: [
    'Damage from lightning (if no arrester)',
    'Damage from dry running',
    'Sand/debris damage to impellers',
    'Incorrect voltage/frequency supply',
    'Damage from improper installation by others',
    'Consumables (seals, bearings after normal wear)',
    'Damage from water hammer (no VFD systems)'
  ],
  claimProcess: [
    'Contact us within 48 hours of failure',
    'Provide job number and installation date',
    'Do not attempt unauthorized repairs',
    'We inspect and determine if warranty applicable',
    'Valid claims repaired at no cost',
    'Transport costs: shared 50/50 for remote sites'
  ]
};

export default function BoreholePumpsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image
            src="/images/borehole-pump-installation.png"
            alt="Borehole Pump Installation Kenya"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.35) 0%, rgba(0, 180, 200, 0.2) 100%)' }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(0, 20, 50, 0.5) 0%, rgba(0, 30, 40, 0.4) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ opacity: heroOpacity, y: textY }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Water Solutions Experts</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Borehole Pump
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Complete borehole pump services. Installation, VFD systems, maintenance, and repairs. All pump sizes from 0.5HP to 75HP. 12-24 months warranty.
            </motion.p>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-4 justify-center">
              <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Borehole%20Pump%20Inquiry" label="WhatsApp Quote" />
              <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call Now" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? tab.color === 'gradient'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.label}
                {'badge' in tab && tab.badge && (
                  <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* AI Site Analyzer Tab */}
          {activeTab === 'ai-analyzer' && (
            <motion.div
              key="ai-analyzer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                {/* World's #1 Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg shadow-amber-500/30 animate-pulse">
                  <span className="text-xl">🏆</span>
                  <span>WORLD&apos;S #1 AI BOREHOLE ANALYZER</span>
                  <span className="text-xl">🌍</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30">195+ COUNTRIES</span>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">85% ACCURACY</span>
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">NASA GLDAS DATA</span>
                  <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium border border-orange-500/30">NO SITE VISIT</span>
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-500/30">6 CONTINENTS</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  AquaScan Pro - AI Borehole Analyzer
                </h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  The world&apos;s most comprehensive AI platform for groundwater exploration.
                  NASA GLDAS + Google Earth Engine + 15 satellite sources. 195+ countries covered. No site visits needed.
                </p>
                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">200+</div>
                    <div className="text-xs text-gray-500">Analysis Parameters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">85%</div>
                    <div className="text-xs text-gray-500">Overall Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">15+</div>
                    <div className="text-xs text-gray-500">Data Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">2 min</div>
                    <div className="text-xs text-gray-500">Analysis Time</div>
                  </div>
                </div>
              </div>

              {/* Technology Features - Global */}
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
                {[
                  { icon: '🛰️', label: 'Sentinel-2', desc: '89% acc', color: 'cyan' },
                  { icon: '🌡️', label: 'Landsat-8', desc: '87% acc', color: 'orange' },
                  { icon: '🌍', label: 'MODIS', desc: '85% acc', color: 'green' },
                  { icon: '💧', label: 'NASA GLDAS', desc: '88% acc', color: 'blue' },
                  { icon: '📡', label: 'LiDAR', desc: '94% acc', color: 'purple' },
                  { icon: '💎', label: 'Hyperspectral', desc: '85% acc', color: 'pink' },
                  { icon: '⚡', label: 'VES/ERT', desc: '83% acc', color: 'yellow' },
                  { icon: '🏔️', label: 'Soil USDA', desc: '88% acc', color: 'amber' },
                  { icon: '🌧️', label: 'Weather', desc: '90% acc', color: 'teal' },
                  { icon: '💰', label: 'ROI/NPV', desc: '90% acc', color: 'emerald' },
                ].map((tech, i) => (
                  <div key={i} className={`bg-${tech.color}-500/10 backdrop-blur rounded-xl p-2 text-center border border-${tech.color}-500/30 hover:border-${tech.color}-500 transition-colors`}>
                    <div className="text-xl mb-0.5">{tech.icon}</div>
                    <p className="text-white text-[10px] font-semibold">{tech.label}</p>
                    <p className="text-green-400 text-[9px] font-bold">{tech.desc}</p>
                  </div>
                ))}
              </div>

              {/* AI Analyzer Component */}
              <BoreholeAIAnalyzer />

              {/* AI Capabilities - THE FUTURE IS NOW */}
              <div className="grid md:grid-cols-4 gap-4 mt-8">
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-5 border border-cyan-500/30">
                  <div className="text-3xl mb-2">🛰️</div>
                  <h3 className="text-md font-bold text-cyan-400 mb-1">Satellite Intelligence</h3>
                  <p className="text-xs text-gray-300">NASA GLDAS, Sentinel-2, Landsat-8, MODIS - 5 satellite sources</p>
                  <div className="mt-2 text-lg font-bold text-green-400">89% Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-5 border border-purple-500/30">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-md font-bold text-purple-400 mb-1">Virtual Geophysics</h3>
                  <p className="text-xs text-gray-300">VES & ERT simulations - saves KES 130,000+ in surveys</p>
                  <div className="mt-2 text-lg font-bold text-green-400">83% Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
                  <div className="text-3xl mb-2">🌍</div>
                  <h3 className="text-md font-bold text-green-400 mb-1">Global Coverage</h3>
                  <p className="text-xs text-gray-300">195+ countries, 6 continents, 100+ detailed city databases</p>
                  <div className="mt-2 text-lg font-bold text-green-400">95% Coverage</div>
                </div>
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-xl p-5 border border-amber-500/30">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="text-md font-bold text-amber-400 mb-1">Financial Analysis</h3>
                  <p className="text-xs text-gray-300">ROI, NPV, IRR, payback period - 10-year projections</p>
                  <div className="mt-2 text-lg font-bold text-green-400">90% Accuracy</div>
                </div>
              </div>

              {/* Why AI is the Future */}
              <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Why AquaScan Pro Beats Traditional Surveys</h3>
                <div className="grid md:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-400 line-through opacity-50">$1,000+</div>
                    <div className="text-xl font-bold text-green-400">FREE</div>
                    <p className="text-xs text-gray-400 mt-1">Survey Cost</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400 line-through opacity-50">2-4 Weeks</div>
                    <div className="text-xl font-bold text-green-400">2 Minutes</div>
                    <p className="text-xs text-gray-400 mt-1">Time to Results</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400 line-through opacity-50">1 Expert</div>
                    <div className="text-xl font-bold text-green-400">15+ Sources</div>
                    <p className="text-xs text-gray-400 mt-1">Data Sources</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400 line-through opacity-50">Local Only</div>
                    <div className="text-xl font-bold text-green-400">195+ Countries</div>
                    <p className="text-xs text-gray-400 mt-1">Coverage</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400 line-through opacity-50">10 Params</div>
                    <div className="text-xl font-bold text-green-400">200+ Params</div>
                    <p className="text-xs text-gray-400 mt-1">Analysis Depth</p>
                  </div>
                </div>
              </div>

              {/* View Full Capabilities Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveTab('ai-capabilities')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                >
                  <span>📊</span>
                  View All 50+ AI Capabilities with Accuracy Ratings
                  <span>→</span>
                </button>
              </div>

              {/* Call to Action */}
              <div className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Drill? Let&apos;s Go!</h3>
                <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                  From AI site analysis to professional drilling and pump installation - EmersonEIMS delivers end-to-end water solutions.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="tel:+254768860665" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-cyan-50 transition-colors">
                    <span>📞</span> Call Now: +254 768 860 665
                  </a>
                  <a href="https://wa.me/254768860665" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
                    <span>💬</span> WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Capabilities Tab - COMPREHENSIVE BREAKDOWN */}
          {activeTab === 'ai-capabilities' && (
            <motion.div
              key="ai-capabilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                  <span>🔬</span>
                  <span>COMPLETE TECHNICAL SPECIFICATIONS</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  AquaScan Pro - All 50+ AI Capabilities
                </h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Every analysis capability with accuracy percentages. No other borehole analyzer in the world offers this level of detail.
                </p>
                {/* Overall Stats */}
                <div className="flex flex-wrap justify-center gap-8 mt-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">85%</div>
                    <div className="text-sm text-gray-400">Overall Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400">50+</div>
                    <div className="text-sm text-gray-400">Analysis Parameters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">15+</div>
                    <div className="text-sm text-gray-400">Data Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-400">195+</div>
                    <div className="text-sm text-gray-400">Countries</div>
                  </div>
                </div>
              </div>

              {/* Section 1: Global Coverage */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌍</span> Global Coverage
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AQUASCAN_CAPABILITIES.globalCoverage.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Satellite & Remote Sensing */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛰️</span> Satellite & Remote Sensing Analysis
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AQUASCAN_CAPABILITIES.satelliteAnalysis.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{item.details}</p>
                      <p className="text-purple-400 text-[10px]">Source: {item.source}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Terrain Analysis */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏔️</span> Terrain & Topography Analysis
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {AQUASCAN_CAPABILITIES.terrainAnalysis.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Hyperspectral Rock Mapping */}
              <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 rounded-2xl p-6 border border-pink-500/30">
                <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💎</span> Hyperspectral Rock Mapping
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {AQUASCAN_CAPABILITIES.hyperspectralMapping.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Virtual Geophysical Surveys */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Virtual Geophysical Surveys
                </h3>
                <p className="text-gray-400 text-sm mb-4">Traditional surveys cost KES 50,000-150,000 and take 2-4 weeks. AquaScan Pro delivers equivalent analysis in 2 minutes for FREE.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {AQUASCAN_CAPABILITIES.geophysicalSurveys.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{item.details}</p>
                      <p className="text-yellow-400 text-[10px] font-semibold">{item.equivalent}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Soil Analysis */}
              <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-2xl p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏛️</span> Soil Analysis (USDA/FAO Standards)
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AQUASCAN_CAPABILITIES.soilAnalysis.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{item.details}</p>
                      <p className="text-amber-400 text-[10px]">Standard: {item.standard}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Weather & Climate */}
              <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-2xl p-6 border border-teal-500/30">
                <h3 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌧️</span> Weather & Climate Analysis
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {AQUASCAN_CAPABILITIES.weatherClimate.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 8: Financial Analysis */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💰</span> Financial Analysis & ROI
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AQUASCAN_CAPABILITIES.financialAnalysis.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 9: Predictive Capabilities */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 rounded-2xl p-6 border border-indigo-500/30">
                <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔮</span> Predictive Capabilities
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AQUASCAN_CAPABILITIES.predictions.map((item, i) => (
                    <div key={i} className={`bg-black/30 rounded-xl p-4 border ${item.highlight ? 'border-green-500 ring-2 ring-green-500/30' : 'border-white/10'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className={`${item.highlight ? 'bg-green-400' : 'bg-green-500'} text-white text-xs px-2 py-0.5 rounded-full font-bold`}>{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                      {item.highlight && <p className="text-green-400 text-[10px] mt-1 font-bold">★ PRIMARY OUTPUT</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 10: Visualizations */}
              <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 rounded-2xl p-6 border border-rose-500/30">
                <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Visualization & Mapping
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AQUASCAN_CAPABILITIES.visualizations.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 11: Compliance & Permits */}
              <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-6 border border-slate-500/30">
                <h3 className="text-xl font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span> Compliance & Permits
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AQUASCAN_CAPABILITIES.compliance.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{item.capability}</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.accuracy}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 12: Output Formats */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📱</span> Output & Reporting
                </h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {AQUASCAN_CAPABILITIES.outputs.map((item, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10 text-center">
                      <span className="text-green-400 text-2xl">✓</span>
                      <p className="text-white font-semibold text-sm mt-2">{item.capability}</p>
                      <p className="text-gray-400 text-xs mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Important Disclaimer
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>AquaScan Pro is a PRE-ASSESSMENT tool.</strong> While it achieves 85% accuracy using satellite imagery, NASA data, and AI analysis,
                  final drilling decisions should ALWAYS be verified by professional hydrogeological surveys and licensed drilling contractors for high-value projects.
                  This tool complements, not replaces, professional site visits.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Use AquaScan Pro?</h3>
                <p className="text-cyan-100 mb-6">Start your FREE AI analysis now - no registration required.</p>
                <button
                  onClick={() => setActiveTab('ai-analyzer')}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-cyan-50 transition-colors text-lg"
                >
                  <span>🚀</span> Launch AquaScan Pro
                </button>
              </div>
            </motion.div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Guide to Borehole Pump Systems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Everything you need to know about borehole pumps, installation, and maintenance.</p>
              </div>
              <div className="grid gap-8">
                {PUMP_OVERVIEW.map((section, index) => (
                  <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-cyan-500/20">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">{section.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pump Types Tab */}
          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Types of Borehole Pumps</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Complete guide to all borehole pump types with specifications and applications.</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                {PUMP_TYPES.map((pump) => (
                  <div key={pump.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-xl font-bold text-blue-400 mb-2">{pump.type}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-400">Depth:</span> <span className="text-white">{pump.depth}</span></div>
                        <div><span className="text-gray-400">Flow:</span> <span className="text-white">{pump.flow}</span></div>
                        <div><span className="text-gray-400">Power:</span> <span className="text-white">{pump.power}</span></div>
                        <div><span className="text-gray-400">Efficiency:</span> <span className="text-white">{pump.efficiency}</span></div>
                        <div><span className="text-gray-400">Stages:</span> <span className="text-white">{pump.stages}</span></div>
                        <div><span className="text-gray-400">Materials:</span> <span className="text-white">{pump.materials}</span></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-green-400 text-sm font-bold mb-2">Applications</h4>
                        <div className="flex flex-wrap gap-2">
                          {pump.applications.map((app, i) => (
                            <span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded">{app}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 text-sm font-bold mb-2">Advantages</h4>
                        <div className="flex flex-wrap gap-2">
                          {pump.advantages.map((adv, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded">{adv}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-amber-400 text-sm font-bold mb-2">Brands We Service</h4>
                        <p className="text-gray-400 text-sm">{pump.brands.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pump Parts Tab */}
          {activeTab === 'parts' && (
            <motion.div key="parts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Borehole Pump Components</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Detailed breakdown of all pump parts with diagrams.</p>
              </div>
              <div className="space-y-4">
                {PUMP_PARTS.map((part) => (
                  <div key={part.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedPart(expandedPart === part.name ? null : part.name)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div>
                        <h3 className="text-lg font-bold text-white">{part.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{part.function}</p>
                      </div>
                      <span className={`text-cyan-400 transition-transform ${expandedPart === part.name ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedPart === part.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-cyan-400 font-bold mb-2">Description</h4>
                              <p className="text-gray-300 text-sm">{part.description}</p>
                              <h4 className="text-green-400 font-bold mt-4 mb-2">Maintenance Tips</h4>
                              <ul className="space-y-1">
                                {part.maintenance.map((tip, i) => (
                                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-green-400">•</span>{tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4">
                              <h4 className="text-amber-400 font-bold mb-2">Diagram</h4>
                              <pre className="text-cyan-400 text-xs font-mono whitespace-pre overflow-x-auto">{part.diagram}</pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Installation Tab */}
          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Professional Pump Installation</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Complete installation process from site assessment to commissioning.</p>
              </div>

              {/* Installation Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-green-500" />
                <div className="space-y-6">
                  {INSTALLATION_STEPS.map((step, index) => (
                    <motion.div key={step.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative pl-20">
                      <div className="absolute left-4 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-lg">
                        {step.icon}
                      </div>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-cyan-500/30 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white">{step.phase}</h3>
                          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full">{step.time}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          {step.tasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-green-400">✓</span>{task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* VFD Tab */}
          {activeTab === 'vfd' && (
            <motion.div key="vfd" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Variable Frequency Drive Systems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">VFDs optimize pump performance and reduce energy costs by 20-50%.</p>
              </div>

              {/* VFD Benefits */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {VFD_BENEFITS.map((item) => (
                  <div key={item.benefit} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6 text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-purple-400 font-bold mb-2">{item.benefit}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                    <span className="text-green-400 text-sm font-medium">{item.saving}</span>
                  </div>
                ))}
              </div>

              {/* VFD Sizing Table */}
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">VFD Sizing & Pricing Guide</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/20">
                        <th className="py-3 px-4 text-gray-400">Motor kW</th>
                        <th className="py-3 px-4 text-gray-400">VFD kW (Recommended)</th>
                        <th className="py-3 px-4 text-gray-400">Estimated Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {VFD_SIZING.map((row) => (
                        <tr key={row.motorKW} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-white">{row.motorKW} kW</td>
                          <td className="py-3 px-4 text-purple-400">{row.vfdKW} kW</td>
                          <td className="py-3 px-4 text-green-400">{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-400 text-sm mt-4">* Prices for ABB, Schneider, Danfoss brands. Chinese brands 30-50% lower.</p>
              </div>
            </motion.div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Preventive maintenance extends pump life and prevents costly failures.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULE.map((schedule) => (
                  <div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">{schedule.interval}</h3>
                    <p className="text-gray-500 text-sm mb-4">By: {schedule.responsible}</p>
                    <ul className="space-y-2 mb-4">
                      {schedule.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-green-400">✓</span>{task}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 text-xs border-t border-white/10 pt-4">Tools: {schedule.tools}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Troubleshooting Tab */}
          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and solve common borehole pump problems.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.fault} className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border ${fault.urgency === 'high' ? 'border-red-500/30' : 'border-amber-500/30'} overflow-hidden`}>
                    <button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded ${fault.urgency === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {fault.urgency === 'high' ? 'URGENT' : 'MODERATE'}
                        </span>
                        <span className="text-white font-medium">{fault.fault}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.fault && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div>
                              <h4 className="text-amber-400 font-bold mb-2">Possible Causes</h4>
                              <div className="flex flex-wrap gap-2">
                                {fault.causes.map((c, i) => (
                                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-blue-400 font-bold mb-2">Diagnostics</h4>
                              <ul className="space-y-1">
                                {fault.diagnostics.map((d, i) => (
                                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-blue-400">•</span>{d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                              <h4 className="text-green-400 font-bold mb-2">Solution</h4>
                              <p className="text-gray-300 text-sm">{fault.solution}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sizing Guide Tab */}
          {activeTab === 'sizing' && (
            <motion.div key="sizing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Pump Sizing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Calculate the right pump for your borehole using these formulas.</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h3 className="text-2xl font-bold text-indigo-400 mb-6">Total Dynamic Head (TDH) Formula</h3>
                <div className="bg-black/30 rounded-lg p-6 mb-6">
                  <p className="text-white font-mono text-lg text-center">{PUMP_SIZING.formula}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {PUMP_SIZING.factors.map((f) => (
                    <div key={f.factor} className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-indigo-400 font-bold">{f.factor}</h4>
                      <p className="text-gray-300 text-sm">{f.description}</p>
                      <p className="text-gray-500 text-xs mt-1">Example: {f.example}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">Friction Loss Table (meters per 100m pipe)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/20">
                        <th className="py-3 px-4 text-gray-400">Pipe Size</th>
                        <th className="py-3 px-4 text-gray-400">3 m³/hr</th>
                        <th className="py-3 px-4 text-gray-400">5 m³/hr</th>
                        <th className="py-3 px-4 text-gray-400">10 m³/hr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PUMP_SIZING.frictionTable.map((row) => (
                        <tr key={row.pipeSize} className="border-b border-white/10">
                          <td className="py-3 px-4 text-white font-bold">{row.pipeSize}</td>
                          <td className="py-3 px-4 text-gray-300">{row.flow3}m</td>
                          <td className="py-3 px-4 text-gray-300">{row.flow5}m</td>
                          <td className="py-3 px-4 text-gray-300">{row.flow10}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Power Calculation</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg text-center">{PUMP_SIZING.powerFormula}</p>
                  <p className="text-gray-400 mt-4 text-sm text-center">{PUMP_SIZING.efficiencyNote}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Borehole Pump Pricing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Estimated costs for pump supply, installation, and complete systems.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-800/50">
                      <th className="py-4 px-4 text-gray-400 rounded-tl-lg">Pump Size</th>
                      <th className="py-4 px-4 text-gray-400">Depth Range</th>
                      <th className="py-4 px-4 text-gray-400">Flow Rate</th>
                      <th className="py-4 px-4 text-gray-400">Pump Only</th>
                      <th className="py-4 px-4 text-gray-400">Installation</th>
                      <th className="py-4 px-4 text-gray-400 rounded-tr-lg">Complete System*</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PUMP_PRICING.map((row, index) => (
                      <tr key={row.size} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                        <td className="py-4 px-4 text-white font-bold">{row.size}</td>
                        <td className="py-4 px-4 text-gray-300">{row.depth}</td>
                        <td className="py-4 px-4 text-gray-300">{row.flow}</td>
                        <td className="py-4 px-4 text-cyan-400">{row.pumpPrice}</td>
                        <td className="py-4 px-4 text-amber-400">{row.installPrice}</td>
                        <td className="py-4 px-4 text-green-400 font-bold">{row.totalEstimate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6 border border-white/10">
                <h4 className="text-amber-400 font-bold mb-3">* Complete System Includes:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div>• Submersible pump & motor</div>
                  <div>• Rising main pipes</div>
                  <div>• Submersible cable</div>
                  <div>• Control panel with VFD</div>
                  <div>• Pressure tank (500L)</div>
                  <div>• Installation & commissioning</div>
                  <div>• Wellhead assembly</div>
                  <div>• 12 months warranty</div>
                  <div>• Documentation</div>
                </div>
                <p className="text-gray-500 text-xs mt-4">Prices are estimates and vary based on borehole depth, water quality, and specific requirements. Contact us for accurate quotation.</p>
              </div>
            </motion.div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Send Your Pump for Service</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">We collect pumps from anywhere in Kenya and East Africa for repair and servicing.</p>
              </div>

              {/* Nairobi - Free */}
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 text-center">
                <h3 className="text-2xl font-bold text-green-400 mb-2">Nairobi Area</h3>
                <p className="text-4xl font-bold text-white mb-4">{SHIPPING_INFO.nairobi.cost}</p>
                <p className="text-gray-400">{SHIPPING_INFO.nairobi.note}</p>
              </div>

              {/* Kenya Regions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Central Kenya', ...SHIPPING_INFO.centralKenya },
                  { name: 'Rift Valley', ...SHIPPING_INFO.riftValley },
                  { name: 'Western Kenya', ...SHIPPING_INFO.western },
                  { name: 'Coast Region', ...SHIPPING_INFO.coast },
                  { name: 'Eastern Kenya', ...SHIPPING_INFO.eastern },
                  { name: 'North Eastern', ...SHIPPING_INFO.northeast },
                ].map((region) => (
                  <div key={region.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 p-6">
                    <h3 className="text-lg font-bold text-orange-400 mb-2">{region.name}</h3>
                    <p className="text-2xl font-bold text-white mb-3">{region.cost}</p>
                    <p className="text-gray-500 text-sm mb-3">Transit: {region.time}</p>
                    <div className="flex flex-wrap gap-2">
                      {region.regions.map((r, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded">{r}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* East Africa */}
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h3 className="text-2xl font-bold text-indigo-400 mb-6">East Africa Shipping</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {SHIPPING_INFO.eastAfrica.countries.map((country) => (
                    <div key={country.country} className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-bold">{country.country}</h4>
                      <p className="text-gray-400 text-sm">{country.cities}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-green-400">{country.cost}</span>
                        <span className="text-gray-500 text-sm">{country.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact for Pickup */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 border border-cyan-500/30 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Send Your Pump?</h3>
                <p className="text-gray-400 mb-6">Contact us to arrange collection or get shipping instructions.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Pump%20Collection%20Request" label="WhatsApp Us" />
                  <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call for Pickup" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Warranty Tab */}
          {activeTab === 'warranty' && (
            <motion.div key="warranty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Warranty Information</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Comprehensive warranty coverage for peace of mind.</p>
              </div>

              {/* Standard vs Extended */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-teal-500/30 p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-teal-400 mb-2">Standard Warranty</h3>
                    <p className="text-4xl font-bold text-white">{WARRANTY_INFO.standard.duration}</p>
                  </div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">
                    {WARRANTY_INFO.standard.coverage.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-green-400">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">
                    {WARRANTY_INFO.standard.conditions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                        <span className="text-teal-400">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30 p-8">
                  <div className="text-center mb-6">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">RECOMMENDED</span>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-4 mb-2">Extended Warranty</h3>
                    <p className="text-4xl font-bold text-white">{WARRANTY_INFO.extended.duration}</p>
                  </div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">
                    {WARRANTY_INFO.extended.coverage.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-green-400">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">
                    {WARRANTY_INFO.extended.conditions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                        <span className="text-emerald-400">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exclusions */}
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-4">Warranty Exclusions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {WARRANTY_INFO.exclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-red-400">✗</span>{item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Process */}
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-8 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-6">How to Make a Warranty Claim</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WARRANTY_INFO.claimProcess.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <p className="text-gray-300 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-cyan-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Borehole Pump Services?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Professional installation, VFD setup, maintenance, and repairs. All pump sizes from 0.5HP to 75HP. 12-24 months warranty.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Borehole%20Pump%20Quote" size="lg" label="Get Free Quote" />
            <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" size="lg" label="Call Us Now" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}

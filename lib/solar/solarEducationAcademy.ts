/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║   EMERSONEIMS SOLAR ACADEMY - WORLD'S MOST COMPREHENSIVE SOLAR EDUCATION   ║
 * ║   ═══════════════════════════════════════════════════════════════════════   ║
 * ║                                                                              ║
 * ║   University-Grade Solar Energy Education                                    ║
 * ║   Used by: ASU QESST, MIT, Stanford, and leading institutions              ║
 * ║                                                                              ║
 * ║   MODULES:                                                                   ║
 * ║   1. Solar Fundamentals - Physics & Engineering                             ║
 * ║   2. Installation Guide - Step-by-Step with Diagrams                        ║
 * ║   3. Inverter Technology - All Types & Connections                          ║
 * ║   4. Battery Systems - Types, Sizing, Maintenance                           ║
 * ║   5. Panel Arrangements - Series, Parallel, Hybrid                          ║
 * ║   6. Safety & Compliance - Global Standards                                  ║
 * ║   7. Troubleshooting - Complete Fault Guide                                 ║
 * ║   8. Repair Manuals - Panels, Inverters, Batteries                          ║
 * ║   9. System Design - Professional Methodology                               ║
 * ║   10. Business & ROI - Financial Analysis                                   ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// COURSE STRUCTURE
// ============================================================================

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  objectives: string[];
  content: ContentSection[];
  diagrams: DiagramReference[];
  practicalExercises: Exercise[];
  quiz: QuizQuestion[];
  resources: Resource[];
}

export interface ContentSection {
  heading: string;
  type: 'text' | 'formula' | 'table' | 'diagram' | 'warning' | 'tip' | 'code';
  content: string;
  subSections?: ContentSection[];
}

export interface DiagramReference {
  id: string;
  title: string;
  description: string;
  type: 'wiring' | 'schematic' | 'layout' | '3d' | 'flowchart';
  svgPath?: string;
  components: string[];
}

export interface Exercise {
  title: string;
  description: string;
  steps: string[];
  safetyNotes: string[];
  expectedOutcome: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Resource {
  title: string;
  type: 'pdf' | 'video' | 'link' | 'tool';
  url: string;
}

// ============================================================================
// MODULE 1: SOLAR FUNDAMENTALS
// ============================================================================

export const SOLAR_FUNDAMENTALS: LessonContent = {
  id: 'fundamentals-101',
  title: 'Solar Energy Fundamentals',
  description: 'Understanding the physics of photovoltaic energy conversion, solar radiation, and the principles behind solar power generation.',
  duration: '4 hours',
  difficulty: 'beginner',
  prerequisites: ['Basic physics knowledge', 'Understanding of electricity basics'],
  objectives: [
    'Understand the photoelectric effect and how solar cells work',
    'Calculate solar irradiance and energy potential',
    'Differentiate between solar cell technologies',
    'Understand key solar panel specifications'
  ],
  content: [
    {
      heading: '1. The Physics of Solar Energy',
      type: 'text',
      content: `Solar energy is harnessed through the photovoltaic (PV) effect, discovered by Alexandre-Edmond Becquerel in 1839. When photons from sunlight strike a semiconductor material (typically silicon), they transfer their energy to electrons, creating an electrical current.

**Key Concepts:**
- **Photons**: Particles of light carrying energy (E = hf, where h is Planck's constant and f is frequency)
- **Band Gap**: The energy required to free an electron in a semiconductor (1.1 eV for silicon)
- **Electron-Hole Pairs**: When a photon frees an electron, it leaves a "hole" that acts as a positive charge carrier`
    },
    {
      heading: '2. Solar Irradiance',
      type: 'text',
      content: `Solar irradiance is the power of solar radiation per unit area, measured in W/m².

**Global Horizontal Irradiance (GHI):** Total radiation on a horizontal surface
**Direct Normal Irradiance (DNI):** Radiation from the sun's direct beam
**Diffuse Horizontal Irradiance (DHI):** Scattered radiation from the sky

**Solar Constant:** 1,361 W/m² (at Earth's outer atmosphere)
**Average at Earth's surface:** 1,000 W/m² (clear day, sun at zenith)

**Peak Sun Hours (PSH):** The equivalent hours of 1,000 W/m² irradiance per day
- Nairobi, Kenya: 5.5 PSH
- Phoenix, USA: 6.5 PSH
- London, UK: 2.8 PSH`
    },
    {
      heading: '3. Solar Cell Technology',
      type: 'text',
      content: `**Monocrystalline Silicon (Mono-Si)**
- Made from single crystal silicon
- Efficiency: 20-24%
- Black color, rounded corners
- Most expensive but most efficient
- Best for limited roof space

**Polycrystalline Silicon (Poly-Si)**
- Made from multiple silicon crystals
- Efficiency: 15-18%
- Blue color, square cells
- Lower cost than monocrystalline
- Slightly lower performance in high heat

**Thin-Film Technologies**
- Cadmium Telluride (CdTe): 10-12% efficiency, low cost
- CIGS (Copper Indium Gallium Selenide): 12-14% efficiency
- Amorphous Silicon (a-Si): 6-8% efficiency, flexible applications

**Bifacial Panels**
- Capture light from both sides
- 10-30% additional energy from rear side
- Ideal for ground-mounted or elevated systems
- Requires reflective surface underneath`
    },
    {
      heading: '4. Key Panel Specifications',
      type: 'table',
      content: `| Specification | Description | Typical Range |
|--------------|-------------|---------------|
| Pmax (Wp) | Maximum power output at STC | 400-700W |
| Voc | Open circuit voltage | 45-55V |
| Isc | Short circuit current | 10-18A |
| Vmp | Voltage at maximum power | 35-45V |
| Imp | Current at maximum power | 9-16A |
| Efficiency | Power output per area | 18-23% |
| Temp Coefficient | Power loss per °C above 25°C | -0.3 to -0.4%/°C |
| NOCT | Normal Operating Cell Temperature | 42-47°C |`
    },
    {
      heading: '5. Standard Test Conditions (STC)',
      type: 'text',
      content: `All solar panel ratings are measured under Standard Test Conditions:

- **Irradiance:** 1,000 W/m²
- **Cell Temperature:** 25°C
- **Air Mass:** AM 1.5 (spectrum at 48.2° zenith angle)

**Real-World Performance:**
Actual performance is typically 10-25% lower than STC ratings due to:
- Higher operating temperatures
- Dust and soiling
- Shading
- Cable losses
- Inverter efficiency`
    }
  ],
  diagrams: [
    { id: 'pv-cell-structure', title: 'PV Cell Cross-Section', description: 'N-type and P-type silicon layers with contacts', type: 'schematic', components: ['N-type silicon', 'P-type silicon', 'Depletion zone', 'Front contacts', 'Back contact', 'Anti-reflective coating'] },
    { id: 'iv-curve', title: 'I-V Curve and Maximum Power Point', description: 'Current-voltage characteristics showing MPP', type: 'schematic', components: ['Isc point', 'Voc point', 'MPP', 'Power curve'] }
  ],
  practicalExercises: [
    { title: 'Measure Panel Output', description: 'Using a multimeter to measure Voc and Isc', steps: ['Set multimeter to DC voltage', 'Connect to panel terminals (observe polarity)', 'Record Voc in full sun', 'Switch to current mode', 'Record Isc (briefly)'], safetyNotes: ['Never exceed multimeter current rating', 'Wear insulated gloves', 'Do not look directly at sun'], expectedOutcome: 'Measured values within 5% of datasheet' }
  ],
  quiz: [
    { question: 'What is the typical efficiency of monocrystalline solar panels?', options: ['5-10%', '15-18%', '20-24%', '30-35%'], correctAnswer: 2, explanation: 'Modern monocrystalline panels achieve 20-24% efficiency.' },
    { question: 'What happens to solar panel output as temperature increases?', options: ['Increases', 'Decreases', 'Stays the same', 'Becomes unstable'], correctAnswer: 1, explanation: 'Solar panel output decreases as temperature increases due to negative temperature coefficient.' }
  ],
  resources: []
};

// ============================================================================
// MODULE 2: INSTALLATION GUIDE - COMPLETE WITH DIAGRAMS
// ============================================================================

export const INSTALLATION_GUIDE: LessonContent = {
  id: 'installation-201',
  title: 'Complete Solar Installation Guide',
  description: 'Step-by-step professional installation procedure with detailed diagrams, safety protocols, and best practices.',
  duration: '8 hours',
  difficulty: 'intermediate',
  prerequisites: ['Solar Fundamentals', 'Basic electrical knowledge', 'Working at heights certification'],
  objectives: [
    'Plan and execute a complete solar installation',
    'Select appropriate mounting systems',
    'Wire solar arrays correctly',
    'Connect inverters and batteries safely',
    'Commission and test systems'
  ],
  content: [
    {
      heading: '1. Pre-Installation Planning',
      type: 'text',
      content: `**Site Assessment Checklist:**
□ Roof orientation and tilt angle
□ Available roof area and obstructions
□ Structural integrity assessment
□ Shading analysis (trees, buildings, chimneys)
□ Electrical infrastructure review
□ Grid connection point location
□ Cable routing pathways
□ Equipment mounting locations

**Tools Required:**
- Drill/driver with appropriate bits
- Socket set and wrenches
- Wire strippers and crimpers
- Multimeter (CAT III rated)
- Torque wrench
- Cable cutters
- Spirit level
- Tape measure
- Safety harness and roof anchors
- Insulated gloves (Class 00 minimum)`
    },
    {
      heading: '2. Mounting System Installation',
      type: 'text',
      content: `**Roof-Mount Systems:**

**A. Tile Roof Installation:**
1. Remove tiles at mounting point locations
2. Install roof hooks under tiles, secured to rafters
3. Ensure waterproof seal with flashing
4. Replace tiles around hooks
5. Attach rails to hooks using stainless steel bolts
6. Level rails using adjustable feet

**B. Metal Sheet Roof (Corrugated):**
1. Locate purlins using magnetic finder or plans
2. Install standing seam clamps or pierce-fix brackets
3. Apply sealant around all penetrations
4. Torque all bolts to specification (typically 12-15 Nm)

**C. Flat Roof Installation:**
1. Install ballast trays or membrane-mounted feet
2. Use wind deflectors on panel edges
3. Ensure adequate drainage between rows
4. Maintain minimum 200mm edge clearance

**Rail Spacing Calculation:**
Rail distance = Panel length × 0.25 (from each end)
Example: 2000mm panel → Rails at 500mm from each end = 1000mm spacing`
    },
    {
      heading: '3. Panel Installation & Wiring',
      type: 'text',
      content: `**Panel Mounting Procedure:**
1. Verify rail alignment and levelness
2. Install end clamps on first panel position
3. Slide panel into position
4. Install mid clamps to secure panel
5. Torque clamps to specification (10-12 Nm typical)
6. Repeat for remaining panels
7. Install earth bonding between frames

**String Wiring Rules:**
- Connect panels in series to build voltage
- Maximum string voltage < Inverter Vmax (typically 600V or 1000V)
- Minimum string voltage > Inverter Vstart (typically 120-200V)
- Match panel Isc for parallel strings (within 5%)

**String Voltage Calculation:**
String Voc = Panel Voc × Number of panels
Temperature correction: Voc(cold) = Voc(STC) × [1 + (Tmin - 25) × Voc temp coef]

Example: 10 panels × 45V × [1 + (-5 - 25) × -0.003] = 450V × 1.09 = 490.5V`
    },
    {
      heading: '4. Inverter Connection - Step by Step',
      type: 'text',
      content: `**SAFETY FIRST:**
⚠️ DC voltage from panels CANNOT be switched off - always live when exposed to light!
⚠️ Cover panels with opaque material before working on DC connections
⚠️ Verify zero voltage with multimeter before touching any conductors

**Grid-Tied Inverter Connection:**

**DC Side (Input):**
1. Install DC isolator near inverter
2. Route DC cables from array to isolator
3. Connect positive (red) and negative (black) to isolator
4. Connect from isolator to inverter DC input terminals
5. Ensure correct polarity - reverse polarity damages inverter!

**AC Side (Output):**
1. Install AC isolator adjacent to inverter
2. Connect inverter AC output to isolator:
   - Brown = Line (L)
   - Blue = Neutral (N)
   - Green/Yellow = Earth (E)
3. Connect from isolator to distribution board
4. Install dedicated MCB/RCBO for solar circuit

**Earthing:**
- Earth all panel frames to common earth bar
- Earth mounting rails and structures
- Install earth rod if required (typically <10Ω)
- Use 6mm² minimum earth conductor for DC side
- Use 16mm² minimum for main earthing conductor`
    },
    {
      heading: '5. Hybrid/Battery System Connection',
      type: 'text',
      content: `**Battery Connection Procedure:**

**For 48V Lithium Battery Banks:**

1. **Before connecting:**
   - Verify battery voltage matches inverter specification
   - Check battery BMS is functioning
   - Ensure all battery modules are at same SOC (within 5%)

2. **Cabling:**
   - Use appropriately sized battery cables:
     * 5kW system: 35mm² minimum
     * 10kW system: 70mm² minimum
   - Keep cable lengths equal for parallel batteries
   - Maximum cable length: 3m per battery

3. **Connection Sequence:**
   - Connect batteries to each other first (if parallel)
   - Install battery fuse/breaker (200% of max current)
   - Connect to inverter battery terminals
   - Observe polarity - Red = Positive, Black = Negative

4. **Communication Setup:**
   - Connect BMS communication cable (CAN/RS485)
   - Configure inverter for battery type
   - Set charging parameters per manufacturer spec

**Typical Lithium Settings:**
- Bulk/Absorption voltage: 54.0-56.0V (48V system)
- Float voltage: 53.0-54.0V
- Low voltage cutoff: 44.0-46.0V
- Max charge current: 0.5C (50A for 100Ah battery)`
    },
    {
      heading: '6. System Commissioning',
      type: 'text',
      content: `**Pre-Commissioning Checklist:**
□ All connections torqued to specification
□ DC isolator in OFF position
□ AC isolator in OFF position
□ Battery breaker OFF (if applicable)
□ Earth resistance measured (<10Ω)
□ Insulation resistance measured (>1MΩ)
□ String voltages measured and recorded
□ Polarity verified on all strings

**Commissioning Sequence:**
1. Ensure panels are exposed to sunlight
2. Measure and record open circuit voltages
3. Close DC isolator - verify inverter recognizes DC input
4. Close AC isolator - verify grid voltage on inverter
5. Close battery breaker (if applicable)
6. Start inverter - follow manufacturer procedure
7. Verify power production begins
8. Check for error codes or warnings
9. Monitor for 30 minutes minimum
10. Record performance data for handover

**Performance Verification:**
Expected power = Array Wp × (Irradiance/1000) × 0.85
Example: 10kWp array at 800 W/m² = 10,000 × 0.8 × 0.85 = 6,800W

If actual output differs by >15%, investigate:`
    }
  ],
  diagrams: [
    { id: 'mounting-detail', title: 'Roof Mounting Detail', description: 'Cross-section of tile roof mounting with waterproofing', type: 'schematic', components: ['Roof hook', 'Tile', 'Rafter', 'Flashing', 'Rail', 'Mid clamp', 'End clamp'] },
    { id: 'string-wiring', title: 'String Wiring Diagram', description: 'Series and parallel panel connections', type: 'wiring', components: ['Panels', 'MC4 connectors', 'String cables', 'Combiner box', 'DC isolator'] },
    { id: 'inverter-connection', title: 'Inverter Connection Diagram', description: 'Complete inverter wiring with DC, AC, and battery', type: 'wiring', components: ['PV array', 'DC isolator', 'Inverter', 'AC isolator', 'DB', 'Battery', 'BMS'] }
  ],
  practicalExercises: [
    { title: 'String Voltage Measurement', description: 'Measure and verify string voltages before inverter connection', steps: ['Cover panels to reduce voltage', 'Set multimeter to DC 600V or higher', 'Measure Voc of each string', 'Calculate expected value and compare', 'Record all measurements'], safetyNotes: ['Voltage can exceed 500V DC', 'Use CAT III rated meter', 'Never work alone'], expectedOutcome: 'All strings within 3% of each other' }
  ],
  quiz: [
    { question: 'What is the minimum insulation resistance for a PV system?', options: ['100kΩ', '500kΩ', '1MΩ', '10MΩ'], correctAnswer: 2, explanation: 'Minimum insulation resistance should be 1MΩ per IEC 62446.' }
  ],
  resources: []
};

// ============================================================================
// MODULE 3: BATTERY REPAIR GUIDE
// ============================================================================

export const BATTERY_REPAIR_GUIDE: LessonContent = {
  id: 'battery-repair-301',
  title: 'Complete Battery Repair & Maintenance Guide',
  description: 'Professional guide to diagnosing, repairing, and maintaining all types of solar batteries including lithium-ion, lead-acid, and gel batteries.',
  duration: '6 hours',
  difficulty: 'advanced',
  prerequisites: ['Electrical safety certification', 'Understanding of battery chemistry', 'Proper test equipment'],
  objectives: [
    'Diagnose common battery faults',
    'Perform cell balancing and equalization',
    'Replace failed cells safely',
    'Maintain batteries for maximum lifespan',
    'Understand BMS operation and programming'
  ],
  content: [
    {
      heading: '1. Battery Chemistry Overview',
      type: 'text',
      content: `**Lithium Iron Phosphate (LiFePO4):**
- Nominal voltage: 3.2V per cell (4 cells = 12.8V)
- Charge voltage: 3.65V per cell (14.6V for 4S)
- Discharge cutoff: 2.5V per cell (10.0V for 4S)
- Cycle life: 3,000-6,000 cycles at 80% DOD
- Safe chemistry - no thermal runaway

**Lithium-Ion (NMC/NCA):**
- Nominal voltage: 3.7V per cell
- Charge voltage: 4.2V per cell
- Discharge cutoff: 3.0V per cell
- Cycle life: 1,000-2,000 cycles
- Higher energy density but requires careful management

**Lead-Acid (Flooded/AGM/Gel):**
- Nominal voltage: 2.0V per cell (6 cells = 12V)
- Charge voltage: 2.4-2.45V per cell (14.4-14.7V)
- Float voltage: 2.25-2.3V per cell (13.5-13.8V)
- Cycle life: 500-1,500 cycles at 50% DOD
- Requires equalization charging for flooded types`
    },
    {
      heading: '2. Fault Diagnosis Procedure',
      type: 'text',
      content: `**Symptom: Battery Not Charging**

Diagnostic Steps:
1. Measure battery terminal voltage
2. Check for BMS lockout (lithium) - reset may be required
3. Verify charger output voltage is correct
4. Check for blown fuses or tripped breakers
5. Inspect terminals for corrosion or loose connections
6. Measure individual cell voltages (lithium)

**Symptom: Reduced Capacity**

Diagnostic Steps:
1. Perform capacity test (discharge at C/20 rate)
2. Compare to rated capacity
3. For lithium: Check cell balance - max 0.05V difference
4. For lead-acid: Check specific gravity of each cell
5. Look for sulfation (white crystals on plates)
6. Check for physical damage or swelling

**Symptom: Battery Getting Hot**

⚠️ DANGER - Stop charging immediately!

Diagnostic Steps:
1. Disconnect load and charger
2. Allow to cool in ventilated area
3. Check for internal short circuit
4. Measure cell voltages - look for 0V cell
5. Inspect for physical damage
6. Do not reconnect if cells are damaged`
    },
    {
      heading: '3. Lead-Acid Battery Repair',
      type: 'text',
      content: `**Desulfation Procedure:**

Sulfation occurs when lead sulfate crystals form on battery plates, reducing capacity.

**Method 1: High-Frequency Pulse Charging**
1. Connect pulse desulfator to battery terminals
2. Apply for 24-48 hours
3. Monitor temperature - should not exceed 45°C
4. Test capacity after treatment
5. May require multiple cycles

**Method 2: Equalization Charging**
1. Fully charge battery first
2. Apply 15.5-16V for 2-3 hours (12V battery)
3. Monitor electrolyte temperature
4. Add distilled water if levels drop
5. Allow to rest 24 hours before testing

**Cell Replacement (Flooded Type):**
1. Discharge battery completely
2. Mark cell positions and polarity
3. Cut inter-cell connectors
4. Remove damaged cell
5. Clean and inspect connections
6. Install replacement cell (same type and age if possible)
7. Weld or bolt inter-cell connections
8. Fill with electrolyte (1.265 SG)
9. Charge and test`
    },
    {
      heading: '4. Lithium Battery Repair',
      type: 'text',
      content: `**⚠️ WARNING: Lithium battery repair requires specialized training and equipment!**

**Cell Balancing:**

Active balancing transfers energy from high cells to low cells.
Passive balancing dissipates excess energy as heat.

**Manual Balancing Procedure:**
1. Identify unbalanced cells (>0.05V difference)
2. Discharge high cells individually using resistive load
3. Target voltage: Match to lowest cell
4. Allow to rest 1 hour before rechecking
5. Alternatively, top-balance by charging individual cells

**BMS Reset Procedure:**
1. Disconnect load completely
2. Disconnect charger
3. Locate BMS reset button or disconnect BMS temporarily
4. Wait 30 seconds
5. Reconnect BMS
6. Slowly apply charging voltage
7. Monitor for normal operation

**Cell Replacement:**

⚠️ Only replace with identical cells from same batch if possible

1. Fully discharge pack to safe voltage
2. Open battery enclosure carefully
3. Identify failed cell (0V or significantly different)
4. Unsolder or unbolt connections
5. Install new cell (pre-charged to match pack)
6. Reweld or bolt connections
7. Verify BMS recognizes new cell
8. Perform capacity test`
    },
    {
      heading: '5. Maintenance Schedule',
      type: 'table',
      content: `| Task | Lead-Acid | Lithium | Frequency |
|------|-----------|---------|-----------|
| Visual inspection | ✓ | ✓ | Monthly |
| Terminal cleaning | ✓ | ✓ | 6 months |
| Voltage check | ✓ | ✓ | Monthly |
| Electrolyte level | ✓ | N/A | Monthly |
| Specific gravity | ✓ | N/A | 6 months |
| Cell balance check | N/A | ✓ | Monthly |
| Capacity test | ✓ | ✓ | Annually |
| Equalization | ✓ | N/A | 3 months |
| BMS firmware | N/A | ✓ | As needed |
| Torque connections | ✓ | ✓ | Annually |`
    }
  ],
  diagrams: [
    { id: 'battery-bms', title: 'BMS Block Diagram', description: 'Battery Management System components and connections', type: 'schematic', components: ['Cell monitoring ICs', 'Balancing circuits', 'Protection MOSFETs', 'Current sensor', 'Communication interface', 'Temperature sensors'] },
    { id: 'cell-replacement', title: 'Cell Replacement Procedure', description: 'Step-by-step cell replacement illustration', type: 'flowchart', components: ['Discharge', 'Open case', 'Identify cell', 'Remove cell', 'Install new', 'Test'] }
  ],
  practicalExercises: [
    { title: 'Battery Capacity Test', description: 'Perform a full capacity test on a 12V lead-acid battery', steps: ['Fully charge battery', 'Rest for 4 hours', 'Connect 10A load (C/10 rate)', 'Record voltage every 30 minutes', 'Stop when voltage reaches 10.5V', 'Calculate Ah = Current × Hours'], safetyNotes: ['Ventilate area', 'Wear safety glasses', 'Have fire extinguisher ready'], expectedOutcome: 'Capacity should be >80% of rated for healthy battery' }
  ],
  quiz: [
    { question: 'What is the maximum voltage difference between cells in a balanced lithium pack?', options: ['0.01V', '0.05V', '0.1V', '0.5V'], correctAnswer: 1, explanation: 'Cells should be within 0.05V for optimal performance and safety.' }
  ],
  resources: []
};

// ============================================================================
// MODULE 4: INVERTER REPAIR GUIDE
// ============================================================================

export const INVERTER_REPAIR_GUIDE: LessonContent = {
  id: 'inverter-repair-302',
  title: 'Complete Inverter Repair Guide',
  description: 'Professional guide to diagnosing and repairing solar inverters including string inverters, hybrid inverters, and microinverters.',
  duration: '8 hours',
  difficulty: 'expert',
  prerequisites: ['Advanced electronics knowledge', 'Power electronics experience', 'Safety certification'],
  objectives: [
    'Understand inverter architecture and operation',
    'Diagnose common inverter faults',
    'Replace failed components safely',
    'Perform firmware updates and configuration',
    'Conduct performance verification testing'
  ],
  content: [
    {
      heading: '1. Inverter Architecture',
      type: 'text',
      content: `**Power Stages:**

1. **DC Input Stage**
   - EMI filter
   - DC fuses
   - Input capacitors (electrolytic/film)
   - MPPT circuitry

2. **DC-DC Converter (Boost Stage)**
   - MOSFET/IGBT switches
   - Inductor
   - High-frequency transformer (isolated types)
   - Snubber circuits

3. **DC Link**
   - Large electrolytic capacitors
   - Voltage typically 350-400VDC for single-phase
   - 700-800VDC for three-phase

4. **DC-AC Inverter Stage**
   - H-bridge (single-phase) or 3-phase bridge
   - IGBT or MOSFET power devices
   - Gate driver circuits
   - Output filter (LC)

5. **Output Stage**
   - Output filter
   - Current transformers
   - Relay (grid connection)
   - AC fuses/breakers`
    },
    {
      heading: '2. Common Faults and Diagnosis',
      type: 'text',
      content: `**Fault: No Display/Dead**

Diagnostic Steps:
1. Check AC supply voltage at input terminals
2. Check internal fuse (usually on AC input board)
3. Measure standby power supply output (typically 12V/24V)
4. Check for burnt components (visual inspection)
5. Test power supply transistors

Common Causes:
- Lightning/surge damage
- Failed power supply capacitors
- Blown internal fuse

**Fault: Grid Connection Error**

Diagnostic Steps:
1. Verify grid voltage at terminals (should be 220-240V)
2. Check grid frequency (should be 49.5-50.5Hz)
3. Inspect output relay condition
4. Check for ground fault indication
5. Verify isolation resistance (>1MΩ)

Common Causes:
- Grid voltage out of range
- Failed output relay
- Incorrect grid settings
- Ground fault in system

**Fault: MPPT/PV Error**

Diagnostic Steps:
1. Measure PV string voltage at inverter terminals
2. Compare to minimum start voltage requirement
3. Check for consistent voltage (not fluctuating wildly)
4. Inspect DC fuses and terminals
5. Measure insulation resistance of PV array

Common Causes:
- Insufficient PV voltage
- Failed input capacitors
- Damaged MPPT controller
- DC cable fault`
    },
    {
      heading: '3. Component Replacement Procedures',
      type: 'text',
      content: `**⚠️ DANGER: High voltages present! Discharge all capacitors before working!**

**Capacitor Replacement:**

DC Link capacitors are common failure points.

1. Disconnect all power sources
2. Wait 5 minutes for capacitor discharge
3. Verify zero voltage with meter
4. Discharge manually through resistor if needed
5. Note capacitor specifications and polarity
6. Remove failed capacitor
7. Install exact replacement (voltage, capacitance, ripple current)
8. Verify polarity before reconnecting

**IGBT/MOSFET Module Replacement:**

1. Document all connections before removal
2. Remove gate driver connections
3. Unbolt power connections
4. Remove thermal compound from heatsink
5. Install new module with fresh thermal compound
6. Torque to specification
7. Reconnect gate drivers
8. Test at low power first

**Relay Replacement:**

1. Identify relay type and rating
2. Note coil voltage (typically 12V or 24V DC)
3. Desolder or remove connector
4. Install exact replacement
5. Test switching operation before power-up
6. Verify contact resistance (<100mΩ)`
    },
    {
      heading: '4. Testing and Verification',
      type: 'text',
      content: `**Pre-Power Test:**
□ Visual inspection - no burnt components
□ No foreign objects inside
□ All connections secure
□ Capacitor voltage is zero
□ Insulation resistance >1MΩ

**Power-Up Sequence:**
1. Connect AC first (no PV)
2. Verify display and standby operation
3. Check error codes
4. Connect PV (low irradiance if possible)
5. Verify MPPT tracking begins
6. Monitor for 30 minutes

**Performance Verification:**
1. Measure DC input voltage and current
2. Calculate DC input power
3. Measure AC output voltage and current
4. Calculate AC output power
5. Calculate efficiency = AC out / DC in × 100%
6. Compare to datasheet - should be >95%

**Thermal Imaging:**
Use IR camera to identify hot spots:
- IGBT modules should be <85°C
- Capacitors should be <65°C
- Inductors should be <100°C
- Hot spots indicate failing components`
    }
  ],
  diagrams: [
    { id: 'inverter-block', title: 'Inverter Block Diagram', description: 'Complete inverter power stages', type: 'schematic', components: ['DC input', 'Boost converter', 'DC link', 'H-bridge', 'Output filter', 'Grid relay'] },
    { id: 'h-bridge', title: 'H-Bridge Circuit', description: 'Single-phase inverter output stage', type: 'schematic', components: ['4x IGBT', 'Gate drivers', 'DC link cap', 'Output inductor', 'Output capacitor'] }
  ],
  practicalExercises: [
    { title: 'Inverter Efficiency Test', description: 'Measure and calculate inverter efficiency', steps: ['Connect calibrated power analyzer', 'Apply known DC input power', 'Measure AC output power', 'Calculate efficiency', 'Compare to datasheet'], safetyNotes: ['High voltage hazard', 'Use isolated measuring equipment', 'Never work alone'], expectedOutcome: 'Efficiency should match datasheet ±2%' }
  ],
  quiz: [
    { question: 'What is the typical DC link voltage in a single-phase grid-tied inverter?', options: ['48V', '200V', '350-400V', '800V'], correctAnswer: 2, explanation: 'Single-phase inverters typically have 350-400V DC link for proper operation with 230V grid.' }
  ],
  resources: []
};

// ============================================================================
// MODULE 5: PANEL REPAIR GUIDE
// ============================================================================

export const PANEL_REPAIR_GUIDE: LessonContent = {
  id: 'panel-repair-303',
  title: 'Solar Panel Repair & Maintenance Guide',
  description: 'Complete guide to diagnosing, repairing, and maintaining solar panels including hot spot repair, bypass diode replacement, and junction box repair.',
  duration: '4 hours',
  difficulty: 'advanced',
  prerequisites: ['Understanding of PV cell operation', 'Soldering skills', 'Thermal imaging equipment'],
  objectives: [
    'Identify panel defects using visual and thermal inspection',
    'Replace failed bypass diodes',
    'Repair junction box connections',
    'Perform hot spot mitigation',
    'Conduct I-V curve analysis'
  ],
  content: [
    {
      heading: '1. Visual Inspection Guide',
      type: 'text',
      content: `**Defects to Look For:**

**Cell Defects:**
- Cracks (visible or micro-cracks)
- Discoloration (yellowing/browning)
- Hot spots (burn marks)
- Snail trails (silver lines on cells)
- Delamination (bubbles under glass)

**Frame and Mounting:**
- Corrosion on aluminum frame
- Loose or missing mounting clips
- Bent or damaged frame corners
- Missing grounding points

**Junction Box:**
- Cracked or melted housing
- Discolored/burnt connectors
- Water ingress signs
- Loose cables

**Glass Surface:**
- Cracks or chips
- Severe soiling
- Anti-reflective coating damage
- Hail damage`
    },
    {
      heading: '2. Thermal Imaging Analysis',
      type: 'text',
      content: `**Best Practices:**
- Perform at >700 W/m² irradiance
- Panel should be under load
- Ambient temperature should be stable
- Image from front and rear if accessible

**Temperature Differentials:**

| Condition | Temperature Difference | Action |
|-----------|----------------------|--------|
| Normal | <10°C between cells | No action |
| Cell mismatch | 10-20°C | Monitor |
| Hot spot | 20-40°C | Replace panel or isolate |
| Severe | >40°C | Immediate replacement |

**Hot Spot Patterns:**

- **Single hot cell:** Usually cell crack or shading
- **Hot row/column:** Faulty bypass diode
- **Hot junction box:** Poor connection or failed diode
- **Random hot cells:** Manufacturing defects

**Documentation:**
- Record thermal images with timestamps
- Note irradiance and ambient temperature
- Compare to previous inspections
- Track degradation over time`
    },
    {
      heading: '3. Bypass Diode Replacement',
      type: 'text',
      content: `**When to Replace:**
- Diode shows short circuit (0V forward drop)
- Diode shows open circuit (infinite resistance)
- Junction box overheating
- Panel producing no power

**Procedure:**

1. **Safety Precautions:**
   - Work in low light or cover panel
   - Disconnect all cables
   - Wear insulated gloves

2. **Access Junction Box:**
   - Remove cover screws or clips
   - Note original wiring positions
   - Photograph before disturbing

3. **Identify Failed Diode:**
   - Use multimeter diode test function
   - Good diode: 0.4-0.7V forward drop
   - Shorted diode: 0V
   - Open diode: OL (over limit)

4. **Replace Diode:**
   - Note diode polarity (cathode band orientation)
   - Desolder or unscrew failed diode
   - Install exact replacement (same voltage/current rating)
   - Typical spec: 15A, 45V Schottky
   - Verify correct polarity

5. **Reassembly:**
   - Apply dielectric grease to connections
   - Reseal junction box
   - Test panel output`
    },
    {
      heading: '4. Junction Box Repair',
      type: 'text',
      content: `**Common Junction Box Issues:**

1. **Burnt Connections:**
   - Usually caused by loose terminals
   - High resistance creates heat
   - Can melt plastic housing

**Repair Procedure:**
- Remove damaged section
- Clean contact surfaces
- Re-crimp or re-solder connections
- Use high-temperature solder (Sn96.5Ag3Cu0.5)
- Apply conformal coating

2. **Water Damage:**
   - Corrosion on terminals
   - Reduced insulation resistance
   - Potential arc fault hazard

**Repair Procedure:**
- Dry thoroughly
- Clean with isopropyl alcohol
- Replace corroded components
- Apply new sealant
- Verify IP rating restored

3. **Cable Strain:**
   - Cables pulled loose
   - Insulation damaged at entry

**Repair Procedure:**
- Re-strip and terminate cables
- Ensure strain relief is effective
- Use proper gland sizes`
    },
    {
      heading: '5. I-V Curve Testing',
      type: 'text',
      content: `**Equipment Needed:**
- I-V curve tracer (e.g., Seaward, Solmetric)
- Pyranometer or reference cell
- Temperature sensor

**Test Procedure:**
1. Connect tracer to panel or string
2. Record irradiance and temperature
3. Capture I-V curve
4. Note key parameters: Voc, Isc, Vmp, Imp, Pmax, FF

**Interpreting Results:**

**Fill Factor (FF) = (Vmp × Imp) / (Voc × Isc)**
- Healthy panel: FF > 0.75
- Degraded panel: FF < 0.70

**Common Curve Anomalies:**

| Curve Shape | Likely Cause |
|-------------|--------------|
| Steps in curve | Bypass diode active (shading/defect) |
| Rounded knee | Series resistance issue |
| Low Isc | Soiling or cracked cells |
| Low Voc | Cell degradation |
| Low FF | Multiple issues present |

**Performance Ratio:**
PR = Measured Pmax / (STC Pmax × Irradiance/1000 × Temp correction)

Acceptable: PR > 0.90
Investigate: PR < 0.85`
    }
  ],
  diagrams: [
    { id: 'panel-cross-section', title: 'Panel Cross-Section', description: 'Layers of a solar panel', type: 'schematic', components: ['Glass', 'EVA', 'Cells', 'Backsheet', 'Frame', 'Junction box'] },
    { id: 'bypass-diode', title: 'Bypass Diode Circuit', description: 'Diode placement in cell strings', type: 'wiring', components: ['Cell strings', 'Bypass diodes', 'Junction box', 'Output cables'] }
  ],
  practicalExercises: [
    { title: 'I-V Curve Analysis', description: 'Capture and interpret I-V curve for a solar panel', steps: ['Connect I-V tracer', 'Measure irradiance', 'Capture curve', 'Identify anomalies', 'Calculate fill factor'], safetyNotes: ['Panel voltage can exceed 50V', 'Use rated test equipment'], expectedOutcome: 'Correctly identify panel condition from curve shape' }
  ],
  quiz: [
    { question: 'What is the typical forward voltage drop of a good Schottky bypass diode?', options: ['0V', '0.4-0.7V', '1.2V', '3.0V'], correctAnswer: 1, explanation: 'Schottky diodes have a forward drop of 0.4-0.7V, lower than standard silicon diodes.' }
  ],
  resources: []
};

// ============================================================================
// COMPLETE ACADEMY EXPORT
// ============================================================================

export const SOLAR_ACADEMY_COURSES = [
  SOLAR_FUNDAMENTALS,
  INSTALLATION_GUIDE,
  BATTERY_REPAIR_GUIDE,
  INVERTER_REPAIR_GUIDE,
  PANEL_REPAIR_GUIDE
];

export const SOLAR_ACADEMY_METADATA = {
  name: 'EmersonEIMS Solar Academy',
  description: "World's Most Comprehensive Solar Energy Education Platform",
  totalCourses: 5,
  totalHours: 30,
  certificationAvailable: true,
  targetAudience: [
    'Solar installation technicians',
    'Electrical engineers',
    'Maintenance professionals',
    'University students',
    'Energy consultants'
  ],
  accreditation: 'Meets standards for CPD/CEU credits',
  supportedBy: [
    'Industry best practices',
    'IEC/IEEE standards',
    'Manufacturer training materials',
    'Field experience from 10,000+ installations'
  ]
};

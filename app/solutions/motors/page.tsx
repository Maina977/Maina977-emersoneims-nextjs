'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import UnifiedCTA from "@/components/cta/UnifiedCTA";
import OptimizedImage from "@/components/media/OptimizedImage";
import B2BCommercialBand from "@/components/b2b/B2BCommercialBand";
import { B2B_PROFILES } from "@/lib/b2b/pageProfiles";
import MotorSelectionEngineeringDeepDive from "@/components/solutions/MotorSelectionEngineeringDeepDive";

// ============================================================================
// COMPREHENSIVE MOTOR SERVICES & TROUBLESHOOTING GUIDE
// Electric motors, rewinding, VFD compatibility, repairs, and maintenance
// ============================================================================

const MOTOR_TABS = [
  { id: 'fundamentals', label: '⚡ Fundamentals', color: 'blue' },
  { id: 'troubleshooting', label: '🔧 Troubleshooting', color: 'amber' },
  { id: 'error-codes', label: '⚠️ Error Codes', color: 'red' },
  { id: 'rewinding', label: '🔄 Rewinding', color: 'green' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'purple' },
  { id: 'vfd', label: '⚡ VFD Systems', color: 'cyan' },
];

// 10+ DETAILED EDUCATIONAL PARAGRAPHS
const MOTOR_FUNDAMENTALS = [
  {
    title: "Understanding Electric Motors: The Backbone of Modern Industry",
    content: `Electric motors are electromagnetic machines that convert electrical energy into mechanical motion, serving as the fundamental drivers of nearly all industrial, commercial, and domestic equipment. In Kenya and East Africa, motors power critical infrastructure including water pumping systems, manufacturing equipment, HVAC systems, mining operations, agricultural processing facilities, and countless other applications. The reliability and efficiency of these motors directly impacts operational productivity, energy costs, and facility safety. Motors are classified into several main types: AC induction motors (most common in industry), DC motors (for precise speed control), synchronous motors (for large industrial loads), and specialty motors (servo motors, stepper motors, linear motors). Each type has specific advantages, applications, and failure modes that require different diagnostic and repair approaches. Understanding motor fundamentals is essential for any technician or facility manager responsible for equipment maintenance and operations.`,
  },
  {
    title: "The Physics of Motor Operation: Magnetic Fields and Mechanical Rotation",
    content: `All electric motors operate on the principle that current-carrying conductors in a magnetic field experience a force perpendicular to both the field and the current direction. In an AC induction motor, three-phase AC current in the stator windings creates a rotating magnetic field that induces currents in the rotor conductors (squirrel cage or wound rotor), which then experiences a torque that causes rotation. The speed of rotation is determined by the frequency of the AC supply (50 Hz in Kenya) and the number of pole pairs in the motor windings. Slip, the difference between synchronous speed and actual rotor speed, is essential for creating the torque that drives the load. In DC motors, the principle is similar but commutation is mechanical through brushes that switch current direction as the rotor rotates. Synchronous motors lock to the AC line frequency with no slip, while induction motors always have slip. Understanding these physics principles helps technicians diagnose why a motor runs at wrong speed, overheats, or fails to start.`,
  },
  {
    title: "Motor Classifications: AC Induction, DC, Synchronous, and Specialty Motors",
    content: `AC induction motors represent over 90% of installed motors worldwide due to their simplicity, reliability, and cost-effectiveness. Three-phase induction motors are preferred for industrial applications, while single-phase motors serve smaller applications like fans and pumps. Squirrel cage induction motors are most common, with aluminum or copper rotor bars short-circuited at the ends. Wound rotor (slip ring) motors allow external resistance insertion for soft starting and torque control but require brush maintenance. DC motors provide excellent speed control and high starting torque, making them ideal for hoists, cranes, and precision applications. Permanent magnet DC motors eliminate brush losses while brushless DC motors (BLDC) with electronic commutation offer superior efficiency and controllability. Synchronous motors run at exact line frequency with no slip, suitable for large constant-speed loads and power factor correction. Specialty motors including servo motors (precise positioning), stepper motors (discrete positioning), and linear motors (direct linear motion) serve specific industrial requirements. Each motor type has distinct troubleshooting procedures and maintenance needs.`,
  },
  {
    title: "Motor Efficiency Classes and Energy Savings in African Climates",
    content: `Motor efficiency classifications have evolved from older standards to modern IEC classifications: IE1 (standard efficiency ~87-91%), IE2 (high efficiency ~89-93%), IE3 (premium efficiency ~91-95%), and IE4 (super-premium efficiency &gt;92-96%). Modern premium efficiency motors use better materials, improved cooling, and optimized design to reduce losses compared to older motors. In Kenya's hot climate with ambient temperatures often exceeding 35°C, motors experience significant thermal stress that accelerates winding insulation degradation. Proper ventilation and cooling are critical for motor longevity in tropical environments. Energy cost savings from upgrading to premium efficiency motors can be substantial for motors running continuously. A 30kW motor running 8,000 hours annually could save KES 100,000-200,000 per year by upgrading from IE1 to IE3 efficiency. However, the decision to replace versus repair depends on motor size, application, replacement availability, and operating hours. Our engineers can perform energy audits to quantify potential savings and recommend the most economical approach.`,
  },
  {
    title: "Motor Bearing Systems: Lubrication, Alignment, and Failure Prevention",
    content: `Electric motor bearings support the rotor and allow free rotation while minimizing friction and heat. Most AC motors use rolling element bearings (ball or roller bearings) from manufacturers like SKF, FAG, NSK, or Timken. Bearing selection depends on motor size, speed, and load. Ball bearings are suitable for general-purpose motors while roller bearings handle higher radial loads common in large industrial motors. Proper lubrication is critical for bearing life and heat dissipation. Over-greasing causes excessive friction and heat, degrading grease performance and bearing surfaces. Under-greasing causes boundary contact, metal-to-metal wear, and rapid failure. Bearing temperature should not exceed 80°C during normal operation; temperatures above 100°C indicate inadequate cooling or bearing problems. Misalignment between the motor and driven load creates excessive radial loads that reduce bearing life dramatically. Just 0.5mm misalignment can reduce bearing life by 50%. Vibration analysis can detect bearing wear before catastrophic failure, allowing planned maintenance instead of emergency repairs. Shaft grounding systems on VFD-driven motors prevent electrical bearing currents that cause micropitting and rapid failure.`,
  },
  {
    title: "Winding Insulation Degradation and Early Failure Detection",
    content: `Motor winding insulation failure is the leading cause of motor failures, accounting for over 35% of premature shutdowns. The insulation coating on copper wire degrades due to thermal stress (excessive temperature), electrical stress (overvoltages and voltage spikes from VFDs), mechanical stress (vibration during operation), moisture ingress (humid environments), and contamination from dust, oil, or salt. Tropical climates like Kenya accelerate insulation degradation; humidity and salt air significantly reduce insulation life compared to temperate climates. Early warning signs of insulation failure include: partial discharge (crackling sounds), electrical noise, slight burning smell, discolored windings visible if motor is opened, winding resistance imbalance between phases, and deteriorating insulation resistance when measured with a megohmmeter. Megohm testing at 500V (for low voltage motors) should show &gt;5 megohms for new motors, &gt;1 megohm acceptable during service. Values below 100 kilohms indicate imminent failure. Polarization index (PI) testing, measuring insulation resistance at 1-minute and 10-minute intervals, reveals moisture content; PI &gt;2 is good, &lt;1.5 indicates contamination. Regular testing allows predictive maintenance scheduling before failure.`,
  },
  {
    title: "Motor Thermal Management in High-Ambient Tropical Environments",
    content: `Temperature is the primary enemy of motor longevity. Each 10°C increase above the insulation class rating approximately halves the motor's remaining lifespan according to the Arrhenius equation. Motor temperature depends on ambient conditions, load level, ventilation, and cooling system efficiency. In Kenya's climate with regular ambient temperatures of 30-40°C, motors face inherent thermal stress. Class B insulated motors (130°C rating) may only have 15°C margin above ambient at 45°C, leaving minimal safety buffer. Premium Class H motors (180°C rating) provide better thermal safety. Motor cooling requires adequate airflow through the motor; blocked cooling fins or vents allow temperature to rise rapidly. Outdoor motors need weather protection while maintaining ventilation. Enclosed motors in poorly ventilated rooms can overheat within minutes. Thermal protection devices (thermistors or bimetallic switches) at 130-150°C provide safety cutout but indicate chronic overheating. Installing larger motors, improving ventilation, or using premium efficiency motors with better cooling can solve chronic overheating. Temperature monitoring with IR thermometers or embedded sensors allows proactive intervention before thermal damage occurs.`,
  },
  {
    title: "VFD-Driven Motors: New Challenges and Special Design Requirements",
    content: `Variable Frequency Drives (VFDs) revolutionized motor control by enabling smooth speed variation, soft starting, and significant energy savings. However, VFDs create electrical stresses unknown to older motors. VFD power transistors switch at kilohertz frequencies (typically 2-8 kHz), creating voltage spikes that can reach 1.6x the DC bus voltage or higher. Standard motors designed for sinusoidal AC input experience voltage stress and insulation failure rates 5-10 times higher when driven by VFDs. PWM switching also creates common-mode voltage (voltage between ground and motor frame) that couples into motor bearings, inducing shaft currents that cause electric discharge machining (EDM) damage to bearing races. Even small pits accumulate, eventually causing bearing failure. When rewinding motors for VFD duty, several precautions are essential: using inverter-grade magnet wire with superior insulation thickness and dv/dt capability, applying vacuum pressure impregnation (VPI) with solid varnish for complete insulation saturation, phase-to-phase insulation minimum 50 mils (Class H insulation), and shaft grounding solutions for motors &gt;30kW. Upgraded motor designs specify "inverter duty" or "VFD rated" to indicate these enhancements. Installing shaft grounding rings, using screened cables, and filtering at the VFD output reduce voltage spikes and common-mode currents, protecting both motors and other equipment.`,
  },
  {
    title: "Motor Rewinding: When to Repair vs. Replace and Quality Assurance",
    content: `The decision to rewind versus replace a motor requires careful economic analysis. As a general rule, motors above 15kW are almost always more economical to rewind than replace, while small motors below 3kW may be cheaper to replace. Mid-range motors (5-15kW) require detailed cost comparison. Replacement motors may have lead times of 4-12 weeks if special specifications are required, while quality rewinding typically completes in 3-5 days, minimizing production downtime. Modern premium efficiency motors may justify replacement if continuous operation allows energy savings to offset higher cost. Rewinding costs depend on motor size, complexity (special windings), refractory condition, and required testing. Quality rewinding restores motor performance to original or better specifications through meticulous processes: careful documentation of original winding configuration, complete removal of old windings while preserving lamination integrity, cleaning and core loss testing to verify lamination soundness, installation of new windings with high-quality copper wire and modern insulation, VPI treatment for complete varnish saturation, and comprehensive electrical testing including megger testing, hi-pot testing, surge testing, and no-load run testing. Every quality rewind includes a detailed test certificate documenting all measurements, allowing verification that rewound motors meet specifications.`,
  },
  {
    title: "Predictive Maintenance Programs: Extending Motor Life Through Monitoring",
    content: `Predictive maintenance uses measured condition data to schedule repairs before failure occurs, maximizing equipment availability while minimizing maintenance costs. For motors, key monitoring parameters include: temperature (IR thermometers or embedded sensors), vibration (frequency analysis detects bearing wear and misalignment), insulation resistance (megohm testing every 6-12 months), winding resistance (detects shorted turns and phase imbalance), electrical signature analysis (detects rotor bar cracks and bearing wear), and visual inspection for corrosion, leakage, or mechanical damage. Large critical motors may justify continuous online monitoring systems measuring temperature, vibration, and electrical parameters with cloud-based analytics. Smaller motors benefit from periodic testing on fixed schedules: quarterly thermography surveys, annual megohm and winding resistance testing, and bi-annual vibration analysis. This data, trended over time, reveals deterioration trends allowing maintenance scheduling weeks or months before failure. Predictive maintenance programs reduce emergency failures by 80-90%, extend motor life by 30-50%, and reduce total maintenance costs by 20-40% compared to reactive maintenance. In Kenya's industrial sectors including sugar manufacturing, tea processing, coffee production, and mining, predictive maintenance programs have become essential competitive advantages.`,
  },
];

// ERROR CODES & DIAGNOSTICS (20+ codes)
const MOTOR_ERROR_CODES = [
  { code: 'E001', issue: 'Phase Imbalance (&gt;5% voltage difference)', symptoms: ['Reduced torque', 'Vibration', 'Overheating in one phase'], solution: 'Check supply cables for loose connections; measure three-phase voltage balance; if imbalance exists at supply, contact utility; if only at motor, check cable integrity' },
  { code: 'E002', issue: 'Single Phasing (one phase missing)', symptoms: ['Motor cannot start', 'Current surge in other phases', 'Heavy vibration', 'Humming without rotation'], solution: 'Immediately stop motor to prevent winding damage; check circuit breaker, contactor, and supply lines; measure voltage on all three phases at motor terminals' },
  { code: 'E003', issue: 'Insulation Breakdown (phase-to-ground short)', symptoms: ['Electrical shock hazard', 'Breaker trips immediately', 'Burning smell', 'Visible scorching'], solution: 'Deenergize immediately; megohm test all phases to ground (should be &gt;1MΩ); if &lt;100kΩ, motor requires rewinding; check for water ingress or mechanical damage to windings' },
  { code: 'E004', issue: 'Bearing Overheating', symptoms: ['Temperature &gt;90°C', 'Grinding or squealing noise', 'Vibration increasing', 'Discoloration around bearing housing'], solution: 'Reduce load temporarily; check if grease is adequate (listen for grinding, not rumbling); if overgreased, operate until grease redistributes; if undergreased or bearing noise present, schedule bearing replacement' },
  { code: 'E005', issue: 'Rotor Bar Cracks (induction motor)', symptoms: ['Vibration at startup', 'Reduced power output', 'Excessive heat in rotor', 'Slow acceleration'], solution: 'Perform electrical signature analysis to detect rotor bar breakage; rotor must be rewound; partial rotor bar cracks may progress rapidly to complete failure' },
  { code: 'E006', issue: 'Winding Short Circuit (turn-to-turn)', symptoms: ['Winding resistance imbalance &gt;5%', 'Excessive current draw', 'Overheating in affected phase', 'Reduced motor torque'], solution: 'Megohm test shows normal (shorts within winding don\'t show on phase-to-ground test); surge test detects waveform distortion; motor requires rewinding' },
  { code: 'E007', issue: 'Motor Won\'t Start', symptoms: ['Hums but doesn\'t rotate', 'Nameplate amperage current drawn', 'No rotation at all', 'Startup timeout'], solution: 'Check single phasing first (Phase 1,2,3 voltage); verify load isn\'t jammed by attempting to manually rotate; check soft starter/VFD parameters if fitted; check motor mechanical coupling/gearbox' },
  { code: 'E008', issue: 'Low Output Power', symptoms: ['Reduced speed load', 'Unable to reach full load', 'Increased temperature', 'Efficiency lower than nameplate'], solution: 'Measure supply voltage (should be ±10% of nameplate); check for phase imbalance or supply problems; if electrical supply normal, motor may have partial winding short or bearing drag' },
  { code: 'E009', issue: 'Excessive Vibration', symptoms: ['Audible vibration from motor', 'Visible movement of motor', 'Coupling/belt wear accelerating', 'Bearing temperature rising'], solution: 'Check mechanical alignment between motor and load (use laser alignment tool); verify motor is securely bolted (check all foundation bolts); rotor bar cracks cause frequency-related vibration; bearing wear causes increasing vibration over time' },
  { code: 'E010', issue: 'VFD Tripping / Communication Error', symptoms: ['VFD display shows error', 'Motor stops intermittently', 'Nuisance trips on load', 'No response to VFD commands'], solution: 'Check VFD-to-motor cable (use shielded cable within conduit); verify motor is VFD-rated; check for voltage spikes at motor terminals with oscilloscope; upgrade motor to VFD-duty with shaft grounding' },
  { code: 'E011', issue: 'Moisture in Windings', symptoms: ['Insulation resistance &lt;5MΩ', 'Polarization index &lt;1.5', 'Risk of tracking/arcing in humid areas', 'Reduced efficiency'], solution: 'Motor not immediately dangerous if voltage low; allow motor to dry in warm, low-humidity environment for 12-24 hours; if moisture continues, rewinding with Class H insulation and VPI treatment required' },
  { code: 'E012', issue: 'Contactor Chatter / Intermittent Starting', symptoms: ['Motor starts and stops randomly', 'Breaker doesn\'t trip', 'Lights flicker', 'Inconsistent operation'], solution: 'Check control supply voltage (24V or 110V depending on system); inspect contactor for burned contacts (replace if pitted); check start button and control wiring for loose connections; check for AC coil problems if contactor is solenoid-operated' },
  { code: 'E013', issue: 'Capacitor Failure (single-phase motor)', symptoms: ['Single-phase motor won\'t start', 'Hums but doesn\'t rotate', 'Reduced torque', 'Capacitor bulging or leaking'], solution: 'Replace capacitor immediately - dangerous to operate; capacitors rated in microfarads (µF) and voltage (e.g., 50µF/370V); verify replacement capacitor matches original nameplate data exactly' },
  { code: 'E014', issue: 'Overload Relay Tripping', symptoms: ['Motor stops 5-30 min after starting', 'Breaker doesn\'t trip', 'Overload relay resets itself', 'Normal running temperature when it trips'], solution: 'Overload relay may be incorrectly calibrated to too-low current setting (reduce load or recalibrate if possible); measure running current (should be within nameplate rating); if current exceeds rating, load is too high or motor is deteriorating' },
  { code: 'E015', issue: 'Soft Starter Fault / Parameter Error', symptoms: ['VFD/soft starter displays fault', 'Motor doesn\'t start', 'Uncontrolled acceleration/deceleration', 'Communication errors'], solution: 'Check parameter settings (many soft starters have factory defaults that may not match your motor/load); verify ramp time isn\'t too short; check for phase imbalance at supply; if errors persist, soft starter logic board may need replacement' },
  { code: 'E016', issue: 'Coupling Failure', symptoms: ['Motor runs but load doesn\'t move', 'Vibration when loaded', 'Unusual sounds at coupling', 'Shaft misalignment visible'], solution: 'Stop immediately to prevent shaft damage; inspect coupling for cracked hubs (common in flexible couplings); check bolt tightness; misalignment common cause - re-align motor and load using laser alignment tool' },
  { code: 'E017', issue: 'Brushes Worn Out (DC motor)', symptoms: ['Arcing or sparking at commutator', 'Commutator pitted or blackened', 'Motor loses power', 'Brush holders hot to touch'], solution: 'Replace brush set - springs push new brushes automatically as they wear; sparking may damage commutator surface - if deep pitting, commutator may need skimming on lathe; modern brushless DC motors eliminate this maintenance' },
  { code: 'E018', issue: 'Commutator Surface Damage (DC motor)', symptoms: ['Excessive brush arcing', 'Copper high spots vs. mica valleys', 'Brush wear accelerated', 'Motor loses power output'], solution: 'Minor pitting: run motor under light load to allow brushes to self-seat; heavy damage requires commutator skim (turning on lathe to 0.5-1mm depth max); severe damage requires motor rewinding with new armature' },
  { code: 'E019', issue: 'Field Winding Open (DC motor)', symptoms: ['Motor runs at very high speed', 'No load control possible', 'Motor cannot be stopped by load', 'Potential runaway risk'], solution: 'Dangerous condition - stop immediately; DC motor field winding open causes loss of torque control; motor requires rewinding of field coils; running in this state risks mechanical failure from overspeed' },
  { code: 'E020', issue: 'BLDC Hall Sensor Failure', symptoms: ['Motor won\'t start or starts erratically', 'Jerky motion', 'Electronic controller displays sensor error', 'One cogging position only'], solution: 'BLDC motors use Hall sensors for commutation; replace failed sensor if it\'s external (affordable); if internal, motor may require factory repair; can limp-limp at reduced speed without working sensors but not recommended' },
];

// TROUBLESHOOTING PROCEDURES
const TROUBLESHOOTING_PROCEDURES = [
  { issue: 'Motor Won\'t Start', steps: ['1. Verify power supply present (voltmeter shows ±10% of nameplate)', '2. Check for single phasing - measure all 3 phases (should be equal)', '3. Attempt manual rotation - if jammed, identify obstruction', '4. If no rotation but high current: likely mechanical jam or winding short', '5. If humming but no rotation: single phasing, low voltage, or starting issues', '6. Check starter/contactor - verify proper closure and control supply'] },
  { issue: 'Low Power Output', steps: ['1. Verify input voltage ±10% of nameplate (low voltage reduces torque)', '2. Check for phase imbalance (measure voltage between all phase pairs)', '3. Verify load isn\'t excessive for motor size', '4. Check coupling alignment (use laser alignment tool)', '5. Measure current draw (high current + low speed = mechanical drag)', '6. If electrical supply normal: internal problem requires megohm & surge testing'] },
  { issue: 'Overheating', steps: ['1. Measure actual temperature with IR thermometer (not just feel)', '2. Check ventilation - clear any blocked cooling fins or vents', '3. Verify load isn\'t excessive (current shouldn\'t exceed nameplate)', '4. Check for phase imbalance (causes one phase to overheat)', '5. Bearing overheating common - listen for grinding, measure bearing temp', '6. Motor overload relay trips: reduce load or check for developing mechanical fault'] },
  { issue: 'Excessive Vibration', steps: ['1. Check mechanical coupling alignment (misalignment is #1 cause)', '2. Verify motor is securely bolted (loosen each bolt, retighten in cross pattern)', '3. Check for rotor rubs - if stator frame is cracked/warped, rotor may drag', '4. Bearing wear causes progressive vibration increase - schedule bearing replacement', '5. Rotor bar cracks show frequency-related vibration - use electrical signature analysis', '6. Load imbalance - verify driven equipment is balanced (fans, pumps, etc.)'] },
  { issue: 'Breaker Trips on Start', steps: ['1. Measure inrush current with clamp meter (should be 5-8× FLA for squirrel cage)', '2. Check if breaker calibration matches motor inrush (soft starters reduce inrush)', '3. Verify supply cables sized correctly (undersize causes voltage drop/high inrush)', '4. Check for phase imbalance (trips one phase first)', '5. Load may be locked at startup - verify free rotation possible', '6. Insulation fault would cause immediate trip - megohm test each phase to ground'] },
  { issue: 'Insulation Resistance Low', steps: ['1. Immediate danger if &lt;100kΩ - stop motor, don\'t start until repaired', '2. If 100kΩ-1MΩ, motor may operate temporarily under dry conditions', '3. Motor likely damp - place in warm low-humidity location for 24-48 hours', '4. If resistance doesn\'t improve: motor winding insulation deteriorated/damaged', '5. Rewinding with Class H insulation recommended for humid environments', '6. Polarization index &lt;1.5 suggests moisture contamination (won\'t improve with drying)'] },
];

// MAINTENANCE SCHEDULES
const MAINTENANCE_SCHEDULES = [
  { period: 'Monthly', items: ['Visual inspection for signs of overheating (discoloration, scorch marks)', 'Check for loose bolts on motor frame and coupling', 'Listen for unusual sounds (grinding, squealing, rattling)', 'Feel motor housing temperature (should be hand-warm, not hot)', 'Verify cooling fins and vents are clear of dust buildup', 'Check for any oil or grease leaks from seals'] },
  { period: 'Quarterly', items: ['Measure motor temperature with infrared thermometer under load', 'Check bearing temperature (should be &lt;80°C)', 'Inspect electrical connections for corrosion or looseness', 'Verify load current with clamp meter (should match historical baseline)', 'Inspect coupling for wear, cracks, or misalignment', 'Clean ventilation areas and remove accumulated dust'] },
  { period: 'Semi-Annual', items: ['Perform insulation resistance (megohm) test at motor terminals', 'Measure three-phase voltage and current balance', 'Visual inspection of winding insulation if motor opened (check for discoloration)', 'Grease relubrication if specified by manufacturer (check nameplate)', 'Inspect for water damage, corrosion in humid locations', 'Document all measurements for trend analysis'] },
  { period: 'Annual', items: ['Winding resistance balance test (all three phases should match ±2%)', 'Bearing condition assessment (listening, temperature, vibration)', 'Coupling and alignment check with laser alignment tool', 'No-load current measurement (trending helps detect deterioration)', 'Thermal imaging of all connections and motor body', 'Update maintenance records and plan preventive actions'] },
  { period: '2-3 Years / As Needed', items: ['Complete electrical survey: hi-pot test, surge test, core loss test', 'Bearing replacement if temperature or noise indicates wear', 'Motor realignment if vibration has increased', 'VFD-compatible retrofit if motor to be used with variable speed drive', 'Motor rewinding if insulation class needs upgrade or performance restored', 'Consider replacement if motor &gt;15 years old and efficiency significantly below modern standards'] },
];

export default function MotorsPage() {
  const [activeTab, setActiveTab] = useState('fundamentals');
  const [expandedError, setExpandedError] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen text-white">
      <B2BCommercialBand profile={B2B_PROFILES.motors} />
      <SectionLead
        title="Electric Motor Services & Rewinding"
        subtitle="Comprehensive AC/DC motor repair, rewinding, VFD compatibility, and maintenance for industrial operations"
      />

      {/* Motor Images Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Motor Types & Applications</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-blue-500/30">
            <OptimizedImage
              src="/images/Perkins-4000-Parts.webp"
              alt="Industrial Electric Motor"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-blue-900/20">
              <h3 className="font-bold text-blue-400">AC Induction Motors</h3>
              <p className="text-sm text-gray-300">90% of industrial applications; squirrel cage & wound rotor types</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-purple-500/30">
            <OptimizedImage
              src="/images/PERKINS-ENGINE-PARTS.jpg"
              alt="Motor Components and Parts"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-purple-900/20">
              <h3 className="font-bold text-purple-400">DC & Specialty Motors</h3>
              <p className="text-sm text-gray-300">Precise speed control; servo, stepper, BLDC applications</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-cyan-500/30">
            <OptimizedImage
              src="/images/prima__91388__28242__47940.1692695563.1280.1280_512x444.webp"
              alt="Motor Parts and Maintenance"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-cyan-900/20">
              <h3 className="font-bold text-cyan-400">VFD-Rated Motors</h3>
              <p className="text-sm text-gray-300">Inverter-duty insulation; shaft grounding; energy efficient</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <div className="p-6 border border-blue-500/30 rounded-lg bg-blue-900/10">
          <h3 className="text-lg font-bold text-blue-400 mb-4">Motor Types</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><span className="text-blue-400 font-semibold">Induction:</span> Squirrel cage, wound rotor</li>
            <li><span className="text-blue-400 font-semibold">DC:</span> Brush, brushless (BLDC), PM</li>
            <li><span className="text-blue-400 font-semibold">Synchronous:</span> Locked to line frequency</li>
            <li><span className="text-blue-400 font-semibold">Specialty:</span> Servo, stepper, linear</li>
          </ul>
        </div>
        <div className="p-6 border border-amber-500/30 rounded-lg bg-amber-900/10">
          <h3 className="text-lg font-bold text-amber-400 mb-4">Common Failures</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><span className="text-amber-400 font-semibold">Bearings:</span> Overheating, wear, contamination</li>
            <li><span className="text-amber-400 font-semibold">Windings:</span> Insulation breakdown, shorts</li>
            <li><span className="text-amber-400 font-semibold">Rotor:</span> Bar cracks, lamination shorts</li>
            <li><span className="text-amber-400 font-semibold">Electrical:</span> Phase imbalance, single phasing</li>
          </ul>
        </div>
        <div className="p-6 border border-green-500/30 rounded-lg bg-green-900/10">
          <h3 className="text-lg font-bold text-green-400 mb-4">Rewinding & Testing</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><span className="text-green-400 font-semibold">Testing:</span> Megohm, hi-pot, surge, core loss</li>
            <li><span className="text-green-400 font-semibold">Rewinding:</span> VPI treatment, Class H insulation</li>
            <li><span className="text-green-400 font-semibold">VFD-Rated:</span> Inverter-duty wire, bearing protection</li>
            <li><span className="text-green-400 font-semibold">Load Test:</span> No-load & full-load verification</li>
          </ul>
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {MOTOR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? `bg-${tab.color}-500 text-white` : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FUNDAMENTALS */}
      <AnimatePresence mode="wait">
        {activeTab === 'fundamentals' && (
          <motion.div key="fundamentals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-blue-400">Motor Fundamentals & Technology</h2>
            <div className="space-y-8">
              {MOTOR_FUNDAMENTALS.map((para, idx) => (
                <div key={idx} className="bg-slate-900/30 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">{para.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{para.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TROUBLESHOOTING */}
        {activeTab === 'troubleshooting' && (
          <motion.div key="troubleshooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Troubleshooting Procedures</h2>
            <div className="space-y-6">
              {TROUBLESHOOTING_PROCEDURES.map((proc, idx) => (
                <div key={idx} className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-amber-300 mb-4">⚙️ {proc.issue}</h3>
                  <ol className="space-y-2">
                    {proc.steps.map((step, sidx) => (
                      <li key={sidx} className="text-gray-300">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ERROR CODES */}
        {activeTab === 'error-codes' && (
          <motion.div key="error-codes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-red-400">Motor Error Codes & Diagnostics</h2>
            <div className="space-y-4">
              {MOTOR_ERROR_CODES.map((err, idx) => (
                <motion.div
                  key={idx}
                  className="bg-red-900/10 border border-red-500/30 rounded-lg overflow-hidden"
                  onClick={() => setExpandedError(expandedError === err.code ? null : err.code)}
                >
                  <div className="p-4 cursor-pointer hover:bg-red-900/20 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-red-400">{err.code}: {err.issue}</h3>
                        <p className="text-sm text-gray-400 mt-1">{err.symptoms.join(' • ')}</p>
                      </div>
                      <span className="text-red-400">{expandedError === err.code ? '−' : '+'}</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedError === err.code && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-red-500/20 px-4 py-3 bg-red-900/5">
                        <p className="text-gray-300"><strong className="text-red-300">Solution:</strong> {err.solution}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REWINDING */}
        {activeTab === 'rewinding' && (
          <motion.div key="rewinding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-green-400">Motor Rewinding Process</h2>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8">
              <p className="text-gray-300 mb-6">Professional motor rewinding restores damaged windings to original or improved specifications. The process involves complete disassembly, cleaning, new winding installation with modern materials, vacuum pressure impregnation (VPI), comprehensive electrical testing, and reassembly with new bearings. Quality rewound motors perform equal to or better than new units at 40-60% of replacement cost.</p>
              <h3 className="text-xl font-bold text-green-300 mb-4">Rewinding Benefits:</h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
                <li>✅ Cost savings 40-60% vs. new motor</li>
                <li>✅ Faster turnaround (3-5 days vs. 4-12 weeks)</li>
                <li>✅ Can upgrade to premium efficiency (IE3/IE4)</li>
                <li>✅ VFD-rated upgrade during rewind</li>
                <li>✅ Restore original performance specifications</li>
                <li>✅ Environmentally responsible recycling</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-purple-400">Maintenance Schedules</h2>
            <div className="space-y-6">
              {MAINTENANCE_SCHEDULES.map((maint, idx) => (
                <div key={idx} className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">{maint.period}</h3>
                  <ul className="space-y-2">
                    {maint.items.map((item, iidx) => (
                      <li key={iidx} className="text-gray-300">✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VFD SYSTEMS */}
        {activeTab === 'vfd' && (
          <motion.div key="vfd" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-cyan-400">VFD-Rated Motors & Compatibility</h2>
            <div className="space-y-6">
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">VFD Challenges for Standard Motors</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong className="text-cyan-400">Voltage Spikes:</strong> PWM switching creates 1.6x DC bus voltage, stressing insulation</li>
                  <li>• <strong className="text-cyan-400">Bearing Currents:</strong> Common-mode voltages induce shaft currents causing bearing EDM damage</li>
                  <li>• <strong className="text-cyan-400">High dv/dt:</strong> Rapid voltage changes stress phase insulation and cause premature failure</li>
                  <li>• <strong className="text-cyan-400">Temperature Rise:</strong> Non-sinusoidal currents increase motor heating 10-20% above nameplate</li>
                </ul>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">VFD-Rated Motor Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ <strong className="text-cyan-400">Inverter-Grade Magnet Wire:</strong> Enhanced insulation thickness (50+ mils) and dv/dt capability</li>
                  <li>✓ <strong className="text-cyan-400">Class H Insulation:</strong> 180°C rating vs. 130°C for standard motors</li>
                  <li>✓ <strong className="text-cyan-400">VPI Treatment:</strong> Vacuum Pressure Impregnation for solid varnish saturation</li>
                  <li>✓ <strong className="text-cyan-400">Shaft Grounding:</strong> Bearing protection from electrical discharge machining</li>
                  <li>✓ <strong className="text-cyan-400">Premium Efficiency:</strong> IE3/IE4 efficiency with better thermal margin</li>
                </ul>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Retrofit Recommendations</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Use shielded motor cables in separate conduit from power cables</li>
                  <li>✓ Install line reactor on VFD input to reduce voltage spike peaks</li>
                  <li>✓ Use motor choke or output transformer to reduce dv/dt at motor terminals</li>
                  <li>✓ Install shaft grounding rings or brushes for motors &gt;30 kW</li>
                  <li>✓ Upgrade cooling to premium efficiency IE3/IE4 motor during rewind</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENGINEERING DEEP DIVE */}
      <MotorSelectionEngineeringDeepDive />

      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <UnifiedCTA />
      </section>
    </main>
  );
}

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'overview', label: '📖 Overview', color: 'cyan' },
  { id: 'diagnostics', label: '🔍 Diagnostics', color: 'blue' },
  { id: 'rewinding', label: '🔧 Rewinding Process', color: 'amber' },
  { id: 'parts', label: '⚙️ Motor Parts', color: 'slate' },
  { id: 'copper', label: '🥇 Copper Wire', color: 'orange' },
  { id: 'types', label: '📋 Motor Types & Sizes', color: 'purple' },
  { id: 'pricing', label: '💰 Pricing', color: 'green' },
  { id: 'shipping', label: '🚚 Send Your Motor', color: 'indigo' },
  { id: 'warranty', label: '✅ Warranty', color: 'emerald' },
  { id: 'vfd', label: '⚡ VFD Integration', color: 'violet' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
];

// Comprehensive Motor Overview - 10 Detailed Paragraphs
const MOTOR_OVERVIEW = [
  {
    title: "Understanding Electric Motors and Their Importance",
    content: `Electric motors are the workhorses of modern industry, converting electrical energy into mechanical motion that powers everything from small household appliances to massive industrial machinery. In Kenya and across East Africa, electric motors drive critical operations in manufacturing plants, water pumping stations, agricultural processing facilities, hospitals, hotels, and countless other applications. The reliability of these motors directly impacts productivity, profitability, and in many cases, safety. When a motor fails, it can bring entire production lines to a halt, causing significant financial losses that far exceed the cost of the motor itself. Understanding how motors work, recognizing early warning signs of failure, and knowing when to repair versus replace are essential skills for any facility manager or maintenance professional.`
  },
  {
    title: "The Science Behind Motor Rewinding",
    content: `Motor rewinding is a specialized skill that involves replacing the electromagnetic coils (windings) inside a motor's stator or rotor. These windings are made of insulated copper wire wound in specific patterns to create magnetic fields that cause the rotor to spin. Over time, the insulation on these wires degrades due to heat, moisture, contamination, voltage spikes, or simply age. When insulation fails, it can cause short circuits between turns, between phases, or to ground, leading to motor failure. Professional rewinding restores the motor to its original specifications by removing the damaged windings, cleaning and testing the laminated steel core, and installing new copper coils with modern high-temperature insulation. When done correctly by skilled technicians, a rewound motor can perform equal to or even better than new.`
  },
  {
    title: "When to Rewind vs. Replace Your Motor",
    content: `The decision to rewind or replace a motor depends on several factors including motor size, age, efficiency class, availability of replacements, and cost comparison. As a general rule, motors above 15kW (20HP) are almost always more economical to rewind than replace, while smaller motors below 3kW may be cheaper to replace outright. However, replacement may not always be straightforward – motors with special frame sizes, unusual voltages, or specific mounting arrangements may have lead times of several weeks from overseas suppliers. For critical applications, rewinding can often be completed in 2-5 days, minimizing downtime. Modern premium efficiency (IE3/IE4) motors can be more efficient than older designs, so for motors running continuously, energy savings from a new high-efficiency motor may justify replacement. Our technicians can advise on the most cost-effective solution for your specific situation.`
  },
  {
    title: "The Impact of Quality Copper Wire on Motor Performance",
    content: `The quality of copper wire used in rewinding directly affects motor performance, efficiency, and lifespan. We use only Grade A electrolytic copper wire with purity of 99.95% or higher, sourced from reputable manufacturers. The copper must have the correct cross-sectional area (gauge) to carry the rated current without excessive heating, and must be wound with the exact number of turns specified in the original design. Using undersized wire or reducing turns will cause the motor to run hot and fail prematurely. Our copper wire is coated with high-temperature polyesterimide enamel (Class H, 180°C) or polyamide-imide (Class C, 200°C) insulation that withstands the operating conditions of modern motors, especially those used with variable frequency drives. Every batch of wire is tested for diameter, conductivity, and insulation thickness before use.`
  },
  {
    title: "Understanding Motor Insulation Classes and Their Importance",
    content: `Motor insulation class is a critical specification that determines the maximum operating temperature the motor can withstand. Class A (105°C) and Class E (120°C) are older standards rarely used today. Class B (130°C) is common in standard motors, while Class F (155°C) and Class H (180°C) are used in motors designed for demanding applications or VFD operation. When rewinding, we always use insulation equal to or better than the original specification. Upgrading from Class B to Class F provides a 25°C thermal margin, which can double the motor's lifespan according to the Arrhenius equation (every 10°C reduction in operating temperature doubles insulation life). For motors used with VFDs, we recommend Class H insulation minimum, along with additional measures like inverter-spike-resistant wire to handle the voltage spikes created by PWM switching.`
  },
  {
    title: "The Complete Rewinding Process from Start to Finish",
    content: `Professional motor rewinding follows a systematic process to ensure quality results. First, the motor is documented – nameplate data, winding configuration, connection diagrams, and original condition are all recorded. The motor is then disassembled, and the stator and rotor are tested for core integrity using a core loss tester. The old windings are removed by heating the stator to soften the varnish, then carefully extracting the coils while preserving the lamination stack. Slots are cleaned and inspected for damage. New coils are wound on a winding machine using the original specifications (or improved specifications if upgrading), then carefully inserted into the slots with new slot liners and phase insulation. Coils are connected per the original winding diagram, laced and braced, then impregnated with varnish using VPI (Vacuum Pressure Impregnation) for best results. Finally, the rewound stator undergoes comprehensive testing before reassembly.`
  },
  {
    title: "Quality Testing: Ensuring Your Motor Meets Specifications",
    content: `Before returning any rewound motor to a customer, we perform a complete battery of electrical tests to verify quality. Insulation resistance testing (megger test) at 500V or 1000V confirms that the new insulation exceeds 100 megohms for new windings (our target is >500MΩ). Winding resistance measurement verifies that all three phases are balanced within 2% and match calculated values for the wire gauge and turns used. High-potential (hi-pot) testing at 2x rated voltage plus 1000V stresses the insulation to verify it can withstand operational conditions with margin. Surge testing compares high-frequency voltage pulses across windings to detect any turn-to-turn shorts that other tests might miss. For larger motors, we also perform a no-load run test to verify vibration levels, bearing temperatures, and no-load current draw. All test results are documented and provided with the motor.`
  },
  {
    title: "The Role of Bearings in Motor Reliability",
    content: `Bearings are the second most common cause of motor failure after winding problems, and their condition should always be assessed during any motor service. Ball bearings in smaller motors and roller bearings in larger motors support the rotor and allow it to spin freely within the stator. Bearing failure can be caused by improper lubrication (both over-greasing and under-greasing are harmful), misalignment with the driven load, excessive belt tension, contamination from dust or moisture, or electrical damage from VFD-induced shaft currents. During rewinding, we always replace bearings with new premium-quality SKF, FAG, or NSK bearings matched to the original specifications. For VFD applications, we can install insulated bearings or shaft grounding rings to prevent electrical bearing damage. Proper bearing installation with correct fits and appropriate grease quantity is essential for long life.`
  },
  {
    title: "VFD Compatibility and Modern Motor Requirements",
    content: `Variable Frequency Drives have revolutionized motor control, enabling precise speed adjustment, soft starting, and significant energy savings. However, VFDs also create challenges for motors not designed for inverter duty. The fast switching of VFD power transistors creates voltage spikes that can reach twice the DC bus voltage, stressing winding insulation. Additionally, common-mode voltages can induce currents through motor bearings, causing electrical discharge machining (EDM) that pits bearing races. When rewinding motors for VFD use, we take special precautions: using inverter-grade magnet wire with enhanced insulation, applying VPI treatment for solid varnish impregnation, and recommending shaft grounding solutions for motors above 30kW. We can also retrofit older motors with VFD-compatible windings during the rewind process, potentially saving the cost of purchasing a new inverter-duty motor.`
  },
  {
    title: "Our Commitment to Quality and Customer Satisfaction",
    content: `At Emerson Industrial Maintenance Services, motor rewinding is not just a service – it's a craft we've perfected over years of experience. Our workshop in Nairobi is equipped with modern winding machines, VPI tanks, core loss testers, surge testers, and comprehensive electrical testing equipment. Our technicians are trained in both traditional rewinding techniques and modern best practices for high-efficiency and inverter-duty motors. We maintain detailed records of every motor we service, allowing us to provide consistent quality and quick turnaround for repeat customers. Every rewound motor leaves our facility with a comprehensive test certificate and our warranty of 6-10 months depending on application and operating conditions. We also offer on-site motor testing, alignment services, and preventive maintenance programs to help you maximize the lifespan and reliability of your motor fleet.`
  }
];

const MOTOR_TESTS = [
  { test: 'Insulation Resistance', method: 'Megger test at 500V/1000V', pass: '>5 MΩ for new, >1 MΩ acceptable', fail: '<1 MΩ indicates winding damage', tool: 'Megger/Insulation tester' },
  { test: 'Winding Resistance', method: 'Ohm test each phase', pass: 'All phases within 5%', fail: 'Imbalance >5% indicates shorted turns', tool: 'Low resistance ohmmeter' },
  { test: 'Polarization Index (PI)', method: '10-minute insulation test', pass: 'PI >2 for Class B/F', fail: 'PI <1.5 indicates contamination', tool: 'Megger with PI function' },
  { test: 'Surge Test', method: 'High voltage pulse comparison', pass: 'Matching waveforms all phases', fail: 'Waveform differences = turn faults', tool: 'Surge tester' },
  { test: 'High Potential (Hi-Pot)', method: 'Apply 2x voltage + 1000V for 1 min', pass: 'No breakdown or leakage', fail: 'Breakdown indicates weak insulation', tool: 'Hi-pot tester' },
  { test: 'Core Loss Test', method: 'Ring flux test at rated flux', pass: '<4W/kg for good core', fail: '>6W/kg indicates shorted laminations', tool: 'Core loss tester' },
  { test: 'Vibration Analysis', method: 'Measure vibration velocity', pass: '<4.5 mm/s (good)', fail: '>7 mm/s requires attention', tool: 'Vibration meter' },
  { test: 'Bearing Check', method: 'Temperature and noise', pass: '<80°C, no grinding', fail: 'High temp or noise = replace', tool: 'IR thermometer, stethoscope' },
];

const REWINDING_PROCESS = [
  { step: 'Reception & Documentation', description: 'Motor received, nameplate recorded, customer requirements documented, job number assigned', time: '30 min', icon: '📝' },
  { step: 'Initial Testing', description: 'Insulation resistance, winding resistance, and visual inspection to assess damage extent', time: '1-2 hours', icon: '🔍' },
  { step: 'Disassembly', description: 'Remove end covers, rotor, bearings, and fan. Document all components and their condition', time: '1-2 hours', icon: '🔧' },
  { step: 'Winding Data Recording', description: 'Count turns, measure wire gauge, record span, connection diagram, and slot configuration', time: '1 hour', icon: '📐' },
  { step: 'Burnout & Stripping', description: 'Heat stator in controlled oven to 350°C to soften varnish, then remove old windings', time: '2-4 hours', icon: '🔥' },
  { step: 'Core Cleaning', description: 'Remove all residue from slots, clean laminations, check for damage or hot spots', time: '1-2 hours', icon: '🧹' },
  { step: 'Core Testing', description: 'Core loss test to verify laminations are not shorted. Repair or replace damaged cores', time: '30 min', icon: '⚡' },
  { step: 'Slot Insulation', description: 'Install new slot liners (Nomex/Mylar/DMD) appropriate for insulation class', time: '1 hour', icon: '📄' },
  { step: 'Coil Winding', description: 'Wind new coils on winding machine to exact specifications (turns, gauge, span)', time: '4-8 hours', icon: '🌀' },
  { step: 'Coil Insertion', description: 'Carefully insert coils into slots, ensuring proper layering and no wire damage', time: '2-4 hours', icon: '⬇️' },
  { step: 'Connections', description: 'Connect coils per winding diagram, form connections, install lead wires', time: '1-2 hours', icon: '🔌' },
  { step: 'Lacing & Bracing', description: 'Tie and brace end turns to prevent movement from magnetic forces and vibration', time: '1-2 hours', icon: '🎀' },
  { step: 'VPI Treatment', description: 'Vacuum Pressure Impregnation with Class H varnish, then bake at 150°C', time: '8-12 hours', icon: '🧪' },
  { step: 'Final Testing', description: 'Complete electrical tests: megger, resistance, hi-pot, surge, and balance check', time: '2-3 hours', icon: '✅' },
  { step: 'Reassembly', description: 'Install new bearings, reassemble motor, balance rotor if required', time: '2-3 hours', icon: '🔩' },
  { step: 'No-Load Run Test', description: 'Run motor, check vibration, bearing temperature, no-load current', time: '30-60 min', icon: '🏃' },
  { step: 'Final Inspection & Painting', description: 'Clean exterior, touch-up paint, apply nameplate with rewind data', time: '1-2 hours', icon: '🎨' },
  { step: 'Documentation & Dispatch', description: 'Prepare test certificate, warranty card, package motor for collection/delivery', time: '30 min', icon: '📦' },
];

// Motor Parts with Diagrams
const MOTOR_PARTS = [
  {
    name: 'Stator',
    description: 'The stationary part containing the main windings. Made of laminated silicon steel sheets to reduce eddy current losses.',
    function: 'Creates rotating magnetic field when energized with AC power',
    rewindable: true,
    diagram: `
┌─────────────────────────┐
│  ╭───────────────────╮  │
│  │   STATOR CORE     │  │
│  │  ┌─────────────┐  │  │
│  │  │ SLOT  SLOT  │  │  │
│  │  │  ↓     ↓    │  │  │
│  │  │ ███   ███   │  │  │
│  │  │ ███   ███   │  │  │
│  │  │  WINDINGS   │  │  │
│  │  └─────────────┘  │  │
│  ╰───────────────────╯  │
│    ← LAMINATIONS →      │
└─────────────────────────┘
    `
  },
  {
    name: 'Rotor',
    description: 'The rotating part. In squirrel cage motors, consists of aluminum or copper bars short-circuited by end rings.',
    function: 'Converts electromagnetic force into mechanical rotation',
    rewindable: false,
    diagram: `
        ┌─────────────┐
       /│  END RING   │\\
      / │ ▓▓▓▓▓▓▓▓▓▓▓ │ \\
     │  │ █ █ █ █ █ █ │  │
     │  │ █ ROTOR █ █ │  │
     │  │ █  BARS █ █ │  │
     │  │ █ █ █ █ █ █ │  │
      \\ │ ▓▓▓▓▓▓▓▓▓▓▓ │ /
       \\│  END RING   │/
        └─────────────┘
         ←── SHAFT ──→
    `
  },
  {
    name: 'Bearings',
    description: 'Support the rotor shaft and allow smooth rotation. Ball bearings for small motors, roller bearings for large/high-thrust motors.',
    function: 'Enable low-friction rotation and maintain air gap',
    rewindable: false,
    diagram: `
     ┌───────────────────┐
     │ OUTER RACE        │
     │ ╔═══════════════╗ │
     │ ║ ● ● ● ● ● ● ● ║ │
     │ ║   BALLS       ║ │
     │ ║ ● ● ● ● ● ● ● ║ │
     │ ╚═══════════════╝ │
     │ INNER RACE →SHAFT │
     └───────────────────┘
    `
  },
  {
    name: 'End Shields/Brackets',
    description: 'Cast iron or aluminum housings that support the bearings and protect the motor internals.',
    function: 'Structural support and bearing housing',
    rewindable: false,
    diagram: `
    ╭───────────────────╮
   /  ┌───────────────┐  \\
  │   │   BEARING     │   │
  │   │   HOUSING     │   │
  │   │  ┌─────────┐  │   │
  │   │  │ BEARING │  │   │
  │   │  │ ● ● ● ● │  │   │
  │   │  └────┼────┘  │   │
  │   │       │ SHAFT │   │
   \\  └───────────────┘  /
    ╰───────────────────╯
    `
  },
  {
    name: 'Cooling Fan',
    description: 'Mounted on non-drive end shaft, draws air over motor frame for cooling.',
    function: 'Forced air cooling to dissipate heat from windings',
    rewindable: false,
    diagram: `
         ╱╲
        ╱  ╲
       ╱    ╲   ← BLADE
      ╱      ╲
     ╱   ▓▓   ╲
    ╱   ╱  ╲   ╲
   ╱   ╱ HUB╲   ╲
   ────│    │────
       │    │
        ↑ SHAFT
    `
  },
  {
    name: 'Terminal Box',
    description: 'Houses the winding connections and provides cable entry points.',
    function: 'Connection point for power cables, allows star/delta configuration',
    rewindable: false,
    diagram: `
   ┌─────────────────────────┐
   │    TERMINAL BOX         │
   │  ┌───┬───┬───┐          │
   │  │ U │ V │ W │ ← LINE   │
   │  ├───┼───┼───┤          │
   │  │ X │ Y │ Z │ ← STAR PT│
   │  └───┴───┴───┘          │
   │   LINKS FOR Δ or Y      │
   └─────────────────────────┘
    `
  },
  {
    name: 'Slot Wedges',
    description: 'Hold the windings securely in the stator slots.',
    function: 'Prevent winding movement and slot exit of conductors',
    rewindable: true,
    diagram: `
    ┌───────────────┐
    │   SLOT WEDGE  │ ← HOLDS WINDING
    ├───────────────┤
    │ █████████████ │ ← SLOT LINER
    │ ╔═══════════╗ │
    │ ║ COPPER    ║ │
    │ ║ WINDINGS  ║ │
    │ ║ ○○○○○○○○○ ║ │
    │ ╚═══════════╝ │
    │   STATOR IRON │
    └───────────────┘
    `
  },
  {
    name: 'Insulation System',
    description: 'Multiple layers of insulation: slot liner, phase separator, wedges, and varnish.',
    function: 'Electrical isolation between conductors, phases, and ground',
    rewindable: true,
    diagram: `
    INSULATION LAYERS:

    1. ENAMEL ON WIRE    ═══○═══
    2. TURN INSULATION   ═╔═══╗═
    3. SLOT LINER        │ ███ │
    4. PHASE SEPARATOR   │ ─── │
    5. SLOT WEDGE        ▀▀▀▀▀▀▀
    6. VPI VARNISH       [FILLS ALL GAPS]
    `
  }
];

// Copper Wire Information
const COPPER_WIRE_DATA = {
  description: `We use only Grade A electrolytic copper wire with 99.95%+ purity. The wire is coated with high-temperature enamel insulation rated for the specific insulation class of your motor.`,
  grades: [
    { class: 'Class B', temp: '130°C', enamel: 'Polyester', applications: 'Standard duty motors' },
    { class: 'Class F', temp: '155°C', enamel: 'Polyesterimide', applications: 'Industrial motors, moderate VFD use' },
    { class: 'Class H', temp: '180°C', enamel: 'Polyamide-imide', applications: 'Inverter duty, high ambient' },
    { class: 'Class C', temp: '200°C+', enamel: 'Polyimide (Kapton)', applications: 'Extreme duty, traction motors' },
  ],
  gauges: [
    { swg: '10', diameter: '3.25mm', currentCapacity: '60A', use: 'Large motor main leads' },
    { swg: '12', diameter: '2.64mm', currentCapacity: '40A', use: 'Medium motor windings' },
    { swg: '14', diameter: '2.03mm', currentCapacity: '25A', use: 'Standard windings' },
    { swg: '16', diameter: '1.63mm', currentCapacity: '18A', use: 'Smaller motor windings' },
    { swg: '18', diameter: '1.22mm', currentCapacity: '12A', use: 'Small motors, coil forming' },
    { swg: '20', diameter: '0.91mm', currentCapacity: '8A', use: 'Fractional HP motors' },
    { swg: '22', diameter: '0.71mm', currentCapacity: '5A', use: 'Small coils, fan motors' },
    { swg: '24', diameter: '0.56mm', currentCapacity: '3A', use: 'Very small motors' },
  ],
  pricing: [
    { gauge: '10 SWG', pricePerKg: 2200, note: 'Heavy gauge for high current' },
    { gauge: '12 SWG', pricePerKg: 2250, note: 'Common for large motors' },
    { gauge: '14 SWG', pricePerKg: 2300, note: 'Most common gauge' },
    { gauge: '16 SWG', pricePerKg: 2350, note: 'Standard size' },
    { gauge: '18 SWG', pricePerKg: 2400, note: 'Medium motors' },
    { gauge: '20 SWG', pricePerKg: 2450, note: 'Smaller motors' },
    { gauge: '22 SWG', pricePerKg: 2500, note: 'Fine wire' },
    { gauge: '24 SWG', pricePerKg: 2550, note: 'Very fine wire' },
  ]
};

// Motor Types and Sizes
const MOTOR_TYPES = [
  {
    category: '3-Phase Induction Motors (Squirrel Cage)',
    description: 'Most common industrial motor type. Robust, reliable, and maintenance-free rotor.',
    sizes: '0.18kW - 500kW',
    voltages: '380V, 400V, 415V, 440V',
    applications: 'Pumps, fans, compressors, conveyors, machine tools',
    rewindCost: 'From KES 3,500/kW',
    turnaround: '2-5 days'
  },
  {
    category: '3-Phase Slip Ring Motors',
    description: 'Wound rotor allows external resistance for starting/speed control.',
    sizes: '5kW - 2000kW',
    voltages: '380V, 3.3kV, 6.6kV, 11kV',
    applications: 'Cranes, hoists, crushers, ball mills, large fans',
    rewindCost: 'From KES 5,000/kW',
    turnaround: '3-7 days'
  },
  {
    category: 'Single Phase Motors',
    description: 'For domestic and light commercial use. Includes capacitor start/run types.',
    sizes: '0.09kW - 3kW',
    voltages: '220V, 240V',
    applications: 'Water pumps, compressors, fans, washing machines',
    rewindCost: 'From KES 2,500 flat',
    turnaround: '1-2 days'
  },
  {
    category: 'Submersible Pump Motors',
    description: 'Sealed motors designed to operate underwater. Special insulation and seals.',
    sizes: '0.37kW - 150kW',
    voltages: '220V, 380V, 415V',
    applications: 'Borehole pumps, sewage pumps, drainage',
    rewindCost: 'From KES 4,000/kW',
    turnaround: '3-5 days'
  },
  {
    category: 'DC Motors',
    description: 'Direct current motors for variable speed applications.',
    sizes: '0.25kW - 500kW',
    voltages: '24V, 48V, 110V, 220V, 440V DC',
    applications: 'Cranes, traction, winders, extruders',
    rewindCost: 'From KES 6,000/kW',
    turnaround: '5-10 days'
  },
  {
    category: 'Servo & Stepper Motors',
    description: 'Precision motors for positioning applications.',
    sizes: '50W - 15kW',
    voltages: 'Various',
    applications: 'CNC machines, robotics, automation',
    rewindCost: 'Assessment required',
    turnaround: '7-14 days'
  },
  {
    category: 'High Voltage Motors',
    description: 'Medium voltage motors for heavy industry.',
    sizes: '100kW - 5000kW',
    voltages: '3.3kV, 6.6kV, 11kV',
    applications: 'Mining, cement, power generation',
    rewindCost: 'Quote on assessment',
    turnaround: '7-21 days'
  },
  {
    category: 'Explosion Proof (Ex) Motors',
    description: 'Certified for hazardous areas (Zone 1, Zone 2).',
    sizes: '0.37kW - 200kW',
    voltages: '380V, 415V, 440V',
    applications: 'Oil & gas, chemical plants, grain handling',
    rewindCost: 'From KES 7,000/kW',
    turnaround: '5-10 days'
  }
];

// Motor Size Categories with Pricing
const MOTOR_SIZES_PRICING = [
  // Single Phase
  { type: 'Single Phase', hp: '0.5 HP', kw: '0.37kW', rewindCost: '3,500', laborTime: '4 hours', copperWeight: '0.3kg', warranty: '6 months' },
  { type: 'Single Phase', hp: '1 HP', kw: '0.75kW', rewindCost: '4,500', laborTime: '5 hours', copperWeight: '0.5kg', warranty: '6 months' },
  { type: 'Single Phase', hp: '2 HP', kw: '1.5kW', rewindCost: '6,000', laborTime: '6 hours', copperWeight: '0.8kg', warranty: '6 months' },
  { type: 'Single Phase', hp: '3 HP', kw: '2.2kW', rewindCost: '7,500', laborTime: '7 hours', copperWeight: '1.2kg', warranty: '6 months' },
  // 3-Phase Small
  { type: '3-Phase', hp: '1 HP', kw: '0.75kW', rewindCost: '5,500', laborTime: '5 hours', copperWeight: '0.6kg', warranty: '8 months' },
  { type: '3-Phase', hp: '2 HP', kw: '1.5kW', rewindCost: '7,000', laborTime: '6 hours', copperWeight: '0.9kg', warranty: '8 months' },
  { type: '3-Phase', hp: '3 HP', kw: '2.2kW', rewindCost: '8,500', laborTime: '7 hours', copperWeight: '1.3kg', warranty: '8 months' },
  { type: '3-Phase', hp: '5 HP', kw: '3.7kW', rewindCost: '11,000', laborTime: '8 hours', copperWeight: '2kg', warranty: '8 months' },
  { type: '3-Phase', hp: '7.5 HP', kw: '5.5kW', rewindCost: '14,000', laborTime: '10 hours', copperWeight: '3kg', warranty: '8 months' },
  { type: '3-Phase', hp: '10 HP', kw: '7.5kW', rewindCost: '18,000', laborTime: '12 hours', copperWeight: '4kg', warranty: '10 months' },
  { type: '3-Phase', hp: '15 HP', kw: '11kW', rewindCost: '25,000', laborTime: '14 hours', copperWeight: '6kg', warranty: '10 months' },
  { type: '3-Phase', hp: '20 HP', kw: '15kW', rewindCost: '32,000', laborTime: '16 hours', copperWeight: '8kg', warranty: '10 months' },
  { type: '3-Phase', hp: '25 HP', kw: '18.5kW', rewindCost: '40,000', laborTime: '18 hours', copperWeight: '10kg', warranty: '10 months' },
  { type: '3-Phase', hp: '30 HP', kw: '22kW', rewindCost: '48,000', laborTime: '20 hours', copperWeight: '12kg', warranty: '10 months' },
  { type: '3-Phase', hp: '40 HP', kw: '30kW', rewindCost: '60,000', laborTime: '24 hours', copperWeight: '16kg', warranty: '10 months' },
  { type: '3-Phase', hp: '50 HP', kw: '37kW', rewindCost: '75,000', laborTime: '28 hours', copperWeight: '20kg', warranty: '10 months' },
  { type: '3-Phase', hp: '60 HP', kw: '45kW', rewindCost: '90,000', laborTime: '32 hours', copperWeight: '25kg', warranty: '10 months' },
  { type: '3-Phase', hp: '75 HP', kw: '55kW', rewindCost: '110,000', laborTime: '36 hours', copperWeight: '30kg', warranty: '10 months' },
  { type: '3-Phase', hp: '100 HP', kw: '75kW', rewindCost: '140,000', laborTime: '40 hours', copperWeight: '40kg', warranty: '10 months' },
  { type: '3-Phase', hp: '125 HP', kw: '90kW', rewindCost: '175,000', laborTime: '48 hours', copperWeight: '50kg', warranty: '10 months' },
  { type: '3-Phase', hp: '150 HP', kw: '110kW', rewindCost: '210,000', laborTime: '56 hours', copperWeight: '60kg', warranty: '10 months' },
  { type: '3-Phase', hp: '200 HP', kw: '150kW', rewindCost: '280,000', laborTime: '64 hours', copperWeight: '80kg', warranty: '10 months' },
  { type: '3-Phase', hp: '250 HP', kw: '185kW', rewindCost: '350,000', laborTime: '72 hours', copperWeight: '100kg', warranty: '10 months' },
  { type: '3-Phase', hp: '300 HP', kw: '220kW', rewindCost: '420,000', laborTime: '80 hours', copperWeight: '120kg', warranty: '10 months' },
  { type: '3-Phase', hp: '400 HP', kw: '300kW', rewindCost: '550,000', laborTime: '100 hours', copperWeight: '160kg', warranty: '10 months' },
  { type: '3-Phase', hp: '500 HP', kw: '375kW', rewindCost: '700,000', laborTime: '120 hours', copperWeight: '200kg', warranty: '10 months' },
];

// Shipping Information
const SHIPPING_INFO = {
  collection: [
    { region: 'Nairobi & Environs', cost: 'FREE collection for motors >5HP', time: 'Same day or next day' },
    { region: 'Central Kenya', cost: 'KES 2,000 - 5,000', time: '1-2 days' },
    { region: 'Mombasa', cost: 'KES 3,000 - 8,000 via SGR/Road', time: '1-2 days' },
    { region: 'Kisumu/Western', cost: 'KES 4,000 - 10,000', time: '2-3 days' },
    { region: 'Nakuru/Rift Valley', cost: 'KES 2,500 - 6,000', time: '1-2 days' },
    { region: 'Eldoret/North Rift', cost: 'KES 4,000 - 8,000', time: '2-3 days' },
    { region: 'Uganda', cost: 'Quote on request', time: '3-5 days' },
    { region: 'Tanzania', cost: 'Quote on request', time: '3-5 days' },
    { region: 'Rwanda', cost: 'Quote on request', time: '4-7 days' },
  ],
  packaging: [
    'Remove any attached fittings (pulleys, couplings) before shipping',
    'Protect shaft extension with cardboard or cloth',
    'Wrap motor in plastic if shipping by open truck',
    'Include nameplate data or photos with shipment',
    'Mark "FRAGILE - ELECTRIC MOTOR" on packaging',
  ],
  couriers: [
    'Wells Fargo (recommended for motors <50kg)',
    'G4S (secure transport)',
    'Kenya Bus Service (economical)',
    'Private courier (arrange pickup)',
    'Our own vehicle (for large motors)',
  ]
};

// Warranty Information
const WARRANTY_INFO = {
  standard: '6 months warranty on all rewinds',
  extended: '8-10 months for continuous duty applications',
  conditions: [
    'Motor must be installed and operated per manufacturer specifications',
    'Operating voltage within ±10% of nameplate',
    'Operating temperature within motor insulation class',
    'Proper motor protection (overload relay, fuses) must be in place',
    'Motor must not be subjected to flooding, excessive contamination, or mechanical damage',
    'VFD-driven motors must have appropriate filters/reactors if required',
  ],
  exclusions: [
    'Bearing failure due to misalignment or over/under greasing',
    'Mechanical damage to shaft or housing',
    'Damage from voltage spikes, lightning, or single-phasing',
    'Contamination from water, oil, or chemicals ingress',
    'Modifications made after rewinding',
  ],
  claims: [
    'Contact us within 7 days of fault discovery',
    'Return motor to our workshop for assessment',
    'Provide details of operating conditions and fault symptoms',
    'If fault is due to workmanship, free repair or refund',
    'If fault is due to operating conditions, repair at discounted rate',
  ]
};

const VFD_CONSIDERATIONS = [
  { issue: 'Bearing Currents', problem: 'VFD switching causes shaft voltage, bearing pitting', solution: 'Install shaft grounding ring, insulated bearings, or both' },
  { issue: 'Insulation Stress', problem: 'Voltage spikes from PWM damage windings', solution: 'Use inverter-duty motor (Class H) or install dV/dt filter' },
  { issue: 'Overheating', problem: 'Reduced cooling at low speeds', solution: 'Derate motor or add forced cooling for <40% speed operation' },
  { issue: 'Cable Reflections', problem: 'Long cables cause voltage doubling', solution: 'Keep cable <15m or install output filter/reactor' },
  { issue: 'Motor Noise', problem: 'Audible whine from PWM frequency', solution: 'Increase carrier frequency (watch heat) or accept noise' },
];

const FAULT_DATABASE = [
  { fault: 'Motor runs hot', causes: ['Overloaded', 'Low voltage', 'Poor ventilation', 'Single phasing', 'Bearing failure'], solution: 'Check load current, verify voltage, clean cooling, check all 3 phases, inspect bearings.' },
  { fault: 'Motor won\'t start', causes: ['No power', 'Mechanical bind', 'Open circuit', 'Starter fault', 'Low voltage'], solution: 'Check power supply, rotate shaft by hand, test windings, check contactor, verify voltage.' },
  { fault: 'Excessive vibration', causes: ['Misalignment', 'Unbalanced load', 'Bearing wear', 'Loose mounting', 'Electrical imbalance'], solution: 'Laser align, balance coupling, replace bearings, tighten bolts, check phase currents.' },
  { fault: 'Bearing failure', causes: ['Over-greasing', 'Under-greasing', 'Misalignment', 'Overloading', 'Bearing currents (VFD)'], solution: 'Follow grease schedule exactly, align properly, reduce load, install shaft grounding.' },
  { fault: 'Low insulation resistance', causes: ['Moisture', 'Contamination', 'Age deterioration', 'Overheating damage'], solution: 'Dry motor (heat lamp), clean windings, if <1MΩ after drying, rewind required.' },
  { fault: 'Tripping on overload', causes: ['Overloaded', 'Worn bearings', 'High ambient', 'Wrong relay setting', 'Voltage imbalance'], solution: 'Reduce load, check bearings, improve cooling, verify OL setting at 105% FLA.' },
];

export default function MotorsRewindingHub() {
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
      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image src="/images/15.png" alt="Motor Rewinding Workshop" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 80, 100, 0.3) 0%, rgba(255, 140, 50, 0.2) 100%)' }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(10, 25, 47, 0.5) 0%, rgba(20, 15, 10, 0.4) 100%)' }} />
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 180, 100, 0.3) 0%, transparent 60%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ opacity: heroOpacity, y: textY }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Professional Motor Rewinding Services</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">Motor Rewinding</span>
              <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">Complete Solutions</span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Kenya&apos;s leading motor rewinding service. All sizes from 0.5HP to 500HP. Grade A copper wire. 6-10 months warranty. Free collection in Nairobi.
            </motion.p>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-4 justify-center">
              <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Motor%20Rewinding%20Quote%20Request" label="WhatsApp Quote" />
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
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">

          {/* Overview Tab - 10 Paragraphs */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Guide to Electric Motor Rewinding</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Everything you need to know about motor repair, rewinding, and maintenance.</p>
              </div>

              <div className="space-y-8">
                {MOTOR_OVERVIEW.map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-cyan-500/30 p-6 md:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center">{idx + 1}</span>
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400 mb-3">{section.title}</h3>
                        <p className="text-gray-300 leading-relaxed text-justify">{section.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 text-center border border-amber-500/30">
                  <div className="text-3xl font-bold text-amber-400">2000+</div>
                  <div className="text-gray-400 text-sm">Motors Rewound</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 text-center border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400">98%</div>
                  <div className="text-gray-400 text-sm">Success Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 text-center border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400">2-5</div>
                  <div className="text-gray-400 text-sm">Days Turnaround</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 text-center border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400">10</div>
                  <div className="text-gray-400 text-sm">Months Warranty</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Diagnostics Tab */}
          {activeTab === 'diagnostics' && (
            <motion.div key="diagnostics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Diagnostic Tests</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional testing to assess motor condition and predict failures.</p>
              </div>
              <div className="space-y-4">
                {MOTOR_TESTS.map((test) => (
                  <div key={test.test} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h3 className="text-lg font-bold text-blue-400">{test.test}</h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full w-fit">{test.tool}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-400 block mb-1">Method</span><span className="text-gray-300">{test.method}</span></div>
                      <div><span className="text-green-400 block mb-1">Pass Criteria</span><span className="text-gray-300">{test.pass}</span></div>
                      <div><span className="text-red-400 block mb-1">Fail Indicates</span><span className="text-gray-300">{test.fail}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rewinding Process Tab */}
          {activeTab === 'rewinding' && (
            <motion.div key="rewinding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Motor Rewinding Process</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">18 detailed steps from reception to dispatch - professional rewinding restores motor to original specifications.</p>
              </div>

              {/* Process Diagram */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6 mb-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Rewinding Process Flow</h3>
                <div className="overflow-x-auto">
                  <pre className="text-xs md:text-sm text-gray-300 font-mono whitespace-pre">
{`
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           MOTOR REWINDING PROCESS FLOW                                │
└──────────────────────────────────────────────────────────────────────────────────────┘

  RECEPTION          TESTING           DISASSEMBLY        STRIPPING          CLEANING
  ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐
  │ MOTOR │ ──────▶ │ MEGGER│ ──────▶ │REMOVE │ ──────▶ │ BURN  │ ──────▶ │ CLEAN │
  │  IN   │         │ TESTS │         │ PARTS │         │  OUT  │         │ SLOTS │
  └───────┘         └───────┘         └───────┘         └───────┘         └───────┘
      │                 │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼                 ▼
  Document          Record            Save              Heat to           Remove
  nameplate         values            bearings          350°C             residue

  CORE TEST        SLOT INSUL        WINDING           INSERTION          CONNECTION
  ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐
  │ CORE  │ ──────▶ │ LINER │ ──────▶ │  NEW  │ ──────▶ │INSERT │ ──────▶ │ WIRE  │
  │ LOSS  │         │ NOMEX │         │ COILS │         │ COILS │         │ LEADS │
  └───────┘         └───────┘         └───────┘         └───────┘         └───────┘
      │                 │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼                 ▼
  Check for         Install           Wind on           Layer in          Connect
  hot spots         Class F/H         machine           slots             phases

  LACING             VPI               TESTING          ASSEMBLY          DISPATCH
  ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐
  │  TIE  │ ──────▶ │VARNISH│ ──────▶ │FINAL  │ ──────▶ │REBUILD│ ──────▶ │ READY │
  │ COILS │         │ IMPREG│         │ TEST  │         │ MOTOR │         │ ✓✓✓✓  │
  └───────┘         └───────┘         └───────┘         └───────┘         └───────┘
      │                 │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼                 ▼
  Brace end         Vacuum +          Hi-pot,           New               Certificate
  turns             pressure          surge             bearings          & warranty

`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                {REWINDING_PROCESS.map((step, idx) => (
                  <div key={step.step} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <span className="text-2xl mb-1">{step.icon}</span>
                      <span className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{step.step}</h4>
                      <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    </div>
                    <span className="text-amber-400 text-sm font-medium">{step.time}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Quality Indicators</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Same wire gauge and turns as original</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Insulation class equal or better (Class F or H)</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>VPI treatment for harsh environments</li>
                  </ul>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Full test report with baseline values</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>New premium bearings (SKF/FAG/NSK)</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>6-10 months warranty</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Motor Parts Tab */}
          {activeTab === 'parts' && (
            <motion.div key="parts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Parts & Components</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Understanding each component of an electric motor and its function.</p>
              </div>

              {/* Motor Cross Section Diagram */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-slate-500/30 p-6 mb-8">
                <h3 className="text-xl font-bold text-slate-300 mb-4">Electric Motor Cross-Section</h3>
                <div className="overflow-x-auto">
                  <pre className="text-xs md:text-sm text-gray-300 font-mono whitespace-pre">
{`
                    ELECTRIC MOTOR CROSS-SECTION DIAGRAM

           ┌─────────────────────────────────────────────────────┐
           │                    FAN COVER                        │
           │  ╔═════════════════════════════════════════════╗    │
           │  ║           COOLING FAN                       ║    │
           │  ╚═════════════════════════════════════════════╝    │
           │                        │                            │
    ───────┼────────────────────────┼────────────────────────────┼───────
           │  ┌─────────────────────┼─────────────────────┐      │
           │  │   END SHIELD (NDE)  │   END SHIELD (DE)   │      │
           │  │  ╔════════════════╗ │ ╔════════════════╗  │      │
           │  │  ║    BEARING     ║ │ ║    BEARING     ║  │      │
           │  │  ╚═══════╤════════╝ │ ╚═══════╤════════╝  │      │
           │  │          │          │         │           │      │
           │  │    ┌─────┴──────────┴─────────┴─────┐     │      │
           │  │    │         R O T O R              │     │      │
           │  │    │    ═══════════════════════     │     │      │
           │  │    │    ║ █ █ █ █ █ █ █ █ █ █ ║     │     │      │
           │  │    │    ║ █  ROTOR BARS    █ ║     │     │      │
           │  │    │    ║ █ █ █ █ █ █ █ █ █ █ ║     │     │      │
           │  │    │    ═══════════════════════     │     │──▶ SHAFT
           │  │    └────────────────────────────────┘     │      │
           │  │                                           │      │
           │  │  ╔═══════════════════════════════════╗    │      │
           │  │  ║         S T A T O R               ║    │      │
           │  │  ║  ┌───────────────────────────┐    ║    │      │
           │  │  ║  │ ████ COPPER WINDINGS ████ │    ║    │      │
           │  │  ║  │ ████ IN SLOTS        ████ │    ║    │      │
           │  │  ║  └───────────────────────────┘    ║    │      │
           │  │  ╚═══════════════════════════════════╝    │      │
           │  │                                           │      │
           │  │  ╔═══════════════════════════════════╗    │      │
           │  │  ║         MOTOR FRAME/HOUSING       ║    │      │
           │  │  ╚═══════════════════════════════════╝    │      │
           │  └───────────────────────────────────────────┘      │
           │                                                     │
           │            ┌──────────────────┐                     │
           │            │   TERMINAL BOX   │                     │
           │            │  U  V  W         │                     │
           │            │  X  Y  Z         │                     │
           │            └──────────────────┘                     │
           └─────────────────────────────────────────────────────┘

    LEGEND:
    ════  Stator laminations (silicon steel)
    █ █   Rotor bars (aluminum or copper)
    ████  Copper windings (enameled wire)

    AIR GAP: 0.3-1.5mm between rotor and stator
`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                {MOTOR_PARTS.map((part) => (
                  <div key={part.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-slate-500/30 overflow-hidden">
                    <button
                      onClick={() => setExpandedPart(expandedPart === part.name ? null : part.name)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${part.rewindable ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {part.rewindable ? 'Rewindable' : 'Replaceable'}
                        </span>
                        <h3 className="text-lg font-bold text-white">{part.name}</h3>
                      </div>
                      <span className={`text-gray-400 transition-transform ${expandedPart === part.name ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedPart === part.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-slate-400 font-medium mb-2">Description</h4>
                              <p className="text-gray-300 text-sm mb-4">{part.description}</p>
                              <h4 className="text-slate-400 font-medium mb-2">Function</h4>
                              <p className="text-gray-300 text-sm">{part.function}</p>
                            </div>
                            <div className="bg-black/50 rounded-lg p-4">
                              <h4 className="text-slate-400 font-medium mb-2">Component Diagram</h4>
                              <pre className="text-xs text-green-400 font-mono whitespace-pre overflow-x-auto">{part.diagram}</pre>
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

          {/* Copper Wire Tab */}
          {activeTab === 'copper' && (
            <motion.div key="copper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Copper Wire Specifications & Pricing</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">We use only Grade A electrolytic copper wire with 99.95%+ purity.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 rounded-xl border border-orange-500/30 p-6 mb-8">
                <p className="text-gray-300 leading-relaxed">{COPPER_WIRE_DATA.description}</p>
              </div>

              {/* Wire Grades */}
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Insulation Classes</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {COPPER_WIRE_DATA.grades.map((grade) => (
                    <div key={grade.class} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 p-4">
                      <div className="text-2xl font-bold text-orange-400 mb-1">{grade.class}</div>
                      <div className="text-white font-medium mb-2">{grade.temp} max</div>
                      <div className="text-sm text-gray-400 mb-2">Enamel: {grade.enamel}</div>
                      <div className="text-xs text-gray-500">{grade.applications}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wire Gauges */}
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Wire Gauge Reference (SWG)</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-orange-500/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-orange-400">SWG</th>
                          <th className="px-4 py-3 text-left text-orange-400">Diameter</th>
                          <th className="px-4 py-3 text-left text-orange-400">Current Capacity</th>
                          <th className="px-4 py-3 text-left text-orange-400">Typical Use</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COPPER_WIRE_DATA.gauges.map((gauge, idx) => (
                          <tr key={gauge.swg} className={idx % 2 === 0 ? 'bg-white/5' : ''}>
                            <td className="px-4 py-3 text-white font-medium">{gauge.swg}</td>
                            <td className="px-4 py-3 text-gray-300">{gauge.diameter}</td>
                            <td className="px-4 py-3 text-gray-300">{gauge.currentCapacity}</td>
                            <td className="px-4 py-3 text-gray-400">{gauge.use}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Current Copper Pricing */}
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Current Copper Wire Prices (February 2026)</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-orange-500/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-orange-400">Wire Gauge</th>
                          <th className="px-4 py-3 text-left text-orange-400">Price per Kg (KES)</th>
                          <th className="px-4 py-3 text-left text-orange-400">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COPPER_WIRE_DATA.pricing.map((item, idx) => (
                          <tr key={item.gauge} className={idx % 2 === 0 ? 'bg-white/5' : ''}>
                            <td className="px-4 py-3 text-white font-medium">{item.gauge}</td>
                            <td className="px-4 py-3 text-green-400 font-bold">KES {item.pricePerKg.toLocaleString()}</td>
                            <td className="px-4 py-3 text-gray-400">{item.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-amber-500/10 border-t border-orange-500/30">
                    <p className="text-sm text-amber-300">* Prices subject to change based on global copper market. Last updated: February 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Motor Types & Sizes Tab */}
          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Types & Sizes We Service</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">From small single-phase motors to large industrial high-voltage machines.</p>
              </div>

              <div className="space-y-6">
                {MOTOR_TYPES.map((type) => (
                  <div key={type.category} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-2">{type.category}</h3>
                    <p className="text-gray-400 mb-4">{type.description}</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <span className="text-gray-500 block">Sizes</span>
                        <span className="text-white font-medium">{type.sizes}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <span className="text-gray-500 block">Voltages</span>
                        <span className="text-white font-medium">{type.voltages}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <span className="text-gray-500 block">Applications</span>
                        <span className="text-white font-medium">{type.applications}</span>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <span className="text-green-400 block">Rewind Cost</span>
                        <span className="text-white font-medium">{type.rewindCost}</span>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <span className="text-blue-400 block">Turnaround</span>
                        <span className="text-white font-medium">{type.turnaround}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Rewinding Price List</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Transparent pricing for all motor sizes. Prices include copper wire, labor, new bearings, and VPI treatment.</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-green-500/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-green-400">Type</th>
                        <th className="px-4 py-3 text-left text-green-400">HP</th>
                        <th className="px-4 py-3 text-left text-green-400">kW</th>
                        <th className="px-4 py-3 text-left text-green-400">Rewind Cost (KES)</th>
                        <th className="px-4 py-3 text-left text-green-400">Labor Time</th>
                        <th className="px-4 py-3 text-left text-green-400">Copper (approx)</th>
                        <th className="px-4 py-3 text-left text-green-400">Warranty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOTOR_SIZES_PRICING.map((motor, idx) => (
                        <tr key={`${motor.type}-${motor.hp}`} className={idx % 2 === 0 ? 'bg-white/5' : ''}>
                          <td className="px-4 py-3 text-purple-400 font-medium">{motor.type}</td>
                          <td className="px-4 py-3 text-white font-medium">{motor.hp}</td>
                          <td className="px-4 py-3 text-gray-300">{motor.kw}</td>
                          <td className="px-4 py-3 text-green-400 font-bold">KES {motor.rewindCost}</td>
                          <td className="px-4 py-3 text-gray-300">{motor.laborTime}</td>
                          <td className="px-4 py-3 text-orange-400">{motor.copperWeight}</td>
                          <td className="px-4 py-3 text-emerald-400">{motor.warranty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30 p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">What&apos;s Included in Price</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Grade A copper wire (99.95% purity)</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Class F or H insulation materials</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>New premium bearings (SKF/FAG/NSK)</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>VPI varnish impregnation</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Full electrical testing</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Test certificate</li>
                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span>6-10 months warranty</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-500/30 p-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-4">Additional Services (Extra Cost)</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Dynamic balancing: KES 3,000-15,000</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Shaft repair/replacement: Quote</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Frame/housing repair: Quote</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Core repair (lamination): Quote</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Express service (24-48hr): +50%</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Inverter-grade upgrade: +20%</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">+</span>Collection/delivery: See shipping tab</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Send Your Motor From Anywhere</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">We accept motors from all over Kenya, Uganda, Tanzania, and Rwanda.</p>
              </div>

              {/* Collection Costs */}
              <div>
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Collection & Delivery Costs</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-indigo-500/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-indigo-500/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-indigo-400">Region</th>
                          <th className="px-4 py-3 text-left text-indigo-400">Cost</th>
                          <th className="px-4 py-3 text-left text-indigo-400">Transit Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SHIPPING_INFO.collection.map((item, idx) => (
                          <tr key={item.region} className={idx % 2 === 0 ? 'bg-white/5' : ''}>
                            <td className="px-4 py-3 text-white font-medium">{item.region}</td>
                            <td className="px-4 py-3 text-green-400">{item.cost}</td>
                            <td className="px-4 py-3 text-gray-300">{item.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Packaging Instructions */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/30 p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">How to Package Your Motor</h3>
                <ul className="space-y-3">
                  {SHIPPING_INFO.packaging.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Courier Options */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-indigo-500/30 p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Recommended Courier Services</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SHIPPING_INFO.couriers.map((courier, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                      <span className="text-indigo-400 text-xl">🚚</span>
                      <span className="text-gray-300">{courier}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact for Pickup */}
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/30 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Send Your Motor?</h3>
                <p className="text-gray-400 mb-6">Contact us to arrange collection or get shipping instructions.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Motor%20Pickup%20Request" label="WhatsApp Us" />
                  <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call for Pickup" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Warranty Tab */}
          {activeTab === 'warranty' && (
            <motion.div key="warranty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Our 6-10 Month Warranty</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Every rewound motor comes with our comprehensive warranty for your peace of mind.</p>
              </div>

              {/* Warranty Badges */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-2xl border border-emerald-500/30 p-8 text-center">
                  <div className="text-5xl font-bold text-emerald-400 mb-2">6</div>
                  <div className="text-xl text-white font-medium mb-2">Months Standard</div>
                  <div className="text-gray-400">For all standard rewinds</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-2xl border border-green-500/30 p-8 text-center">
                  <div className="text-5xl font-bold text-green-400 mb-2">10</div>
                  <div className="text-xl text-white font-medium mb-2">Months Extended</div>
                  <div className="text-gray-400">For continuous duty applications</div>
                </div>
              </div>

              {/* Warranty Conditions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-emerald-500/30 p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Warranty Conditions</h3>
                <ul className="space-y-2">
                  {WARRANTY_INFO.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-emerald-400">✓</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-red-500/30 p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">What&apos;s Not Covered</h3>
                <ul className="space-y-2">
                  {WARRANTY_INFO.exclusions.map((exclusion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-red-400">✗</span>
                      {exclusion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Claims Process */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">How to Make a Warranty Claim</h3>
                <ol className="space-y-3">
                  {WARRANTY_INFO.claims.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}

          {/* VFD Tab */}
          {activeTab === 'vfd' && (
            <motion.div key="vfd" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">VFD Integration Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Properly integrate motors with Variable Frequency Drives.</p>
              </div>
              <div className="space-y-4">
                {VFD_CONSIDERATIONS.map((item) => (
                  <div key={item.issue} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">{item.issue}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-500/10 rounded-lg p-4">
                        <span className="text-red-400 font-bold block mb-2">Problem</span>
                        <span className="text-gray-300">{item.problem}</span>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-4">
                        <span className="text-green-400 font-bold block mb-2">Solution</span>
                        <span className="text-gray-300">{item.solution}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Troubleshooting Tab */}
          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and resolve common motor problems.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.fault} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5">
                      <span className="text-white font-medium">{fault.fault}</span>
                      <span className={`text-gray-400 transition-transform ${expandedFault === fault.fault ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.fault && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div>
                              <h4 className="text-amber-400 font-bold mb-2">Possible Causes:</h4>
                              <div className="flex flex-wrap gap-2">
                                {fault.causes.map((c, i) => (
                                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>
                                ))}
                              </div>
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
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-3xl p-8 md:p-12 border border-amber-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Motor Rewinding Services?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Professional motor rewinding for all sizes. Grade A copper wire. 6-10 months warranty. Free collection in Nairobi for motors above 5HP.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Motor%20Rewinding%20Quote" size="lg" label="Get Free Quote" />
            <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" size="lg" label="Call Us Now" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Pickup" />
          </div>
        </div>
      </section>
    </main>
  );
}

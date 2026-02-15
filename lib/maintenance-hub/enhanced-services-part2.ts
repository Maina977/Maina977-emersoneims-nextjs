/**
 * Enhanced Maintenance Hub Services Data - Part 2
 * Motor Rewinding, Borehole Pumps, UPS Power Services
 */

import { EnhancedServiceCategory } from './enhanced-services-data';

export const ENHANCED_SERVICES_PART2: EnhancedServiceCategory[] = [
  {
    id: 'motor-rewinding',
    name: 'Motor Rewinding',
    icon: '🔄',
    iconBg: 'from-green-500 to-emerald-600',
    shortDescription: 'Professional motor rewinding services for AC motors, DC motors, submersible pumps, and industrial drives.',
    fullDescription: {
      overview: `Motor rewinding is a specialized service that restores electric motors to their original performance specifications at a fraction of the replacement cost. At Emerson EiMS, our motor rewinding division has processed over 500 motors monthly for the past decade, earning us recognition as Kenya's leading motor repair facility. Our expertise spans single-phase domestic motors from 0.5 HP through industrial three-phase units exceeding 500 HP, as well as specialized applications including submersible pump motors, DC motors, and servo motors.

The economics of motor rewinding are compelling for any motor above 10 HP. A quality rewind typically costs 40-60% of a new motor, can be completed faster than new motor delivery, and maintains the exact mounting dimensions and electrical characteristics of the original motor. This eliminates costly modifications to mounting bases, electrical connections, and control systems that would be required if replacing with a different brand or model. For critical applications where specific motor characteristics are required, rewinding is often the only practical option.

Our motor shop is equipped with state-of-the-art winding machines, dynamic balancing equipment, and comprehensive testing facilities. We use only premium grade winding wire meeting IEC and NEMA standards, Class F or Class H insulation systems for extended temperature capability, and vacuum pressure impregnation (VPI) for superior moisture resistance. Every rewound motor undergoes full electrical testing including insulation resistance, hipot testing, and no-load current verification before release.

Beyond rewinding, we provide comprehensive motor repair services including bearing replacement, shaft repair or replacement, fan and fan cover replacement, and terminal box repair. Our machine shop capabilities include shaft grinding, sleeve fitting, and keyway repair. For motors damaged by bearing failure, we can resurface bearing journals and install replacement sleeves that restore factory tolerances.`,

      technicalDetails: `The rewinding process begins with thorough documentation of the original winding configuration. Our technicians record the number of poles, coil pitch, turns per coil, wire gauge, connection pattern (star or delta), and insulation class. This data is critical for producing a rewind that matches original motor performance. We also document any modifications or previous repairs that might affect the rewind specification.

Stripping the old winding requires careful technique to avoid damaging the laminated core. We use controlled temperature burnout ovens that remove insulation and varnish without exceeding the Curie temperature of the core material. Excessive heat during stripping can permanently degrade the magnetic properties of the core, reducing motor efficiency. After stripping, cores are cleaned and tested for interlaminar insulation damage using a core loss tester.

Winding quality depends on precision in every step. Coils are wound on precision forms to ensure consistent turn count and proper shape for insertion. Slot insulation (nomex or equivalent) is cut and inserted before coil placement. Coils are carefully inserted and wedged in place, then connected according to the recorded pattern. Phase insulation separates the phase groups, and leads are attached with crimped and soldered connections.

The varnish treatment process dramatically affects motor longevity. We use vacuum pressure impregnation (VPI) where the wound stator is placed in a vacuum chamber, impregnated with premium varnish under vacuum to ensure penetration, then pressurized to force varnish into all spaces. The result is a solid, void-free insulation system that resists moisture, chemicals, and vibration. After baking to cure the varnish, the stator is ready for testing.`,

      serviceScope: `Our motor rewinding services cover the complete range of electric motor types used in Kenyan industry. Single-phase capacitor start, capacitor run, and split-phase motors for pumps, compressors, and general industrial equipment are our highest volume items. Three-phase squirrel cage induction motors from 1 HP to 500 HP form the backbone of industrial motor repair, including high efficiency (IE2/IE3) motors that require special attention to maintain their efficiency rating after rewind.

Submersible pump motors require specialized expertise due to their hermetically sealed construction. We handle both wet-rotor (water-lubricated) and oil-filled designs from all major manufacturers. Submersible motor repair includes seal replacement, thrust bearing service, and cable termination in addition to rewinding. Our controlled environment workshop prevents contamination that could cause premature failure of these sealed motors.

DC motors including wound field, permanent magnet, and universal motors are increasingly rare but still critical in many applications. We maintain the specialized skills and materials for DC motor repair including armature rewinding, field coil replacement, commutator resurfacing, and brush holder repair. DC motor repair often requires fabrication of replacement parts that are no longer available.

Special purpose motors including brake motors, variable speed motors, high slip motors, and explosion-proof motors require understanding of their unique characteristics. We maintain documentation on special motor types and can often source OEM winding data when not evident from inspection. Explosion-proof motors require special attention to ensure that housings and leads maintain their certification after repair.`,

      whyChooseUs: `Our investment in quality equipment and training sets us apart from competitors who offer "bargain" rewinds that fail prematurely. The motor rewinding industry unfortunately includes operators who cut corners - using substandard wire, omitting proper varnish treatment, or skipping critical tests. These inferior rewinds may cost less initially but fail within months, costing far more in the long run through repeated repairs and production downtime.

Every motor rewound at Emerson EiMS is backed by our comprehensive warranty. We guarantee our workmanship and materials for 12 months under normal operating conditions. Our warranty covers return, diagnosis, and repair at no charge if the motor fails due to winding defects. This warranty reflects our confidence in our quality processes and our commitment to customer satisfaction.

Our turnaround time for standard rewinds is typically 2-3 working days, with express service available for critical motors. We maintain inventory of common wire gauges and insulation materials to avoid delays waiting for supplies. Our workshop operates extended hours during peak seasons to accommodate urgent customer needs. For planned maintenance shutdowns, we can arrange pickup, rewind, and delivery to minimize motor downtime.

Beyond rewinding, our motor services include on-site troubleshooting, vibration analysis, thermal imaging, and motor efficiency testing. These diagnostic services help identify motors that are candidates for rewinding before catastrophic failure occurs. We can also advise on whether a motor should be rewound or replaced based on its age, condition, and replacement cost.`,

      industryApplications: `Water utilities and pump stations rely on our motor rewinding services to maintain their submersible and surface pump motors. We have long-term contracts with county water authorities and private water companies throughout Kenya. Our ability to quickly turn around pump motor repairs minimizes water service disruptions that affect thousands of residents.

Food processing and agricultural industries depend on motors for conveyors, mixers, grinders, and refrigeration. These applications often require motors that meet food-grade cleanliness standards. We understand the hygiene requirements and ensure that motors returned to food processing environments are properly cleaned and sealed.

Manufacturing facilities use motors in every aspect of their operations. We provide maintenance contracts that include scheduled motor inspections, predictive maintenance testing, and priority rewinding service. These contracts help manufacturers avoid unplanned downtime and budget for motor maintenance expenses.

Building management and HVAC systems use numerous motors for fans, pumps, and compressors. We service motors for chiller plants, cooling towers, air handling units, and building water systems. Our technicians understand the critical nature of these systems and the need for rapid turnaround to maintain building comfort.`
    },
    href: '/services#motors',
    color: 'from-green-600/20 to-emerald-700/20',
    glowColor: 'shadow-green-500/20',
    features: ['AC Motor Rewinding', 'DC Motor Repair', 'Submersible Motors', 'VFD Compatible', 'Dynamic Balancing', 'Vacuum Impregnation', 'Core Testing', '12-Month Warranty'],
    stats: { value: '500+', label: 'Motors Monthly' },
    subServices: [
      {
        name: 'Single Phase Rewinding',
        description: 'Complete rewinding service for capacitor start, capacitor run, and split-phase motors used in pumps, compressors, and general equipment.',
        benefits: ['Same-day service available', 'Premium materials', 'Full testing', 'Warranty included']
      },
      {
        name: 'Three Phase Rewinding',
        description: 'Industrial three-phase motor rewinding from 1 HP to 500 HP including high-efficiency motors.',
        benefits: ['Maintain efficiency rating', 'VPI treatment', 'Dynamic balancing', 'Comprehensive testing']
      },
      {
        name: 'DC Motor Armature',
        description: 'Specialized DC motor repair including armature rewinding, commutator service, and brush replacement.',
        benefits: ['Rare expertise', 'Part fabrication', 'Complete restoration', 'Performance testing']
      },
      {
        name: 'Submersible Motor Seals',
        description: 'Submersible pump motor repair including seal replacement, bearing service, and cable termination.',
        benefits: ['Controlled environment', 'OEM seals available', 'Pressure testing', 'Extended warranty']
      },
      {
        name: 'Bearing Replacement',
        description: 'Motor bearing service including removal, cleaning, inspection, and replacement with quality bearings.',
        benefits: ['Premium bearings', 'Proper fitting', 'Alignment check', 'Vibration testing']
      },
      {
        name: 'Shaft Repair',
        description: 'Motor shaft restoration including grinding, sleeving, and keyway repair.',
        benefits: ['Machine shop capability', 'Precision work', 'OEM tolerances', 'Balance maintained']
      },
      {
        name: 'VFD Motor Conversion',
        description: 'Modification of standard motors for variable frequency drive operation with appropriate insulation.',
        benefits: ['Inverter-duty insulation', 'Bearing protection', 'Extended life', 'Efficiency maintained']
      },
      {
        name: 'High Voltage Motors',
        description: 'Rewinding service for medium voltage motors from 3.3kV to 11kV.',
        benefits: ['Specialized expertise', 'High-pot testing', 'Premium insulation', 'Certified technicians']
      }
    ],
    detailedProblems: [
      {
        issue: 'Motor Overheating',
        symptoms: ['Motor too hot to touch', 'Tripping on thermal overload', 'Burning smell', 'Reduced output power'],
        detailedSolution: `Motor overheating is a serious condition that indicates either excessive load, inadequate cooling, or winding deterioration. Continued operation with overheating dramatically shortens insulation life - every 10°C above rated temperature reduces insulation life by approximately 50%. Understanding the cause of overheating is essential for proper repair and prevention of recurrence.

Overload is the most common cause of motor overheating. When a motor is asked to deliver more power than its rating, current increases proportionally, and I²R losses in the windings generate excess heat. Check the driven load for mechanical problems such as seized bearings, misalignment, or increased friction from worn components. Verify that the motor is properly sized for the application - motors should operate at 75-90% of rated load for optimal efficiency and temperature.

Cooling system problems prevent heat dissipation even when electrical operation is normal. External fan motors on TEFC (Totally Enclosed Fan Cooled) motors can fail, and the internal fan is often overlooked during service. Fan blades can break or become coated with debris that reduces airflow. Fan covers can become clogged with dust and debris. Ensure adequate clearance around the motor for air circulation, and verify that any external cooling is functioning.

Voltage imbalance in three-phase systems causes significant additional heating even at modest levels. A 3.5% voltage imbalance can increase motor temperature rise by 25%. Measure voltage on all three phases under load and calculate imbalance as a percentage of the average voltage. Imbalance often results from unequal single-phase loads on the supply transformer or from poor connections in the power distribution system.

Winding deterioration from age, contamination, or previous damage reduces insulation thermal conductivity and can create hot spots within the winding. Increased winding resistance due to turn-to-turn shorts also generates additional heat. If external causes are eliminated and the motor continues to overheat, internal inspection and possible rewinding are indicated.

Single-phasing occurs when one phase of a three-phase motor loses power, causing the remaining phases to carry increased current. The motor may continue to run but at reduced torque and dramatically increased temperature. Single-phasing is extremely destructive and can burn out a motor in minutes under load. Check for blown fuses, open contactors, or broken connections if overheating occurs suddenly.`,
        diagnosticSteps: [
          'Measure motor temperature with infrared thermometer or thermocouple',
          'Measure current on all phases and compare to nameplate rating',
          'Measure voltage on all phases and calculate imbalance',
          'Check driven load for mechanical problems',
          'Verify cooling fan operation and airflow',
          'Clean fan cover and ensure adequate clearance around motor',
          'Measure winding resistance and compare phases',
          'Check thermal overload setting and operation',
          'Inspect motor for contamination or damage',
          'Consider load testing to verify behavior under controlled conditions'
        ],
        repairProcedure: [
          'Reduce load if motor is undersized for application',
          'Clean cooling system - fan, fan cover, motor surface',
          'Replace fan if damaged or worn',
          'Correct voltage imbalance at supply source',
          'Replace thermal overload if not protecting properly',
          'If windings are damaged, rewinding is required',
          'Consider upgrading to higher service factor motor if overloading is unavoidable',
          'Install proper motor protection relay with phase monitoring'
        ],
        preventionTips: [
          'Size motors with appropriate service factor for application',
          'Maintain cleanliness of motor and cooling system',
          'Monitor motor temperature during operation',
          'Install motor protection relays with current and temperature monitoring',
          'Correct power quality issues promptly',
          'Ensure proper alignment and coupling condition',
          'Follow manufacturer\'s maintenance recommendations'
        ],
        estimatedTime: '2-5 days if rewinding required',
        estimatedCost: 'KES 8,000 - 65,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Infrared thermometer', 'Clamp meter', 'Multimeter', 'Megger tester', 'Vibration analyzer']
      },
      {
        issue: 'Motor Not Starting',
        symptoms: ['Motor hums but won\'t turn', 'No response to start command', 'Trips breaker immediately', 'Starts slowly with reduced torque'],
        detailedSolution: `Motor starting failures frustrate production and require systematic diagnosis to identify the root cause. The failure to start can originate in the power supply, motor starter, motor windings, mechanical load, or any combination of these. A methodical approach efficiently isolates the problem without wasting time on unnecessary tests.

Electrical supply problems are the first checkpoint. Verify that voltage is present at all three phases of the motor terminals with the starter energized. Low voltage will cause slow starting and overheating; missing phases will cause failure to start or operation at reduced capacity. Check fuses, contactors, and overload relays in the starter circuit. Reset any tripped overloads after investigating the cause of the trip.

For single-phase motors, capacitor failure is a common starting problem. Start capacitors provide additional starting torque and often fail from heat or age. A failed start capacitor results in humming without rotation or very slow, weak starting. Run capacitors maintain power factor during operation; their failure may allow starting but causes reduced efficiency and overheating. Capacitors can be tested with a capacitance meter and should be replaced if significantly below rated value.

Mechanical binding can prevent motor starting even when electrical systems are functional. Try rotating the motor shaft by hand (with power disconnected) to check for seized bearings, locked rotor, or load mechanical problems. Bearings that have failed due to loss of lubrication or contamination can lock the rotor in position. Pump motors can experience hydraulic lock if the impeller is blocked with debris.

Winding faults including open circuits, short circuits, or grounds can prevent starting or cause immediate tripping. Measure winding resistance on all phases; readings should be equal within 5% and match expected values for the motor size. Test insulation resistance between windings and to ground using a megger; readings below 1 megohm indicate contamination or insulation breakdown requiring cleaning or rewinding.

Centrifugal switch faults in single-phase motors prevent switching from start to run winding configuration. If the switch fails to close, the motor won't start at all. If the switch fails to open, the start winding overheats and burns out quickly. Listen for the distinctive click of the centrifugal switch at approximately 75% of full speed during starting.`,
        diagnosticSteps: [
          'Check for voltage at motor terminals with starter energized',
          'Verify all three phases present with no blown fuses',
          'Test overload relay and reset if tripped',
          'Try rotating shaft by hand with power disconnected',
          'Measure winding resistance on all phases',
          'Test insulation resistance to ground',
          'Check capacitors on single-phase motors',
          'Verify starter contactor is pulling in fully',
          'Check for mechanical load problems',
          'Listen for centrifugal switch operation on single-phase motors'
        ],
        repairProcedure: [
          'Replace blown fuses after determining cause',
          'Replace failed contactor or overload relay',
          'Replace failed capacitor with correct rating',
          'Replace seized bearings',
          'Clear any mechanical blockage in load',
          'Clean and dry motor if insulation resistance is low',
          'Rewind motor if winding faults are found',
          'Replace centrifugal switch if defective',
          'Verify correct rotation after any starter modifications'
        ],
        preventionTips: [
          'Install motor protection relay with proper settings',
          'Maintain starter components according to schedule',
          'Lubricate bearings as specified by manufacturer',
          'Protect motor from contamination and moisture',
          'Don\'t attempt repeated starts on a motor that won\'t start',
          'Investigate trip causes before resetting overloads',
          'Consider soft starter for motors with high starting current'
        ],
        estimatedTime: '1-3 days if rewinding required',
        estimatedCost: 'KES 3,000 - 45,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Multimeter', 'Megger tester', 'Capacitance meter', 'Clamp meter', 'Hand tools']
      },
      {
        issue: 'Excessive Vibration',
        symptoms: ['Visible shaking during operation', 'Loud noise', 'Bearing temperature increase', 'Loosening of mounting bolts'],
        detailedSolution: `Motor vibration accelerates wear on bearings, couplings, and mechanical components throughout the driven system. Excessive vibration indicates imbalance, misalignment, bearing problems, or electrical faults that should be corrected to prevent premature failure. Vibration analysis is a powerful diagnostic tool that can identify the specific cause of vibration and guide corrective action.

Mechanical imbalance occurs when the rotor mass is not evenly distributed around the axis of rotation. Imbalance can result from manufacturing variations, damage to fan blades, loss of balancing weights, or uneven wear. The vibration from imbalance occurs at the rotational frequency (1X) and increases with speed squared. Balancing requires adding or removing weight from the rotor to bring the center of mass onto the axis of rotation.

Misalignment between motor and driven equipment creates vibration at both 1X and 2X rotational frequency. Angular misalignment occurs when shaft centerlines intersect at an angle; parallel misalignment occurs when centerlines are parallel but offset. Modern coupling designs can tolerate some misalignment, but they are not designed to operate continuously with significant misalignment. Laser alignment tools provide accurate measurement and guidance for correction.

Bearing defects produce characteristic vibration signatures that identify the type and severity of damage. Ball pass frequency of the outer race (BPFO), ball pass frequency of the inner race (BPFI), ball spin frequency (BSF), and fundamental train frequency (FTF) can all be identified in vibration spectra. Early detection of bearing faults allows scheduled replacement before catastrophic failure.

Electrical faults including unbalanced magnetic pull, broken rotor bars, and stator winding faults can cause vibration. Electrical faults often produce vibration at twice line frequency (100 Hz in Kenya's 50 Hz system). The vibration from electrical faults may change when load is applied or removed, distinguishing them from mechanical faults that are load-independent. Motor current signature analysis can confirm electrical faults identified through vibration analysis.

Resonance occurs when exciting forces from the motor match the natural frequency of the supporting structure. Resonance dramatically amplifies vibration even from small forcing inputs. Resonance problems can appear suddenly when motor speed is changed or when structural modifications alter the natural frequency. Solutions include changing motor speed, stiffening or softening the support structure, or adding damping.`,
        diagnosticSteps: [
          'Measure vibration levels with portable analyzer',
          'Compare to ISO 10816 standards for machinery vibration',
          'Analyze vibration spectrum to identify frequency components',
          'Check shaft alignment with laser alignment tool',
          'Inspect coupling condition and installation',
          'Check bearing condition by temperature and sound',
          'Verify motor mounting is secure and level',
          'Test motor uncoupled to isolate motor from load',
          'Check for electrical faults using current analysis',
          'Evaluate structural response to motor vibration'
        ],
        repairProcedure: [
          'Balance rotor using dynamic balancing machine',
          'Correct alignment using precision methods',
          'Replace worn or damaged coupling',
          'Replace bearings that show defect signatures',
          'Tighten or repair loose motor mounting',
          'Repair electrical faults (may require rewinding)',
          'Modify support structure to avoid resonance',
          'Replace damaged fan or fan cover',
          'Verify correction with post-repair vibration measurement'
        ],
        preventionTips: [
          'Include vibration measurement in regular maintenance',
          'Set alarm levels based on baseline measurements',
          'Verify alignment after any equipment moves',
          'Replace bearings proactively before failure',
          'Don\'t ignore increasing vibration levels',
          'Maintain coupling lubrication where required',
          'Ensure adequate motor mounting stiffness'
        ],
        estimatedTime: '1-2 days',
        estimatedCost: 'KES 5,000 - 35,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Vibration analyzer', 'Laser alignment tool', 'Stroboscope', 'Balancing machine', 'Thermal camera']
      },
      {
        issue: 'Burning Smell from Motor',
        symptoms: ['Smoke or smell of burning insulation', 'Discolored windings', 'Extreme heat', 'Motor stopped or running rough'],
        detailedSolution: `A burning smell from an electric motor is an emergency indication of serious winding damage. The smell comes from overheated or burning insulation, which indicates that winding temperatures have far exceeded their rated limits. Immediate shutdown is required to prevent fire and limit damage. Most motors producing a burning smell will require rewinding; continued operation guarantees total destruction.

Insulation failure is the ultimate result of any condition that causes sustained overtemperature. Once insulation begins to break down, it becomes conductive, allowing current to flow between turns or to ground. This shorts out portions of the winding, causing even more current to flow through the remaining turns, accelerating the destruction. What starts as localized heating quickly cascades to complete winding failure.

The cause of the overheating must be identified and corrected before putting a rewound motor back in service. Simply rewinding without addressing the root cause will result in another failure. Common causes include overload, voltage imbalance, single phasing, blocked ventilation, bearing failure, and previous poor-quality repairs. All of these should be investigated before restarting.

Inspection of the burned motor can provide clues to the failure mode. Uniform darkening across all phases suggests overload or blocked ventilation. Darkening concentrated in one phase suggests single phasing or phase imbalance. Localized damage at specific coils suggests contamination or physical damage to insulation. Pattern of damage helps determine what preventive measures are needed.

After rewinding, installation should include protective measures to prevent recurrence. Motor protection relays that monitor current, temperature, and voltage balance can shut down the motor before damage occurs. Improved ventilation, reduced load, or a larger motor may be required. Regular monitoring after restart ensures that the problem has truly been resolved.

Fire response may be needed if the motor actually ignites. Electrical fires should be fought with Class C or ABC extinguishers, never water. Disconnect power before attempting to extinguish. Evacuate the area if fire cannot be quickly controlled. Report all motor fires to management for investigation and prevention of recurrence.`,
        diagnosticSteps: [
          'Immediately disconnect power to prevent fire',
          'Allow motor to cool before inspection',
          'Inspect windings for pattern of damage',
          'Check for evidence of contamination or physical damage',
          'Review operating history - load, duty cycle, environment',
          'Test incoming power for voltage, balance, and phase sequence',
          'Inspect starter components for proper operation',
          'Check motor nameplate against application requirements',
          'Look for evidence of previous repairs or modifications',
          'Document everything for warranty and insurance purposes'
        ],
        repairProcedure: [
          'Complete rewinding is required - partial repair is not possible',
          'Clean and test core before rewinding',
          'Consider upgrading insulation class for higher temperature margin',
          'Replace bearings regardless of apparent condition',
          'Address root cause before returning to service',
          'Install motor protection relay with appropriate settings',
          'Improve ventilation if environment contributed to failure',
          'Consider upgrading to larger motor if overloaded',
          'Document repair and root cause for future reference'
        ],
        preventionTips: [
          'Install motor protection relay on all critical motors',
          'Don\'t ignore warning signs - heat, noise, vibration',
          'Maintain clean operating environment',
          'Keep ventilation paths clear',
          'Don\'t exceed motor rated load or duty cycle',
          'Address power quality problems promptly',
          'Respond to thermal overload trips - don\'t just reset',
          'Investigate any unusual motor behavior'
        ],
        estimatedTime: '3-7 days for rewind',
        estimatedCost: 'KES 15,000 - 120,000',
        difficultyLevel: 'Expert',
        toolsRequired: ['Inspection equipment', 'Winding machine', 'VPI system', 'Testing equipment', 'Documentation']
      }
    ],
    turnaroundTime: '2-5 days for standard rewinds, express service available',
    priceRange: 'KES 5,000 - 200,000',
    requiredTools: [
      { name: 'Megger Tester', purpose: 'Measure insulation resistance between windings and to ground', importance: 'Essential' },
      { name: 'Winding Machine', purpose: 'Produce consistent, precise coils for motor winding', importance: 'Essential' },
      { name: 'Dynamic Balancer', purpose: 'Measure and correct rotor imbalance', importance: 'Essential' },
      { name: 'VPI System', purpose: 'Vacuum pressure impregnation for superior insulation', importance: 'Essential' },
      { name: 'Core Loss Tester', purpose: 'Verify stator core integrity after stripping', importance: 'Recommended' },
      { name: 'Surge Tester', purpose: 'Detect turn-to-turn shorts in windings', importance: 'Recommended' },
      { name: 'Bearing Puller/Press', purpose: 'Proper removal and installation of bearings', importance: 'Essential' },
      { name: 'Vibration Analyzer', purpose: 'Diagnose and verify mechanical condition', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'Electrical Isolation',
        icon: '⚡',
        importance: 'Critical',
        overview: 'Motors must be completely disconnected before service. Stored energy in motor windings and capacitors can cause shock.',
        detailedExplanation: `Electric motors can retain electrical energy even after disconnection from power supply. Single-phase motors with capacitors are particularly hazardous because the capacitors can hold charge for extended periods. Three-phase motors can have residual magnetism that generates voltage when rotated, and large motors can coast for extended periods after disconnection. Always verify zero energy before beginning work.

Disconnect the motor at the power supply, not just at the starter. Open and lock out the main breaker feeding the motor circuit. If the motor has local disconnects, open and lock those as well. Use a lock-out tag-out procedure that ensures the motor cannot be energized while work is in progress. Each person working on the motor should attach their personal lock.

Capacitors in single-phase motors should be discharged before handling. Use a resistor (typically 10-20 kilohms, rated for capacitor voltage) connected across the capacitor terminals to safely dissipate stored energy. Never short-circuit capacitors directly - the instantaneous discharge can weld contacts and spray metal fragments. Wait for at least 1 minute after discharge before handling.

Test for voltage before touching any conductors. Use a properly rated voltage tester that you have verified is working by testing on a known energized source. Test all phases and the ground conductor. Remember that motor terminals may be at different potential than the wiring in conduits due to internal connections.

During testing that requires the motor to be energized, maintain proper clearances from rotating parts and electrical connections. Use proper test equipment rated for the voltages involved. Never bypass protective devices or safety interlocks for testing purposes. Have emergency stop means immediately available.`,
        procedures: [
          'Disconnect motor at main power source',
          'Apply personal lock and tag',
          'Discharge capacitors through proper resistor',
          'Test for zero voltage at motor terminals',
          'Test for zero voltage in motor terminal box',
          'Verify motor shaft has stopped rotating',
          'Ground motor frame to ensure no potential differences',
          'Maintain isolation until work is complete',
          'Remove locks/tags only when safe to do so',
          'Verify all personnel clear before re-energizing'
        ],
        commonMistakes: [
          'Assuming motor is safe because starter is off',
          'Not discharging capacitors before handling',
          'Not verifying voltage tester is working',
          'Removing locks before all work is complete',
          'Not grounding motor frame during service',
          'Bypassing interlocks for convenience'
        ],
        emergencyProtocol: 'For electrical shock: Don\'t touch victim - use insulated object to separate from source. Call emergency services. Begin CPR if victim not breathing. Treat any burns after victim is clear of electrical source.'
      },
      {
        title: 'Mechanical Hazards',
        icon: '⚙️',
        importance: 'Critical',
        overview: 'Motor rotors, fans, and couplings can cause severe injury. Secure all rotating parts before service.',
        detailedExplanation: `Motor rotors store significant kinetic energy when spinning and can take considerable time to coast to a stop, especially large motors or those with high-inertia loads. During this coasting period, the motor remains dangerous. Never touch coupling areas, shaft extensions, or fan covers until the motor has completely stopped rotating.

Coupling work requires special attention because it often takes place in the overlap zone between motor and driven equipment. Ensure both machines are isolated and locked out. Even after isolation, couplings can be mechanically loaded by the driven equipment and may move unexpectedly when loosened. Support heavy coupling halves before removing bolts.

Bearing work involves pressing operations that can result in sudden movement of the rotor or ejection of bearing components. Use proper bearing pullers and presses designed for the task. Support the rotor adequately during bearing removal to prevent it from falling. Wear face shields during pressing operations in case of component failure.

Lifting motors requires assessment of motor weight and proper rigging. Motors are compact and heavy, with high center of gravity that can cause tipping. Use lifting eyes if provided - these are designed for the motor's weight and center of gravity. Never lift by the conduit box or shaft. Verify that lifting equipment is rated for the motor weight plus a safety factor.

Heat hazards exist during and after burnout oven operations. Stators removed from burnout ovens can be over 400°C and take hours to cool. Handle with appropriate heat-resistant gloves and allow adequate cooling before further operations. The cooling process releases fumes from decomposing insulation; ensure adequate ventilation.`,
        procedures: [
          'Verify motor has completely stopped before service',
          'Lock coupling so it cannot rotate from driven equipment',
          'Support rotor during bearing removal',
          'Use proper bearing tools - pullers and presses',
          'Wear face shield during pressing operations',
          'Use appropriate lifting equipment for motor weight',
          'Lift only by designated lifting points',
          'Allow adequate cooling after burnout oven',
          'Wear heat-resistant gloves when handling hot components',
          'Ensure adequate ventilation during thermal processes'
        ],
        commonMistakes: [
          'Starting work before motor has completely stopped',
          'Not supporting rotor during bearing removal',
          'Using improvised tools for bearing work',
          'Underestimating motor weight for lifting',
          'Lifting by conduit box or shaft',
          'Handling oven-hot components without protection'
        ],
        emergencyProtocol: 'For crush injuries: Don\'t attempt to reverse equipment. Call emergency services. Control bleeding with direct pressure. For burns: Cool with running water for 20 minutes. Cover with clean dressing. Seek medical attention for any significant burn.'
      },
      {
        title: 'Chemical Safety',
        icon: '🧪',
        importance: 'High',
        overview: 'Motor rewinding involves varnishes, solvents, and cleaning chemicals that require proper handling.',
        detailedExplanation: `Electrical insulating varnishes contain solvents and resins that can cause health effects with prolonged exposure. Vapors can irritate eyes and respiratory system, and some components are suspected carcinogens. Always work in well-ventilated areas when applying varnish or during oven curing. Respiratory protection may be required depending on exposure levels.

Solvents used for cleaning motor components include acetone, MEK, and specialty electrical cleaners. These are flammable, can be absorbed through skin, and have vapor hazards. Store in approved containers away from ignition sources. Use in ventilated areas with appropriate personal protective equipment. Dispose of waste solvents according to environmental regulations.

Cleaning chemicals for degreasing motor components range from relatively safe aqueous cleaners to hazardous chlorinated solvents. Read and follow Safety Data Sheets (SDS) for all chemicals used. Some cleaning chemicals are incompatible with certain motor materials and can cause damage - verify compatibility before use.

Lead was historically used in motor bearings and solder. While modern motors typically don't contain lead, older motors being rewound may have lead-containing components. Test for lead when working on older motors and follow appropriate precautions if present. Never burn or grind lead-containing components.

The burnout oven process releases decomposition products from insulation materials. While most modern insulation materials produce relatively benign decomposition products, older motors may contain materials that release toxic gases when heated. Ensure the burnout oven has appropriate exhaust ventilation and never open the oven door during the burnout process.`,
        procedures: [
          'Review SDS for all chemicals before use',
          'Work in well-ventilated areas when using chemicals',
          'Wear appropriate PPE - gloves, eye protection, respirator as needed',
          'Store chemicals in approved containers',
          'Keep ignition sources away from flammable materials',
          'Dispose of chemical waste properly',
          'Test for lead in older motors',
          'Ensure burnout oven ventilation is functioning',
          'Wash hands thoroughly after chemical handling',
          'Keep first aid supplies for chemical exposure readily available'
        ],
        commonMistakes: [
          'Working with chemicals without checking SDS',
          'Inadequate ventilation during varnish application',
          'Using incompatible solvents on motor components',
          'Improper storage of flammable chemicals',
          'Disposing of chemicals down drains',
          'Not wearing appropriate PPE'
        ],
        emergencyProtocol: 'For chemical splash in eyes: Flush with water for 15-20 minutes while holding eyelids open. Seek medical attention. For skin contact: Remove contaminated clothing, wash skin with soap and water. For inhalation: Move to fresh air, seek medical attention if symptoms persist.'
      }
    ],
    certifications: ['Certified Motor Repair Facility', 'ISO 9001 Quality Management', 'EASA Accredited Service Center'],
    warranty: '12 months on rewinding under normal operating conditions'
  },
  {
    id: 'borehole-pumps',
    name: 'Borehole & Water Pumps',
    icon: '💧',
    iconBg: 'from-cyan-500 to-blue-600',
    shortDescription: 'Complete borehole and water pump services. Installation, maintenance, and repair of submersible pumps, surface pumps, and booster systems.',
    fullDescription: {
      overview: `Water is the foundation of life, agriculture, and industry in Kenya, and reliable pumping systems are essential for delivering water where it's needed. Emerson EiMS has established itself as Kenya's premier provider of borehole and water pump services, with expertise spanning from small domestic installations to large agricultural irrigation systems and municipal water supply projects. Our comprehensive services cover the entire water system lifecycle from initial site assessment through installation, commissioning, operation, and maintenance.

Borehole drilling represents a significant investment, and proper pump selection and installation are essential to maximize the return on that investment. We work with hydrogeologists and drilling contractors to ensure that pump systems are properly matched to borehole characteristics including depth, yield, water quality, and intended use. Undersized pumps fail to deliver required flow rates; oversized pumps waste energy and can damage the borehole through excessive drawdown.

Our pump services cover all major pump types and brands used in Kenya. Submersible pumps from manufacturers including Grundfos, Pedrollo, Franklin Electric, Kirloskar, and Davis & Shirtliff are our primary focus, but we also service surface pumps, booster systems, and specialty pumps for industrial applications. We maintain inventory of common spare parts and have established supply chains for specialty items to minimize downtime when repairs are needed.

Beyond pump hardware, we provide complete water system services including pressure tank installation and service, water treatment systems, storage tank installation, and pipeline work. Our technicians understand water systems holistically and can diagnose and resolve problems throughout the system, not just at the pump. This comprehensive approach ensures that customers receive solutions that address their actual water supply challenges.`,

      technicalDetails: `Submersible pump technology has evolved significantly, and modern pumps offer exceptional efficiency and reliability when properly selected and installed. Multistage centrifugal designs with stainless steel impellers and bowls provide excellent performance across a wide range of conditions. Motor efficiency has improved with permanent magnet and variable frequency drive technologies. Understanding these technologies allows us to recommend optimal solutions for each application.

Pump selection requires detailed analysis of system requirements. Total dynamic head (TDH) includes static lift (depth to water plus height to delivery point), friction losses in piping, and pressure requirements at delivery. Flow rate must meet peak demand with appropriate safety margin. Operating point on the pump curve should be in the efficient range to minimize energy cost and maximize pump life. We use professional selection software to match pumps to application requirements.

Electrical systems for submersible pumps include the motor, control panel, protective devices, and wiring. Proper sizing of conductors for voltage drop over long cable runs is critical - excessive voltage drop reduces motor performance and life. Protection devices including overload relays, phase monitors, and dry-run protection prevent damage from abnormal operating conditions. Variable frequency drives provide soft starting, speed control, and additional protection features.

Water quality significantly affects pump selection and longevity. Sandy water causes abrasive wear on impellers and bowls. Acidic water attacks brass components and can cause dezincification. Iron bacteria create deposits that clog pump passages. Water analysis guides material selection and identifies need for water treatment. We recommend water testing before pump installation and periodically during operation.`,

      serviceScope: `Our borehole services begin with pre-drilling consultation where we review proposed borehole locations, expected yields based on geological surveys, and intended water uses. This information guides pump specification and ensures that electrical and piping infrastructure are adequately planned. After drilling, we coordinate pump test pumping to verify borehole yield and water quality before permanent installation.

Pump installation follows a rigorous process to ensure reliable operation. All components are inspected before installation. Cable splices are made using approved materials and techniques for submersible applications. Pump settings are based on water level measurements during test pumping. Rising main connections use proper support and alignment. Wellhead completion includes sanitary seal to prevent surface contamination.

Maintenance services for borehole pumps include periodic inspections, pump extraction for service, and replacement of wear components. We recommend pump extraction every 3-5 years for inspection, more frequently in challenging water quality conditions. During service, we inspect impellers for wear, replace seals and bearings as needed, and test motor insulation. Proactive maintenance extends pump life and prevents costly emergency repairs.

Emergency repair services are available when pumps fail unexpectedly. We maintain pump extraction equipment and trained crews ready for rapid response. Common emergency issues include pump seizure from sand ingress, cable failure, and motor burnout. Our goal is to minimize the time that customers are without water, which we understand is extremely disruptive to homes, farms, and businesses.`,

      whyChooseUs: `Our investment in proper pump extraction equipment sets us apart from competitors who rely on improvised methods that can damage pumps, cables, and boreholes. We use hydraulic extraction equipment with controlled lift rate to prevent cable damage and pump shock. Our extraction crews are trained to recognize and respond to problems during extraction such as stuck pumps or cable hang-ups.

Water system expertise extends beyond pumps to encompass the entire water supply chain. When customers call with water problems, we diagnose systematically to identify whether the issue is with the pump, piping, storage, treatment, or distribution. This holistic approach prevents costly pump extractions when the problem is actually a failed pressure switch or clogged filter.

Quality parts and materials are essential for long-term reliability. We use only genuine or equivalent-quality replacement parts from reputable manufacturers. Cable splices use heat-shrink technology designed for submersible applications. Sanitary well seals prevent the contamination that has ruined many Kenyan boreholes. Cutting corners on materials creates callbacks and damages our reputation.

Training and certification demonstrate our commitment to professional standards. Our pump technicians have completed manufacturer training programs and hold industry certifications. We stay current with new pump technologies and installation practices. This expertise translates to installations that work correctly from day one and provide many years of reliable service.`,

      industryApplications: `Agricultural irrigation consumes more water than any other sector, and efficient pumping is essential for profitable farming. We have installed pump systems for flower farms, vegetable farms, fruit orchards, and livestock operations throughout Kenya. Solar-powered pump systems are increasingly popular for agricultural applications, eliminating fuel costs and reducing maintenance. We design and install complete irrigation pump systems including filtration for drip systems.

Residential water supply in areas without municipal water depends on boreholes and storage systems. We install complete domestic water systems including submersible pumps, pressure tanks, treatment systems, and storage tanks. Our residential systems are designed for automatic operation with minimal owner intervention. We also service existing systems and provide emergency repair for homes that have lost water supply.

Commercial and institutional facilities including hotels, schools, hospitals, and office buildings require reliable water supply for operations and occupant comfort. We design pump systems with appropriate redundancy for critical facilities and provide maintenance contracts that include regular inspections and priority emergency response. Water treatment systems ensure that water quality meets requirements for each application.

Municipal and community water supply projects serve hundreds or thousands of people from single boreholes. These projects require careful engineering to ensure sustainable yield, adequate storage, and appropriate distribution. We have partnered with NGOs, county governments, and development agencies on community water projects throughout Kenya. Our involvement ranges from technical consultation to complete turnkey implementation.`
    },
    href: '/services#pumps',
    color: 'from-cyan-600/20 to-blue-700/20',
    glowColor: 'shadow-cyan-500/20',
    features: ['Borehole Pumps', 'Pump Installation', 'Pressure Systems', 'Solar Pumping', 'Water Treatment', 'Emergency Repair', 'Pump Extraction', 'Water Testing'],
    stats: { value: '200+', label: 'Installations Yearly' },
    subServices: [
      {
        name: 'Borehole Pump Installation',
        description: 'Professional installation of submersible pumps with proper sizing, cable splicing, and wellhead completion.',
        benefits: ['Proper pump selection', 'Quality installation', 'Testing included', 'Warranty coverage']
      },
      {
        name: 'Submersible Pump Repair',
        description: 'Extraction, diagnosis, and repair of failed submersible pumps including motor rewinding and seal replacement.',
        benefits: ['Hydraulic extraction', 'Workshop facilities', 'Motor rewinding', 'Quality parts']
      },
      {
        name: 'Surface Pump Service',
        description: 'Installation and repair of surface-mounted pumps including centrifugal, jet, and self-priming types.',
        benefits: ['All pump types', 'Priming systems', 'Control panels', 'Booster pumps']
      },
      {
        name: 'Pressure Tank Systems',
        description: 'Installation and service of pressure tanks for constant water pressure without continuous pump operation.',
        benefits: ['Proper sizing', 'Air charge service', 'Switch adjustment', 'Extended pump life']
      },
      {
        name: 'Solar Pump Systems',
        description: 'Design and installation of solar-powered pumping systems for locations without grid power.',
        benefits: ['No fuel costs', 'Low maintenance', 'Environmentally friendly', 'Complete systems']
      },
      {
        name: 'Water Level Monitoring',
        description: 'Installation of water level sensors and monitoring systems for borehole management.',
        benefits: ['Protect borehole', 'Optimize pumping', 'Remote monitoring', 'Data logging']
      },
      {
        name: 'Borehole Rehabilitation',
        description: 'Services to restore yield in declining boreholes including cleaning, acidization, and development.',
        benefits: ['Restore yield', 'Remove deposits', 'Improve quality', 'Extend life']
      },
      {
        name: 'Pump Testing',
        description: 'Pumping tests to determine borehole yield and optimal pump settings.',
        benefits: ['Proper sizing', 'Sustainable yield', 'Quality baseline', 'Professional reports']
      }
    ],
    detailedProblems: [
      {
        issue: 'No Water Output',
        symptoms: ['Pump running but no water', 'Drastically reduced flow', 'Air in pipes', 'Dry running sounds'],
        detailedSolution: `Complete loss of water output requires systematic diagnosis to identify whether the problem lies in the pump, the borehole, or the piping system. The pump may be running without actually pumping water due to internal failures, or the water may never be reaching the delivery point due to piping problems. Understanding water system hydraulics guides efficient troubleshooting.

First, verify that the pump is actually running by checking current draw and listening for motor operation. Submersible motors can fail while appearing to run based on panel indicators. Current draw significantly below normal suggests that the motor is not producing normal torque, either due to motor failure or mechanical blockage. No current draw indicates electrical problems in the motor or wiring.

Water level in the borehole is a critical factor. If the pump has been running dry due to low water level, it may have overheated and failed. Check static water level with a water level indicator before assuming pump failure. Seasonal variations, increased extraction in the area, and reduced recharge can all cause water levels to drop below pump intake. Pump settings may need adjustment as water levels change.

Internal pump failures include worn impellers, damaged check valves, and seized stages. Submersible pumps have multiple stages, and damage to any stage reduces overall pump performance. Sand in the water accelerates wear on impellers and bowls. Pump extraction is required to inspect and repair internal components. In some cases, repair is not economical and pump replacement is recommended.

Rising main and piping problems can prevent water delivery even when the pump is operating correctly. Check valves can stick closed, air locks can form in horizontal or downhill sections, and leaks can divert water before it reaches delivery points. Pressurize the system from the surface to test for leaks, and verify that all check valves are free to operate.

Electrical issues including voltage drop, phase loss, and control panel failures can prevent pump operation. Measure voltage at the pump control panel and at the wellhead under load conditions. Voltage below 90% of rated will cause motor overheating and eventual failure. Check all protective devices and control relays for proper operation.`,
        diagnosticSteps: [
          'Verify pump is drawing normal current',
          'Check water level in borehole',
          'Verify voltage at control panel under load',
          'Check for air in pipes at delivery point',
          'Inspect wellhead for leaks or damage',
          'Test check valves by pressurizing from surface',
          'Listen at wellhead for pump operating sounds',
          'Review recent pumping patterns for overuse',
          'Check control panel for fault indicators',
          'Consider pump extraction for internal inspection'
        ],
        repairProcedure: [
          'If water level is low, wait for recovery or lower pump setting',
          'If electrical issue, repair wiring or replace components',
          'If piping leak, locate and repair',
          'If check valve stuck, replace',
          'If pump internal failure, extract for service',
          'Replace worn impellers, seals, bearings',
          'Rewind motor if insulation failed',
          'Consider new pump if repair not economical',
          'Verify repair by test pumping',
          'Document all findings and repairs'
        ],
        preventionTips: [
          'Install water level protection to prevent dry running',
          'Monitor pump current regularly for changes',
          'Maintain proper pump setting relative to water level',
          'Install sand filter if water contains grit',
          'Schedule regular extraction for inspection',
          'Monitor borehole yield and adjust pumping if declining',
          'Use quality cable and splices to prevent electrical failures'
        ],
        estimatedTime: '4-8 hours for diagnosis, 1-3 days for repair',
        estimatedCost: 'KES 15,000 - 80,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Water level indicator', 'Clamp meter', 'Pressure gauge', 'Pump extraction equipment', 'Test pump']
      },
      {
        issue: 'Reduced Water Flow',
        symptoms: ['Lower than normal flow rate', 'Gradual decline over time', 'Adequate flow initially then decline', 'Pressure not reaching previous levels'],
        detailedSolution: `Gradual reduction in water flow is often more insidious than complete failure because it may not be noticed until it significantly impacts water availability. The causes range from pump wear to borehole problems to piping restrictions, and diagnosis requires systematic analysis of the complete water system. Early intervention when flow reduction is noticed can prevent complete failure and costly emergency repairs.

Pump wear is the most common cause of gradual flow reduction. Impellers, wear rings, and bowls all experience wear during normal operation, accelerated by sandy or abrasive water. As clearances increase, pump efficiency decreases and flow rate drops. Pump curves show that worn pumps produce less flow at any given head, and the reduction becomes more pronounced as the pump tries to operate against higher head.

Borehole yield decline can occur over time due to natural aquifer changes, regional overdrawing, or borehole deterioration. Encrustation of screens with mineral deposits or iron bacteria reduces the effective open area for water entry. Sand production can cause screen collapse. Comparison of current specific yield (flow per unit of drawdown) with original test pumping data indicates whether the borehole has deteriorated.

Piping restrictions from scale buildup, debris accumulation, or partially closed valves reduce flow without necessarily indicating pump problems. Scale accumulates in pipes serving hard water, gradually reducing effective diameter. Debris including rust flakes, sand, and foreign objects can accumulate at fittings and valves. Systematic checking of the piping system identifies restrictions.

Changing water levels affect pump performance even without actual pump degradation. As water level drops, total pumping head increases, moving the operating point on the pump curve to lower flow. If seasonal variations cause significant water level changes, pump settings or sizing may need adjustment to maintain adequate flow during low-water periods.

System leaks divert water before it reaches intended delivery points. Underground leaks may not be visible but can waste significant water. Pressure testing with the pump stopped and all outlets closed identifies whether the system holds pressure. Leak detection techniques including acoustic listening and pressure logging can locate hidden leaks.`,
        diagnosticSteps: [
          'Measure actual flow rate and compare to original specification',
          'Measure pump current and compare to original values',
          'Check water level static and during pumping',
          'Calculate specific yield and compare to original test',
          'Inspect visible piping for restrictions or leaks',
          'Pressure test system with pump stopped',
          'Check all valves for proper opening',
          'Inspect strainer or filter for blockage',
          'Review water quality history for encrustation indicators',
          'Consider pump extraction for internal inspection'
        ],
        repairProcedure: [
          'Clean or replace blocked strainers and filters',
          'Repair or descale piping if restricted',
          'Repair leaks in piping system',
          'Adjust pump setting if water level has changed',
          'Extract pump for service if internal wear suspected',
          'Replace worn impellers, wear rings, bowls',
          'Consider borehole rehabilitation if yield has declined',
          'Verify repair by measuring flow rate',
          'Establish baseline for future monitoring',
          'Recommend ongoing monitoring program'
        ],
        preventionTips: [
          'Monitor flow rate regularly and trend over time',
          'Install flow meter for continuous monitoring',
          'Address water quality issues that accelerate wear',
          'Schedule pump extraction based on hours or years',
          'Monitor borehole water level during pumping',
          'Don\'t exceed sustainable yield of borehole',
          'Consider borehole CCTV inspection if yield declining'
        ],
        estimatedTime: '4-8 hours for diagnosis, variable for repair',
        estimatedCost: 'KES 10,000 - 60,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Flow meter', 'Pressure gauge', 'Water level indicator', 'Clamp meter', 'Pump extraction equipment']
      }
    ],
    turnaroundTime: '1-3 days for most repairs, same-day emergency service available',
    priceRange: 'KES 10,000 - 300,000',
    requiredTools: [
      { name: 'Pump Extraction Rig', purpose: 'Safe extraction of submersible pumps from boreholes', importance: 'Essential' },
      { name: 'Water Level Indicator', purpose: 'Measure static and pumping water levels', importance: 'Essential' },
      { name: 'Pressure Gauge', purpose: 'Measure system pressure at various points', importance: 'Essential' },
      { name: 'Clamp Meter', purpose: 'Measure motor current without disconnection', importance: 'Essential' },
      { name: 'Megger Tester', purpose: 'Test motor and cable insulation resistance', importance: 'Essential' },
      { name: 'Flow Meter', purpose: 'Measure actual flow rate for diagnosis and verification', importance: 'Recommended' },
      { name: 'Pipe Wrenches', purpose: 'Connect and disconnect rising main sections', importance: 'Essential' },
      { name: 'Cable Splice Kit', purpose: 'Make proper submersible cable connections', importance: 'Essential' }
    ],
    safetyGuidelines: [
      {
        title: 'Electrical Safety',
        icon: '⚡',
        importance: 'Critical',
        overview: 'Submersible pump systems operate at dangerous voltages with cables extending deep into boreholes. Proper isolation is essential.',
        detailedExplanation: `Submersible pump systems present unique electrical hazards because the motor and cables are submerged in water, an excellent conductor. Any insulation failure creates a shock hazard not only at the fault location but throughout the water in the borehole. Testing insulation integrity before and after any work is essential to ensure safety.

Cable damage is common in pump installations due to the mechanical stresses during installation and extraction. Cables can be abraded by the borehole casing, cut by sharp edges, or crushed by improperly secured rising main. Damaged insulation may not cause immediate failure but creates a hazard that worsens over time. Careful handling during extraction prevents new damage.

Voltage is present at pump cables whenever the control panel is powered, regardless of whether the motor is actually running. Capacitor-start motors retain charge that can cause shock even after disconnection. Before any work on pump cables, disconnect power at the main breaker and verify with a voltage tester.

Water contact multiplies electrical hazard significantly. Never handle pump cables or motor connections with wet hands or while standing in water. Wear insulated gloves and boots when working around pump electrical systems. Ensure that work areas are dry and that standing water is drained before beginning electrical work.

Control panels should be locked and tagged during pump service to prevent unintended starting while personnel are working on the pump. The pump can be started remotely by level switches, pressure switches, or building management systems. Only personnel with proper authorization should operate control panels.`,
        procedures: [
          'Disconnect power at main breaker before any pump work',
          'Lock and tag control panel to prevent remote starting',
          'Verify zero voltage at pump cables with tester',
          'Test cable insulation with megger before and after work',
          'Inspect cables for damage during extraction',
          'Never handle electrical connections with wet hands',
          'Wear insulated gloves when working on cables',
          'Ensure proper cable support to prevent damage',
          'Make cable splices with approved submersible splice kits',
          'Test system before re-energizing'
        ],
        commonMistakes: [
          'Assuming pump is safe because control panel shows off',
          'Not testing cable insulation before working',
          'Handling cables with wet hands',
          'Using non-submersible splice materials',
          'Not locking out control panel during service',
          'Ignoring cable damage discovered during extraction'
        ],
        emergencyProtocol: 'For electrical contact in water: Don\'t enter water to rescue - disconnect power first. Use non-conductive materials to separate victim from water. Call emergency services. Begin CPR if victim not breathing after removal from water.'
      },
      {
        title: 'Lifting and Extraction',
        icon: '🏗️',
        importance: 'Critical',
        overview: 'Pump extraction involves handling heavy equipment over open borehole. Proper techniques prevent injury and equipment damage.',
        detailedExplanation: `Submersible pumps with cables and rising main can weigh hundreds of kilograms, distributed across tens or hundreds of meters of depth. Extraction requires proper equipment and technique to handle these loads safely. Improvised extraction methods frequently result in dropped pumps, damaged cables, and personal injury.

The borehole opening is an ever-present fall hazard during pump work. The casing may be flush with ground level or in a chamber, and edges may be sharp or unstable. Never reach into the borehole opening. Use long-handled tools to manipulate cables and pipes. Establish barriers around the work area to prevent personnel from approaching the opening unexpectedly.

Hydraulic extraction equipment provides controlled lifting that protects both personnel and equipment. Manual extraction is feasible only for shallow, small pumps. For pumps at depth, hydraulic systems provide the power and control needed for safe extraction. Extraction rate should be slow enough to manage the equipment and fast enough to prevent cable tangling.

Cable management during extraction is critical. Cables must be guided to prevent tangling, secured to prevent uncontrolled unwinding, and protected from damage by abrasion or kinking. Failed cables often result from poor handling during extraction rather than in-service damage.

Rising main sections are heavy and awkward to handle. Unsecured pipes can swing unexpectedly as they emerge from the borehole. Multiple personnel are usually needed to manage pipes safely. Pipe racks or supports should be prepared before extraction begins to provide places to set down pipes as they are removed.

Installation reverses the extraction process with additional concerns for preventing contamination of the borehole. All components entering the borehole must be clean. Disinfection procedures prevent introduction of bacteria that can create ongoing water quality problems.`,
        procedures: [
          'Assess total weight to be lifted and verify equipment capacity',
          'Establish barriers around borehole opening',
          'Never reach into borehole with hands',
          'Use hydraulic extraction for deep or heavy pumps',
          'Control extraction rate to manage equipment safely',
          'Guide cables to prevent tangling during extraction',
          'Prepare supports for rising main sections',
          'Use multiple personnel for heavy pipe handling',
          'Clean all components before installation',
          'Follow disinfection procedures after installation'
        ],
        commonMistakes: [
          'Underestimating total weight to be lifted',
          'Reaching into borehole opening',
          'Using manual extraction for heavy pumps',
          'Uncontrolled cable spooling causing tangles',
          'Inadequate personnel for pipe handling',
          'Installing contaminated components'
        ],
        emergencyProtocol: 'For dropped equipment: Don\'t attempt to catch falling objects. Clear personnel from area. Assess damage and plan recovery. For fall into borehole area: Call emergency services immediately. Don\'t enter confined space without proper equipment and training.'
      }
    ],
    certifications: ['Licensed Water Works Contractor', 'Grundfos Service Partner', 'Davis & Shirtliff Authorized Service'],
    warranty: '12 months on installations, 6 months on repairs'
  }
];

export default ENHANCED_SERVICES_PART2;

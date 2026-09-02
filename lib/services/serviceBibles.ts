/**
 * Service Bibles — comprehensive technical reference for every /services/<slug>
 * page. Each bible covers: deep introduction, top brands, install phases,
 * parts manual, repair manual, error code library, ROI scenarios, warranty
 * options, quality controls, and references SVG diagrams from
 * components/services/BibleDiagrams.tsx.
 *
 * Content discipline:
 *  • Engineering principles and formulas — drawn from standard references
 *    (BS 7671, IEC 60364, IEEE 519, ASHRAE handbook, IEC 62040 for UPS,
 *    IEC 60034 for rotating machines, BS EN 12952 for waste-to-energy).
 *  • Brand rosters — manufacturers that hold meaningful market share in
 *    East-African / global B2B procurement. Capability summaries describe
 *    documented product positioning rather than fabricated spec numbers.
 *  • Spec ranges given as TYPICAL industry ranges (e.g. "8–12 °F superheat
 *    on R-410A"), not invented model-specific numbers.
 *  • Error codes listed by FAMILY (e.g. SPN/FMI structure for J1939 ECUs;
 *    DSE 7000-series controller categories) rather than fabricated specific
 *    code-to-meaning mappings the engineer cannot verify against the OEM
 *    service manual on hand.
 *
 * 8 unique bibles · 10 service slugs (3 generator slugs share one bible).
 */

export interface BrandProfile {
  name: string;
  origin: string;
  founded?: string;
  capability: string;
  bestFor: string[];
  warranty: string;
  tier: 'premium' | 'mid' | 'value';
  notes: string;
}

export interface InstallPhase {
  phase: string;
  goal: string;
  checklist: string[];
}

export interface PartsManualGroup {
  group: string;
  items: { name: string; interval?: string; note?: string }[];
}

export interface RepairProcedure {
  fault: string;
  priority: 'routine' | 'urgent' | 'emergency';
  steps: string[];
  warning?: string;
}

export interface ErrorCodeEntry {
  code: string;
  family: string;
  meaning: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fix: string[];
}

export interface ROIRow {
  scenario: string;
  capex: string;
  annualSaving: string;
  payback: string;
  notes: string;
}

export interface ServiceBible {
  family: string;
  hero: { headline: string; subhead: string };
  intro: string[];                    // 10+ paragraphs
  topBrands: BrandProfile[];          // 10 brands
  installPhases: InstallPhase[];
  partsManual: PartsManualGroup[];
  repairManual: RepairProcedure[];
  errorCodes: ErrorCodeEntry[];
  diagrams: string[];                 // BibleDiagrams ids
  roi: ROIRow[];
  warrantyOptions: string[];
  qualityChecks: string[];
  fastRepairCallouts: string[];
  references: string[];               // standards / sources
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GENERATOR BIBLE — shared by cummins-generators / generator-repairs / ats-changeover
// ═══════════════════════════════════════════════════════════════════════════════

const GENERATOR_BIBLE: ServiceBible = {
  family: 'generator',
  hero: {
    headline: 'The Diesel Genset Bible',
    subhead: 'Engineered for hospitals, data centres, factories and any site that cannot afford to stop.',
  },
  intro: [
    'A diesel genset is a tightly-coupled system of a compression-ignition prime mover, a synchronous alternator, a control module, a fuel-and-cooling skid, and the switchgear that decides when the genset is connected to the load. Every one of those subsystems has its own failure modes, its own service intervals, and its own commissioning checklist. A specification that ignores any of them is the source of nine out of ten standby-power complaints we see in the field.',
    'The first decision is duty class. ISO 8528 defines four duty profiles — Emergency Standby (ESP), Prime (PRP), Limited-Time Prime (LTP) and Continuous Operation (COP). A 100 kVA ESP-rated unit running continuously will derate to ~90 kVA and double its maintenance burden. Choose the rating that matches expected runtime, not the cheapest sticker price.',
    'Sizing follows the formula kVA = Σ(running kW) ÷ pf + Σ(starting kW × inrush factor). Real installations are dominated by motor inrush — a 30 kW direct-on-line motor will pull six times running current for the first second. Soft-starters, VSDs, and step-loading sequences buy back capacity, which is why a 250 kVA genset can often replace a 400 kVA one if the controls are designed properly.',
    'Fuel is where most field failures originate. Diesel is hygroscopic; water condenses on the inside of half-empty tanks, sulphate-reducing bacteria thrive at the water-fuel interface, and the resulting biomass blocks primary filters in months. Polishing systems, weekly water checks, and full-tank policies during long shutdowns extend injector life from 4,000 hours to 15,000 hours.',
    'Cooling design is rarely optimised. A radiator sized for 35 °C ambient that is installed in a 45 °C engine room will overheat. Ventilation requires inlet area ≥ radiator face area × 1.5 and outlet area ≥ inlet × 1.25, with louvre free-area corrections. We have lifted three Cummins units in 2025 alone whose ducting reduced free area to under 50% of catalogue.',
    'The alternator (the "generator end") must be selected for both kVA and short-circuit ratio. Hospitals running large MRI / CT plant need an alternator with high SCR and low subtransient reactance to ride through nuisance breaker trips during diagnostic imaging cycles. Cheap end-coupled alternators are fine for offices and useless for clinical loads.',
    'Modern controllers — Deepsea DSE, ComAp InteliLite, Cummins PowerCommand, Woodward easYgen — implement the same core functions: AVR setpoint, governor trim, fuel theft alarm, over/under-voltage, over/under-frequency, oil pressure low, coolant high, charge-fail and emergency-stop interlocks. The controller is also where you connect the J1939 CAN bus that will give you live engine telemetry on a SCADA.',
    'The switchgear that joins the genset to the building is the Automatic Transfer Switch. Open-transition ATSs leave a brief power gap (typically 100–500 ms once running). Closed-transition ATSs synchronise the genset with utility before transferring — required for sites that cannot tolerate even a flicker, such as broadcast and telco. Bypass-isolation ATSs let you maintain the switch without dropping load. Pick the right class — they do not retrofit cheaply.',
    'Earthing of standby gensets is its own discipline. As a separately-derived source the alternator neutral and frame must be bonded once and only once; a second N-PE bond inside the building will draw triplen-harmonic currents through the structure. Earth resistance ≤ 5 Ω is enough for general; ≤ 1 Ω is the standard for medical, telecom and data-centre. Test by fall-of-potential or clamp method annually.',
    'A maintenance regime is non-negotiable. Daily: visual leaks, fuel level, battery charge LED. Weekly: 5-minute no-load run, exercise the ATS. Monthly: load-bank ≥ 30% of nameplate for 30 minutes to burn off wet-stacking. 250-hour: oil and filter, coolant test, valve adjustment per OEM. 1,000-hour: injector test, cooling system flush, generator-end air-gap inspection. Skipping the load-bank is the single biggest reason "perfectly good" gensets fail to take load on the day of an outage.',
    'Finally, the most under-spec\'d item is the fuel-day-tank piping. A diesel-engine return temperature can hit 80 °C; routing the return to the bottom of a tank that already supplies the engine recirculates hot fuel and chokes capacity. Returns must enter at the top, separated from suction by a baffle, and the day-tank should be vented through a flame-arrester that itself is checked yearly.',
    'The transfer switch deserves its own commissioning discipline, because it is the component that decides whether all the money spent on the genset ever reaches the load. Four timers govern its behaviour and all four need to be set for the site rather than left at factory defaults: the utility-failure delay, which stops a momentary dip from starting the engine; the warm-up delay, which holds transfer until voltage and frequency are inside the acceptance window; the retransfer delay, which stops the load bouncing back onto a utility supply that has not settled; and the cool-down run, which lets the engine shed heat unloaded before it stops. Sites that suffer repeated transfers during unstable-supply periods almost always have a retransfer delay set in seconds when it should be minutes. Beyond the timers, the switch itself must be exercised: an ATS that has sat in one position for a year can have stiff mechanism and oxidised contacts, and the first time it is asked to move should not be during a real outage.',
    'Repair economics deserve to be stated honestly, because the sector has a reputation for the opposite. A well-maintained diesel genset is a long-lived asset — the engine is designed for tens of thousands of hours — so a unit failing early is usually telling you about installation, fuel or maintenance rather than about its own design life. Three pieces of evidence should exist before anyone quotes an overhaul: the running hours, the maintenance history, and a load-bank result showing what the set can actually deliver today. Those three numbers separate a set that needs an injector service from one that genuinely needs a rebuild, and they occasionally show that neither is worth doing on an old machine. Ask for them, from any contractor. A quote that arrives without that evidence base is a guess dressed up as a diagnosis, and it is the buyer who carries the cost of the guess.',
  ],
  topBrands: [
    { name: 'Cummins', origin: 'United States', founded: '1919', capability: 'Vertical-integrated engine + alternator + controls (PowerCommand). 10 kVA – 3.75 MVA range with QSB / QSL / QSK / QSV engine families. Reference choice for hospitals and data-centres.', bestFor: ['Hospitals', 'Data centres', 'Industry'], warranty: 'Standard 24 months / 1,000 hr; extended to 5 yr on QSB7 / QSL9 with PMS contract', tier: 'premium', notes: 'EmersonEIMS sells and services Cummins generators in Kenya.' },
    { name: 'Perkins', origin: 'United Kingdom (Caterpillar group)', founded: '1932', capability: 'Diesel engine builder; gensets assembled by partners (FG Wilson, Olympian). Strong parts network in East Africa.', bestFor: ['Construction', 'Telecom shelters', 'SME'], warranty: 'Typically 24 months — varies by packager', tier: 'mid', notes: 'Look for "Perkins Genuine Parts" lock-tag holograms; counterfeits are common in regional markets.' },
    { name: 'Caterpillar (CAT)', origin: 'United States', founded: '1925', capability: 'Heavy-duty C-series engines (C7.1 to C175). Industrial-grade, premium dealer support.', bestFor: ['Mining', 'Petrochemical', 'Mission-critical'], warranty: '12 months std / extended to 5 yr via Customer Value Agreement', tier: 'premium', notes: 'Highest TCO of the top tier; lowest unplanned-downtime statistics in heavy industry.' },
    { name: 'FG Wilson', origin: 'United Kingdom', founded: '1966', capability: 'Perkins-engined gensets 6.8 kVA – 2,500 kVA. Strong African distribution.', bestFor: ['Commercial', 'Light industrial'], warranty: '24 months / 1,000 hr standard', tier: 'mid', notes: 'Owned by Caterpillar; benefits from CAT parts logistics.' },
    { name: 'Kohler', origin: 'United States', founded: '1873', capability: 'Residential through 4 MW industrial. KD Series uses MTU-derived large engines. Premium controls (DEC4000).', bestFor: ['Healthcare', 'Government', 'Premium commercial'], warranty: '24 months std / 5 yr platinum', tier: 'premium', notes: 'Strong in Middle-East / Africa government tenders.' },
    { name: 'MTU (Rolls-Royce Power Systems)', origin: 'Germany', founded: '1909', capability: 'Series-2000 / 4000 large bore engines for 600 kVA – 4,000 kVA continuous duty. Best-in-class bsfc.', bestFor: ['Tier-3/4 data centres', 'Marine', 'Continuous prime'], warranty: '24 months / 5,000 hr extendable', tier: 'premium', notes: 'Lowest fuel burn per kWh in its class; capex matches.' },
    { name: 'Mitsubishi Heavy Industries', origin: 'Japan', founded: '1884', capability: 'S- and SR-series engines from 600 to 4,500 kVA. Robust in tropical / dusty environments.', bestFor: ['Mining', 'Cement', 'Continuous'], warranty: '24 months / 1,500 hr standard', tier: 'premium', notes: 'Excellent thermal margin — common at >2,000 m altitude sites without heavy derate.' },
    { name: 'Volvo Penta', origin: 'Sweden', founded: '1907', capability: 'TAD/TWD industrial engines 80–770 kVA, paired with Stamford / Leroy alternators by packagers.', bestFor: ['Mid-range commercial', 'Marine standby'], warranty: '24 months / 2,000 hr', tier: 'mid', notes: 'Low NOx variants suit emissions-restricted locations.' },
    { name: 'Doosan', origin: 'South Korea', founded: '1937', capability: 'P086, DP158, DP180 engines from 90 to 700 kVA. Aggressive price/performance.', bestFor: ['Telecom', 'SME industrial'], warranty: '24 months / 1,000 hr', tier: 'mid', notes: 'Common option when CAT/Cummins capex is unavailable; insist on genuine Stamford end.' },
    { name: 'John Deere Power Systems', origin: 'United States', founded: '1837', capability: '4045 / 6068 / 6090 / 6135 engines 30–500 kVA. Tier-3 / Tier-4 emissions options.', bestFor: ['Agriculture', 'Light industrial', 'Rural telecom'], warranty: '24 months / 2,000 hr', tier: 'mid', notes: 'Strong fuel economy and parts availability in rural Africa.' },
  ],
  installPhases: [
    { phase: '1. Site survey & load study', goal: 'Quantify real running, starting, and step loads.', checklist: ['Walk-through of every panel and motor', 'Logging clamp-meter readings over 7-day cycle', 'Identify essential vs non-essential circuits', 'Confirm civil access for delivery and exhaust route'] },
    { phase: '2. Sizing & specification', goal: 'Lock the kVA, duty class, alternator option, controls level.', checklist: ['Compute kVA per motor inrush', 'Choose ESP/PRP rating', 'Specify alternator SCR for sensitive loads', 'Decide ATS class — open / closed / bypass'] },
    { phase: '3. Civil works & foundation', goal: 'Vibration-isolated, drained, fire-rated platform.', checklist: ['Reinforced concrete plinth ≥ 1.5 × wet weight of genset', 'Anti-vibration mounts rated to engine RPM', 'Bund wall for 110% fuel capacity', 'Drainage to oil-water separator'] },
    { phase: '4. Electrical infrastructure', goal: 'Cabling, ATS, earthing, neutral strategy correct from day one.', checklist: ['Cable sized for full-load current × 1.25 + voltage drop', 'TN-S separately-derived neutral arrangement', 'Earth pit installed and tested', 'ATS mechanical interlock verified'] },
    { phase: '5. Fuel & ventilation', goal: 'Reliable fuel delivery and adequate cooling air.', checklist: ['Bulk + day-tank with float controls', 'Inlet free area ≥ radiator face × 1.5', 'Exhaust silencer hospital-grade if near patients', 'Spring-loaded counterweight on exhaust roof flap'] },
    { phase: '6. Commissioning', goal: 'Validate every protection setting and load behaviour.', checklist: ['No-load run 30 minutes — log all parameters', 'Load-bank to 100% nameplate for 1 hour', 'Step-load test 25 / 50 / 75 / 100%', 'Black-start under simulated mains failure'] },
    { phase: '7. Documentation & training', goal: 'Operations team can run the genset confidently.', checklist: ['As-built single-line, ATS schedule, earthing certificate', 'Parts list and OEM manuals (paper + PDF)', 'Operator training — start / stop / silence-alarm', 'Loaded test report with annotated trends'] },
    { phase: '8. Service contract activation', goal: 'Locked-in maintenance from day one.', checklist: ['Quarterly visit schedule', '24/7 emergency call-out SLA', 'OEM-genuine consumables in agreement', 'Annual load-bank and thermography in scope'] },
  ],
  partsManual: [
    { group: 'Filtration', items: [
      { name: 'Lube oil filter', interval: '250 hr / 6 mo', note: 'Spin-on; torque per OEM (typically 18–22 Nm).' },
      { name: 'Fuel primary (water separator)', interval: '500 hr', note: 'Drain weekly; replace when ΔP > 100 kPa.' },
      { name: 'Fuel secondary (fine)', interval: '500 hr', note: 'Cleanliness critical for common-rail systems.' },
      { name: 'Air cleaner', interval: '1,000 hr or per ΔP gauge', note: 'Dusty East-African sites: 6 months.' },
      { name: 'Crankcase breather', interval: '1,000 hr' },
    ]},
    { group: 'Fluids', items: [
      { name: 'Engine oil — CI-4 / CK-4 SAE 15W-40', interval: '250 hr / annually' },
      { name: 'Coolant — pre-mixed 50/50 ELC', interval: '5,000 hr / 5 yr' },
      { name: 'Diesel — EN 590 or ASTM D975 #2-D', note: 'Sulphur ≤ 50 ppm preferred for Tier 3+ engines.' },
    ]},
    { group: 'Belts & hoses', items: [
      { name: 'Fan / alternator belt', interval: 'Inspect 250 hr / replace 2,000 hr' },
      { name: 'Coolant hoses', interval: 'Replace 4 yr regardless of appearance' },
      { name: 'Fuel hoses', interval: '4 yr / on hardening or weeping' },
    ]},
    { group: 'Engine — wear items', items: [
      { name: 'Glow plugs / heaters (cold-start)', interval: 'On failure' },
      { name: 'Injector nozzles', interval: '4,000–8,000 hr' },
      { name: 'Turbocharger', interval: '15,000 hr / oil-condition based' },
      { name: 'Starter motor', interval: 'On low-voltage crank fault' },
    ]},
    { group: 'Generator end', items: [
      { name: 'AVR module', interval: 'On voltage instability' },
      { name: 'Bearings (NDE/DE)', interval: '20,000 hr or per vibration trend' },
      { name: 'Brushes & slip rings (brushed alternators)', interval: '10,000 hr' },
    ]},
    { group: 'Battery & charging', items: [
      { name: 'Cranking battery 12 V / 24 V', interval: '3 yr or capacity < 80%' },
      { name: 'Battery charger (float)', interval: '5 yr / on alarm' },
      { name: 'Battery cables & terminals', interval: 'Annual clean & dielectric grease' },
    ]},
    { group: 'Transfer switchgear & controls', items: [
      { name: 'ATS main contactors or motorised breaker pair', interval: 'Exercise monthly, inspect contacts annually', note: 'A switch that never moves is a switch that will not move when it matters.' },
      { name: 'Mechanical interlock assembly', interval: 'Verify annually', note: 'Prove it physically. This is what prevents paralleling the genset onto a live utility supply.' },
      { name: 'ATS controller with utility and generator sensing', interval: 'Settings review annually', note: 'The four timers — failure delay, warm-up, retransfer, cool-down — must be set for the site, not left at defaults.' },
      { name: 'Voltage and frequency sensing relays', interval: 'Function test annually' },
      { name: 'Engine start control wiring and remote-start contact', interval: 'Continuity test annually', note: 'A broken start signal is a silent failure — the genset simply never gets asked to run.' },
      { name: 'Bypass-isolation section (where fitted)', note: 'Lets the ATS be maintained without dropping load. Specify it up front; retrofitting is expensive.' },
      { name: 'Control fuses and auxiliary contacts', interval: 'Inspect annually' },
      { name: 'Manual changeover handle and operating instructions at the panel', note: 'Whoever is on site at 2 a.m. needs to be able to transfer by hand without a manual.' },
    ]},
  ],
  repairManual: [
    { fault: 'Cranks but will not start', priority: 'urgent', steps: [
      'Confirm cranking RPM ≥ 150 (battery voltage > 9.6 V under crank for 12 V).',
      'Bleed fuel system from primary filter through secondary to injection pump.',
      'Verify fuel solenoid energises on start command (24 V / 12 V coil).',
      'Check air filter ΔP and inlet shutoff flap.',
      'Probe ECU for SPN/FMI faults; clear and re-attempt.',
    ]},
    { fault: 'Black smoke under load', priority: 'urgent', steps: [
      'Inspect air filter ΔP — replace if > 6 kPa.',
      'Boost-pressure check at full load (compare against engine spec card).',
      'Injector pop test — replace any with poor spray pattern.',
      'Fuel timing on mechanical pumps; verify advance.',
    ], warning: 'Sustained black smoke wets piston rings — schedule oil sample to check fuel dilution.' },
    { fault: 'High coolant temperature', priority: 'emergency', steps: [
      'Stop engine; allow controlled cool-down — never open hot pressure cap.',
      'Verify coolant level once below 60 °C; pressure-test cap.',
      'Check thermostat opening temperature on bench (82 / 88 °C typical).',
      'Inspect water pump impeller and belt tension.',
      'Clean radiator core externally; pressure-flush if internally fouled.',
    ], warning: 'A genset that fails on coolant after only 30 minutes of load almost always has restricted ducting — recheck inlet and outlet free area.' },
    { fault: 'Low / no power output', priority: 'urgent', steps: [
      'Confirm engine reaches and holds rated RPM (50 Hz → 1,500 / 60 Hz → 1,800).',
      'Measure residual voltage across alternator output unloaded.',
      'Test AVR sensing on terminals 1–2 (typically 220–240 V single phase).',
      'Re-flash field if alternator has lost residual magnetism.',
      'Replace AVR if rotating diodes test good but excitation fails.',
    ]},
    { fault: 'Excessive vibration', priority: 'routine', steps: [
      'Tighten flexible coupling between engine and alternator.',
      'Inspect AVMs for collapsed rubber.',
      'Spectrum-analyse vibration to isolate 1× / 2× / bearing frequencies.',
      'Check alignment laser-style if engine and alternator are split-coupled.',
    ]},
    { fault: 'Frequent oil top-up required', priority: 'routine', steps: [
      'Compression test all cylinders.',
      'Crankcase pressure check (positive pressure = ring blow-by).',
      'Inspect turbocharger oil seals.',
      'Send oil sample for ferrography & viscosity.',
    ]},
    { fault: 'ATS will not transfer to genset', priority: 'emergency', steps: [
      'Confirm genset reaches rated voltage and frequency on local panel.',
      'Verify ATS sensing 415 V three-phase from genset side.',
      'Check ATS controller — utility-fail timer expired?',
      'Mechanically operate ATS in manual mode; inspect contacts for welding.',
    ]},
    { fault: 'Battery cranking but engine does not turn over', priority: 'urgent', steps: [
      'Voltage drop across starter solenoid — should be < 0.5 V at engagement.',
      'Replace solenoid if engagement intermittent.',
      'Check ring gear for chipped teeth.',
      'Verify ECU permits crank (not in lockout).',
    ]},
    { fault: 'Load keeps bouncing between utility and generator', priority: 'urgent', steps: [
      'Log the utility supply through a full episode rather than diagnosing from the ATS alone; repeated brownouts and recoveries look identical to a controller fault.',
      'Check the retransfer delay first. Set in seconds it will hand the load back to a supply that has not settled, and the cycle repeats; minutes is the normal setting.',
      'Verify the utility-failure delay is long enough to ride through momentary dips without starting the engine.',
      'Compare the sensing thresholds against the actual supply; sensing set to tight tolerances on a weak rural feeder will trip constantly.',
      'Inspect the sensing wiring and any auxiliary contacts for intermittent connections, which mimic supply failure exactly.',
      'Confirm the genset is holding its own voltage and frequency steadily — an unstable set will also fail the acceptance window and drop back.',
    ], warning: 'Every transfer is a switching event for the whole building. Repeated cycling damages motor loads, IT equipment and the ATS contacts themselves — treat it as urgent rather than as a quirk.' },
    { fault: 'Wet stacking — oily exhaust residue after long light-load running', priority: 'routine', steps: [
      'Identify the pattern: unburnt fuel and oil at the exhaust, black wet deposits around the stack, and often a loss of responsiveness under load.',
      'Establish the average load factor. A diesel engine run for long periods well below a healthy proportion of its rating never reaches proper combustion temperature, and this is the cause in most cases.',
      'Load-bank the set at a substantial proportion of nameplate for a sustained period to burn off accumulated deposits.',
      'Make it routine — a monthly loaded exercise run is what prevents recurrence, and a no-load weekly run does not achieve it.',
      'Where the site load is genuinely and permanently small, the honest fix is a smaller genset or a load-bank in the maintenance regime, not a bigger one.',
      'Inspect turbocharger and exhaust components for oil carry-over, which follows prolonged wet stacking.',
    ], warning: 'Wet stacking is caused by how the set is operated, not by a defective engine. Replacing components without changing the duty pattern simply repeats it.' },
    { fault: 'Set will not deliver rated output on load bank', priority: 'urgent', steps: [
      'Establish the facts before quoting anything: running hours, maintenance history, and the load-bank curve showing what it delivers now.',
      'Step the load up in stages and record voltage, frequency, temperature and smoke at each step; where it falls over tells you which subsystem is limiting.',
      'Frequency sagging under load points at the engine — fuel delivery, air intake restriction, injectors or compression.',
      'Voltage sagging while frequency holds points at the alternator end — AVR, excitation, or winding condition.',
      'Overheating at high load points at cooling and ventilation, which is a room problem as often as a radiator problem.',
      'Run a compression test and take an oil sample before recommending an overhaul; these two results usually settle the repair-versus-replace question.',
      'Present the finding with the evidence attached, including the option of not rebuilding where the economics do not support it.',
    ]},
  ],
  errorCodes: [
    { code: 'SPN 100 / FMI 1', family: 'J1939 (Cummins, Perkins, JD)', meaning: 'Engine oil pressure low — below shutdown threshold.', severity: 'critical', fix: ['Stop engine immediately', 'Check oil level and pressure-sender wiring', 'Replace sender if reading conflicts with manual gauge'] },
    { code: 'SPN 110 / FMI 0', family: 'J1939', meaning: 'Engine coolant temperature high.', severity: 'critical', fix: ['Allow cool-down', 'Check coolant level', 'Inspect thermostat and radiator', 'Verify ventilation free-area'] },
    { code: 'SPN 190 / FMI 0', family: 'J1939', meaning: 'Engine speed above limit (overspeed).', severity: 'critical', fix: ['Inspect governor / actuator', 'Check throttle linkage on mechanical engines', 'Verify ECU calibration not corrupted'] },
    { code: 'SPN 168 / FMI 1', family: 'J1939', meaning: 'Battery voltage low.', severity: 'medium', fix: ['Test battery capacity', 'Verify charger output 13.8–14.4 V at 12 V system', 'Replace battery if < 80% capacity'] },
    { code: 'SPN 1239 / FMI 2', family: 'J1939 (Tier 4)', meaning: 'Fuel pressure regulation fault.', severity: 'high', fix: ['Inspect rail pressure sensor', 'Check for return-line restriction', 'Bleed system'] },
    { code: 'DSE 7000-Series — "Fail to Start"', family: 'Deepsea controller', meaning: 'Cranking time exceeded without RPM detection.', severity: 'high', fix: ['Bleed fuel system', 'Verify fuel solenoid energises', 'Check magnetic pickup signal'] },
    { code: 'DSE 7000 — "Loss of Mains"', family: 'Deepsea controller', meaning: 'Detected utility outage; standby start sequence active.', severity: 'low', fix: ['Verify ATS will accept transfer', 'Confirm genset reaches V and Hz windows'] },
    { code: 'PowerCommand — "Fault Code 1438"', family: 'Cummins PCC', meaning: 'Fail to crank — typically starter / battery issue.', severity: 'high', fix: ['Test battery under crank load', 'Inspect starter solenoid', 'Check engine harness ground'] },
    { code: 'ComAp — "GenStop"', family: 'InteliLite / InteliGen', meaning: 'Generic stop alarm. Drill into binary inputs.', severity: 'high', fix: ['Identify which binary input triggered', 'Verify sensor and wiring', 'Reset and re-test under load'] },
    { code: 'AVR loss-of-sensing', family: 'Stamford / Marathon', meaning: 'AVR no longer sees output voltage; field collapses.', severity: 'high', fix: ['Verify sensing fuses', 'Check AVR connector tightness', 'Replace AVR if field re-flash does not restore output'] },
    { code: 'Reverse-power trip', family: 'Generator protection relay', meaning: 'Genset motoring on parallel runs.', severity: 'high', fix: ['Check governor minimum-fuel setting', 'Verify load-share lines on parallel sets', 'Inspect prime-mover power'] },
    { code: 'Overcurrent (51) trip', family: 'Generator protection relay', meaning: 'Sustained current above pickup setting.', severity: 'high', fix: ['Identify offending feeder', 'Verify CT polarity and ratio', 'Check protection grading vs downstream MCB'] },
    { code: 'Engine start signal absent', family: 'ATS controller', meaning: 'Utility failure detected but no start command reached the genset — the set never gets asked to run.', severity: 'critical', fix: ['This fails silently and is only discovered during an outage — test it deliberately every month', 'Check continuity of the remote-start wiring between ATS and genset control panel', 'Verify the genset control switch is in AUTO, not OFF or MANUAL', 'Confirm the start relay and its auxiliary contacts operate'] },
    { code: 'Sync-check (25) block', family: 'Closed-transition ATS', meaning: 'Sources are not within the voltage, frequency and phase-angle window required to close both together, so transfer is inhibited.', severity: 'high', fix: ['Verify genset frequency and voltage are stable and within the acceptance window', 'Check governor and AVR trim on the set', 'Confirm phase rotation matches between sources after any switchgear work', 'Never defeat a sync-check on a closed-transition switch — out-of-phase closure is destructive'] },
    { code: 'Emergency stop / lockout active', family: 'Genset control panel', meaning: 'An E-stop or a latched protective shutdown is holding the set inoperable.', severity: 'critical', fix: ['Identify which device latched before resetting anything — the lockout recorded a real event', 'Check every E-stop station in the loop, including remote ones outside the genset room', 'Read the shutdown history in the controller for the originating alarm', 'Reset only after the underlying cause is understood and corrected'] },
    { code: 'Low coolant level pre-alarm', family: 'Genset control panel', meaning: 'Coolant has dropped below the sensor threshold; a shutdown on high temperature will follow if it is ignored.', severity: 'high', fix: ['Treat a repeating low-level alarm as a leak, not as a top-up task', 'Pressure-test the cooling system and inspect hoses, the pump seal and the core', 'Top up with the correct pre-mixed coolant, never plain water', 'Investigate before the next loaded run — this alarm precedes most overheating shutdowns'] },
  ],
  diagrams: ['gen-single-line', 'gen-fuel-system', 'gen-cooling-loop', 'ats-wiring', 'gen-grounding'],
  roi: [
    { scenario: '50 kVA Cummins — small clinic standby', capex: 'KES 1.4M – 1.8M', annualSaving: 'Loss-of-revenue avoided ≈ KES 350k', payback: '4–5 years', notes: 'Assumes 8 outages × 6 hr × KES 7,000/hr revenue.' },
    { scenario: '250 kVA Cummins — mid-size hospital', capex: 'KES 4.5M – 6M', annualSaving: 'Outage cost ≈ KES 1.2M + KPLC penalties avoided', payback: '3–4 years', notes: 'Critical to size alternator for MRI inrush.' },
    { scenario: '500 kVA dual-set parallel — manufacturing', capex: 'KES 12M – 15M', annualSaving: 'Production loss avoided ≈ KES 3M + utility demand-charge optimisation', payback: '2.5–3 years', notes: 'Run as peak-shaving outside outages.' },
    { scenario: '1 MVA MTU — Tier-3 data centre', capex: 'KES 30M – 40M', annualSaving: 'SLA-credit avoidance ≈ KES 8M / yr', payback: '4–5 years', notes: 'Closed-transition ATS mandatory.' },
    { scenario: 'ATS retrofit to a manual changeover installation', capex: 'KES 350k – 1.5M depending on rating', annualSaving: 'Every outage becomes seconds of interruption instead of however long it takes someone to reach the panel', payback: 'Within the first year on most commercial sites', notes: 'A common gap on otherwise well-specified installations. A genset behind a manual switch protects nothing overnight, at weekends, or whenever the person who knows the procedure is not on site.' },
    { scenario: 'Engine overhaul vs replacement — 250 kVA set at high hours', capex: 'Overhaul KES 1.5M – 3M vs new set KES 4.5M – 6M', annualSaving: 'Depends entirely on remaining life, which is why we insist on the evidence first', payback: 'Overhaul typically justified where the block, alternator and controls are sound', notes: 'Ask for the load-bank result, the compression figures and an oil sample before accepting any overhaul quote — including ours. Those three numbers decide it, and occasionally they say do neither.' },
  ],
  warrantyOptions: [
    'OEM standard 24 months / 1,000 hr',
    'Extended OEM 5 yr / 5,000 hr — requires PMS contract',
    'Loadbank-test certificate annually keeps warranty live',
  ],
  qualityChecks: [
    'Megger insulation resistance test on alternator — ≥ 1 MΩ/kV +1',
    'Cooling system pressure-test 100 kPa for 10 minutes',
    'Oil sample tribology every 250 hr',
    'Thermography of switchgear connections at 80% load',
    'Earth-loop impedance test on every distribution circuit',
    'ATS mechanical interlock proven physically, not assumed from the drawing',
    'All four ATS timers set for the site and recorded on the commissioning sheet',
    'Black-start proven by opening the utility supply deliberately under load',
    'Remote-start wiring continuity tested — the silent failure mode',
    'Monthly loaded exercise run scheduled and logged, not a no-load run',
  ],
  fastRepairCallouts: [
    'Stocked critical spares: AVR, starter motor, fuel solenoid, water pump, thermostat',
    'Mobile load bank (75–500 kW) deployable in Nairobi metro within 4 hr',
    '24/7 hotline +254 768 860 665 — escalation to OEM tech support',
    'Common ECU programmers on hand: Cummins INSITE, Perkins EST, CAT ET',
  ],
  references: [
    'ISO 8528 — Reciprocating internal combustion engine driven AC generators',
    'BS 7698 / ISO 8528 (UK) — performance classes',
    'NFPA 110 — emergency and standby power systems',
    'IEC 60364-7-710 — medical locations',
    'IEEE 446 — recommended practice for emergency power',
    'SAE J1939 — vehicle network for diesel ECU diagnostics',
    'IEC 60947-6-1 — automatic transfer switching equipment',
    'ISO 8528-5 — generating sets, performance classes G1–G4 and load-acceptance requirements',
    'ISO 3046 — reciprocating internal combustion engines, performance and derating',
    'NFPA 111 — stored electrical energy emergency and standby power systems',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HIGH-VOLTAGE / DISTRIBUTION-BOARDS BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const DISTRIBUTION_BIBLE: ServiceBible = {
  family: 'high-voltage',
  hero: {
    headline: 'The HV / Distribution Bible',
    subhead: 'From 11 kV substation termination to the final RCBO in the kitchen — coordinated, earthed, and audited.',
  },
  intro: [
    'A modern distribution system is a chain: utility / genset → main switchgear → distribution boards → final circuits. Each link has its own protection device, its own short-circuit rating, and its own coordination with the device upstream and downstream. Get the chain right and a fault clears in 50 ms with one breaker; get it wrong and a fault takes the building dark.',
    'Cable sizing is the most common source of trouble. BS 7671 Tables 4 specify ampacity by installation method (clipped, conduit, tray, ground, derated for grouping and ambient). The rule is conductor must carry full-load current × 1.25 continuous, plus voltage drop ≤ 3% to the MDB and ≤ 5% to the final socket. Two separate checks have to pass and it is common for only the first to be done. Take a 4 mm² run of 35 m on a 32 A circuit: the conductor is already at the edge of its rating once grouping and ambient derating are applied, and on volt drop it fails outright — roughly 11 mV per amp per metre single-phase gives about 12 V, over 5% of 230 V. The breaker will not object to either condition, because a cable running hot and a cable running at reduced voltage are both perfectly normal current-wise. The consequence is chronic overheating of insulation and undervolted equipment, which shortens the life of both.',
    'Earthing strategy precedes everything. TT, TN-S, TN-C-S and IT systems each have specific earth-fault behaviours. East-African urban supplies are typically TN-C-S; medical wards must be IT (isolated) for life-protection circuits. Mixing strategies inside one building is a recipe for circulating currents and tripping nuisance.',
    'Protection coordination uses two graphs side-by-side: the upstream device curve and the downstream device curve. Discrimination means the downstream curve sits entirely below the upstream curve up to the let-through current. Modern Schneider, ABB, Siemens, and Eaton catalogues publish let-through tables that make this almost mechanical — but only if the engineer reads them.',
    'Short-circuit current at the busbar must be calculated, not guessed. The transformer impedance, source impedance, and cable run determine prospective fault current. Type-2 coordinated motor starters require this number to specify the contactor ratings; an MCB rated 6 kA on a 25 kA bus will explode rather than trip.',
    'Harmonics from rectifiers, VSDs, UPS systems, and LED lighting now dominate the harmonic profile of commercial buildings. The classic over-rated neutral conductor and K-rated transformers are still the right answer; ignoring them produces neutral overheating fires that are mis-attributed to "overloaded" sockets.',
    'Switchgear types: ACBs (air circuit breakers) for incoming mains, MCCBs (moulded case) for distribution feeders, MCBs / RCBOs for final circuits. RCDs come in Type AC, A, F, and B — Type B mandatory anywhere DC components exist (EV chargers, VSDs, solar inverters). A Type AC RCD downstream of a VSD can become "blind" to earth faults — silent and dangerous.',
    'Capacitor-bank power-factor correction must be detuned (typically 7% reactor) on harmonic-rich sites or it amplifies the 5th and 7th harmonics into resonance. We have rebuilt three Nairobi industrial PF banks in 2025 that exploded for exactly this reason; the original installer specified untuned capacitors.',
    'Documentation is part of the install, not an afterthought. The single-line, switchboard schedule, earth-loop test results, insulation-resistance log, and thermography baseline form the commissioning pack. Without them there is no defensible answer when an inspector or an insurance adjuster asks "what is the prospective fault current at this point in 2026?"',
    'Maintenance follows two timelines. Annually: thermography of every joint at 50% load or more. Judge a hotspot by comparison, not against room temperature — the meaningful number is the temperature difference between a joint and a similar joint carrying a similar current, because ambient tells you nothing about how hard the connection is working. Standard practice treats a few degrees of difference as worth monitoring, roughly 5–15 °C as a deficiency to schedule, and anything beyond that as requiring immediate attention, with any joint above its insulation or component rating taken out of service regardless of the delta. Where no similar joint exists to compare against, use the rise above the ambient inside the enclosure rather than the room. Five-yearly: secondary injection on every protective relay to verify pickup and time-delay. Skipping the second test means relying on hope.',
    'Arc-flash is the risk that switchboard specifications routinely ignore. Incident energy at a busbar is a function of prospective fault current and clearing time — halve the upstream relay time and you roughly halve the incident energy. IEC 61439 assemblies with Form-3b or Form-4b segregation limit how far an arc can propagate between functional units, and a maintenance-mode setting group (reduced instantaneous pickup while a technician is inside the board) is the cheapest arc-flash control available. Label every board with its calculated incident energy and the PPE category required to work on it live.',
    'Kenyan sites add three local variables to the textbook. First, supply quality: 415 V / 240 V nominal with statutory tolerance, but rural feeders routinely sag well below that at peak, and sustained under-voltage running is among the leading causes of motor and compressor burnout. Second, lightning: the Rift Valley and Lake Victoria basin sit in one of the highest ground-flash-density regions on earth, which makes coordinated Type 1 + Type 2 surge protection a necessity rather than a luxury. Third, regulation: installation work is licensed under EPRA, and the wiring rules referenced in Kenyan practice track BS 7671 / KS IEC 60364 — an installation certificate signed by a licensed electrician is what makes the work insurable.',
  ],
  topBrands: [
    { name: 'Schneider Electric', origin: 'France', founded: '1836', capability: 'Full LV/MV ecosystem — Acti9 MCBs, Compact NSX MCCBs, Masterpact ACBs, Prisma boards. EcoStruxure digitalisation.', bestFor: ['Premium commercial', 'Healthcare', 'Data centre'], warranty: '24 months std', tier: 'premium', notes: 'Acti9 iC60 RCBOs — reference choice for residential / light commercial.' },
    { name: 'ABB', origin: 'Switzerland / Sweden', founded: '1988 (merger)', capability: 'SACE Tmax / Emax breakers, MNS switchgear, REF / REJ relays. Strong utility-grade.', bestFor: ['Utility', 'Industrial', 'Mining'], warranty: '24 months std', tier: 'premium', notes: 'Emax 2 ACBs are the European reference for incomers > 1,000 A.' },
    { name: 'Siemens', origin: 'Germany', founded: '1847', capability: 'SENTRON 3VA / 3WL breakers, SIVACON boards, SIPROTEC relays. Excellent IEC 61850 stations.', bestFor: ['Industry', 'Utility', 'Process'], warranty: '24 months std', tier: 'premium', notes: 'Siprotec 7SJ relays — world-standard motor protection.' },
    { name: 'Eaton', origin: 'United States / Ireland', founded: '1911', capability: 'xPole MCBs, Power Defense MCCBs, Magnum DS ACBs, IEC + UL ranges.', bestFor: ['Mixed-standard plants', 'Healthcare', 'Commercial'], warranty: '24 months std', tier: 'premium', notes: 'Strong UL/IEC dual-spec offering — useful in mining clients with US-spec equipment.' },
    { name: 'Legrand', origin: 'France', founded: '1860', capability: 'DX³ MCBs, DPX MCCBs, XL3 enclosures, sockets and final-wiring accessories.', bestFor: ['Hospitality', 'Office', 'Residential premium'], warranty: '24 months std', tier: 'mid', notes: 'Strong on aesthetics and wiring accessory range.' },
    { name: 'Hager', origin: 'Germany / France', founded: '1955', capability: 'Volta / Quadro consumer units, MCB / RCBO ranges to BS EN 61009.', bestFor: ['Residential', 'Light commercial'], warranty: '24 months std', tier: 'mid', notes: 'BS-7671-aligned product line — popular in UK-spec residential builds.' },
    { name: 'Chint', origin: 'China', founded: '1984', capability: 'NXB MCBs, NM8 MCCBs, NXM ACBs — IEC 60898 / IEC 60947 compliant.', bestFor: ['Cost-sensitive commercial', 'Government tender'], warranty: '24 months std', tier: 'value', notes: 'Verify holographic seals; counterfeits are common.' },
    { name: 'Mitsubishi Electric', origin: 'Japan', founded: '1921', capability: 'NF / NV MCCBs, MS-T contactors, motor-protection circuit-breakers.', bestFor: ['Industrial controls', 'Manufacturing'], warranty: '24 months std', tier: 'premium', notes: 'Class-leading endurance on motor-protection circuit breakers.' },
    { name: 'Schrack Technik', origin: 'Austria', founded: '1895', capability: 'BX / BC MCB / RCBO ranges, modular relay accessories.', bestFor: ['DIN-rail control panels', 'Automation cabinets'], warranty: '24 months std', tier: 'mid', notes: 'Often paired with PLC cabinets in automation work.' },
    { name: 'Havells', origin: 'India', founded: '1958', capability: 'Euro-II MCBs, switchgear, capacitor banks. ISI + IEC certified.', bestFor: ['SME', 'Light commercial'], warranty: '24 months std', tier: 'mid', notes: 'Strong logistics in East Africa — fast availability.' },
  ],
  installPhases: [
    { phase: '1. Load schedule', goal: 'Compile every circuit, kVA, demand factor.', checklist: ['List every motor, lighting circuit, socket', 'Apply NEC / BS demand factors', 'Compute total connected and diversified load'] },
    { phase: '2. Single-line drawing', goal: 'Document the topology before procurement.', checklist: ['Source / transformer / genset on top', 'ATS / main switchgear', 'All sub-boards with breaker ratings', 'Cable sizes and route'] },
    { phase: '3. Short-circuit & coordination study', goal: 'Verify breaker sequence and cable withstand.', checklist: ['Calculate Ipk at every busbar', 'Plot upstream/downstream let-through curves', 'Confirm cable I²t < breaker I²t at fault'] },
    { phase: '4. Switchgear procurement', goal: 'OEM-genuine, correctly rated, correctly enclosed.', checklist: ['IP rating per location (IP54 generally, IP65 wet)', 'IK rating against impact', 'Form-segregation level (Form 2 / 3 / 4 per load criticality)'] },
    { phase: '5. Cable installation', goal: 'Mechanical and thermal protection assured.', checklist: ['Trefoil layout for single-core > 240 mm²', 'Spacing per current rating tables', 'Glanding torque per OEM', 'Pulling tension below cable maximum'] },
    { phase: '6. Earthing & bonding', goal: 'Single-fault clears within disconnection time.', checklist: ['Earth electrode test (fall-of-potential)', 'Main earth bar bonded to structure', 'Equipotential bonding to gas/water/lift'] },
    { phase: '7. Testing & energisation', goal: 'Every circuit verified before live.', checklist: ['Continuity', 'Insulation resistance ≥ 1 MΩ phase-earth', 'Polarity', 'Earth-fault loop impedance', 'RCD trip-time test'] },
    { phase: '8. Documentation & handover', goal: 'Building owner has audit-ready records.', checklist: ['As-built single-line', 'Test certificates', 'Warranty cards', 'Operator schedule'] },
  ],
  partsManual: [
    { group: 'Protection devices', items: [
      { name: 'MCB 6 / 10 / 16 / 20 / 32 / 63 A — Curve B/C/D' },
      { name: 'RCBO 30 / 100 / 300 mA — Type AC / A / B' },
      { name: 'MCCB 100 / 250 / 400 / 630 A' },
      { name: 'ACB 800 / 1,250 / 1,600 / 2,500 A' },
    ]},
    { group: 'Cables', items: [
      { name: 'XLPE/SWA/PVC 4-core 1.5 to 300 mm²' },
      { name: 'Single-core XLPE 50 to 630 mm²' },
      { name: 'Fire-resistant CWZ / FP200 for life-safety circuits' },
      { name: 'PVC flexible H07RN-F for portable equipment' },
    ]},
    { group: 'Accessories', items: [
      { name: 'Cable lugs / glands brass IP66' },
      { name: 'Heat-shrink and resin joints for HV cables' },
      { name: 'Earth electrodes copper / copper-bonded' },
      { name: 'Surge protection devices Type 1+2 / Type 2' },
    ]},
    { group: 'Test equipment recommended', items: [
      { name: 'Megger MFT 1741+ multifunction tester' },
      { name: 'Fluke 1664 FC' },
      { name: 'Earth-loop impedance / RCD time-delay tester' },
      { name: 'Thermography camera ≥ 320 × 240 px' },
    ]},
    { group: 'Metering & monitoring', items: [
      { name: 'Three-phase power-quality meter (Class 0.5S)', interval: 'Calibrate 3 yr', note: 'Log THD-V, THD-I and neutral current, not just kWh.' },
      { name: 'Split-core current transformers 100–1,000 A', note: 'Match CT ratio to the meter — a mismatched ratio silently scales every reading.' },
      { name: 'Maximum-demand indicator / kVA logger', interval: 'Download monthly', note: 'The evidence base for negotiating a KPLC demand tariff.' },
      { name: 'Modbus / Ethernet gateway for BMS integration', interval: 'Firmware review annually' },
      { name: 'Panel-mounted voltage & phase-failure relay', interval: 'Function test annually' },
    ]},
    { group: 'Panel-build hardware', items: [
      { name: 'Copper busbar 20 × 5 mm to 100 × 10 mm', note: 'Rate by cross-section and ventilation, not by breaker size alone.' },
      { name: 'Busbar supports and phase barriers', note: 'Required to achieve Form-3b / Form-4b segregation.' },
      { name: 'DIN rail, trunking and terminal blocks', note: 'Leave 30% spare way capacity at handover — every board grows.' },
      { name: 'Panel cooling — filter fans / thermostat', interval: 'Filter change 6 mo', note: 'Internal rise > 15 °C above ambient derates every device inside.' },
      { name: 'Anti-condensation heater with hygrostat', note: 'Essential for outdoor and coastal enclosures.' },
      { name: 'Arc-flash and circuit-identification labelling', interval: 'Re-verify after every modification' },
    ]},
  ],
  repairManual: [
    { fault: 'RCD trips intermittently', priority: 'urgent', steps: [
      'Identify circuits on the RCD; isolate one at a time.',
      'Insulation-resistance test phase-earth and neutral-earth.',
      'For Type AC RCDs, suspect VSD / EV / inverter — upgrade to Type A or B.',
      'Inspect socket outlets for moisture ingress (kitchens, washrooms).',
    ]},
    { fault: 'MCB trips on starting motor', priority: 'routine', steps: [
      'Verify curve type — Curve C (5–10×) for general; Curve D (10–20×) for transformers / motors.',
      'Apply soft-starter or DOL → star-delta conversion for > 7.5 kW motors.',
      'Validate cable sizing isn\'t producing voltage sag at start.',
    ]},
    { fault: 'Hot busbar / connection', priority: 'emergency', steps: [
      'De-energise; measure resistance across the suspect joint.',
      'Re-torque to OEM value (commonly 35 / 70 / 140 Nm by busbar size).',
      'Replace tarnished hardware; never re-use stretched bolts.',
      'Re-thermograph at 50% and 80% load.',
    ], warning: 'A connection that has run > 90 °C should be replaced — the surrounding insulation is degraded.' },
    { fault: 'Capacitor bank tripping continuously', priority: 'urgent', steps: [
      'Measure THD-V at busbar — > 5% suggests harmonic resonance.',
      'Add 7% detuning reactor in series with each step.',
      'Verify discharge resistors and contactor pre-charge logic.',
    ]},
    { fault: 'Voltage drop excessive', priority: 'routine', steps: [
      'Measure under load at incomer and at far-end socket.',
      'Compute drop vs cable size; upgrade if > 5%.',
      'Re-balance phases — uneven loading inflates drop on heaviest phase.',
    ]},
    { fault: 'Earth-fault loop impedance fails', priority: 'urgent', steps: [
      'Verify earth-electrode resistance.',
      'Inspect main bonding to MET.',
      'Check continuity of CPC throughout final circuit.',
      'Tighten earth-strap on switchgear assembly.',
    ]},
    { fault: 'Neutral conductor running hotter than the phases', priority: 'emergency', steps: [
      'Clamp all four conductors simultaneously — neutral current above the highest phase current confirms triplen harmonics, not imbalance.',
      'Measure THD-I and the 3rd-harmonic component at the busbar; single-phase rectifier loads (LED drivers, PCs, small UPS) are the usual source.',
      'Thermograph the neutral bar and every neutral termination — these run cool on a healthy board.',
      'Uprate the neutral to 100% or 200% of phase cross-section on the affected sub-main, or split the load across a second board.',
      'Where the source is a transformer, specify a K-rated or double-neutral unit at replacement rather than derating in place.',
    ], warning: 'A neutral has no overcurrent device protecting it. Harmonic neutral overheating is invisible to the breaker and is a common cause of board fires mis-recorded as "overload".' },
    { fault: 'Surge protection device shows end-of-life indicator', priority: 'routine', steps: [
      'Read the window indicator or remote-signalling contact — green/red flag means the MOV has degraded, not that a fault is present now.',
      'Confirm the SPD backup fuse or dedicated MCB has not operated; replace it together with the module.',
      'Replace the plug-in module only — the base stays. Match Type (1, 2 or 1+2), Uc, and In / Iimp ratings exactly.',
      'Verify the connecting leads are ≤ 0.5 m total; long leads add inductive volt-drop that defeats the SPD entirely.',
      'Log the event date — repeated module loss within a season means the site needs upstream Type 1 protection at the incomer.',
    ]},
    { fault: 'Single-phasing on a three-phase board', priority: 'emergency', steps: [
      'Measure all three phase-to-neutral and phase-to-phase voltages at the incomer, then again at the busbar — a difference isolates the fault to the board.',
      'Inspect the incoming fuse or breaker pole for a single blown element or a failed-open contact.',
      'Check the incoming cable terminations under thermography before re-energising; a loose lug can open under load and re-make when cool.',
      'Compute the percentage voltage unbalance. As a rule of thumb the resulting current unbalance in a connected motor is roughly six to ten times the voltage unbalance, and the winding temperature rise increases by about twice the square of the percentage — so 2% voltage unbalance means roughly 12–20% current unbalance and around 8% extra temperature rise.',
      'Fit a phase-failure / unbalance relay ahead of every motor group before returning the board to service.',
    ], warning: 'Three-phase motors left running single-phased will burn out within minutes. Isolate motor circuits first, then diagnose the board.' },
  ],
  errorCodes: [
    { code: 'I> trip', family: 'IDMT relay', meaning: 'Inverse-time overcurrent', severity: 'high', fix: ['Identify offending feeder', 'Verify CT secondary wiring', 'Re-grade if discrimination broken'] },
    { code: 'I>>', family: 'IDMT relay', meaning: 'Instantaneous overcurrent — short-circuit', severity: 'critical', fix: ['Inspect feeder for fault', 'IR test before re-energising', 'Replace breaker if welded'] },
    { code: 'IE>', family: 'Earth-fault relay', meaning: 'Earth-fault current above pickup', severity: 'high', fix: ['Locate earth fault by section', 'Megger to identify damaged cable', 'Repair cable / replace gland seal'] },
    { code: 'V>', family: 'Voltage relay', meaning: 'Over-voltage', severity: 'medium', fix: ['Check tap-changer setting', 'Verify AVR on genset', 'Inspect capacitor bank step engagement'] },
    { code: 'V<', family: 'Voltage relay', meaning: 'Under-voltage', severity: 'medium', fix: ['Inspect transformer tap', 'Verify cable size at long runs', 'Reduce load on affected feeder'] },
    { code: 'F>', family: 'Frequency relay', meaning: 'Over-frequency on island', severity: 'medium', fix: ['Verify governor on local genset', 'Tune droop if multiple sets parallel'] },
    { code: 'BUCH-1 / BUCH-2', family: 'Buchholz relay (transformer)', meaning: 'Gas accumulation / surge — internal fault', severity: 'critical', fix: ['Take oil sample for DGA', 'Isolate transformer until OEM diagnosis'] },
    { code: 'OLI', family: 'Oil-temperature indicator', meaning: 'Top-oil over temperature', severity: 'high', fix: ['Reduce load', 'Inspect cooling fans', 'Verify oil level'] },
    { code: 'WTI', family: 'Winding-temperature indicator', meaning: 'Winding hotspot over temperature', severity: 'high', fix: ['Reduce load', 'Confirm fan / pump auxiliaries running', 'Check current transformer signal'] },
    { code: '46 — reverse-phase / phase-balance current', family: 'ANSI/IEEE C37.2 device function', meaning: 'Negative-sequence current above pickup — the three phase currents are unbalanced. Connected motors overheat on negative-sequence current. The voltage-side equivalent is device 47 (phase-sequence / phase-balance voltage), which is what detects reversed rotation.', severity: 'high', fix: ['Measure all three phase currents and voltages, and compute % unbalance for each', 'Check for a blown fuse or open pole upstream', 'Rebalance single-phase loads across the three phases', 'Confirm phase rotation with a rotation meter after any switchgear work'] },
    { code: '87 — differential', family: 'ANSI/IEEE device function', meaning: 'Current entering the protected zone does not equal current leaving it — internal fault in transformer, busbar or cable.', severity: 'critical', fix: ['Do not re-energise on a differential trip', 'Insulation-resistance and DGA test the protected plant', 'Verify CT ratios, polarity and wiring before blaming the relay', 'Escalate to OEM or specialist test house'] },
    { code: '49 — thermal overload', family: 'ANSI/IEEE device function', meaning: 'Thermal replica model has reached trip threshold — sustained current below instantaneous pickup.', severity: 'medium', fix: ['Log the load profile before resetting', 'Check ambient and enclosure temperature', 'Verify the thermal setting matches the cable and load, not the breaker frame'] },
    { code: 'AFDD trip', family: 'IEC 62606 arc-fault detection', meaning: 'Series or parallel arcing signature detected in a final circuit.', severity: 'high', fix: ['Inspect socket outlets, joints and flexible cords for loose terminals and damaged insulation', 'Insulation-resistance test the circuit', 'Distinguish nuisance operation from real arcing by isolating loads one at a time', 'Do not replace an AFDD with a plain MCB to stop the tripping'] },
    { code: 'SPD end-of-life flag', family: 'IEC 61643 surge protection', meaning: 'Varistor has degraded past its useful life; the circuit is now unprotected.', severity: 'medium', fix: ['Replace the plug-in module, matching Type, Uc and In/Iimp', 'Check and replace the SPD backup fuse', 'Keep total connecting-lead length under 0.5 m', 'Repeated failures indicate the need for Type 1 protection at the incomer'] },
  ],
  diagrams: ['mdb-layout', 'gen-grounding', 'ats-wiring', 'gen-single-line'],
  roi: [
    { scenario: 'MDB upgrade — 200 A → 400 A office', capex: 'KES 850k – 1.2M', annualSaving: 'Avoided downtime ≈ KES 400k', payback: '2–3 years', notes: 'Often paid back by insurance premium reduction alone.' },
    { scenario: 'Capacitor bank with detuning — 200 kVAR factory', capex: 'KES 1.6M', annualSaving: 'Reactive-charge & demand reduction ≈ KES 600k', payback: '2.5 years', notes: 'PF improves from 0.78 → 0.96; eliminates KPLC reactive penalty.' },
    { scenario: 'Switchgear thermography programme', capex: 'KES 250k / yr', annualSaving: 'Failure avoidance ≈ KES 1.5M', payback: 'First incident', notes: 'Equivalent to one avoided panel-fire incident.' },
    { scenario: 'Coordinated Type 1 + Type 2 surge protection — lightning-exposed site', capex: 'KES 400k – 700k', annualSaving: 'Equipment replacement avoided ≈ KES 800k – 1.5M', payback: '1 storm season', notes: 'Costed against one lost inverter plus one control panel — a routine loss in high ground-flash-density areas.' },
    { scenario: 'Form-4b switchboard replacement — hospital theatre block', capex: 'KES 3.5M – 5M', annualSaving: 'Arc-flash exposure and unplanned theatre closure avoided', payback: 'Compliance-driven', notes: 'Justified by IEC 60364-7-710 duty of care rather than energy savings; segregation allows maintenance without dropping the whole board.' },
  ],
  warrantyOptions: [
    'OEM 24-month component warranty',
    'Workmanship warranty 12 months',
    'Annual inspection contracts that extend OEM warranty by 12 months',
  ],
  qualityChecks: [
    'Continuity of conductors (R1 + R2)',
    'Insulation resistance ≥ 1 MΩ phase-earth',
    'Polarity check on every socket',
    'Earth-fault loop impedance < tabulated maximum',
    'RCD trip-time at 1× and 5× IΔn',
    'Thermography baseline at 50% load',
    'Phase-balance check — no phase more than 10% off the mean at handover',
    'Neutral current logged against phase current to detect harmonic loading',
    'Torque-audit of every busbar and lug connection against the OEM value, recorded per joint',
  ],
  fastRepairCallouts: [
    'Stocked: MCB / RCBO 6–63 A, common MCCB 100–400 A frames',
    'Cable terminations to 240 mm² on van',
    'Megger 1741+ on every callout',
    'Live-line tools rated 1 kV for energised inspection',
  ],
  references: [
    'BS 7671:2018+A2:2022 — Requirements for Electrical Installations',
    'IEC 60364 — Electrical installations of buildings',
    'IEC 60898 / 60947 — Circuit-breakers',
    'IEC 61009 — Residual current operated circuit-breakers',
    'IEEE 519 — Harmonic control in electrical power systems',
    'IEC 61439 — Low-voltage switchgear and controlgear assemblies (forms of separation)',
    'IEC 61643 — Low-voltage surge protective devices',
    'IEC 62606 — General requirements for arc fault detection devices',
    'IEC 62305 — Protection against lightning',
    'IEEE 1584 — Guide for performing arc-flash hazard calculations',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SOLAR BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const SOLAR_BIBLE: ServiceBible = {
  family: 'solar',
  hero: {
    headline: 'The Solar PV Bible',
    subhead: 'On-grid, off-grid, hybrid — sized, oriented, earthed, and bankable.',
  },
  intro: [
    'Solar PV is misunderstood as a panel-and-inverter purchase. It is in fact a complete electrical system: array, DC isolation, MPPT optimisation, inverter, AC isolation, metering, storage, and distribution. The panel rating in watts is barely a quarter of what determines whether the plant pays back inside 5 years or 15.',
    'Site irradiance is the first input. Nairobi sees ≈ 5.5 kWh/m²/day average GHI; Northern Kenya pushes 6.5; Mombasa coastal humidity drops effective generation. NASA POWER and Solargis databases give locational means but only on-site pyranometer data — even one month — captures soil, shade and microclimate.',
    'Tilt and orientation: in Kenya (latitude 1° S to 4° N) the equator-facing tilt of 10–15° is mathematically optimal but visually almost flat; many architects insist on 15–25° for self-cleaning. The trade-off is annual yield vs water-shedding — a 5-degree mismatch costs ~1% annual generation, soil loss to dust costs 3–5%.',
    'Module choice today is between mono-PERC, TOPCon, and HJT cells. Bifacial modules add 5–15% rear-side gain when mounted over high-albedo surfaces. Polycrystalline still appears in cheap imports but is now obsolete — efficiency 15% vs 21–24% for current mono-PERC, with worse temperature coefficient.',
    'String voltage matters more than panel count, and it is set by the coldest morning rather than the hottest afternoon. Open-circuit voltage rises as cell temperature falls: a modern mono-PERC or TOPCon module has a Voc temperature coefficient of roughly −0.25 to −0.30 %/°C, so at 5 °C in the Kenyan highlands at dawn — twenty degrees below the 25 °C STC reference — Voc sits about 5–6% above its nameplate figure. Size the string on that corrected figure: N × Voc(stc) × (1 + coefficient × ΔT) must stay below the inverter\'s maximum DC input voltage, with margin. Note that the module datasheet coefficient is the number to use; applying a generic multiplier instead is how strings end up either over the inverter limit or needlessly short. Exceeding maximum DC voltage does not simply reduce output — the inverter trips on DC overvoltage and sustained excursions damage the input stage, which is not a warranty claim you will win.',
    'Inverter topology: string inverters (Sungrow, Huawei, SolarEdge, Fronius, GoodWe) for residential and small-commercial; central inverters (SMA, Sungrow, Power Electronics) for utility scale; microinverters (Enphase) for residential with shading. Hybrid inverters (Victron, Deye, Sungrow Hybrid, GoodWe ET) integrate batteries on the same DC bus.',
    'Battery technology in 2026 is dominated by LiFePO₄ (LFP) cells. Lead-acid is gone from new commercial installs — its 50% depth-of-discharge ceiling and 1,500-cycle life can\'t compete with LFP\'s 80–90% DoD and 6,000 cycles. Pylontech, BYD, BSLBATT, Dyness and Huawei LUNA are the workhorses; Tesla Powerwall remains premium residential.',
    'DC isolation is non-negotiable. IEC 60364-7-712 and the AS/NZS 5033 derivative require lockable DC isolators within 3 m of the array (rooftop) and at the inverter end. We see imported Chinese kits omit the rooftop isolator — that single missing component blocks any compliance certificate and voids fire insurance.',
    'Earthing and lightning: PV arrays are large equipotential mats that attract direct strikes. Class I SPDs at array entry and class II at inverter AC output are mandatory. Equipment earth bonding must achieve < 0.1 Ω across the array structure. Inadequate bonding is the leading cause of inverter electronics frying after thunderstorms in the highlands.',
    'Long-term performance is dominated by soiling and degradation. Modules degrade 0.4–0.7%/yr (LID + LeTID); soiling can cost 5–10%/yr if uncleaned. A robust O&M contract includes monthly cleaning, quarterly thermography (cell hot-spots indicate cracks), and annual IV-curve tracing. Sites without it lose 15–20% generation by year 5 vs spec.',
    'The financial model decides the design, not the other way round. Kenya\'s Energy Act 2019 provides for net metering on systems up to 1 MW, but the practical rollout has been slow and the terms depend on your supply agreement, so the sound approach is to size for self-consumption first and treat any export credit as upside rather than as the basis of the business case. That single assumption changes the answer: a self-consumption design puts the array where the daytime load is, keeps the DC/AC ratio near 1.2, and only adds storage where the evening load or outage exposure justifies it. Systems sized on annual kWh instead of the hourly load curve routinely generate power at noon that nobody on site is using.',
    'Fire safety on rooftop PV is the part that gets skipped. A live array cannot be switched off by the fire brigade — daylight alone keeps the DC side energised — which is why rooftop DC isolation, clear array-boundary marking, and a documented shutdown procedure at the main entrance matter as much as the electrical design. Roof structure deserves the same rigour: a ballasted flat-roof array adds meaningful dead load plus wind uplift, and uplift, not weight, is what removes arrays from Kenyan industrial sheet roofs. Get a structural sign-off in writing before the first rail is fixed.',
  ],
  topBrands: [
    { name: 'JinkoSolar', origin: 'China', founded: '2006', capability: 'Tier-1 modules. Tiger Neo TOPCon 575–625 W series. Strong bankability (Bloomberg Tier 1).', bestFor: ['Utility', 'Commercial rooftop'], warranty: '12 yr product / 30 yr linear performance', tier: 'mid', notes: '#1 global module shipments multiple years.' },
    { name: 'JA Solar', origin: 'China', founded: '2005', capability: 'DeepBlue TOPCon, MBB modules. Wide channel availability in Africa.', bestFor: ['Commercial', 'Rooftop'], warranty: '12 yr product / 30 yr linear', tier: 'mid', notes: 'Strong residential channel in Kenya.' },
    { name: 'LONGi Solar', origin: 'China', founded: '2000', capability: 'Hi-MO 6 / Hi-MO X6, mono-PERC and HPBC. Very high cell efficiency.', bestFor: ['Premium commercial', 'Utility'], warranty: '15 yr product / 30 yr linear', tier: 'premium', notes: 'Holds module efficiency world records repeatedly.' },
    { name: 'Trina Solar', origin: 'China', founded: '1997', capability: 'Vertex, Vertex S+ TOPCon. Bifacial with double-glass.', bestFor: ['Utility', 'C&I rooftop'], warranty: '15 yr product / 30 yr linear', tier: 'mid', notes: 'Strong project EPC partner network.' },
    { name: 'Canadian Solar', origin: 'Canada (mfg China)', founded: '2001', capability: 'HiKu / TOPHiKu / TOPBiHiKu modules.', bestFor: ['C&I', 'Utility'], warranty: '12 yr product / 25–30 yr linear', tier: 'mid', notes: 'Listed on NYSE — good documentation discipline.' },
    { name: 'Q CELLS (Hanwha)', origin: 'Germany / Korea', founded: '1999', capability: 'Q.PEAK DUO M-G11+ premium residential / commercial modules.', bestFor: ['Premium residential', 'Commercial'], warranty: '25 yr product / 25 yr linear', tier: 'premium', notes: 'Q.ANTUM cell tech mitigates LID and PID well.' },
    { name: 'Sungrow', origin: 'China', founded: '1997', capability: 'String inverters 3–250 kW; central 1.5–6 MW; battery storage. World #2 inverter shipments.', bestFor: ['Inverters', 'Battery storage'], warranty: '5–10 yr extendable to 25', tier: 'mid', notes: 'Reference inverter for African utility plants.' },
    { name: 'Huawei FusionSolar', origin: 'China', founded: '1987', capability: 'SUN2000 string inverters with smart-string optimisers.', bestFor: ['Commercial', 'Utility', 'Hybrid'], warranty: '10 yr extendable', tier: 'premium', notes: 'AI yield-optimisation; restricted in some Western markets.' },
    { name: 'Victron Energy', origin: 'Netherlands', founded: '1975', capability: 'MultiPlus / Quattro / EasySolar all-in-one for off-grid and hybrid.', bestFor: ['Off-grid', 'Mobile', 'Marine'], warranty: '5 yr', tier: 'premium', notes: 'Reference brand for harsh / off-grid sites.' },
    { name: 'Pylontech', origin: 'China', founded: '2009', capability: 'US / Force / Pelio LFP residential & C&I battery storage.', bestFor: ['Residential ESS', 'C&I'], warranty: '10 yr / 6,000 cycle', tier: 'mid', notes: 'Most common LFP brand in East-African residential hybrid.' },
  ],
  installPhases: [
    { phase: '1. Energy audit & target', goal: 'Quantify load profile and offset goal.', checklist: ['12-month utility bill review', 'kWh / kVAh seasonal pattern', 'Critical-load sub-metering', 'Roof / ground area measurement'] },
    { phase: '2. Solar resource assessment', goal: 'Estimate generation defensibly.', checklist: ['NASA POWER / Solargis pull', 'Shading study (sun-path / drone)', 'Tilt and orientation chosen'] },
    { phase: '3. System design', goal: 'Match generation to load with margin.', checklist: ['Module count and string layout', 'Inverter sizing 1.0–1.3 DC/AC', 'Battery capacity and DoD', 'BoS components, cable size, breakers'] },
    { phase: '4. Structural & permit', goal: 'Roof loads documented; statutory approvals lodged.', checklist: ['Roof-load calculation per BS EN 1991', 'EPRA permit (Kenya)', 'Aviation marking if mast > 30 m', 'Net-metering application'] },
    { phase: '5. Mechanical install', goal: 'Mount, ground, and weatherproof.', checklist: ['Rail or hook-mounted to OEM spec', 'Roof penetrations sealed (EPDM + flashing)', 'Module clamps torqued (typically 14–18 Nm)', 'Cable management — UV-rated DC ties'] },
    { phase: '6. Electrical install', goal: 'DC and AC sides safely terminated.', checklist: ['MC4 connectors crimped — pull-test 50 N', 'DC isolators rooftop and inverter', 'AC isolator and import/export meter', 'Earthing and SPDs Class I + II'] },
    { phase: '7. Commissioning', goal: 'Demonstrate yield and protections.', checklist: ['IV-curve trace per string', 'Insulation resistance ≥ 1 MΩ', 'AVR / anti-islanding test', 'First-day generation log'] },
    { phase: '8. Monitoring & O&M', goal: 'Live yield, alerts, and lifecycle service.', checklist: ['Cloud monitoring activated', 'Cleaning schedule (monthly dusty / quarterly clean)', 'Annual thermography', 'Battery SoH report annually'] },
  ],
  partsManual: [
    { group: 'Modules', items: [
      { name: 'Mono-PERC half-cell 540–560 W' },
      { name: 'TOPCon 575–625 W' },
      { name: 'Bifacial double-glass 580–620 W' },
    ]},
    { group: 'Inverters & MPPTs', items: [
      { name: 'String inverter 3–25 kW (residential / SME)' },
      { name: 'Three-phase string 30–125 kW (C&I)' },
      { name: 'Hybrid inverter with battery port 5–30 kW' },
      { name: 'Central inverter 1.5–6 MW (utility)' },
    ]},
    { group: 'Batteries (LFP)', items: [
      { name: '48 V residential 5 / 10 / 15 / 20 kWh' },
      { name: '380–800 V high-voltage stack 20–100 kWh' },
      { name: 'Containerised C&I 100–500 kWh' },
    ]},
    { group: 'BoS', items: [
      { name: 'MC4 connectors / extension cables' },
      { name: 'DC isolator 1,000–1,500 V 25–32 A' },
      { name: 'AC isolator IP65' },
      { name: 'SPD Type 1+2 / Type 2 DC and AC' },
      { name: 'Earthing strap and clamps' },
      { name: 'String fuses gPV 10–25 A' },
    ]},
    { group: 'Mounting', items: [
      { name: 'Aluminium rail 6 m / 4.4 m' },
      { name: 'Mid-clamp / end-clamp 35–40 mm' },
      { name: 'L-foot / hanger bolt for tile / sheet' },
      { name: 'Ballast trays for flat roof' },
    ]},
    { group: 'Monitoring & test equipment', items: [
      { name: 'Data logger / dongle (WiFi, LAN or 4G)', interval: 'Firmware check annually', note: 'A 4G dongle beats site WiFi — most "monitoring dropped out" tickets are the customer changing their router password.' },
      { name: 'CT-based export-limit meter', interval: 'Verify direction at commissioning', note: 'A reversed CT silently limits generation to zero on a zero-export site.' },
      { name: 'Irradiance sensor and module-temperature probe', interval: 'Calibrate 2 yr', note: 'Turns "the system feels slow" into a measured performance ratio.' },
      { name: 'IV-curve tracer', interval: 'Annual use per string', note: 'The only instrument that separates a shading loss from a cell defect.' },
      { name: 'Insulation tester rated 1,000 / 1,500 V DC', interval: 'Calibrate annually' },
      { name: 'Clamp meter with DC range and MC4 test leads', note: 'DC clamp — an AC-only clamp reads nothing useful on the array side.' },
    ]},
  ],
  repairManual: [
    { fault: 'Underperforming string', priority: 'urgent', steps: [
      'IV-curve trace and compare to neighbour string.',
      'Thermography for hot cells.',
      'MC4 inspection — re-crimp any with continuity drift.',
      'Module-level swap test if one panel suspected.',
    ]},
    { fault: 'Inverter Iso (insulation) fault', priority: 'urgent', steps: [
      'Wait for self-clear — early-morning condensation often causes false alarm.',
      'If persistent, IR-test each polarity to earth.',
      'Inspect connectors for water ingress.',
      'Replace damaged module if cell-glass crack suspected.',
    ]},
    { fault: 'Battery low SoC after sunny day', priority: 'urgent', steps: [
      'Verify charge-current limit not throttled by battery temperature.',
      'Check DC bus voltage — undersized cable causes voltage sag.',
      'Inspect fuse / breaker between inverter and battery.',
      'BMS log retrieval — cell imbalance > 100 mV requires balancing.',
    ]},
    { fault: 'Anti-islanding trip during day', priority: 'urgent', steps: [
      'Compare grid voltage / frequency limits with inverter setting.',
      'Reduce DC/AC ratio if inverter clipping during voltage rise.',
      'Engage utility — supply-side voltage swings exceed inverter window.',
    ]},
    { fault: 'Hotspot on module', priority: 'routine', steps: [
      'Thermography baseline.',
      'If single cell > 20 °C above neighbours — suspect cell crack.',
      'Replace module under product warranty.',
    ], warning: 'Ignored hotspots can ignite backsheet — inspect twice yearly.' },
    { fault: 'Leakage current > 30 mA', priority: 'urgent', steps: [
      'Locate path with insulation tester.',
      'Inspect MC4 boots, junction boxes for moisture.',
      'Re-seal or replace damaged components.',
    ]},
    { fault: 'Yield falling progressively month over month', priority: 'routine', steps: [
      'Normalise before diagnosing: compare kWh per kWp against measured irradiance, not against last year\'s raw total. A dull season is not a fault.',
      'Clean one string and leave the neighbouring string dirty for a week — the difference is your soiling loss, measured rather than guessed.',
      'Thermograph the whole array: uniform dullness points to soiling or degradation, isolated hot cells to cracks, and a hot module edge or frame-adjacent gradient to potential-induced degradation.',
      'IV-curve trace the worst string; a depressed fill factor indicates series-resistance problems at connectors, a lowered current step indicates shading or cell damage.',
      'Check inverter derating logs — a heatsink running against its thermal limit each afternoon clips generation without ever raising an alarm.',
      'Only after the above, compare against the module warranty degradation curve and open a claim if the shortfall is genuine.',
    ], warning: 'Do not clean modules in the middle of a hot day. Cold water on hot glass causes thermal shock and micro-cracks — clean early morning or after sunset.' },
    { fault: 'Hybrid system does not carry the load when the grid fails', priority: 'urgent', steps: [
      'Confirm the loads in question are wired to the inverter\'s backup / EPS output, not to the ordinary distribution board — this is the cause in most cases.',
      'Verify the backup neutral-earth bonding arrangement matches the inverter manual; many hybrids require a relay-switched bond that only closes in island mode.',
      'Check battery state of charge against the inverter\'s configured cut-off — a reserve set at 30% will refuse to discharge at 25%.',
      'Test the changeover by opening the grid isolator deliberately and timing the transfer, rather than waiting for the next real outage.',
      'Inspect the BMS communication cable and protocol setting; a battery the inverter cannot talk to is treated as absent.',
      'Confirm the backup circuit total does not exceed the inverter\'s island-mode rating, which is usually lower than its grid-tied rating.',
    ]},
    { fault: 'Monitoring portal shows zero while the system is generating', priority: 'routine', steps: [
      'Read the inverter\'s own display first and record actual output — this separates a comms fault from a generation fault.',
      'Check the logger link: signal strength on 4G, or router password and 2.4 GHz band availability on WiFi.',
      'Verify the CT or meter direction and ratio; a reversed CT reports zero or negative and, on an export-limited site, will also throttle the inverter.',
      'Confirm the plant is still bound to the correct account after any installer handover.',
      'Update logger firmware, then re-pair the device before replacing hardware.',
    ]},
  ],
  errorCodes: [
    { code: 'Iso fault / Insulation low', family: 'String inverter', meaning: 'Insulation resistance below threshold (typically 100 kΩ).', severity: 'high', fix: ['IR-test each pole', 'Inspect for water-ingress on MC4', 'Replace damaged module/cable'] },
    { code: 'Grid voltage out of range', family: 'String inverter', meaning: 'Utility voltage outside trip window.', severity: 'medium', fix: ['Log and report to utility', 'Verify firmware grid-code matches local utility'] },
    { code: 'Grid frequency out of range', family: 'String inverter', meaning: 'Utility frequency outside trip window.', severity: 'medium', fix: ['Often utility-side issue', 'Verify local genset / grid-tie impact'] },
    { code: 'PV reverse polarity', family: 'String inverter', meaning: 'String wired with polarity inverted.', severity: 'high', fix: ['De-energise', 'Swap MC4 connector orientation', 'Verify string before re-energising'] },
    { code: 'Over-temperature', family: 'String inverter', meaning: 'Inverter heatsink above limit.', severity: 'medium', fix: ['Improve ventilation', 'Clean fan filters', 'Reduce DC/AC oversize if persistent'] },
    { code: 'BMS overvoltage', family: 'LFP battery', meaning: 'Cell voltage above pack limit.', severity: 'high', fix: ['Check charge-controller setpoint', 'Activate balancer', 'Replace failing cell if imbalance > 200 mV'] },
    { code: 'BMS undervoltage', family: 'LFP battery', meaning: 'Cell voltage below pack limit; protective shutdown.', severity: 'high', fix: ['Inspect parasitic loads during inactive periods', 'Verify low-SoC pickup', 'Recharge slowly to restore'] },
    { code: 'BMS over-temperature', family: 'LFP battery', meaning: 'Pack temperature outside operating window.', severity: 'high', fix: ['Improve ventilation / cooling', 'Reduce charge / discharge C-rate'] },
    { code: 'DC arc-fault detected', family: 'Arc-fault detection (IEC 63027 class)', meaning: 'Inverter has detected the electrical signature of a series arc on the DC side and shut down.', severity: 'critical', fix: ['Treat as a real fire risk until proven otherwise — inspect before resetting', 'Check every MC4 crimp and junction-box terminal on the affected string for heat discolouration', 'Pull-test connectors and replace any pair from mismatched manufacturers', 'Repeated resets without inspection are how roof fires start'] },
    { code: 'Residual current (RCMU) trip', family: 'IEC 62109-2 inverter monitoring', meaning: 'Residual current monitoring unit measured leakage above threshold.', severity: 'high', fix: ['Distinguish a morning condensation clear-down from a persistent fault', 'Insulation-test each polarity to earth with the inverter isolated', 'Inspect junction boxes and cable entries for water ingress', 'Check for a damaged cable pinched under a rail or clamp'] },
    { code: 'String current mismatch', family: 'String inverter / MPPT', meaning: 'One MPPT input is carrying materially less current than its paired input.', severity: 'medium', fix: ['Compare string currents at the same instant, not sequentially', 'Check for new shading — an aerial, a water tank or a grown tree', 'Verify all string fuses intact', 'IV-trace the low string to separate shading from cell defect'] },
    { code: 'Battery communication loss', family: 'Hybrid inverter ↔ BMS', meaning: 'Inverter has lost the CAN or RS485 link to the battery management system.', severity: 'high', fix: ['Confirm the protocol/brand setting in the inverter matches the battery installed', 'Check pin-out — a straight-through cable where a crossover is required is the usual cause', 'Verify address/DIP settings on stacked battery modules', 'Without comms the inverter treats the battery as absent and will not island'] },
    { code: 'DC injection above limit', family: 'Grid-tied inverter', meaning: 'DC component of the exported AC current exceeds the grid-code limit.', severity: 'high', fix: ['Log the event and check firmware grid-code profile is correct for the local utility', 'Inspect the AC output filter and any external transformer', 'Escalate to OEM — this is an inverter-internal fault, not an installation fault'] },
  ],
  diagrams: ['pv-system', 'mppt-strings', 'battery-bank', 'gen-grounding'],
  roi: [
    { scenario: '5 kWp residential rooftop, no battery', capex: 'KES 600k – 800k', annualSaving: '≈ KES 120k', payback: '5–6 years', notes: 'Self-consumption only; no net metering required for payback.' },
    { scenario: '20 kWp + 30 kWh battery — small office', capex: 'KES 3.5M – 4.5M', annualSaving: '≈ KES 720k', payback: '5 years', notes: 'Replaces ~70% utility + diesel during outages.' },
    { scenario: '500 kWp C&I rooftop on supermarket', capex: 'KES 45M – 55M', annualSaving: '≈ KES 11M', payback: '4–5 years', notes: 'Net metering improves further; demand-charge reduction key.' },
    { scenario: '5 MWp ground-mount IPP', capex: 'KES 450M – 550M', annualSaving: 'PPA-driven', payback: '6–8 years', notes: 'Bankable with Tier-1 modules + EPRA letter of authorisation.' },
    { scenario: 'Battery retrofit to an existing grid-tied array — 10 kWh', capex: 'KES 700k – 1.1M', annualSaving: 'Evening self-consumption + diesel displaced during outages', payback: '6–8 years on tariff alone', notes: 'Rarely pays back on tariff arbitrage by itself. It is bought for outage resilience — judge it against what an outage costs you, not against the KPLC bill.' },
  ],
  warrantyOptions: [
    'Modules: 12–25 yr product / 25–30 yr linear performance',
    'Inverters: 5–10 yr standard, extendable to 20 yr',
    'Batteries (LFP): 10 yr / 6,000 cycle',
    'Workmanship & mounting: 5 yr',
  ],
  qualityChecks: [
    'Module flash-test data sheet supplied per delivery',
    'Pull-test on every MC4 crimp',
    'IR test ≥ 1 MΩ DC side',
    'IV curve trace per string at commissioning',
    'Earth bonding < 0.1 Ω across rails',
    'Anti-islanding verified per IEC 62116',
    'Performance ratio calculated at handover against measured irradiance, not against a brochure figure',
    'Structural sign-off on file for roof dead load and wind uplift before rails are fixed',
    'Rooftop DC isolator fitted and array boundary marked for emergency responders',
    'Backup / island-mode changeover proven by deliberately opening the grid isolator',
  ],
  fastRepairCallouts: [
    'Spare modules of installed model held in Nairobi store',
    'Spare inverter SD-card / firmware images on hand',
    'Drone thermography service deployable nationwide',
    'Battery diagnostic clamps for live BMS interrogation',
  ],
  references: [
    'IEC 61730 / IEC 61215 — module safety and design qualification',
    'IEC 62109 — power converter safety',
    'IEC 62116 — anti-islanding test procedure',
    'IEC 60364-7-712 — solar PV systems',
    'IEC 62446 — commissioning tests, documentation, maintenance',
    'EPRA Solar PV Technician Licensing Regulations 2012 (Kenya)',
    'IEC 62109-2 — safety of power converters, inverter-specific requirements',
    'IEC 61724 — photovoltaic system performance monitoring',
    'IEC 62548 — design requirements for PV arrays',
    'Energy Act 2019 (Kenya) — net metering provision for systems up to 1 MW',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MOTOR REWINDING BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const MOTOR_BIBLE: ServiceBible = {
  family: 'motor-rewinding',
  hero: {
    headline: 'The Motor Rewinding Bible',
    subhead: 'Strip, slot-fill, varnish, dip-and-bake — done to BS EN 60034 every time.',
  },
  intro: [
    'A motor rewind is not a replacement of "the wire that burned out." It is a complete electromagnetic redesign verification: identify the original wire gauge, slot fill, span, and connection topology; reproduce it (or improve it) within tolerance; and re-prove the machine to BS EN 60034. A shop that skips even one of those steps produces motors that run for six months and burn again.',
    'Why motors fail: the EASA root-cause survey of thousands of failures puts mechanical bearing failure at ≈ 50%, electrical insulation breakdown 15–20%, contamination 10%, mis-application / overload 10%. A burnt winding is rarely the original cause — it is the symptom. Rewinding without diagnosing the upstream cause guarantees repeat failure.',
    'Inrush and starting: a DOL-started 7.5 kW motor pulls 6–8 × FLC for 2–4 s. Star-delta reduces to ⅓; soft-starter to 2.5–4 ×; VSD to nameplate current. Repeated DOL starts hammer rotor bars and stator-end coils — the failure mode is often mechanical rotor-bar fracture rather than burn.',
    'Insulation classes — A (105 °C), E (120 °C), B (130 °C), F (155 °C), H (180 °C) — define the temperature index of the wire enamel and varnish system. Class F insulation with Class B temperature rise is now the default for industrial motors. A rewound motor must carry at least the original class; cheap Class E rewinds in tropical environments fail in 2 years.',
    'Slot fill: too low → flux losses, vibration. Too high → impossible to insert without damaging enamel, voids that fill with moisture and degrade. Industry target is 70–75% slot fill for VPI motors. Hand-wound rewinds typically peak at 60–65%.',
    'VPI (Vacuum Pressure Impregnation) is the gold-standard varnish process: stator placed in vessel, vacuum drawn to remove air from voids, varnish flooded under pressure to penetrate every gap, then baked at 150 °C for 6 h. Dip-and-bake is acceptable for IE2 motors and below; VPI is mandatory for medium-voltage and continuous-duty machines.',
    'Submersible borehole pumps require water-resistant winding insulation (PVC-impregnated copper) and 100% sealed motor body filled with non-toxic dielectric oil or distilled water. A standard rewind technique applied to a submersible motor will leak within a month.',
    'Bearings are the silent killer. SKF / FAG / NSK / NTN — all reputable. Counterfeit Chinese bearings cost 10% of genuine and last 10% as long. Specify the OEM bearing number, verify packaging and laser-etched marks, and re-grease per L10 calculation, not the calendar.',
    'Test reports must accompany every rewind: insulation resistance (IR), polarisation index (PI), surge comparison, no-load run, locked-rotor check, vibration spectrum baseline. A rewind without these documents is unverifiable; an insurance claim for a downstream failure will be denied.',
    'Energy-efficiency policy is moving toward IE3 / IE4 / IE5 (premium / super-premium / ultra-premium). The European benchmark is Regulation (EU) 2019/1781, which stages minimum efficiency by power band rather than banning a class outright: since July 2021 motors from 0.75 to 1,000 kW must meet IE3 and motors from 0.12 to 0.75 kW must meet IE2, and since July 2023 motors from 75 to 200 kW must meet IE4. Kenya is moving in the same direction. The practical point for a rewind decision is unchanged. An older motor, even rewound flawlessly, will use more energy than a current IE3 equivalent, and the gap is size-dependent: it is widest on small motors, where several percentage points separate the classes, and narrows to a point or two on large frames where efficiency is already high. Each rewind also tends to cost a little efficiency of its own. So on a small, hard-run motor the replacement case is strong, while on a large machine at moderate runtime the rewind usually wins — get the kW rating and the annual running hours before deciding either way.',
    'Variable-speed drives changed what a winding has to survive. A VFD output is not a sine wave — it is a train of steep-fronted pulses, and every pulse arrives at the motor terminals with a reflected-wave overshoot that can approach twice the DC bus voltage on long cable runs. The first few turns of each coil take the brunt of it. Inverter-duty insulation systems (the requirements set out in IEC 60034-25 and NEMA MG1 Part 31) exist precisely for this, and a motor rewound to plain mains-duty specification then run on a drive will fail early at the coil entry every time. Where the run between drive and motor is long, an output dv/dt filter or sine filter is cheaper than the rewind it prevents.',
    'The same drives create a second, quieter problem: shaft currents. Common-mode voltage on the drive output finds a path to earth through the bearing lubricant film, and each discharge pits the raceway. Left alone it develops into the washboard "fluting" pattern that produces a rising whine and then a seized bearing, typically inside two years. The fixes are well established — an insulated non-drive-end bearing, a shaft earthing ring, symmetrical shielded cable properly bonded at both ends — but all of them must be specified at rewind time, not after the second bearing failure. On Kenyan sites the picture is compounded by supply quality: sustained under-voltage and phase unbalance both push extra current through the windings, and a motor that keeps burning is very often telling you about the supply rather than about itself.',
  ],
  topBrands: [
    { name: 'ABB', origin: 'Switzerland', capability: 'IE3 / IE4 / IE5 induction and SynRM motors. M3BP / M3GP frames.', bestFor: ['Industry', 'Pumps', 'HVAC'], warranty: '24 mo std', tier: 'premium', notes: 'Reference for SynRM technology.' },
    { name: 'Siemens', origin: 'Germany', capability: 'Simotics SD / GP / HV ranges. Aluminium and cast-iron frames.', bestFor: ['Process', 'Compressors', 'Conveyors'], warranty: '24 mo', tier: 'premium', notes: 'Strong service network in East Africa.' },
    { name: 'WEG', origin: 'Brazil', capability: 'W22 IE3 / IE4 motors. Excellent value-to-quality ratio.', bestFor: ['Industry', 'Agriculture', 'Marine'], warranty: '24 mo', tier: 'mid', notes: 'Most-installed brand in Latin America; growing in Africa.' },
    { name: 'TECO', origin: 'Taiwan', capability: 'AESV / AEEB ranges. Strong submersible motor line.', bestFor: ['Pumps', 'General industry'], warranty: '24 mo', tier: 'mid', notes: 'Quality close to Tier-1 at meaningful discount.' },
    { name: 'Toshiba', origin: 'Japan', capability: 'GoldMotor / EQPIII series IE3.', bestFor: ['Premium industry', 'Marine'], warranty: '24 mo', tier: 'premium', notes: 'High vibration tolerance.' },
    { name: 'Nidec / Leroy-Somer', origin: 'Japan / France', capability: 'LSMV high-voltage motors, FLSE compact ranges.', bestFor: ['Compact servo', 'Pumps'], warranty: '24 mo', tier: 'premium', notes: 'Strong custom-build capability.' },
    { name: 'Marathon Electric (Regal Rexnord)', origin: 'United States', capability: 'NEMA + IEC ranges.', bestFor: ['NEMA-spec installs'], warranty: '24 mo', tier: 'mid', notes: 'Common in mining clients with US-spec.' },
    { name: 'Crompton Greaves', origin: 'India', capability: 'IE2 / IE3 LV induction motors. Wide East-African distribution.', bestFor: ['SME', 'Pumps', 'Agriculture'], warranty: '12–24 mo', tier: 'value', notes: 'Cost-conscious replacement for industrial pumps.' },
    { name: 'Franklin Electric (motor end)', origin: 'United States', capability: '4" / 6" / 8" submersible motors with hermetic stator.', bestFor: ['Boreholes', 'Deep wells'], warranty: '24 mo', tier: 'premium', notes: 'Reference brand for submersibles.' },
    { name: 'Bharat Bijlee', origin: 'India', founded: '1946', capability: 'TEFC IE2 / IE3 induction motors across a wide LV frame range, plus drives and transformers.', bestFor: ['Cost-sensitive industrial'], warranty: '12 mo', tier: 'value', notes: 'Verify the IE rating on the nameplate against the test certificate — counterfeit efficiency labelling is a known problem in the value tier, whatever the brand.' },
  ],
  installPhases: [
    { phase: '1. Strip & inspect', goal: 'Quantify damage and original winding data.', checklist: ['Photograph every winding bundle before stripping', 'Record turns / coil pitch / wire gauge', 'Inspect rotor bars for fracture', 'Check shaft for run-out (< 0.05 mm)'] },
    { phase: '2. Stator core check', goal: 'Confirm core lamination integrity.', checklist: ['Loop test for hot-spots (< 10 °C above ambient)', 'Loose-lamination grind & re-clamp', 'Remove all old varnish residue'] },
    { phase: '3. Rewind', goal: 'Reproduce or improve original winding.', checklist: ['Match wire gauge & class', 'Use correct slot insulation (Nomex / PET)', 'Form coils to original span', 'Connect for delta or star per nameplate'] },
    { phase: '4. Impregnate', goal: 'Eliminate voids; bond coils.', checklist: ['VPI for MV / continuous-duty', 'Dip-and-bake for IE2 LV', 'Bake to varnish manufacturer\'s temp/time'] },
    { phase: '5. Reassemble', goal: 'Bearings and seals correct.', checklist: ['Genuine OEM bearings only', 'Grease per L10 calc', 'Balance rotor to ISO 21940-11 grade G2.5', 'Air-gap variation within ±10% of mean, measured at four points'] },
    { phase: '6. Test', goal: 'Prove the rewound machine.', checklist: ['IR ≥ 100 MΩ at 500 V DC', 'PI > 2.0', 'Surge comparison test', 'No-load run 30 min — vibration < 1.8 mm/s', 'Locked-rotor current within 5% of nameplate'] },
    { phase: '7. Document', goal: 'Test report attached to motor.', checklist: ['Pre & post IR / PI', 'Surge waveform images', 'Vibration baseline', 'Delivery certificate'] },
    { phase: '8. Re-install & monitor', goal: 'Catch infant-mortality early.', checklist: ['Vibration check at 24 hr / 1 wk / 1 mo', 'Bearing temp monitoring', 'IR re-test 6 months'] },
  ],
  partsManual: [
    { group: 'Wire & insulation', items: [
      { name: 'Enamelled copper wire — Class F / H, 0.4–6.0 mm Ø' },
      { name: 'Slot insulation — Nomex 410 / 411' },
      { name: 'Phase paper — DMD / NMN' },
      { name: 'Tying tape — polyester' },
    ]},
    { group: 'Varnish', items: [
      { name: 'VPI varnish — solvent-free polyester resin' },
      { name: 'Trickle-impregnation resin' },
      { name: 'Insulation top-coat — silicone for high temp' },
    ]},
    { group: 'Bearings', items: [
      { name: '6204 / 6206 / 6208 / 6210 deep-groove (LV motors)' },
      { name: '6312 / 6316 (medium frame)' },
      { name: 'NU-series cylindrical roller (DE on large frames)' },
      { name: 'Insulated bearings for VFD-driven motors > 110 kW (mitigate shaft currents)' },
    ]},
    { group: 'Hardware', items: [
      { name: 'Shaft seals V-ring, oil seal' },
      { name: 'Terminal-box gland & terminal block' },
      { name: 'Cooling fan & fan cover' },
      { name: 'Lifting eyes / hardware' },
    ]},
    { group: 'Rotor, shaft & drive-end', items: [
      { name: 'Shaft sleeve / shaft repair by metal spray and regrind', note: 'Only where run-out and seal track can be restored within 0.05 mm — a bent shaft is scrap.' },
      { name: 'Rotor bar and end-ring repair (brazed or replaced)', note: 'Fractured bars show as sidebands on a current signature long before the motor stalls.' },
      { name: 'Balancing weights and correction discs', note: 'Correct to ISO 21940-11 grade G2.5; record the residual unbalance on the test sheet.' },
      { name: 'Keys, keyways and locking collars' },
      { name: 'Shaft earthing ring for VFD-driven machines', note: 'Fit at rewind, not after the second bearing failure.' },
      { name: 'Flexible coupling elements and spacer', note: 'Replace in pairs with the bearings; a tired element hides misalignment.' },
    ]},
    { group: 'Workshop test equipment', items: [
      { name: 'Insulation tester 500 / 1,000 / 5,000 V with PI function', interval: 'Calibrate annually' },
      { name: 'Surge comparison tester', interval: 'Calibrate annually', note: 'The only bench instrument that finds a turn-to-turn short before it becomes an earth fault.' },
      { name: 'Core-loss (loop) test set', note: 'Proves the stator core is worth rewinding before any copper is bought.' },
      { name: 'Dynamic balancing machine', interval: 'Verify with test rotor 6 mo' },
      { name: 'Vibration analyser with spectrum capability', interval: 'Calibrate annually' },
      { name: 'Bearing induction heater and fitting tools', note: 'Never drive a bearing on with a hammer — brinelled raceways fail within weeks.' },
      { name: 'Micro-ohmmeter for winding resistance balance', note: 'Phase-to-phase resistance should match within 2%.' },
    ]},
  ],
  repairManual: [
    { fault: 'Stator burnt — earth fault to frame', priority: 'urgent', steps: [
      'Confirm earth-fault by IR test phase-frame.',
      'Strip core; inspect for thermal blackening and copper colour.',
      'Diagnose root cause — over-load? phase failure? VFD spike?',
      'Rewind with same or higher insulation class.',
    ]},
    { fault: 'Single-phasing damage', priority: 'urgent', steps: [
      'Check supply for missing phase or blown fuse.',
      'Inspect contactor — welded contact is common cause.',
      'Add phase-failure relay before re-energising.',
    ]},
    { fault: 'Bearing noise / overheating', priority: 'urgent', steps: [
      'Vibration spectrum to identify defect frequency.',
      'Replace bearing pair (DE + NDE) — never one alone.',
      'Re-grease per OEM type and quantity.',
      'Check shaft alignment and coupling.',
    ]},
    { fault: 'Excessive vibration after rewind', priority: 'routine', steps: [
      'Re-balance rotor to ISO G2.5.',
      'Re-check air-gap symmetry.',
      'Tighten foot bolts to torque spec.',
      'Inspect coupling and driven equipment alignment.',
    ]},
    { fault: 'Hot spots in winding', priority: 'urgent', steps: [
      'Confirm correct connection (Y or Δ matching nameplate).',
      'Verify no shorted turns via surge test.',
      'Check ventilation — fan / cover removed?',
      'Audit driven load — over-loading is the most common cause.',
    ]},
    { fault: 'Submersible motor low IR', priority: 'urgent', steps: [
      'Pull motor; inspect cable splice integrity.',
      'Test motor wet-end and dry-end separately.',
      'Re-fill with fresh dielectric per OEM and seal.',
    ]},
    { fault: 'Same motor has failed again within months of a rewind', priority: 'urgent', steps: [
      'Read the burn pattern before touching anything — it names the cause. All three phases evenly blackened means overload; one phase clean and two burnt means single-phasing; symmetrical burning at 120° intervals means voltage unbalance; damage concentrated in the first turns of each coil means VFD voltage stress; a single localised hole means a turn-to-turn short.',
      'Log supply voltage and current on all three phases through a full duty cycle, not a spot reading. Sustained under-voltage and unbalance are the two most common upstream causes.',
      'Verify the driven load has not changed — a blocked impeller, a tightened gland, a worn gearbox or a heavier product all show up as motor failure.',
      'Confirm the overload relay class and setting match the actual start time; a Class 10 relay on a high-inertia fan will either trip on every start or be turned up until it protects nothing.',
      'Check starts per hour against the nameplate duty rating; repeated DOL starting cooks a winding no rewind will survive.',
      'Only when the upstream cause is identified and corrected should the motor go back on the bench — otherwise you are buying the same failure again.',
    ], warning: 'A second rewind without a documented root cause is not a repair, it is a subscription. Ask for the supply and load data before authorising one.' },
    { fault: 'Rising whine and repeat bearing failure on a VFD-driven motor', priority: 'urgent', steps: [
      'Strip the failed bearing and inspect the raceway under magnification — evenly spaced axial ridges (fluting) confirm electrical discharge damage rather than mechanical wear.',
      'Measure shaft voltage to earth with a brush probe while running; discharge spikes confirm the diagnosis.',
      'Fit an insulated bearing at the non-drive end, or a shaft earthing ring at the drive end — fitting insulation at both ends simply moves the current into the coupling and the driven machine.',
      'Verify the motor cable is symmetrical shielded type with the screen bonded at both ends over 360°, not a pigtail.',
      'Check drive switching frequency and cable length against the drive manual; add an output dv/dt or sine filter on long runs.',
      'Re-grease with the lubricant specified for the bearing type — conductive grease is not a substitute for a proper earthing path.',
    ]},
    { fault: 'Low insulation resistance after flooding or long storage', priority: 'routine', steps: [
      'Do not energise to "dry it out" — that converts a recoverable winding into a rewind.',
      'Measure IR and polarisation index cold, and record both as the baseline.',
      'Dry the stator with controlled heat at around 100 °C, monitoring IR hourly; a genuine moisture problem shows a dip and then a steady climb.',
      'Hold the temperature until IR readings plateau for at least two consecutive hours, then re-measure PI — above 2.0 means the winding is recoverable.',
      'If IR stays low after drying, the insulation is contaminated or broken down and the machine needs rewinding.',
      'Before returning to service, clean and re-seal the terminal box and check that the enclosure IP rating actually suits where the motor is mounted.',
    ]},
  ],
  errorCodes: [
    { code: 'IR < 1 MΩ', family: 'Insulation test', meaning: 'Insulation degraded.', severity: 'high', fix: ['Bake stator at 100 °C 4 h to dry', 'If unchanged → rewind', 'Verify slot insulation and lead seals'] },
    { code: 'PI < 2.0', family: 'Insulation test', meaning: 'Moisture in winding.', severity: 'medium', fix: ['Heat-dry the stator', 'Re-test', 'Improve sealing if recurrent'] },
    { code: 'Surge waveform mismatch', family: 'Surge test', meaning: 'Turn-to-turn fault.', severity: 'high', fix: ['Identify affected coil', 'Strip and replace coil group', 'Re-VPI'] },
    { code: 'Vibration > 4.5 mm/s', family: 'ISO 20816 (formerly ISO 10816)', meaning: 'Above acceptable severity.', severity: 'high', fix: ['Re-balance rotor', 'Inspect coupling', 'Verify foundation rigidity'] },
    { code: 'I2 / I1 high (negative-sequence)', family: 'Motor protection relay', meaning: 'Voltage / current unbalance.', severity: 'medium', fix: ['Inspect supply for unbalanced phases', 'Tighten cable terminations', 'Check for single-phase loads on same panel'] },
    { code: 'Locked-rotor stall', family: 'Motor protection relay', meaning: 'Motor fails to accelerate.', severity: 'high', fix: ['Verify rotor mechanically free', 'Check supply voltage at start (must hold > 90% during start)', 'Rotor-bar fracture surge test'] },
    { code: 'Core loss above limit', family: 'EASA core-loss (loop) test', meaning: 'Stator core watts-per-kilogram exceeds the acceptance figure, or hot-spots exceed the allowed rise — the core itself is damaged.', severity: 'high', fix: ['Locate hot-spots by thermal imaging during the loop test', 'Grind and re-insulate shorted laminations, then re-test', 'If loss remains high the core must be restacked or the machine replaced', 'Never rewind a failed core — the new copper will burn on the same spot'] },
    { code: 'Partial discharge / high tan δ', family: 'IEC 60034-27 insulation diagnostics', meaning: 'Voids or delamination in the insulation system are discharging internally; applies to medium-voltage machines.', severity: 'high', fix: ['Trend against the machine\'s own baseline rather than an absolute number', 'Correlate with tan δ tip-up to locate the deteriorating section', 'Plan an outage for rewind or re-impregnation before failure', 'Improve VPI quality on rebuild — voids are a process defect'] },
    { code: 'Rotor-bar sidebands', family: 'Motor current signature analysis', meaning: 'Sidebands around line frequency at twice slip frequency indicate cracked rotor bars or a broken end-ring.', severity: 'high', fix: ['Confirm with a single-phase rotor (growler) test on the bench', 'Braze or replace the affected bars and end-ring', 'Review starts-per-hour — repeated DOL starting is the usual cause', 'Consider a soft-starter or drive before returning to service'] },
    { code: 'PTC thermistor trip', family: 'IEC 60034-11 thermal protection', meaning: 'Embedded winding thermistor reached its switching temperature; the winding is genuinely hot.', severity: 'high', fix: ['Do not bypass the thermistor to keep production running', 'Check ventilation, fan cover and cooling-air path first', 'Measure actual load current against nameplate', 'Verify ambient and enclosure temperature at the motor, not at the panel'] },
    { code: 'Shaft voltage / EDM bearing current', family: 'VFD-driven machine diagnostics', meaning: 'Common-mode voltage discharging through the bearing lubricant film; produces fluting and premature bearing failure.', severity: 'medium', fix: ['Fit an insulated bearing at the non-drive end or a shaft earthing ring at the drive end', 'Bond the cable screen 360° at both ends', 'Add an output dv/dt or sine filter on long drive-to-motor runs', 'Never insulate both ends — the current will find the coupling instead'] },
    { code: 'Winding resistance unbalance > 2%', family: 'Micro-ohmmeter bench test', meaning: 'Phase-to-phase resistance differs beyond tolerance — a connection, joint or turn problem.', severity: 'medium', fix: ['Re-measure at the winding, bypassing the terminal block, to exclude a loose lug', 'Inspect brazed joints in the coil connections', 'Compare against surge test results before deciding to strip'] },
  ],
  diagrams: ['motor-cross-section', 'star-delta', 'insulation-test'],
  roi: [
    { scenario: 'Rewind 7.5 kW IE2 motor vs replace with IE3', capex: 'Rewind ≈ KES 35k vs new ≈ KES 90k', annualSaving: 'IE3 saves ≈ KES 14k / yr at 4,000 hr', payback: 'Replace pays in 4 yr', notes: 'Decision flips toward replacement for heavy-runtime motors.' },
    { scenario: 'Rewind 75 kW pump motor', capex: '≈ KES 220k vs new ≈ KES 800k', annualSaving: 'Replacement IE3 saves ≈ KES 90k / yr', payback: 'Rewind > 5× cheaper short-term', notes: 'Rewind preferred unless < 6 yr remaining service life.' },
    { scenario: 'Submersible 18.5 kW borehole motor', capex: 'Rewind ≈ KES 95k', annualSaving: 'Avoids 3-day pump pull repeat', payback: 'Immediate', notes: 'Critical to determine root cause before reinstalling.' },
    { scenario: 'Third rewind of a 22 kW motor vs IE3 replacement', capex: 'Rewind ≈ KES 110k vs new IE3 ≈ KES 320k', annualSaving: 'Efficiency gain ≈ KES 45k / yr at 6,000 hr, plus the downtime the next failure would cost', payback: 'Replacement pays in about 4–5 years', notes: 'Each rewind costs a little efficiency. By the third one on a high-runtime motor, replacement is usually the cheaper answer — ask for the runtime figure before quoting either.' },
    { scenario: 'Condition-monitoring programme across a 40-motor plant', capex: 'KES 600k – 900k / yr for quarterly vibration and thermography rounds', annualSaving: 'One avoided unplanned line stop ≈ KES 1.5M – 3M', payback: 'First avoided stoppage', notes: 'The value is in catching bearing degradation while it is still a planned overnight bearing change instead of a burnt stator and a three-day outage.' },
  ],
  warrantyOptions: [
    'Workmanship 12 months on rewinds',
    '6 months on re-bearing only',
    'Full insurance-backed rebuild for HV motors > 1 MW',
  ],
  qualityChecks: [
    'IR > 100 MΩ at 500 V DC after VPI',
    'PI > 2.0',
    'Surge test waveform matched',
    'Vibration within ISO 20816 Zone A on no-load run',
    'Bearing temp rise < 35 K',
    'Core-loss test passed before any copper is ordered',
    'Phase-to-phase winding resistance balanced within 2%',
    'No-load current balanced across phases within 10%, recorded per phase',
    'Rotor balanced to ISO 21940-11 grade G2.5 with residual unbalance recorded',
    'Root cause of the original failure stated in writing on the test report',
  ],
  fastRepairCallouts: [
    'Stocked: bearings 6200 / 6300 series, common terminal blocks, slot insulation rolls',
    'Dynamic balancing rig in-house',
    'VPI tank for motors up to 200 kW',
    'Surge tester on every visit',
  ],
  references: [
    'BS EN 60034-1 — rotating electrical machines, rating and performance',
    'BS EN 60034-30 — IE classification',
    'IEEE 43 — recommended practice for testing insulation resistance',
    'ISO 20816 (supersedes ISO 10816) — mechanical vibration, measurement and evaluation of machine vibration',
    'EASA AR100 — recommended practice for repair of rotating electrical apparatus',
    'IEC 60034-25 — AC machines fed from converters (inverter-duty insulation)',
    'IEC 60034-27 — off-line partial discharge measurement on stator winding insulation',
    'IEC 60034-11 — thermal protection of rotating machines',
    'ISO 21940-11 (supersedes ISO 1940-1) — mechanical vibration, rotor balancing, balance quality requirements for rigid rotors',
    'NEMA MG1 Part 31 — definite-purpose inverter-fed motors',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. AC INSTALLATION BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const AC_BIBLE: ServiceBible = {
  family: 'ac',
  hero: {
    headline: 'The HVAC Bible',
    subhead: 'Vapour-compression theory in your hands — split, central, VRF, chilled water, cold-room.',
  },
  intro: [
    'A modern air-conditioning system is a heat pump — it does not "make cold," it moves heat. Refrigerant changes phase between liquid and vapour, exploiting the latent heat of vaporisation to absorb energy at the evaporator and reject it at the condenser. Every fault in HVAC ultimately ties back to one of those four phase boundaries operating outside its design window.',
    'Sizing in BTU/h or kW is the first commercial decision, and the units matter because the common rules of thumb are quoted in BTU/h. For a typical East-African office at 25 °C indoor and 35 °C outdoor, allow roughly 600–700 BTU/h per m², which is about 176–205 W/m². Solar-loaded rooms and kitchens run nearer 900–1,000 BTU/h per m² (about 264–293 W/m²), and server rooms start around 1,500 BTU/h per m² (about 440 W/m²) and climb steeply with rack density. Convert carefully — 1 kW is 3,412 BTU/h, and reading a BTU/h rule of thumb as though it were watts oversizes the plant by roughly three and a half times, which is exactly how a building ends up with equipment that short-cycles and never dehumidifies. Manual J style heat-load calculation is more precise but rule-of-thumb survives in the field for one good reason — it works for 80% of cases and forces the engineer to spend time on the other 20%.',
    'Refrigerant choice is regulated. R-22 is phased out under the Montreal Protocol; R-410A is being replaced by R-32 (lower GWP) and R-454B for new equipment in Europe and increasingly Kenya. Mixing refrigerants is a felony in some jurisdictions and always voids warranty. Recovery, recycling and reclamation are non-optional.',
    'Pressure / temperature relationships are the diagnostic backbone. R-410A operating at 35 °C ambient typically presents 110–125 PSI suction (corresponding to ≈ 5–7 °C evaporator saturation) and 250–280 PSI discharge (≈ 40–45 °C condenser saturation). Suction below 100 PSI almost always means low charge or restriction; discharge above 320 PSI means dirty condenser or overcharge.',
    'Superheat (suction-line temperature minus saturation temperature at suction pressure) tells whether the evaporator is fully active. On a TXV system the valve actively holds superheat, so expect a tight band of roughly 8–12 °F at the evaporator outlet and treat a wandering value as a hunting or failed valve. On a fixed-orifice or piston system there is no such regulation: superheat floats with indoor wet-bulb and outdoor dry-bulb, so there is no single target figure and the correct value must be read off the manufacturer\'s superheat chart for the conditions on the day. Charging a fixed-orifice system to a TXV number is one of the most common ways a healthy system is wrongly diagnosed and then over- or under-charged. Superheat too low — flooded compressor, liquid slugging, valve damage. Too high — starved evaporator, low capacity, oil return failure.',
    'Subcooling (saturation temperature at discharge pressure minus actual liquid-line temperature) tells whether the condenser is rejecting heat fully. Target 8–14 °F. Subcooling too low — under-charged or over-loaded; too high — over-charged or restricted liquid line.',
    'Ducting in central systems must respect static pressure. Total external static pressure ≤ blower spec; common error is 0.8 in.WC blower forced through 1.2 in.WC ducting → blower stalls, motor draws lock-rotor amps, breakers trip. Pressure-tested ducting and balancing dampers are not optional in commercial install.',
    'Chilled-water systems shift the heat-rejection problem into a different topology. Primary (chiller) loop maintains 6–8 °C supply / 12–14 °C return; secondary loop distributes to AHUs / FCUs. Variable-primary, primary-secondary, and decoupled topologies each have specific pump-control and ΔT-stability requirements.',
    'Refrigerant leaks are the silent killer. A 10% loss reduces capacity 20% and kicks compressor temperature up — the system runs longer trying to satisfy thermostat, eventually burning out. Annual electronic / nitrogen leak-test plus visual oil-stain inspection is mandatory.',
    'Filter discipline finishes the cycle. A 1" pleated filter loaded to ΔP 0.4" reduces airflow 30%, drops coil temperature, ices the evaporator, and turns the world\'s best AC unit into a humidifier. Monthly filter change is the single highest-leverage maintenance task in residential HVAC.',
    'Sensible cooling and latent cooling are different jobs, and conflating them is why so many correctly-sized systems still feel clammy. Total capacity splits into a sensible part that lowers dry-bulb temperature and a latent part that condenses moisture out of the air. An oversized unit satisfies the thermostat quickly, short-cycles, and never runs long enough to dehumidify — the room reads 22 °C and feels unpleasant. Two things fix it: size to the actual load rather than the round number above it, and give the coil enough run time at a low enough surface temperature to condense. Ventilation air is where most of the latent load enters a commercial building, which is why ASHRAE 62.1 outdoor-air rates belong in the heat-load calculation from the start rather than being discovered at commissioning.',
    'Kenyan installations fail in three predictable local ways. Coastal salt attacks the condenser first — bare aluminium fins in Mombasa, Malindi or Diani can corrode through in a few seasons, so coated coils or an epoxy-treated condenser are a specification item, not an upgrade. Inland dust does the same job more slowly by blanketing the coil and lifting head pressure, which is why condenser cleaning belongs on the quarterly list rather than the annual one. And supply quality finishes the story: inverter units are sensitive to sustained under-voltage and to the surges that follow a utility restoration, so a properly rated isolator, surge protection and, on critical rooms, a voltage stabiliser will outlast several rounds of PCB replacement. Rated capacity also assumes a rating ambient — a condenser sitting in a hot enclosed courtyard at 45 °C simply will not deliver its nameplate figure.',
  ],
  topBrands: [
    { name: 'Daikin', origin: 'Japan', founded: '1924', capability: 'VRV/VRF leader, splits to large chillers. R-32 early adopter.', bestFor: ['Premium commercial', 'Hospitality', 'Industrial'], warranty: '5 yr compressor / 1 yr parts std', tier: 'premium', notes: 'Most widely-installed VRF brand globally.' },
    { name: 'Mitsubishi Electric', origin: 'Japan', founded: '1921', capability: 'M-series splits, City Multi VRF. Industry-leading inverter precision.', bestFor: ['Residential premium', 'Commercial VRF'], warranty: '5 yr compressor', tier: 'premium', notes: 'Distinct from Mitsubishi Heavy Industries — different brand.' },
    { name: 'LG', origin: 'South Korea', capability: 'Multi V VRF, dual-inverter splits, Therma V heat-pumps.', bestFor: ['Residential', 'Light commercial'], warranty: '5–10 yr compressor', tier: 'mid', notes: 'Strong inverter portfolio in mid-tier price.' },
    { name: 'Samsung', origin: 'South Korea', capability: 'WindFree splits, DVM S VRF, ductless mini-splits.', bestFor: ['Residential', 'Office'], warranty: '5 yr compressor', tier: 'mid', notes: 'WindFree marketing actually delivers reduced-draught comfort.' },
    { name: 'Carrier', origin: 'United States', founded: '1915', capability: 'Inventor of modern AC. Full residential to chiller line.', bestFor: ['Commercial', 'Healthcare', 'Industrial'], warranty: '5–10 yr compressor', tier: 'premium', notes: 'Reference brand for chilled-water.' },
    { name: 'Trane', origin: 'United States', capability: 'Voyager rooftop, Centravac centrifugal chillers.', bestFor: ['Large commercial', 'Industry', 'Data centre'], warranty: '5–10 yr compressor', tier: 'premium', notes: 'Strong centrifugal chiller reputation.' },
    { name: 'York (Johnson Controls)', origin: 'United States', capability: 'Magnitude OFCT chillers, YK water-cooled.', bestFor: ['Commercial', 'Industry'], warranty: '5 yr compressor', tier: 'premium', notes: 'Magnetic-bearing oil-free option for premium efficiency.' },
    { name: 'Hitachi', origin: 'Japan', capability: 'Set Free VRF, RAS splits.', bestFor: ['Commercial', 'Residential'], warranty: '5 yr compressor', tier: 'mid', notes: 'Strong on tropical-climate ranges.' },
    { name: 'Panasonic', origin: 'Japan', capability: 'Etherea splits, ECOi VRF.', bestFor: ['Residential', 'Light commercial'], warranty: '5 yr compressor', tier: 'mid', notes: 'NanoeX ionisation marketing — modest real benefit.' },
    { name: 'Gree', origin: 'China', capability: 'GMV5 VRF, U-Crown splits.', bestFor: ['Cost-sensitive commercial', 'Residential'], warranty: '5 yr compressor', tier: 'value', notes: 'Largest residential AC manufacturer by volume; quality varies by line.' },
  ],
  installPhases: [
    { phase: '1. Heat-load calculation', goal: 'Right-size capacity.', checklist: ['Manual J or commercial heat-load software', 'Solar gain by orientation', 'Internal gains (people, lights, equipment)', 'Ventilation latent load'] },
    { phase: '2. Refrigerant pipe routing', goal: 'Pipe length and bends within OEM limits.', checklist: ['Equivalent length ≤ OEM max', 'Vertical lift within compressor capacity', 'Oil-trap every 6 m on long verticals', 'Slope condensate drain ≥ 1%'] },
    { phase: '3. Pre-install', goal: 'Mounts, brackets, and electrical ready.', checklist: ['Wall / ceiling structural check', 'Anti-vibration mounts', 'IP65 isolator within 1 m of ODU', 'Dedicated final circuit'] },
    { phase: '4. Pipe install', goal: 'Clean, vacuum-tight refrigerant circuit.', checklist: ['Clean copper, deburred and reamed', 'Brazed under nitrogen purge', 'Pressure test 350 PSI nitrogen 24 hr', 'Pull vacuum to 500 µm and decay test'] },
    { phase: '5. Electrical', goal: 'Correct cable, breaker, RCD, earthing.', checklist: ['Cable size for FLA × 1.25', 'MCB curve C / D', 'Type B RCD on inverter ODU', 'Earth bonding < 0.5 Ω'] },
    { phase: '6. Charge & commission', goal: 'Achieve target sub-cool / superheat.', checklist: ['Weigh-in OEM charge from blank vacuum', 'Top-up to subcool target', 'Verify suction / discharge pressure', 'Log all temps and pressures'] },
    { phase: '7. Air balancing', goal: 'Comfort across every zone.', checklist: ['Anemometer at every grille', 'Adjust dampers to design CFM', 'Verify return-air path', 'Set controls schedule'] },
    { phase: '8. Handover & maintenance plan', goal: 'Owner trained, schedule active.', checklist: ['Filter change calendar', 'Quarterly inspection contract', 'Annual leak test', 'Warranty registration filed'] },
  ],
  partsManual: [
    { group: 'Refrigerant', items: [
      { name: 'R-32 — current new equipment standard' },
      { name: 'R-410A — installed-base replacement' },
      { name: 'R-454B — emerging low-GWP standard' },
      { name: 'R-22 — recovery only, do not top-up new installs' },
    ]},
    { group: 'Pipes & fittings', items: [
      { name: '1/4" / 3/8" / 1/2" / 5/8" / 3/4" Cu ACR pipe' },
      { name: 'Insulation — closed-cell elastomer 9–13 mm' },
      { name: 'Brazing rod silver 5–15%' },
      { name: 'Flare nuts and unions' },
    ]},
    { group: 'Electrical & controls', items: [
      { name: 'IP65 isolator 32 / 40 / 63 A' },
      { name: 'Type B RCBO 30 mA (inverter ODUs)' },
      { name: '5-core cable for VRF inter-unit' },
      { name: 'BMS interface (Modbus / BACnet)' },
    ]},
    { group: 'Service items', items: [
      { name: 'Filters — 1" pleated MERV 8 / MERV 13' },
      { name: 'Drier / filter-drier replacement on every charge re-do' },
      { name: 'Condenser fan motors and capacitors' },
      { name: 'Indoor blower wheels' },
      { name: 'Drain pumps and float switches' },
    ]},
    { group: 'Cold room & process refrigeration', items: [
      { name: 'Thermostatic or electronic expansion valve with matched orifice', note: 'An EEV pays for itself on wide-swing loads by holding superheat where a TXV hunts.' },
      { name: 'Evaporator defrost heaters and termination thermostat', interval: 'Inspect 6 mo', note: 'A failed termination thermostat is the usual cause of a permanently iced evaporator.' },
      { name: 'Door heater tape, gaskets and strip curtains', interval: 'Gaskets inspect quarterly', note: 'A poor door seal loads the plant more than any other single fault in a cold room.' },
      { name: 'Crankcase heater', interval: 'Verify current draw annually', note: 'Prevents refrigerant migration and liquid slugging on start after a long off-cycle.' },
      { name: 'Liquid receiver, sight glass and moisture indicator' },
      { name: 'Pressure relief valve and safety switches', interval: 'Function test annually', note: 'Required by EN 378 practice on systems above the charge threshold.' },
      { name: 'Panel insulation and floor-heater tape for freezer rooms' },
    ]},
    { group: 'Service instruments', items: [
      { name: 'Digital manifold gauge set with P/T tables for R-32, R-410A, R-454B', interval: 'Calibrate annually', note: 'Superheat and subcooling are only as good as the gauge.' },
      { name: 'Micron (vacuum) gauge', note: 'A compound gauge cannot resolve 500 µm — this is the instrument that proves the evacuation.' },
      { name: 'Recovery machine and recovery cylinders', note: 'Venting refrigerant is both illegal and traceable; recover every time.' },
      { name: 'Electronic leak detector and UV dye kit', interval: 'Sensor replace per maker' },
      { name: 'Refrigerant scale for weighed charging', interval: 'Calibrate annually' },
      { name: 'Anemometer and manometer for airflow and static pressure' },
      { name: 'Clamp meter with inrush and capacitance ranges' },
      { name: 'Nitrogen regulator and purge kit for brazing' },
    ]},
  ],
  repairManual: [
    { fault: 'Insufficient cooling', priority: 'urgent', steps: [
      'Verify thermostat setpoint and battery.',
      'Inspect filter — replace if loaded.',
      'Measure suction & discharge pressure; compute superheat & subcool.',
      'Inspect condenser cleanliness.',
      'Leak-test if subcool low.',
    ]},
    { fault: 'Evaporator coil icing', priority: 'urgent', steps: [
      'Power off and let ice melt completely.',
      'Replace filter.',
      'Verify airflow at supply grille (≥ 350 CFM/ton).',
      'Check superheat — low SH suggests overcharge or stuck TXV.',
    ], warning: 'Running with ice damages compressor on slugging.' },
    { fault: 'Compressor short-cycling', priority: 'urgent', steps: [
      'Inspect thermostat differential and fan setting.',
      'Verify refrigerant charge.',
      'Check capacitor and contactor.',
      'Pump-down and inspect for high pressure cut-out.',
    ]},
    { fault: 'Water leak from indoor unit', priority: 'routine', steps: [
      'Inspect drain pan and condensate line.',
      'Vacuum drain line; flush with bleach solution.',
      'Verify drain pan slope and primary trap.',
      'Replace drain pump if installed and clogged.',
    ]},
    { fault: 'Outdoor fan not running', priority: 'urgent', steps: [
      'Check capacitor (5–10 µF dual-run typical).',
      'Test contactor coil and contacts.',
      'Verify fan motor windings IR > 1 MΩ.',
      'Confirm sufficient line-voltage at terminals.',
    ]},
    { fault: 'High discharge pressure', priority: 'urgent', steps: [
      'Inspect condenser coil for blockage.',
      'Verify outdoor fan is running.',
      'Check for overcharge.',
      'Look for non-condensables (air) — vacuum and recharge.',
    ]},
    { fault: 'Room reaches setpoint but stays humid and clammy', priority: 'routine', steps: [
      'Measure run time, not just temperature — a unit satisfying in under ten minutes is short-cycling and cannot dehumidify.',
      'Record dry-bulb and relative humidity at the return grille and at the supply grille; the difference tells you how much moisture the coil is actually removing.',
      'Check airflow against the design figure. Excess airflow raises coil surface temperature and kills latent capacity, so a fan set to maximum is often the culprit.',
      'Measure superheat — a starved coil runs warm and condenses little.',
      'Quantify the outdoor-air load; an open door, a failed damper or an over-generous ventilation rate can exceed the unit\'s latent capability by itself.',
      'Where the equipment is genuinely oversized, the fix is a lower fan speed and a longer run cycle, or an inverter unit that can modulate down — not a lower setpoint.',
    ], warning: 'Turning the thermostat down to fight humidity makes it worse: shorter, colder cycles remove even less moisture and cost more to run.' },
    { fault: 'System loses charge again a few months after every top-up', priority: 'urgent', steps: [
      'Stop topping up. A system that needs gas annually has a leak, and repeated recharging is both a warranty risk and an environmental offence.',
      'Recover the remaining charge properly and weigh it — the shortfall against nameplate tells you the leak rate.',
      'Pressure-test with dry nitrogen at the OEM test pressure and hold; a standing-pressure test finds what a sniffer misses.',
      'Concentrate the search on flare joints, braze joints, Schrader cores and the evaporator return bends — these account for most field leaks.',
      'Inspect for oil staining, which marks a refrigerant leak far more reliably than bubbles.',
      'Repair, replace the filter-drier, evacuate to 500 µm with a decay test, then weigh in the full nameplate charge and record it.',
    ], warning: 'Never add refrigerant to a system that has not been leak-tested. Topping up a leaking circuit destroys the compressor by running it hot and starved of oil return.' },
    { fault: 'Cold room will not pull down to temperature', priority: 'urgent', steps: [
      'Separate a load problem from a plant problem: check door seals, strip curtains, defrost frequency and how much warm product was loaded at once before condemning the equipment.',
      'Inspect the evaporator for ice bridging between fins — a blocked coil moves no air regardless of how well the compressor is running.',
      'Verify the defrost cycle actually terminates on temperature rather than on time alone, and that the termination thermostat and heaters work.',
      'Measure suction pressure and superheat at the evaporator; a hunting TXV shows as oscillating superheat and poor pull-down.',
      'Check the condenser and ambient conditions — head pressure climbing at midday will cut capacity exactly when the load is highest.',
      'Confirm the crankcase heater is drawing current; refrigerant migration during off-cycles damages the compressor on restart.',
      'Only after the above, verify charge by subcooling and weight against nameplate.',
    ]},
  ],
  errorCodes: [
    { code: 'E1 / E2 / E3 / E5 / E6', family: 'Generic split AC family (varies by OEM)', meaning: 'Indoor / outdoor temp sensor error · communication loss · over-pressure · etc.', severity: 'medium', fix: ['Reference OEM manual — code mapping is brand-specific', 'Verify sensor wiring and resistance', 'Reset and observe'] },
    { code: 'F1 / F2 / F3', family: 'Daikin / LG split family', meaning: 'Indoor sensor / outdoor sensor / refrigerant pressure', severity: 'medium', fix: ['Replace failed thermistor', 'Inspect coil and condenser', 'Refrigerant pressure check'] },
    { code: 'P0 / P1 / P2', family: 'Daikin / Carrier inverter', meaning: 'Inverter PCB, voltage, or compressor protection', severity: 'high', fix: ['Verify supply voltage stability', 'Inspect PCB for swollen capacitors', 'Test compressor windings'] },
    { code: 'U0 / U2 / U4', family: 'Daikin VRV', meaning: 'Refrigerant shortage / unit communication / outdoor lockout', severity: 'high', fix: ['Pressure check', 'Verify F1/F2 communication wiring', 'Restart sequence per OEM'] },
    { code: 'CH 01–CH 38', family: 'Samsung / LG VRF', meaning: 'Various indoor / outdoor / sensor / valve faults', severity: 'medium', fix: ['Brand-specific table — consult service manual', 'Replace failed sensor or component'] },
    { code: 'L4 / L5', family: 'Mitsubishi Electric M-series', meaning: 'Drain overflow / drain pump fault', severity: 'medium', fix: ['Clear drain pan and line', 'Test drain pump motor', 'Replace float switch if stuck'] },
    { code: 'High-pressure switch lockout', family: 'Mechanical safety protection', meaning: 'Discharge pressure reached the cut-out setting; the system has locked out to protect the compressor.', severity: 'high', fix: ['Clean the condenser coil and confirm the outdoor fan runs', 'Check for overcharge and for non-condensables in the circuit', 'Measure ambient at the condenser — an enclosed hot courtyard defeats any unit', 'Never bypass or wire out a pressure switch to keep a room cool'] },
    { code: 'Low-pressure / loss-of-charge lockout', family: 'Mechanical safety protection', meaning: 'Suction pressure fell below the cut-out — usually undercharge, restriction, or an airflow failure on the evaporator.', severity: 'high', fix: ['Check the filter and evaporator airflow before touching the charge', 'Look for ice on the coil, which starves suction pressure', 'Leak-test rather than top up', 'Inspect the filter-drier and TXV for restriction'] },
    { code: 'Discharge temperature protection', family: 'Compressor protection', meaning: 'Discharge line or compressor dome temperature exceeded limit — running hot and starved of oil return.', severity: 'critical', fix: ['Stop and investigate before restarting; this is the fault that kills compressors', 'Check for undercharge and excessive superheat', 'Verify the expansion device is feeding correctly', 'Confirm the compressor is not running against a high-pressure condition'] },
    { code: 'IPM / inverter over-current', family: 'Inverter compressor drive', meaning: 'The compressor drive module tripped on current — drive, compressor winding, or supply-side problem.', severity: 'high', fix: ['Log supply voltage over a full cycle; sustained under-voltage is a common trigger', 'Test compressor winding resistance and insulation to earth', 'Inspect the PCB for swollen capacitors and heat damage', 'Confirm the heatsink and its cooling path are clear'] },
    { code: 'Reverse / loss of phase', family: 'Three-phase protection module', meaning: 'Phase sequence reversed or a phase is missing; scroll compressors will run backwards and be damaged.', severity: 'critical', fix: ['Do not run the plant — a scroll turning backwards is destroyed quickly', 'Measure all three phases and check for a blown fuse or open pole', 'Correct rotation by swapping two phases at the isolator', 'Confirm the phase-protection relay is functional, not bypassed'] },
    { code: 'Defrost fault / permanent ice', family: 'Refrigeration controller', meaning: 'The defrost cycle is not initiating or not terminating correctly, so the evaporator stays iced.', severity: 'medium', fix: ['Verify defrost termination on temperature, not on time alone', 'Test the defrost heaters for continuity and current draw', 'Check the termination thermostat and its mounting position on the coil', 'Review defrost frequency against the actual door-opening pattern'] },
  ],
  diagrams: ['ac-refrigeration-cycle', 'chiller-system'],
  roi: [
    { scenario: 'Replace 10-yr-old fixed-speed split with R-32 inverter', capex: 'KES 80k – 130k', annualSaving: 'Energy ≈ KES 18k / yr', payback: '5–6 yr', notes: 'Comfort and noise improve dramatically.' },
    { scenario: 'VRF retrofit for 30-room office floor', capex: 'KES 6M – 9M', annualSaving: '≈ KES 1.4M', payback: '4–5 yr', notes: 'Zone control + heat-recovery delivers savings beyond rated efficiency.' },
    { scenario: 'Oil-free centrifugal chiller upgrade', capex: 'KES 20M+', annualSaving: '≈ KES 4M', payback: '4–6 yr', notes: 'Plus reduced maintenance vs old screw chiller.' },
    { scenario: 'Planned maintenance contract vs reactive callouts — 20-unit office', capex: 'KES 350k – 500k / yr', annualSaving: 'Compressor replacements avoided ≈ KES 600k, plus roughly 10–15% lower running cost from clean coils and correct charge', payback: 'Within the first year', notes: 'The saving is mostly in what does not happen: a clean condenser and a correct charge are what keep a compressor alive to its design life.' },
    { scenario: 'Cold room refurbishment — doors, seals and defrost control', capex: 'KES 400k – 900k', annualSaving: 'Energy ≈ KES 250k / yr plus product-loss risk removed', payback: '2–3 years', notes: 'Cheaper and faster than replacing the refrigeration plant, and it usually fixes the pull-down complaint that prompted the quote for a bigger unit.' },
  ],
  warrantyOptions: [
    'Compressor warranty 5 yr standard',
    'PCB / parts 1–2 yr standard',
    'Workmanship 12 months',
    'Annual maintenance contract extends compressor warranty by 12 months',
  ],
  qualityChecks: [
    'Pressure-test 350 PSI nitrogen 24 h before refrigerant',
    'Vacuum to 500 µm with decay test',
    'Superheat / subcool logged at commissioning',
    'Air-flow at every grille balanced to design',
    'Insulation thickness ≥ 9 mm on all refrigerant pipes',
    'Charge weighed in from a blank vacuum and the figure recorded on the unit',
    'Filter-drier replaced whenever the circuit has been opened',
    'Brazing carried out under a flowing nitrogen purge, verified on site',
    'Condensate drain proven by pouring water through it before handover',
    'Recovered refrigerant logged rather than vented',
  ],
  fastRepairCallouts: [
    'Stocked: capacitors, contactors, common PCBs, R-32 / R-410A bottles',
    'Vacuum pump and recovery machine on every van',
    'Brazing kit with nitrogen purge',
    'Leak detector electronic + UV dye',
  ],
  references: [
    'ASHRAE Handbook — HVAC Applications',
    'ISO 5151 — non-ducted air conditioners performance',
    'EN 378 — refrigerating systems and heat pumps, safety',
    'Kigali Amendment to Montreal Protocol — HFC phase-down',
    'Kenya — Ozone Layer Protection Regulations 2007',
    'ASHRAE 62.1 — ventilation for acceptable indoor air quality',
    'ASHRAE 15 — safety standard for refrigeration systems',
    'ISO 817 — refrigerant designation and safety classification',
    'EN 14511 — performance rating of air conditioners and heat pumps',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. UPS BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const UPS_BIBLE: ServiceBible = {
  family: 'ups',
  hero: {
    headline: 'The UPS Bible',
    subhead: 'Online double-conversion to modular megawatt rooms — every joule accounted for.',
  },
  intro: [
    'A UPS is the bridge between utility and the load during the seconds-to-minutes that the genset takes to start, transfer, and stabilise. Its sizing, topology, and battery technology decide whether the bridge is fit for the load it carries — or quietly fails the day everything depends on it.',
    'Three topologies exist per IEC 62040-3. VFD (offline / standby) — load runs on raw mains; UPS only engages on failure with 4–10 ms transfer. VI (line-interactive) — adds a buck/boost autotransformer to handle voltage swings without battery use. VFI (online / double-conversion) — load is permanently fed by inverter from rectifier+battery DC bus. VFI is the only acceptable choice for mission-critical IT, medical, telecom, and most data-centre loads.',
    'Sizing in kVA / kW is more complex than it looks. Servers are mostly active power (kW); ageing PSUs draw at PF 0.7–0.8; modern PSUs at 0.95–0.98. A UPS rated 10 kVA / 8 kW will overload on a server cabinet drawing 9 kW even though apparent power is fine. Always match kW to load demand — kVA is secondary.',
    'Battery sizing follows runtime requirements. Runtime (h) ≈ (Capacity Ah × Voltage × DoD × inverter η) ÷ Load W. A 480 V × 100 Ah string at 80% DoD with 95% inverter efficiency will run a 30 kW load for ≈ 1.2 hours. VRLA batteries lose 4–5% capacity per year of float; lithium-ion lose < 2% — but capex is 2.5–3 × VRLA.',
    'Battery technology is shifting. VRLA (sealed lead-acid) AGM remains common for cost; lithium-ion (NMC or LFP) for longevity, weight, and faster recharge. LFP is the preferred chemistry now — thermal runaway resistance, 10-year design life, 3,000–5,000 cycle endurance. NMC is denser but riskier; banned from many data-centre rooms.',
    'Modular UPS (Schneider Galaxy VS, Eaton 93PM, Vertiv Liebert APM, ABB Conceptpower) lets you scale capacity in 25–50 kW slices, hot-swap modules, and design N+1 redundancy without doubling capex. Single-block UPS still has a place in small server rooms but loses on serviceability.',
    'Static bypass is the crucial fallback that lets a faulted inverter route power directly from utility to load without dropping the load. Test the static bypass annually under controlled conditions; an untested static-bypass on the day of an inverter failure is no bypass at all.',
    'Harmonic distortion of the input current matters because UPS rectifiers are large non-linear loads. Older 6-pulse rectifiers produce 25–30% THDi — punishes upstream gensets and trips PF-correction. 12-pulse and IGBT input rectifiers cut THDi to <5%. Specify low-THDi for any UPS > 100 kVA.',
    'Crash-cart / EPO (Emergency Power Off) wiring is one of the most-mis-installed UPS components. A latched EPO that is wired through the same control circuit as the room shutdown will trip the UPS along with the rest of the room — defeating its purpose. EPO must be a dedicated normally-closed loop tested at commissioning.',
    'Maintenance: monthly battery monitoring (impedance / float current), quarterly thermography and inspection, annual full-load battery test (or use connected battery monitor system to avoid downtime). Battery replacement at end-of-life is non-negotiable; in a critical-load environment we recommend replacement at 80% capacity rather than waiting for failure.',
    'The UPS and the standby generator have to be commissioned as one system, and this is where most sites come unstuck. A UPS rectifier is a non-linear load that the genset sees as harsh, and a genset is a source whose voltage and frequency wander for the first seconds after it takes the load. Three settings decide whether the pair works: rectifier walk-in, which ramps the UPS input current up over several seconds instead of slamming the genset; the input current limit, which caps how hard the UPS charges its batteries while on generator; and the bypass frequency window and slew-rate tolerance, which determine whether the UPS will stay synchronised to a source that is still hunting. Get these wrong and the UPS refuses to accept generator power, runs the batteries flat while the genset sits there loaded only by the building, and drops the load anyway. Where a 6-pulse rectifier is involved, plan on the generator being materially larger than the UPS rating rather than matching them one to one.',
    'Two local realities shape UPS specification in Kenya. The first is heat: VRLA battery life is roughly halved for every 8–10 °C of sustained temperature rise above the 20–25 °C design point, so a battery room without dedicated cooling turns a five-year string into a two-year string, and the customer experiences that as "the UPS failed" rather than "the room was hot". Air-conditioning the battery space is almost always cheaper than the replacement cycle it prevents. The second is that a UPS is only ever a bridge. Kenyan outages routinely outlast any economically sized battery, so the honest design question is not "how many hours of battery" but "how quickly does the generator start, and what must stay alive in between". Sites that try to buy their way out of long outages with battery capacity alone spend several times what a correctly configured UPS-plus-generator pair would cost.',
  ],
  topBrands: [
    { name: 'APC by Schneider Electric', origin: 'United States / France', capability: 'Smart-UPS / Symmetra / Galaxy ranges 0.5 kVA – 1.5 MVA. Galaxy VS / VL modular.', bestFor: ['SME', 'Enterprise', 'Data centre'], warranty: '2–3 yr standard', tier: 'premium', notes: 'Most-installed brand globally.' },
    { name: 'Eaton', origin: 'United States', capability: '5P / 9SX / 93PM / Power Xpert. Strong modular line.', bestFor: ['Enterprise', 'Industrial', 'Data centre'], warranty: '2 yr standard', tier: 'premium', notes: 'EnergyAdvantage variable-mode efficiency 99% in eco-mode.' },
    { name: 'Vertiv (Liebert)', origin: 'United States', capability: 'GXT / EXM / APM / EXL ranges. Strong modular and large-data-centre.', bestFor: ['Data centre', 'Telecom', 'Industrial'], warranty: '2 yr standard', tier: 'premium', notes: 'Industry leader in cooling-integrated solutions.' },
    { name: 'ABB', origin: 'Switzerland', capability: 'PowerValue / DPA / PowerScale modular up to 4 MVA.', bestFor: ['Data centre', 'Industry'], warranty: '2 yr standard', tier: 'premium', notes: 'DPA decentralised parallel architecture — true hot-swap.' },
    { name: 'Riello UPS', origin: 'Italy', capability: 'Multi Sentry / Master HE / Multi Power Combo ranges.', bestFor: ['Healthcare', 'Industry', 'Commercial'], warranty: '2 yr standard', tier: 'mid', notes: 'Strong in European medical / healthcare.' },
    { name: 'Socomec', origin: 'France', capability: 'NETYS / MASTERYS / DELPHYS / MODULYS modular.', bestFor: ['Industrial', 'Data centre', 'Healthcare'], warranty: '2 yr standard', tier: 'premium', notes: 'Modular MODULYS GP & XL widely deployed in colocation.' },
    { name: 'Delta Electronics', origin: 'Taiwan', capability: 'Amplon / Ultron / Modulon series.', bestFor: ['SME', 'Data centre', 'Telecom'], warranty: '2 yr standard', tier: 'mid', notes: 'Aggressive in modular pricing for African data centres.' },
    { name: 'CyberPower', origin: 'United States', capability: 'PR / OL series — line-interactive and online.', bestFor: ['SME', 'SOHO'], warranty: '2 yr', tier: 'value', notes: 'Cost-effective entry tier; popular in retail.' },
    { name: 'Tripp Lite (Eaton group)', origin: 'United States', capability: 'SmartOnline / SmartPro ranges.', bestFor: ['SOHO', 'Light commercial'], warranty: '2 yr', tier: 'mid', notes: 'Strong North-American specification compliance.' },
    { name: 'Huawei', origin: 'China', capability: 'UPS5000-S / UPS2000-G / SmartLi battery.', bestFor: ['Data centre', 'Telecom'], warranty: '3 yr standard', tier: 'mid', notes: 'Aggressive deployments in African telecom and DC.' },
  ],
  installPhases: [
    { phase: '1. Load profile', goal: 'kW, kVA, PF, harmonic profile of every protected load.', checklist: ['Server / IT power-meter logging 7-day', 'Identify dynamic peaks (boot-up storms)', 'Document PF', 'Categorise loads by criticality'] },
    { phase: '2. Topology selection', goal: 'Choose VFD / VI / VFI per criticality.', checklist: ['VFI for any IT / medical / industrial process', 'Modular vs monolithic decision', 'Redundancy strategy (N / N+1 / 2N)'] },
    { phase: '3. Battery sizing & technology', goal: 'Runtime achieved, replacement plan agreed.', checklist: ['Compute Ah for required runtime', 'Pick VRLA / LFP / NMC', 'Decide rack vs cabinet vs containerised', 'Plan ventilation and fire-suppression'] },
    { phase: '4. Power infrastructure', goal: 'Cable, breaker, and bypass paths.', checklist: ['Input cable for full-rated kVA', 'Output cable for protected load', 'Maintenance bypass switch', 'Static bypass tested'] },
    { phase: '5. Cooling & environment', goal: 'Battery and electronics within window.', checklist: ['Battery room 22–25 °C ideal', 'UPS heat dissipation matched to room HVAC', 'Smoke & gas detection in battery room (LFP requires Li-fire-suppression class)'] },
    { phase: '6. Commission', goal: 'Black-start, transfer, autonomy verified.', checklist: ['Battery autonomy actual run', 'Bypass transfer tested', 'EPO loop functionally tested', 'BMS / SNMP integration verified'] },
    { phase: '7. Documentation', goal: 'As-built and capacity records.', checklist: ['Battery serial-number register', 'Initial impedance measurements', 'Float voltage settings', 'Operator runbook'] },
    { phase: '8. Maintenance & monitoring', goal: 'Remain ready, not just installed.', checklist: ['Quarterly visit', 'Annual full-load discharge test', 'Battery monitor system (BMS) installed for any > 50 kVA UPS', '24/7 SNMP traps to NOC'] },
  ],
  partsManual: [
    { group: 'Modules / cards', items: [
      { name: 'Power module 25 / 50 / 75 kW (modular UPS)' },
      { name: 'Bypass module' },
      { name: 'Static-switch assembly' },
      { name: 'Display / control panel' },
      { name: 'Communication card SNMP / Modbus / BACnet' },
    ]},
    { group: 'Batteries', items: [
      { name: '12 V / 7 / 9 / 12 / 26 / 65 / 100 / 150 / 200 Ah VRLA AGM' },
      { name: 'LFP rack module 48 V / 50–100 Ah' },
      { name: 'High-voltage LFP cabinet 380–600 V' },
      { name: 'Battery cabinet rack with internal fuses' },
    ]},
    { group: 'Wiring & accessories', items: [
      { name: 'Battery interconnects with insulated terminals' },
      { name: 'Battery-circuit breaker' },
      { name: 'Maintenance bypass switch with mechanical interlock' },
      { name: 'Ferrite cores for harmonic mitigation' },
    ]},
    { group: 'Battery monitoring & test', items: [
      { name: 'Battery monitoring system — per-block voltage, impedance and temperature', interval: 'Verify calibration annually', note: 'Turns an annual discharge test into continuous evidence, without taking the load off protection.' },
      { name: 'Handheld battery impedance analyser', interval: 'Calibrate annually', note: 'Impedance trending against the commissioning baseline finds the weak block before the string fails.' },
      { name: 'Discharge load bank for autonomy proving', note: 'The only way to know real runtime. A calculated figure is a claim, a discharge test is a measurement.' },
      { name: 'Battery serial register and installation-date labels', interval: 'Update at every replacement', note: 'Without it nobody can tell you how old the string is when it matters.' },
      { name: 'Insulated torque wrench for terminal connections', note: 'Under-torqued battery terminals run hot; over-torqued ones crack the post seal.' },
    ]},
    { group: 'Environment & safety', items: [
      { name: 'Dedicated battery-room cooling', interval: 'Service with the building HVAC', note: 'Every 8–10 °C above 25 °C roughly halves VRLA life — this is the highest-value item on the list.' },
      { name: 'Hydrogen detection and forced ventilation for VRLA rooms', interval: 'Function test annually', note: 'Required by EN 50272-2 practice where venting is possible.' },
      { name: 'Fire detection appropriate to the chemistry', note: 'Lithium installations need a suppression approach rated for that chemistry — a standard room system is not automatically adequate.' },
      { name: 'Spill kit and eyewash for flooded / VRLA installations' },
      { name: 'Insulated tools, face shield and gloves rated to the DC bus voltage', note: 'A battery string has no off switch; it is live the moment it is connected.' },
      { name: 'Temperature and humidity logger in the battery space', interval: 'Download monthly' },
    ]},
    { group: 'Life-limited components', items: [
      { name: 'Cooling fans in UPS and power modules', interval: '5–7 yr', note: 'A fan is a wear item on a fixed clock. Replace on schedule rather than on alarm.' },
      { name: 'DC bus electrolytic capacitors', interval: '7–10 yr', note: 'Ageing capacitors raise output distortion long before they fail outright.' },
      { name: 'AC output filter capacitors', interval: '7–10 yr' },
      { name: 'Air filters on cabinet intakes', interval: '6–12 mo depending on dust' },
      { name: 'Static-switch SCR assembly', interval: 'On thermography alarm' },
      { name: 'Control board backup cell / RTC battery', interval: '5 yr', note: 'When it dies the UPS loses its event log — the one thing you need after an incident.' },
    ]},
  ],
  repairManual: [
    { fault: 'UPS on bypass continuously', priority: 'urgent', steps: [
      'Read alarm log — internal fault triggers bypass.',
      'Test inverter on no-load.',
      'Replace failed power module.',
      'Verify battery health.',
    ]},
    { fault: 'Battery fault / replace battery alarm', priority: 'urgent', steps: [
      'Run capacity test on string.',
      'Identify weakest battery by impedance.',
      'Replace only entire string — never one battery.',
      'Reset battery age counter.',
    ], warning: 'Mixing old and new VRLA cells dramatically shortens new battery life.' },
    { fault: 'Output overload', priority: 'urgent', steps: [
      'Read output kW / kVA.',
      'Identify load pulled in beyond design.',
      'Reduce or expand UPS capacity.',
      'Consider modular hot-add of power module.',
    ]},
    { fault: 'High input current THD', priority: 'routine', steps: [
      'Install IGBT-input UPS module if older 6-pulse rectifier.',
      'Add input filter or 12-pulse transformer.',
      'Verify upstream genset is sized to handle harmonics.',
    ]},
    { fault: 'EPO falsely tripped', priority: 'urgent', steps: [
      'Inspect EPO wiring continuity — must be normally-closed.',
      'Verify only EPO buttons in loop, no other circuits.',
      'Reset and test deliberately.',
    ]},
    { fault: 'Battery hot to touch', priority: 'emergency', steps: [
      'Isolate battery string immediately.',
      'Allow cool-down; ventilate the room.',
      'Capacity test — replace string if any cell > 5 °C above neighbours.',
      'Investigate float voltage — overcharging is the usual cause.',
    ], warning: 'Overheated VRLA can vent hydrogen; LFP can cascade into thermal event. Prioritise human safety.' },
    { fault: 'UPS drops the load when the generator takes over', priority: 'emergency', steps: [
      'Read the event log around the transfer timestamp — the UPS records exactly why it refused or lost the source.',
      'Check the bypass input window and slew-rate tolerance against what the genset actually delivers in its first ten seconds; a UPS set to utility-grade tolerances will reject a healthy generator.',
      'Enable or lengthen rectifier walk-in so the UPS ramps its input current instead of applying it as a step.',
      'Set the input current limit to hold back battery recharge while on generator; a flat string demanding full charge current can overload the set on its own.',
      'Compare genset rating against UPS rating and rectifier type — a 6-pulse front end needs substantially more generator than its kVA figure suggests.',
      'Confirm the genset governor and AVR are in the right mode; isochronous rather than droop is usually required for a single-set standby installation.',
      'Prove the fix by transferring deliberately under load, not by waiting for the next outage.',
    ], warning: 'This is one of the most common critical-power failures on sites that have both a UPS and a generator, and it is usually a settings and sizing mismatch rather than faulty equipment.' },
    { fault: 'Real runtime is far shorter than the design figure', priority: 'urgent', steps: [
      'Measure the actual load in kW, not kVA. Runtime figures are quoted at a stated load, and a room that has quietly grown from 6 kW to 9 kW has lost a third of its autonomy.',
      'Record the battery string age and the room temperature history — sustained heat is the most common reason a five-year string behaves like a two-year one.',
      'Take impedance readings across every block and compare against the commissioning baseline; a single weak block limits the whole string.',
      'Run a controlled discharge test to a known end voltage and time it. This is the measurement that settles the argument.',
      'Verify the float voltage and temperature compensation setting; chronic overcharging dries VRLA cells and chronic undercharging sulphates them.',
      'Replace the string as a complete set, never block by block, and log the new installation date.',
    ], warning: 'Never mix new and old blocks in one string. The old cells drag the new ones down and you buy the same problem again within a year.' },
    { fault: 'UPS needs servicing but the load cannot be interrupted', priority: 'routine', steps: [
      'Confirm a maintenance bypass exists and is mechanically interlocked with the UPS. If there is none, that is the first job — retrofitting one is far cheaper than an outage.',
      'Verify the static bypass is healthy before relying on the manual path; transfer to static bypass and back under supervision first.',
      'Walk the written switching sequence with the site team before touching anything, and agree who calls a stop.',
      'Transfer to maintenance bypass following the exact make-before-break order for the equipment; the interlock exists to prevent back-feeding the UPS output.',
      'Confirm the load is genuinely on raw utility, and understand that during this window the protected load has no UPS protection at all — keep the window short and avoid it during known-unstable hours.',
      'Complete the work, return to normal in the reverse sequence, and verify the UPS is carrying load on inverter before leaving site.',
    ], warning: 'While on maintenance bypass the critical load is unprotected. Schedule the window deliberately and have the generator available before starting.' },
  ],
  errorCodes: [
    { code: 'INV LOSS', family: 'Online UPS', meaning: 'Inverter not synchronised; load on bypass.', severity: 'high', fix: ['Inspect inverter module', 'Verify sync to bypass', 'Replace failed module'] },
    { code: 'BAT TEST FAIL', family: 'Online UPS', meaning: 'Periodic battery test failed.', severity: 'high', fix: ['Run manual capacity test', 'Replace string if < 80% capacity', 'Investigate float voltage'] },
    { code: 'BAT WEAK', family: 'Online UPS', meaning: 'Internal impedance trending up.', severity: 'medium', fix: ['Schedule replacement within 6 months', 'Run capacity test to confirm'] },
    { code: 'BYP RANGE', family: 'Online UPS', meaning: 'Bypass voltage / frequency outside transfer window.', severity: 'medium', fix: ['Inspect upstream supply', 'Adjust bypass tolerance setting per OEM'] },
    { code: 'OVERLOAD', family: 'All UPS', meaning: 'Connected load exceeds rated capacity.', severity: 'high', fix: ['Reduce load or upgrade UPS', 'Move non-critical load off UPS'] },
    { code: 'OVERTEMP', family: 'All UPS', meaning: 'Internal temperature above limit.', severity: 'medium', fix: ['Improve room ventilation', 'Clean fan filters', 'Verify cooling design'] },
    { code: 'EPO ACTIVE', family: 'All UPS', meaning: 'EPO loop opened — load shut down.', severity: 'critical', fix: ['Inspect EPO wiring', 'Reset only after verifying cause', 'Test bypass before re-enabling'] },
    { code: 'DC BUS FAULT', family: 'Online UPS', meaning: 'DC link voltage outside the permitted window — rectifier, battery or bus-capacitor problem.', severity: 'critical', fix: ['Do not repeatedly reset; the load is riding on bypass and unprotected', 'Measure bus voltage against the OEM figure with the battery isolated', 'Inspect DC bus capacitors for bulging or leakage, especially past 7–10 years of service', 'Escalate to OEM before re-enabling the inverter'] },
    { code: 'RECTIFIER FAULT / input phase loss', family: 'Online UPS', meaning: 'The input stage has lost a phase or detected a fault; the UPS is running from batteries or bypass.', severity: 'critical', fix: ['Treat as an outage in progress — runtime is finite from this moment', 'Measure all three input phases at the UPS terminals and at the board', 'Check input fuses and the upstream breaker for a single open pole', 'Verify phase rotation after any switchgear work upstream'] },
    { code: 'FAN FAIL', family: 'All UPS', meaning: 'One or more cooling fans have stopped or fallen below speed threshold.', severity: 'medium', fix: ['Replace the fan promptly — the UPS will derate or shut down as temperature rises', 'Treat fans as scheduled wear items at 5–7 years rather than waiting for the alarm', 'Clean intake filters at the same time', 'Check room ambient; a hot room shortens every fan on site'] },
    { code: 'PARALLEL / REDUNDANCY COMM LOSS', family: 'Modular or parallel UPS', meaning: 'Units in a parallel or modular system have lost the communication link that coordinates load sharing.', severity: 'high', fix: ['Confirm redundancy is genuinely lost before treating it as an emergency — the load is usually still supported', 'Inspect the inter-unit communication cabling and terminations', 'Check for a module that has isolated itself and is reporting separately', 'Verify firmware versions match across modules after any replacement'] },
    { code: 'BATTERY EARTH FAULT', family: 'DC system monitoring', meaning: 'An earth reference has appeared on the floating battery bus — insulation breakdown somewhere in the string or its wiring.', severity: 'high', fix: ['Locate by sectionalising the string with the load on bypass and the string isolated', 'Inspect for damaged insulation at interconnects and at cabinet entry points', 'Look for moisture, dust bridging or a leaking cell', 'A single earth fault is survivable; a second one on the opposite pole is a short across the string'] },
    { code: 'SYNC LOSS / bypass out of sync', family: 'Online UPS', meaning: 'The inverter cannot lock to the bypass source, so a transfer to bypass would be break-before-make.', severity: 'high', fix: ['Common while running on generator — check the frequency window and slew-rate settings first', 'Verify the genset governor is holding frequency steadily', 'Do not widen the tolerance beyond what the load can accept just to clear the alarm', 'Re-test the transfer deliberately once the source is stable'] },
  ],
  diagrams: ['ups-double-conversion', 'ups-offline'],
  roi: [
    { scenario: '10 kVA online UPS — server room (15 min runtime)', capex: 'KES 350k – 550k', annualSaving: 'Avoided downtime ≈ KES 1.2M / yr', payback: 'First incident', notes: 'Pays back at first severe outage.' },
    { scenario: '160 kVA modular UPS (N+1) — small data centre', capex: 'KES 6M – 9M', annualSaving: 'SLA-credit avoidance ≈ KES 4M / yr', payback: '2–3 yr', notes: 'Critical for colocation tenants.' },
    { scenario: 'LFP retrofit replacing VRLA strings', capex: '+30% over VRLA replacement', annualSaving: 'Halved replacement cycle, lower cooling', payback: '5 yr lifecycle', notes: 'TCO crosses-over at year 5; preferred for new deployments.' },
    { scenario: 'Battery monitoring system retrofit on an existing UPS', capex: 'KES 250k – 600k depending on string size', annualSaving: 'One avoided surprise string failure ≈ KES 400k – 1M, plus the annual discharge outage no longer needed', payback: 'First avoided failure', notes: 'Continuous impedance trending replaces an annual snapshot. It also removes the awkward choice between proving the battery and keeping the load protected.' },
    { scenario: 'Maintenance bypass retrofit on a UPS installed without one', capex: 'KES 300k – 700k', annualSaving: 'Every future service visit stops needing a load outage', payback: 'Second service visit', notes: 'A common and expensive omission on budget installations. Without it, servicing the UPS means dropping the load it was bought to protect.' },
  ],
  warrantyOptions: [
    'UPS hardware 2–3 yr standard',
    'VRLA batteries 1–2 yr; LFP 5–10 yr',
    'Workmanship 12 months',
    'Service contracts extend warranty up to 5 yr',
  ],
  qualityChecks: [
    'Battery impedance log per cell at commissioning',
    'Float voltage measured per OEM spec',
    'Static bypass functionally tested',
    'EPO loop tested NC continuity',
    'Output waveform THD < 5% at full load',
    'Transfer time < 4 ms (online) verified',
    'Autonomy proven by timed discharge, not calculated from a datasheet',
    'Transfer to and from generator supply tested deliberately under load',
    'Maintenance bypass operated end-to-end with the site team present',
    'Battery installation dates and serial numbers recorded on handover',
    'Battery-room temperature logged over a full week before sign-off',
  ],
  fastRepairCallouts: [
    'Stocked: common 7 / 9 / 12 / 100 Ah VRLA, LFP racks',
    'Modular UPS power-modules on shelf',
    'Battery analyser — impedance + capacity',
    'BMS / SNMP cards for major OEMs',
  ],
  references: [
    'IEC 62040-3 — UPS performance and test requirements',
    'IEEE 1184 — guide for batteries for UPS',
    'IEEE 446 — emergency and standby power',
    'EN 50272-2 — safety requirements for batteries and battery installations',
    'Uptime Institute Tier Standard — Topology',
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-2 — UPS electromagnetic compatibility requirements',
    'IEEE 1188 — maintenance, testing and replacement of VRLA batteries',
    'IEEE 519 — harmonic control, relevant to UPS rectifier input current',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. BOREHOLE PUMP BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const PUMP_BIBLE: ServiceBible = {
  family: 'pump',
  hero: {
    headline: 'The Borehole & Pump Bible',
    subhead: 'Drill, develop, test, install, automate — water systems engineered for years not weeks.',
  },
  intro: [
    'A productive borehole is the result of three disciplines, executed in order: hydrogeology to find water, drilling and casing to access it, and pump engineering to lift it. Skipping or compressing any of those phases produces wells that yield little, sand badly, or fail their motors within months. The cost of doing them properly is far below the cost of doing them again.',
    'Site selection starts with regional hydrogeology — granite weathering profiles, basalt vesicles, sedimentary aquifer thickness — interpreted from geological maps, neighbour-well data, and where it pays, geophysics (VES / ERT / TDEM). Targets become drilling locations only after a yield prediction with confidence interval is documented.',
    'Casing design follows soil profile. Surface conductor protects the borehole from collapse during initial drilling. Solid PVC or steel casing isolates aquifers from contamination. Slotted screen sections face the producing aquifer. Gravel pack between screen and formation filters the inflow and stabilises the wall. A poorly chosen slot size or gravel grading sands the pump.',
    'Borehole development is mandatory after drilling — air-lift, surge-block, or jetting cycles remove drilling fluid, fines, and partial cake from the gravel pack. Skipping development hides yield potential and shortens pump life by abrasion. Best practice: develop until the discharge is clear of suspended solids for 30 minutes continuous.',
    'Pump testing is the contract between the driller and the owner. A 24-hour constant-rate test plus a stepped-rate test characterise yield, drawdown, transmissivity, and sustainable abstraction rate. The pump should be sized for sustainable yield, not maximum yield — a 4 m³/h sustainable hole equipped with a 6 m³/h pump runs the pump dry every drought cycle.',
    'Pump selection follows the pump curve, which plots head (m) against flow (m³/h). The system curve plots required head against flow (static lift + friction loss). Operating point is the intersection. A pump operated far from BEP (best efficiency point) wears bearings and impellers, draws more current, and fails earlier.',
    'Submersible motor selection is constrained by pump type, voltage, depth, and water chemistry. 4-inch motors fit boreholes ≥ 100 mm; 6-inch needs 150 mm minimum. Three-phase motors above 5.5 kW are preferred — single-phase has poor starting torque and limited lifecycle.',
    'Cable sizing is the most-skipped pump-design check, and the arithmetic is worth doing rather than eyeballing. Take a 5.5 kW submersible drawing 18 A on a 100 m drop cable. Using the BS 7671 volt-drop figure for 4 mm² three-phase, about 9.5 mV per amp per metre, the drop is 9.5 × 18 × 100 = 17,100 mV, or roughly 17 V. That is 4.3% of 400 V — it fails the 3% limit, and the motor sees about 383 V instead of 400 V. Stepping up to 6 mm² brings the drop to around 11.5 V, or 2.9%, which passes. Undervolting a submersible is not a minor inefficiency: current rises to maintain torque, the winding runs hotter, and the motor is sitting at the bottom of a borehole where nobody will notice until it fails. Specify cable for full-load current × 1.25, verify the drop against the tables before energising, and remember the drop is calculated on the full length of cable including the run down the hole, not just the surface run.',
    'Variable-speed drives transform pump operations. Constant-pressure VSD systems eliminate water-hammer, halve energy at part-load (P ∝ N³), and protect motors from dry-running with current sensing. The premium pays back in 2–3 years for any pump running > 6 hours/day.',
    'Maintenance reality: bore fines erode impellers; iron bacteria foul screens; check-valves fail closed and water-hammer the riser; pressure tanks lose air-charge and force short-cycling. A robust monthly inspection covers all four — it is 2 hours of work that prevents 5-day pull-and-replace operations.',
    'Water chemistry decides materials, and in Kenya it decides them more often than pressure or flow do. Fluoride is elevated across large parts of the Rift Valley and needs to be measured rather than assumed, because it governs whether the water is fit to drink and what treatment the scheme has to carry. Coastal and some sedimentary boreholes carry chloride and salinity that will pit ordinary cast-iron hydraulics, which is where stainless or duplex wet ends earn their premium. Dissolved iron and manganese are the quiet ones: they feed iron-related bacteria that build a slime on the screen and gravel pack, and a well that has lost half its yield in three years has usually been fouled rather than pumped dry. Abrasive fines finish the job on impellers. Take a full chemical and bacteriological analysis at commissioning, and repeat it annually — it is the cheapest test on the site and it explains most of the failures that follow.',
    'Two honest cautions about yield. First, a desktop or geophysical survey narrows where to drill and improves the odds; it does not guarantee a figure, and anyone quoting a precise yield before the hole is drilled and tested is selling confidence rather than data. The number that matters comes from the step test and the constant-rate test, after development, and it should be presented with its assumptions visible. Second, sustainable yield is not the same as the maximum the hole will give on the day of the test. Equipping a borehole at its peak tested rate is the most common cause of dry-running, motor burnout and a collapsed water level a year later. Size the pump to the sustainable abstraction rate, fit dry-run protection regardless, and keep monitoring water level after handover — abstraction in Kenya is permitted and monitored through WRA, and the monitoring record is what protects the licence as much as the pump.',
  ],
  topBrands: [
    { name: 'Grundfos', origin: 'Denmark', founded: '1945', capability: 'SP / SQ submersibles, CR multistage. Industry reference.', bestFor: ['Boreholes', 'Booster systems', 'HVAC'], warranty: '24 mo / 12 mo extendable to 5 yr', tier: 'premium', notes: 'Best-in-class hydraulic and motor design.' },
    { name: 'Franklin Electric', origin: 'United States', founded: '1944', capability: '4" / 6" / 8" submersible motors with hermetic stator. Pumps via partner brands.', bestFor: ['Boreholes', 'Industrial well'], warranty: '24 mo', tier: 'premium', notes: 'Reference for submersible motors globally.' },
    { name: 'Lorentz', origin: 'Germany', founded: '1993', capability: 'Solar-direct DC submersible pumps. PS2 controller line.', bestFor: ['Off-grid solar pumping', 'Rural water supply'], warranty: '24 mo / 5 yr motor', tier: 'premium', notes: 'Reference brand for solar-direct pumping in Africa.' },
    { name: 'Wilo', origin: 'Germany', founded: '1872', capability: 'TWU / Sub TWU submersibles, Helix surface multistage.', bestFor: ['Building services', 'Industry'], warranty: '24 mo', tier: 'premium', notes: 'Strong commercial-building portfolio.' },
    { name: 'KSB', origin: 'Germany', founded: '1871', capability: 'UPA / UPAchrom submersibles; Etanorm / Movitec multistage.', bestFor: ['Industrial', 'Heavy duty'], warranty: '24 mo', tier: 'premium', notes: 'Robust construction; strong process-pump line.' },
    { name: 'Pedrollo', origin: 'Italy', founded: '1974', capability: '4SR / 4BLOCK submersibles, JSWm self-priming surface.', bestFor: ['SME', 'Domestic boreholes', 'Agriculture'], warranty: '24 mo', tier: 'mid', notes: 'Strong cost-quality; widely available in Kenya.' },
    { name: 'DAB Pumps', origin: 'Italy', founded: '1975', capability: 'KVCX / S4 submersibles, 4 / 6 / 8" range.', bestFor: ['Domestic / commercial', 'Pressure boosters'], warranty: '24 mo', tier: 'mid', notes: 'Established Italian manufacturer with a strong domestic and pressure-boosting range; growing share in the East-African market.' },
    { name: 'Ebara', origin: 'Japan', founded: '1912', capability: 'IDR / IDX / IDM ranges.', bestFor: ['Industrial', 'Process'], warranty: '24 mo', tier: 'mid', notes: 'Strong stainless-steel process pumps for chemical / food.' },
    { name: 'Goulds (Xylem)', origin: 'United States', capability: 'Submersibles, SSV multistage, ICS chemical-process.', bestFor: ['Industrial', 'Mining', 'Process'], warranty: '24 mo', tier: 'premium', notes: 'Heavy-duty process pumps; common in mining.' },
    { name: 'Davey Water', origin: 'Australia', capability: 'HM / HS / HF Series, pressure systems with controllers.', bestFor: ['Domestic', 'Agriculture'], warranty: '24 mo', tier: 'mid', notes: 'Strong in farm and domestic pressure systems.' },
  ],
  installPhases: [
    { phase: '1. Hydrogeological survey', goal: 'Predict yield with confidence.', checklist: ['Geological map review', 'Neighbour-well data', 'Geophysics — VES / ERT', 'Yield prediction with range'] },
    { phase: '2. Permits & drilling', goal: 'Comply with WRA (Kenya); drill correctly.', checklist: ['WRA borehole permit', 'EIA where required', 'Mud rotary or DTH technique', 'Cuttings log every 1 m'] },
    { phase: '3. Casing & screening', goal: 'Stable, productive well.', checklist: ['Surface conductor (steel)', 'Plain casing (PVC or steel) cemented', 'Screen across producing zone', 'Graded gravel pack'] },
    { phase: '4. Development & test', goal: 'Maximise yield, characterise drawdown.', checklist: ['Air-lift / surge-block development to clear', 'Step test 4 × 1 hr', 'Constant-rate 24 hr', 'Recovery measurement'] },
    { phase: '5. Pump selection', goal: 'Match pump to sustainable yield.', checklist: ['Pump curve vs system curve at sustainable Q', 'Submersible motor matched in HP and voltage', 'NPSH check above suction'] },
    { phase: '6. Install', goal: 'Pump set, cable spliced, riser anchored.', checklist: ['Heat-shrink water-tight cable splice', 'Cable ties to riser every 3 m', 'Safety cable to wellhead', 'Sanitary seal at top'] },
    { phase: '7. Controls & protection', goal: 'Dry-run, low-flow, surge protection.', checklist: ['Soft-starter or VSD', 'Dry-run protection (current or level)', 'Pressure tank with bladder', 'Surge / lightning protection'] },
    { phase: '8. Commission & monitor', goal: 'Owner gets a documented working asset.', checklist: ['Yield and draw-down log', 'Power consumption baseline', 'Cl₂ disinfection cycle', 'Quarterly inspection contract'] },
  ],
  partsManual: [
    { group: 'Pumps', items: [
      { name: '4" submersible 0.37 – 7.5 kW' },
      { name: '6" submersible 5.5 – 22 kW' },
      { name: '8" submersible 22 – 90 kW' },
      { name: 'Surface multistage (booster)' },
      { name: 'Solar-direct DC submersible' },
    ]},
    { group: 'Pump consumables', items: [
      { name: 'Mechanical seal (surface pumps)' },
      { name: 'Impellers / diffusers (stage replacement)' },
      { name: 'Suction strainer' },
      { name: 'Foot valve / check valve' },
      { name: 'Cable splice kit (heat-shrink with mastic)' },
    ]},
    { group: 'Controls', items: [
      { name: 'DOL or star-delta starter' },
      { name: 'Soft-starter 4 – 90 kW' },
      { name: 'VSD with PID for constant pressure' },
      { name: 'Pressure switch / pressure transmitter' },
      { name: 'Dry-run protector (current / probe)' },
    ]},
    { group: 'Pressure system', items: [
      { name: 'Bladder pressure tank 24 / 50 / 100 / 200 / 500 L' },
      { name: 'Pressure gauge 0–10 bar' },
      { name: 'Air-charge valve (Schrader)' },
      { name: 'Y-strainer / non-return valve' },
    ]},
    { group: 'Wellhead, riser & safety', items: [
      { name: 'Riser pipe — galvanised steel, HDPE or stainless', note: 'Match the material to depth and water chemistry; HDPE simplifies pulling but has a lower pull-out limit.' },
      { name: 'Stainless safety rope or cable to the wellhead', note: 'The one component that decides whether a dropped pump is a recovery or a lost borehole.' },
      { name: 'Sanitary wellhead seal and lockable cover', interval: 'Inspect quarterly', note: 'Keeps surface contamination and vermin out of the water column — the commonest cause of a failed bacteriological test.' },
      { name: 'Water-level dip meter or permanent level probe', interval: 'Read monthly', note: 'Trending the rest level is how you see a problem developing a year before the pump fails.' },
      { name: 'Cable clips and standoff guides', interval: 'Every 3 m of riser' },
      { name: 'Borehole headworks slab and drainage apron' },
      { name: 'Air-release and washout valves on the rising main' },
    ]},
    { group: 'Water quality & treatment', items: [
      { name: 'Full chemical and bacteriological analysis', interval: 'At commissioning then annually', note: 'Fluoride, iron, manganese, chloride, hardness, nitrate and E. coli as a minimum.' },
      { name: 'Sand separator / cyclone for fines', note: 'Protects downstream fittings where a small amount of sand persists after development.' },
      { name: 'Iron and manganese removal filter', interval: 'Media check annually', note: 'Also slows the iron-bacteria fouling that costs boreholes their yield.' },
      { name: 'Chlorination dosing set for disinfection', interval: 'Shock-dose at commissioning and after any pump pull' },
      { name: 'Fluoride removal media where analysis requires it', note: 'Specify only on the strength of a measured result, never on assumption.' },
      { name: 'Cartridge filter housings and spare elements', interval: 'Elements 3–6 mo' },
      { name: 'Sample bottles and field test kit (pH, EC, turbidity)' },
    ]},
  ],
  repairManual: [
    { fault: 'Pump trips overload', priority: 'urgent', steps: [
      'Measure FLA on each phase under load.',
      'IR test motor 500 V DC to earth.',
      'Inspect cable splice under water.',
      'Sand intrusion → pull pump and inspect impellers.',
    ]},
    { fault: 'No flow', priority: 'urgent', steps: [
      'Verify motor running (acoustic / current).',
      'Check water level above pump intake (probe).',
      'Inspect riser for blockage or split.',
      'Check NRV / foot-valve.',
    ]},
    { fault: 'Reduced flow over time', priority: 'routine', steps: [
      'Sand sample on outlet — wear of impellers.',
      'Iron-bacteria fouling on screen → chemical clean.',
      'Increasing static lift — water table dropping.',
      'NPSH check.',
    ]},
    { fault: 'Pump cycling rapidly', priority: 'routine', steps: [
      'Check pressure-tank air pre-charge (cut-in − 0.2 bar).',
      'Verify pressure switch differential.',
      'Inspect for system leak.',
    ]},
    { fault: 'Submersible motor low IR', priority: 'urgent', steps: [
      'Pull pump; inspect splice.',
      'Test motor wet-end and dry-end.',
      'Re-fill motor with dielectric per OEM.',
      'Re-splice cable with quality kit.',
    ]},
    { fault: 'Water at the tap is sandy or cloudy', priority: 'urgent', steps: [
      'Establish when it started. Sand from day one is a well-construction problem; sand that appears later is usually a screen, gravel-pack or pump-wear problem.',
      'Catch a sample in a clear jar and let it settle — angular sand points to formation ingress, fine grey silt to incomplete development, rust-coloured floc to iron bacteria or corroding steel.',
      'Check whether it clears after a few minutes of running or gets worse; worsening with run time suggests the pump is drawing the water level down onto a screened section it should not reach.',
      'Reduce the abstraction rate or raise the pump setting depth and see whether the sand stops — this alone resolves many cases.',
      'If sand persists, the well needs re-development or, where the slot size or gravel grading is wrong, a screen repair; a sand separator treats the symptom only.',
      'Inspect the impellers when the pump is next pulled — abrasive wear is cumulative and silent until flow drops.',
    ], warning: 'Sand is not cosmetic. It abrades impellers, blocks valves and destroys the pump far faster than any other single factor. Diagnose it rather than filtering it.' },
    { fault: 'Yield has fallen well below the commissioning figure', priority: 'urgent', steps: [
      'Separate a well problem from a pump problem before spending anything. Measure the rest water level, then the pumping level, and compare both against the commissioning record.',
      'A rest level that has dropped means the aquifer or the abstraction regime has changed — regional drawdown, a new neighbouring borehole, or a dry season.',
      'A rest level that is unchanged but a pumping level that falls much faster than before points to screen or gravel-pack fouling; iron-bacteria slime is the usual culprit.',
      'A normal pumping level with reduced flow points at the pump itself — worn impellers, a partly blocked intake, or a failing check valve.',
      'Repeat a short step test and compare the specific capacity against the original; this is the number that tells you which of the three it is.',
      'Treat accordingly: chemical or mechanical rehabilitation for a fouled well, a pump overhaul for a worn pump, and a revised sustainable abstraction rate if the aquifer has genuinely changed.',
    ]},
    { fault: 'Pipes knock or bang when the pump stops', priority: 'routine', steps: [
      'Identify water hammer by its timing — a single heavy knock on shutdown, rather than continuous vibration while running.',
      'Inspect the check valve; a valve slamming shut on reverse flow is the classic source, and a slow-closing or spring-assisted type usually cures it.',
      'Verify the pressure-tank pre-charge; a waterlogged tank removes the cushion that absorbs the surge.',
      'Consider a soft-starter or VSD ramp-down so the column decelerates instead of stopping dead.',
      'Check pipe supports and anchors on the rising main — an unrestrained pipe converts surge into movement and eventually into a failed joint.',
      'On long or steep rising mains, evaluate an air vessel or surge arrestor rather than relying on the check valve alone.',
    ], warning: 'Water hammer does cumulative damage. Each surge stresses joints, the riser and the pump bearings, and the failure it eventually causes looks like an unrelated burst.' },
    { fault: 'Solar-direct pump only delivers water for a few hours a day', priority: 'routine', steps: [
      'Confirm expectations first: a solar-direct pump delivers a daily volume, not a constant flow, and output tracks irradiance across the day.',
      'Compare actual daily cubic metres against the design figure rather than instantaneous flow — this is where the real shortfall shows up.',
      'Clean the array and check for new shading; on a direct-coupled pump, a shading loss translates straight into lost pumping hours.',
      'Measure array voltage and current at the controller at midday and compare to the string design values.',
      'Check the controller\'s low-irradiance start threshold and dry-run settings; an over-cautious setting delays the morning start and cuts the afternoon short.',
      'Verify the storage tank is sized for at least a full day of demand — most complaints described as "the pump is weak" are really a tank that is too small to buffer a cloudy afternoon.',
    ]},
  ],
  errorCodes: [
    { code: 'OL', family: 'Pump starter', meaning: 'Overload trip', severity: 'high', fix: ['Measure current and IR', 'Inspect for sand / blockage', 'Verify supply voltage'] },
    { code: 'DRY', family: 'Dry-run protector', meaning: 'Pump drawing below trip current — dry well or air-bound', severity: 'high', fix: ['Wait for recovery', 'Lower probe / sensor', 'Verify intake submergence'] },
    { code: 'F1 / F2 / F3 / F4', family: 'Grundfos CU controller', meaning: 'Various sensor / motor / over-temp faults', severity: 'medium', fix: ['Reference Grundfos service kit', 'Replace sensor / clean intake / verify cooling flow'] },
    { code: 'E.OL', family: 'VSD', meaning: 'Output overload', severity: 'high', fix: ['Pull pump', 'Inspect impellers / sand', 'Check cable IR'] },
    { code: 'E.UV', family: 'VSD', meaning: 'Input under-voltage', severity: 'medium', fix: ['Check supply', 'Verify cable size for inrush'] },
    { code: 'PR-LO', family: 'Pressure controller', meaning: 'Pressure below low-set', severity: 'medium', fix: ['Inspect leaks', 'Verify pump output', 'Check NRV'] },
    { code: 'PR-HI', family: 'Pressure controller', meaning: 'Pressure above high-set', severity: 'medium', fix: ['Inspect tank pre-charge', 'Verify pressure-switch setpoint', 'Check VSD PID setting'] },
    { code: 'Phase failure / unbalance', family: 'Motor protection relay', meaning: 'A supply phase is missing or the three phases differ beyond tolerance — the fastest way to destroy a submersible motor.', severity: 'critical', fix: ['Do not reset and re-run until the supply is proven', 'Measure all three phases at the starter and at the board', 'Inspect for a blown fuse, an open pole or a loose lug', 'A submersible motor cannot be inspected in place — prevention is the whole strategy here'] },
    { code: 'Motor over-temperature', family: 'Submersible motor thermal protection', meaning: 'Motor temperature above limit; usually a cooling-flow problem rather than an electrical one.', severity: 'high', fix: ['Confirm the motor is fully submerged and that flow past it meets the minimum cooling velocity', 'Fit a flow sleeve where the borehole diameter is much larger than the motor', 'Check for reduced flow from wear or blockage — less water means less cooling', 'Verify the pump is operating near its best efficiency point, not far right on the curve'] },
    { code: 'Low-level cut-out', family: 'Well level probe / electrode', meaning: 'Water level has fallen to the protection electrode; the controller has stopped the pump to prevent dry running.', severity: 'medium', fix: ['Let the well recover and record the recovery time — it is useful data, not just a nuisance', 'If it trips daily, the abstraction rate exceeds the sustainable yield', 'Re-check the pump setting depth against the tested drawdown', 'Consider a smaller pump or a duty cycle matched to recovery rather than a deeper setting'] },
    { code: 'Drive earth fault', family: 'VSD protection', meaning: 'Leakage to earth detected on the drive output — commonly the submersible cable or the motor winding.', severity: 'critical', fix: ['Isolate and megger the cable and motor separately from the surface', 'Inspect the cable splice; a failed splice is the single most common cause', 'Check the cable for damage against the casing where it was lowered', 'Do not repeatedly reset a drive on an earth fault'] },
    { code: 'Over-current on acceleration', family: 'VSD protection', meaning: 'Current limit reached during ramp-up — mechanical drag, a blocked intake, or too aggressive a ramp.', severity: 'high', fix: ['Lengthen the acceleration ramp before assuming a mechanical fault', 'Check for sand-locking after a long idle period', 'Verify the drive parameters match the motor nameplate', 'If it persists, pull the pump and inspect the impellers and intake'] },
    { code: 'Excessive starts per hour', family: 'Pump controller', meaning: 'The pump is cycling more often than the motor is rated for; each start is a thermal and mechanical event.', severity: 'medium', fix: ['Check the pressure-tank pre-charge — a waterlogged tank is the usual cause', 'Widen the pressure switch differential within safe limits', 'Look for a leak on the distribution side that keeps bleeding pressure', 'A constant-pressure VSD removes the problem entirely on high-duty systems'] },
  ],
  diagrams: ['borehole-section', 'pump-vsd', 'pressure-tank'],
  roi: [
    { scenario: '5.5 kW solar-direct borehole pump (off-grid farm)', capex: 'KES 750k – 1.1M', annualSaving: '≈ KES 220k vs diesel pumping', payback: '4–5 yr', notes: 'Excludes water security value.' },
    { scenario: 'VSD retrofit on 11 kW farm booster', capex: 'KES 280k', annualSaving: '≈ KES 120k', payback: '2.5 yr', notes: 'Saves wear and water-hammer too.' },
    { scenario: 'New 6" submersible 18.5 kW for community supply', capex: 'KES 950k – 1.4M', annualSaving: 'Direct revenue from water sales', payback: '< 2 yr at 50 m³/day @ KES 50/m³', notes: 'Pricing local-market dependent.' },
    { scenario: 'Rehabilitating an existing borehole vs drilling a new one', capex: 'Rehabilitation KES 250k – 600k vs new borehole KES 1.5M – 3M+', annualSaving: 'Restored yield on an asset you already own', payback: 'Immediate where the well is genuinely recoverable', notes: 'Worth investigating first on any well whose rest level is healthy but whose yield has fallen — that pattern usually means fouling, and fouling is treatable. A well with a genuinely dropped water table is a different conversation.' },
    { scenario: 'Dry-run and phase protection retrofit on an unprotected pump', capex: 'KES 25k – 60k', annualSaving: 'One avoided submersible motor replacement and pump pull ≈ KES 150k – 400k', payback: 'First avoided failure', notes: 'The cheapest insurance in this whole document. A submersible motor cannot be inspected in place, so protection at the surface is the only practical defence.' },
  ],
  warrantyOptions: [
    'Pumps & motors 24 mo standard; extendable on PMS contract',
    'Workmanship 12 mo on installation',
    'Drilling guarantees commonly per metre yield',
  ],
  qualityChecks: [
    'IR test motor wet & dry > 100 MΩ',
    'Yield log per pump test',
    'Water analysis (E-coli, hardness, iron, fluoride)',
    'Cable-splice pressure test',
    'Pressure-tank pre-charge measured at install',
    'Step test and constant-rate test completed after development, with results and assumptions written down',
    'Sustainable abstraction rate stated separately from peak tested yield',
    'Pump setting depth recorded against the tested drawdown',
    'Dry-run and phase protection fitted and function-tested before handover',
    'Safety cable fitted and terminated at the wellhead',
    'Shock chlorination completed and a clear bacteriological result on file',
  ],
  fastRepairCallouts: [
    'Pump pulling rig deployable nationwide',
    'Stocked: 4" / 6" submersibles 5.5–18.5 kW',
    'Cable splice kits up to 35 mm²',
    'Sand-bailer for hole rehab',
  ],
  references: [
    'WRA borehole permit & monitoring guidelines (Kenya)',
    'BS EN 805 — water supply requirements',
    'ISO 9906 — pump performance acceptance tests',
    'WHO Guidelines for Drinking-water Quality',
    'KS EAS 12 — East African Standard for potable water',
    'Water Act 2016 (Kenya) — abstraction permitting and regulation',
    'ISO 17769 — liquid pumps and installations, general terms, definitions and quantities',
    'ANSI/HI 9.6.3 — rotodynamic pumps, guideline for operating regions (preferred and allowable range around BEP)',
    'ANSI/HI 9.6.1 — rotodynamic pumps, guideline for NPSH margin',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. INCINERATOR BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

const INCINERATOR_BIBLE: ServiceBible = {
  family: 'incinerator',
  hero: {
    headline: 'The Incinerator Bible',
    subhead: 'Two-chamber medical / municipal / industrial waste destruction with NEMA-compliant emissions.',
  },
  intro: [
    'A medical-waste incinerator is a controlled-combustion reactor with two specific objectives: destroy infectious agents (SARS-CoV-2, hepatitis viruses, prions, etc.) and break down toxic organics into CO₂, H₂O, and minimal particulate. Achieving both requires the primary chamber ≥ 850 °C and the secondary chamber ≥ 1,100 °C with ≥ 2 seconds gas residence — anything less leaves dioxins and furans in the flue.',
    'The two-chamber design is the universal approach in modern medical-waste systems. Primary chamber gasifies waste at 800–950 °C with sub-stoichiometric (oxygen-starved) air to reduce particulate carry-over. The volatile gas migrates to the secondary (afterburner) chamber where excess air and burner heat complete oxidation at 1,100 °C+. Single-chamber units do not meet emission standards and are prohibited by NEMA Kenya for medical waste.',
    'Capacity is rated in kg/h of input waste at a defined calorific value, typically 18 MJ/kg for mixed medical waste. A 50 kg/h unit will struggle on a hospital generating 1,200 kg/day if the operator schedules it for 12 hours — derating, ash removal, and warm-up time push real throughput to 70%. Size for peak generation × 1.4 not nameplate.',
    'Burners are diesel, LPG, or natural-gas. Diesel is the African default — fuel availability dwarfs both alternatives. LPG burns cleaner and starts faster but requires bulk-tank infrastructure. Natural-gas is reserved for sites with utility-grade supply.',
    'Refractory brick lining is the body of the chamber. High-alumina brick (60–80% Al₂O₃) for primary; mullite or silicon-carbide tile for secondary where temperature is highest. Refractory lifetime is 2–5 years depending on firing cycles and waste chemistry. Replacement is the single largest mid-life cost.',
    'Air system: primary forced-draft fan supplies combustion air to the primary chamber; secondary FD fan supplies excess air to the secondary; induced-draft fan downstream of the scrubber maintains negative chamber pressure (preventing leakage of foul gas into the building). Failure of the ID fan is a NEMA-actionable event.',
    'Emission control train: typically cyclone (coarse particulate) → wet scrubber (acid gases HCl, SO₂) → mist eliminator → stack with sample port. Two different European reference figures get quoted here and they should not be confused. The Industrial Emissions Directive sets the legal emission limit values — broadly total dust 10 mg/Nm³, HCl 10, SO₂ 50, NOx 200, CO 50 as daily averages, and dioxins/furans 0.1 ng I-TEQ/Nm³ over a sampling period, all normalised to 11% O₂ dry. The 2019 BAT conclusions for waste incineration are tighter than that, with BAT-AEL ranges of roughly 2–5 mg/Nm³ for dust and 0.01–0.04 ng I-TEQ/Nm³ for dioxins. Quote whichever you are actually being held to, and never present an IED limit value as though it were the BAT figure — a plant meeting the IED number is not automatically at BAT.',
    'Operator training is the difference between a healthy facility and a NEMA shutdown. Loading rates exceeding capacity, mixed metal/plastic batches, and ignoring secondary-chamber temperature alarms are the top three failure modes. Standard operating procedure must be written, posted, and audited monthly.',
    'Ash handling: bottom ash from the primary chamber is non-hazardous after combustion and can be landfilled per NEMA. Fly-ash from the secondary chamber and scrubber may contain dioxins and heavy metals — handle as hazardous and dispose to a licensed facility. Mixing the two streams contaminates a much larger volume of waste.',
    'Maintenance schedule: weekly burner inspection and refractory visual; monthly emission-port inspection and isokinetic sampling; quarterly burner servicing and refractory hot-face survey; annual major shutdown for refractory patch / replacement, fan re-balancing, and full emissions stack-test for licence renewal.',
    'Segregation at the ward is the highest-leverage intervention in the whole waste chain, and it happens before the incinerator is ever switched on. WHO guidance is consistent on this point: only a minority of the waste a health facility produces is genuinely infectious or hazardous, and the rest is ordinary general waste. Where segregation is poor, that general waste — packaging, food waste, paper, and the water it carries — ends up in the primary chamber, where it consumes fuel, depresses chamber temperature, lengthens the burn, and produces emissions for no clinical benefit. A facility that fixes colour-coded binning and staff training routinely cuts the tonnage it has to incinerate substantially, which reduces fuel cost, extends refractory life, and makes an existing unit adequate for a load it was previously failing to handle. Buying a bigger incinerator to solve a segregation problem is the most expensive mistake in this field.',
    'Compliance in Kenya is a continuous obligation rather than a one-off certificate. Waste-management activity falls under the NEMA regulatory framework, a new installation will generally require environmental assessment before it is built, and the licence to operate is sustained by evidence: stack-test results, operating temperature records, waste-received logs, ash-disposal manifests, and trained operators. That record-keeping is not paperwork for its own sake — it is what a facility produces when questioned, and its absence is what turns a technical problem into an enforcement problem. It is also worth stating plainly that incineration is not the only lawful route for every stream: autoclaving and other non-burn treatment suit some sharps and infectious waste, and anatomical, pharmaceutical and cytotoxic waste each have their own handling expectations. The right answer for a hospital is usually a mix, chosen from a waste audit, not a single machine chosen from a brochure.',
  ],
  topBrands: [
    { name: 'Inciner8', origin: 'United Kingdom', capability: 'Medical / municipal / animal waste 10–500 kg/h. Mobile, fixed, containerised.', bestFor: ['Hospitals', 'Government', 'NGO field deployments'], warranty: '24 mo std', tier: 'premium', notes: 'Reference brand for medical incinerators in African government tenders.' },
    { name: 'Addfield', origin: 'United Kingdom', capability: 'Medical, animal, agricultural waste 25–1,000 kg/h. Energy-recovery options.', bestFor: ['Hospitals', 'Pharmaceutical', 'Agriculture'], warranty: '24 mo', tier: 'premium', notes: 'Strong in agricultural waste (poultry / livestock).' },
    { name: 'Atlas Incinerators', origin: 'Denmark', capability: 'Marine / land medical incinerators.', bestFor: ['Marine', 'Coastal hospitals'], warranty: '24 mo', tier: 'premium', notes: 'Strong marine pedigree.' },
    { name: 'Macrotec', origin: 'South Africa', capability: 'Medical and industrial incinerators 25–500 kg/h.', bestFor: ['Hospitals', 'Industrial'], warranty: '24 mo', tier: 'mid', notes: 'Strong African manufacturer with regional service.' },
    { name: 'Incinco', origin: 'United Kingdom', capability: 'Mid-range medical incinerators 30–150 kg/h.', bestFor: ['Hospitals', 'Mortuaries'], warranty: '24 mo', tier: 'mid', notes: 'Cost-effective for district hospital scale.' },
    { name: 'Pennram', origin: 'United States', capability: 'Pathological / animal waste 50–1,000 kg/h.', bestFor: ['Hospitals', 'Agriculture'], warranty: '12–24 mo', tier: 'mid', notes: 'Strong on animal-waste configurations.' },
    { name: 'Hoval', origin: 'Liechtenstein', capability: 'Industrial waste energy-from-waste 100–2,000 kg/h.', bestFor: ['EfW', 'Industrial'], warranty: '24 mo', tier: 'premium', notes: 'Strong on heat-recovery integration.' },
    { name: 'Therma-Tron-X', origin: 'United States', capability: 'Industrial incinerators with afterburners and scrubbers.', bestFor: ['Hazardous waste', 'Industrial'], warranty: '24 mo', tier: 'premium', notes: 'Hazardous-waste destruction reference.' },
    { name: 'Ecopax', origin: 'United Kingdom', capability: 'Containerised medical incinerators for rural deployment.', bestFor: ['Rural hospitals', 'Field hospitals'], warranty: '24 mo', tier: 'mid', notes: 'Plug-and-play containerised solution.' },
    { name: 'Kenya local manufacturers (assembled)', origin: 'Kenya', capability: 'Local-build incinerators 10–100 kg/h.', bestFor: ['Cost-sensitive county facilities'], warranty: '12 mo', tier: 'value', notes: 'Verify NEMA emissions certification before procurement — many do not meet the standard.' },
  ],
  installPhases: [
    { phase: '1. Waste audit', goal: 'Quantify generation rate and composition.', checklist: ['Daily kg generation by category', 'Calorific value estimate', 'Peak-day vs average', 'Hazardous fraction breakdown'] },
    { phase: '2. Sizing & technology selection', goal: 'Match capacity to waste flow.', checklist: ['Capacity = peak × 1.4', 'Two-chamber mandatory for medical', 'Burner fuel choice', 'Emission-control class'] },
    { phase: '3. Site selection', goal: 'NEMA-compliant location.', checklist: ['≥ 500 m from residential', 'Prevailing wind direction analysed', 'Stack height per dispersion modelling', 'Buffer for ash handling'] },
    { phase: '4. Civil works', goal: 'Foundation, bunding, fuel store.', checklist: ['Concrete plinth for unit weight', 'Bund wall for fuel storage', 'Drainage for scrubber blowdown', 'Fire compartments'] },
    { phase: '5. Mechanical install', goal: 'Chambers, burners, fans, scrubber assembled.', checklist: ['Refractory cured per OEM schedule', 'Burner alignment', 'Fan vibration baseline', 'Scrubber level / flow tests'] },
    { phase: '6. Electrical & controls', goal: 'PLC / BMS commissioned.', checklist: ['Temperature setpoints', 'Interlocks (door, flame, high-temp)', 'EPO functional', 'Data logging active'] },
    { phase: '7. Commissioning & emissions test', goal: 'Verify performance and licence.', checklist: ['Cold-start curve recorded', 'Hot loading test 4 hr', 'Isokinetic emissions sample', 'NEMA licence application'] },
    { phase: '8. Operator training & SOP', goal: 'Operators safe and effective.', checklist: ['Loading SOP posted', 'PPE requirements', 'Daily log book', 'Annual refresher training'] },
  ],
  partsManual: [
    { group: 'Refractory', items: [
      { name: 'High-alumina brick 60–80% Al₂O₃' },
      { name: 'Mullite tile (secondary chamber)' },
      { name: 'Castable refractory (top-up)' },
      { name: 'Ceramic fibre blanket (insulation)' },
    ]},
    { group: 'Burners & fuel', items: [
      { name: 'Diesel burner 200–600 kW' },
      { name: 'LPG / natural-gas burner' },
      { name: 'Fuel pump and filter' },
      { name: 'Igniter / electrode' },
      { name: 'Flame scanner' },
    ]},
    { group: 'Fans & dampers', items: [
      { name: 'Forced-draft fan (primary)' },
      { name: 'Forced-draft fan (secondary)' },
      { name: 'Induced-draft fan' },
      { name: 'Modulating dampers' },
    ]},
    { group: 'Emission control', items: [
      { name: 'Cyclone separator' },
      { name: 'Wet scrubber (packed-bed / venturi)' },
      { name: 'Mist eliminator' },
      { name: 'Stack with sample ports' },
      { name: 'CEMS analyser (optional)' },
    ]},
    { group: 'Controls & safety', items: [
      { name: 'PLC + HMI panel' },
      { name: 'Thermocouples K-type 1,200 °C' },
      { name: 'Pressure transmitters' },
      { name: 'Door interlock switches' },
      { name: 'Emergency-stop chain' },
    ]},
    { group: 'Ash handling, PPE & site safety', items: [
      { name: 'Ash rake, hoe and long-handled tools', interval: 'Inspect for heat damage quarterly', note: 'Bottom ash is removed hot; short tools are how operators get burned.' },
      { name: 'Separate labelled containers for bottom ash and fly ash / scrubber residue', note: 'Mixing the two streams contaminates a much larger volume and multiplies the disposal cost.' },
      { name: 'Heat-resistant gloves, apron, face shield and safety boots', interval: 'Replace on damage', note: 'Non-negotiable at the loading door and during de-ashing.' },
      { name: 'Respiratory protection for ash handling', interval: 'Filters per maker', note: 'Fly ash is the fraction that may carry dioxins and heavy metals.' },
      { name: 'Sharps-safe loading trolley and colour-coded bin set', note: 'Segregation hardware belongs on the incinerator parts list — it does more for emissions than any component in the flue.' },
      { name: 'Ash disposal manifest book and waste-received log', interval: 'Complete every burn', note: 'This log is the evidence base for the operating licence.' },
      { name: 'Fire extinguishers rated for fuel and electrical fires', interval: 'Service annually' },
      { name: 'Eyewash station and first-aid burn kit' },
    ]},
  ],
  repairManual: [
    { fault: 'Failure to reach setpoint temperature', priority: 'urgent', steps: [
      'Verify burner ignition and fuel pressure.',
      'Check FD fan operating and dampers open.',
      'Inspect refractory for hot spots / cracking.',
      'Test thermocouple.',
    ]},
    { fault: 'Excessive smoke from stack', priority: 'urgent', steps: [
      'Reduce loading rate — not exceeding kg/h spec.',
      'Verify secondary chamber > 1,100 °C and 2 s residence.',
      'Inspect scrubber level and recirculation pump.',
      'Check refractory leaks.',
    ], warning: 'Persistent visible smoke is a NEMA-reportable event.' },
    { fault: 'Door interlock trip', priority: 'urgent', steps: [
      'Inspect door seal and hinge.',
      'Verify limit-switch alignment.',
      'Reset only after confirming chamber pressure is negative.',
    ]},
    { fault: 'Fan vibration / bearing noise', priority: 'routine', steps: [
      'Vibration spectrum analysis.',
      'Re-balance impeller.',
      'Replace bearings.',
      'Inspect for ash build-up on impeller.',
    ]},
    { fault: 'Scrubber pH out of range', priority: 'routine', steps: [
      'Check caustic dosing pump and tank.',
      'Inspect pH probe and recalibrate.',
      'Increase recirculation flow.',
    ]},
    { fault: 'Refractory crack visible at hot-face survey', priority: 'urgent', steps: [
      'Schedule cool-down and patch with castable.',
      'For deep cracks, replace affected brick course.',
      'Adjust loading and warm-up curve to reduce thermal-shock.',
    ]},
    { fault: 'Ash still contains recognisable unburnt waste', priority: 'urgent', steps: [
      'Treat poor burnout as a clinical safety issue, not an aesthetic one — recognisable waste in the ash means destruction was incomplete.',
      'Check the loading rate against the rated kg/h first. Overloading is the most common cause, and it also drags chamber temperature down.',
      'Review what is being loaded: wet general waste, food waste and large volumes of packaging depress temperature and smother the bed. This is a segregation problem presenting as a machine problem.',
      'Verify the primary chamber actually held its operating temperature through the burn, using the logged trace rather than the instantaneous reading.',
      'Confirm primary combustion air is reaching the bed — blocked air ports, a failing FD fan or a stuck damper all starve it.',
      'Check that the full burn cycle is being allowed to complete before de-ashing; operators under time pressure often cut the burnout phase short.',
      'Extend the burnout period and re-inspect before changing anything mechanical.',
    ], warning: 'Do not landfill ash containing recognisable clinical waste. Re-burn it and correct the cause first.' },
    { fault: 'Unit fails its annual stack test', priority: 'emergency', steps: [
      'Get the full test report, not the pass/fail line — which parameter failed tells you where to look, and the parameters point to different subsystems.',
      'High carbon monoxide or dioxins points at combustion: secondary chamber temperature, residence time, and secondary air.',
      'High particulate points at carry-over: overloading, excessive primary air disturbing the bed, or a cyclone and scrubber not doing their job.',
      'High acid gases points at the scrubber: dosing, pH control, recirculation flow, or fouled packing.',
      'Verify the instrumentation itself before rebuilding anything — a drifted thermocouple or an uncalibrated analyser has failed tests for plants that were operating correctly.',
      'Review the operating log for the period before the test; loading rates and waste composition on test day frequently differ from normal practice in both directions.',
      'Correct, re-test, and keep the evidence. Address the finding rather than the test.',
    ], warning: 'Continuing to operate on a failed emissions result is an enforcement risk to the whole facility, not just to the incinerator. Escalate it to management the day the report arrives.' },
    { fault: 'Refractory life is far shorter than expected', priority: 'routine', steps: [
      'Count the firing cycles rather than the operating hours. Refractory is damaged by thermal cycling, so a unit fired briefly every day ages faster than one run in long batches.',
      'Review the warm-up and cool-down curves against the OEM schedule; rapid heating is the fastest way to crack a lining.',
      'Check for physical damage from loading — waste and tools thrown against the hot face chip brickwork over time.',
      'Look at waste chemistry: chlorine-rich plastics and certain chemical wastes attack refractory chemically as well as thermally.',
      'Inspect for water ingress during shutdown, which spalls brick on the next heat-up.',
      'Consider batching burns to reduce cycle count, and specify the correct refractory grade for each chamber at the next reline rather than a single grade throughout.',
    ]},
  ],
  errorCodes: [
    { code: 'TEMP HIGH', family: 'PLC', meaning: 'Chamber temperature above limit (typ. > 1,200 °C primary).', severity: 'high', fix: ['Open damper to dilute', 'Reduce loading', 'Check thermocouple — false reading?'] },
    { code: 'TEMP LOW', family: 'PLC', meaning: 'Chamber temperature below set during burn cycle.', severity: 'medium', fix: ['Increase burner firing', 'Inspect fuel pressure', 'Verify damper position'] },
    { code: 'FLAME FAIL', family: 'Burner controller', meaning: 'Flame scanner lost signal.', severity: 'critical', fix: ['Inspect scanner lens', 'Verify fuel pressure', 'Check ignition electrodes'] },
    { code: 'DOOR OPEN', family: 'PLC', meaning: 'Loading door opened during burn.', severity: 'critical', fix: ['Close door', 'Inspect interlock', 'Reset only after pressure verified'] },
    { code: 'ID FAN FAIL', family: 'PLC', meaning: 'Induced-draft fan stopped — chamber pressure positive.', severity: 'critical', fix: ['Stop loading immediately', 'Inspect motor / VFD', 'Verify damper'] },
    { code: 'O2 HIGH', family: 'CEMS', meaning: 'Excess air > 12% — wasting fuel.', severity: 'low', fix: ['Throttle FD fan', 'Adjust damper', 'Verify burner ratio'] },
    { code: 'O2 LOW', family: 'CEMS', meaning: 'Excess air < 6% — risk of CO and soot.', severity: 'medium', fix: ['Increase FD fan', 'Open damper', 'Verify burner air register'] },
    { code: 'CO HIGH', family: 'CEMS', meaning: 'Carbon-monoxide above limit.', severity: 'high', fix: ['Verify secondary > 1,100 °C', 'Increase secondary air', 'Check loading composition'] },
    { code: 'FEED INHIBIT — secondary below setpoint', family: 'PLC interlock', meaning: 'Loading is blocked because the secondary chamber has not reached its operating temperature; waste charged now would not be fully destroyed.', severity: 'high', fix: ['Wait for the secondary to reach setpoint — this interlock is doing its job', 'Never defeat a feed interlock to keep a shift moving', 'If warm-up is chronically slow, service the secondary burner and check fuel pressure', 'Verify the thermocouple is reading true before assuming a burner fault'] },
    { code: 'CHAMBER PRESSURE POSITIVE', family: 'PLC / draught control', meaning: 'The chamber is above ambient pressure, so foul gas can escape through doors and seals into the building.', severity: 'critical', fix: ['Stop loading immediately and evacuate the immediate area if gas is visible', 'Check the induced-draught fan and its drive', 'Inspect the stack and flue path for blockage or a closed damper', 'Verify door and seal integrity before restarting'] },
    { code: 'THERMOCOUPLE FAULT / open circuit', family: 'PLC instrumentation', meaning: 'A temperature input has failed or gone open-circuit; the control system is now flying blind on that chamber.', severity: 'high', fix: ['Do not operate on an estimated temperature — the whole compliance case rests on this measurement', 'Replace the thermocouple and check the compensating cable and terminations', 'Confirm insertion depth and position match the original commissioning setup', 'Cross-check the replacement against a second instrument before returning to service'] },
    { code: 'SCRUBBER ΔP HIGH', family: 'Emission control', meaning: 'Differential pressure across the scrubber has risen — packing fouling, scaling, or a partial blockage.', severity: 'medium', fix: ['Inspect and clean the packing; scaling is common where make-up water is hard', 'Check recirculation flow and spray nozzles for blockage', 'Verify the mist eliminator is not blinded', 'Rising ΔP also loads the ID fan, so treat it before it becomes a draught problem'] },
    { code: 'OPACITY / PARTICULATE HIGH', family: 'Stack monitoring', meaning: 'Visible emission or measured dust above the permitted level.', severity: 'high', fix: ['Reduce the loading rate first — overloading lifts particulate straight up the stack', 'Check primary air; too much air disturbs the bed and carries ash over', 'Inspect the cyclone for ash build-up and the scrubber for reduced performance', 'Treat persistent visible smoke as reportable rather than as a nuisance'] },
  ],
  diagrams: ['incinerator-two-chamber', 'combustion-air-flow'],
  roi: [
    { scenario: '50 kg/h hospital incinerator (district)', capex: 'KES 8M – 12M', annualSaving: 'Avoids contracted disposal ≈ KES 4M', payback: '2–3 yr', notes: 'Plus reduced infection-control risk.' },
    { scenario: '150 kg/h regional medical hub', capex: 'KES 18M – 25M', annualSaving: '≈ KES 9M (county-wide service)', payback: '2–3 yr', notes: 'Critical to integrate with NEMA reporting.' },
    { scenario: 'Containerised mobile unit for outbreak response', capex: 'KES 15M', annualSaving: 'Operational asset only', payback: 'N/A — disaster preparedness', notes: 'Funded usually via donor / public-health budget.' },
    { scenario: 'Waste segregation programme — bins, signage and staff training', capex: 'KES 300k – 900k plus recurring training', annualSaving: 'Fuel, refractory life and disposal cost, proportional to the tonnage no longer incinerated', payback: 'Usually within the first year', notes: 'The cheapest item on this page and the one with the largest effect. WHO guidance is clear that only a minority of health-facility waste is genuinely hazardous; everything else burned is fuel and emissions spent for nothing. Fix this before sizing a bigger machine.' },
    { scenario: 'Refractory reline vs replacing the incinerator', capex: 'Reline KES 1.5M – 4M vs new unit KES 8M – 25M', annualSaving: 'Restores rated capacity and burnout quality on an asset you already own', payback: 'Immediate where the shell, burners and controls are sound', notes: 'Refractory is a consumable with a 2–5 year life, not a terminal fault. Have the shell, fans and flue surveyed before accepting a quote to replace the whole plant.' },
  ],
  warrantyOptions: [
    'Refractory 12 mo workmanship',
    'Burner & PLC 24 mo',
    'Fans & motors 24 mo',
    'Annual service contract extends parts warranty',
  ],
  qualityChecks: [
    'Cold-start temperature curve documented',
    'Hot-load 4-hour test logged',
    'Isokinetic emissions sample annually',
    'NEMA licence current',
    'Operator log audited monthly',
    'Secondary chamber temperature and residence time evidenced from the logged trace, not a spot reading',
    'Thermocouples verified against a second instrument at commissioning and annually',
    'Ash burnout inspected and recorded at the end of each burn cycle',
    'Bottom ash and fly ash kept in separate labelled streams with disposal manifests on file',
    'Segregation audit at ward level, since what arrives at the door determines what leaves the stack',
    'Operators trained and refreshed, with attendance recorded',
  ],
  fastRepairCallouts: [
    'Stocked: thermocouples K-type, common burner igniters',
    'Refractory castable bags for emergency patch',
    'Mobile burner-service kit',
    'CEMS analyser for emergency stack-test',
  ],
  references: [
    'NEMA Waste Management Regulations 2006 (Kenya)',
    'WHO Safe Management of Wastes from Health-Care Activities (Bluebook)',
    'EU Industrial Emissions Directive 2010/75/EU',
    'Stockholm Convention — POPs (dioxins / furans)',
    'BAT-AEL Reference Document for Waste Incineration 2019',
    'Environmental Management and Co-ordination Act (EMCA) — Kenya, environmental assessment and licensing',
    'WHO Core Principles for Achieving Safe and Sustainable Management of Health-Care Waste',
    'UNEP Stockholm Convention — BAT/BEP guidelines for waste incinerators',
    'Basel Convention technical guidelines on biomedical and healthcare waste',
    'EN 746 — industrial thermoprocessing equipment, safety requirements',
    'BS EN 12952 — water-tube boilers and auxiliary installations (heat-recovery plant)',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER MAP — slug → bible
// ═══════════════════════════════════════════════════════════════════════════════

export const SERVICE_BIBLES: Record<string, ServiceBible> = {
  'cummins-generators': GENERATOR_BIBLE,
  'generator-repairs': GENERATOR_BIBLE,
  'ats-changeover': GENERATOR_BIBLE,
  'distribution-boards': DISTRIBUTION_BIBLE,
  'solar-energy': SOLAR_BIBLE,
  'motor-rewinding': MOTOR_BIBLE,
  'ac-installation': AC_BIBLE,
  'ups-systems': UPS_BIBLE,
  'borehole-pumps': PUMP_BIBLE,
  'hospital-incinerators': INCINERATOR_BIBLE,
};

export function getServiceBible(slug: string): ServiceBible | null {
  return SERVICE_BIBLES[slug] ?? null;
}

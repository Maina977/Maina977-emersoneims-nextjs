/**
 * workshopEducation — comprehensive, accurate technical content for each
 * workshop service on /generators/workshop-services.
 *
 * PURPOSE (owner brief 2026-07-23): each service must carry rich content that
 * serves THREE readers at once —
 *   • the CLIENT, deciding whether to repair and what to expect;
 *   • the TECHNICIAN, as a reference for how the work and testing are done;
 *   • the LECTURER, as teaching material for students.
 *
 * ACCURACY DISCIPLINE. Every statement here is established diesel-engineering
 * and rotating-machine practice — the kind found in engine and component
 * service manuals — not invented figures. Where a number would vary by
 * make/model (torques, clearances, pressures, micron ratings) the text says
 * "to the manufacturer's specification" rather than quoting a value that would
 * be wrong for some engines. No EmersonEIMS-specific turnaround, price,
 * capacity or certification claim appears here; those belong to the owner and
 * are deliberately absent.
 *
 * The `image`/`imageAlt` pairs reference files under
 * public/images/workshop/<slug>/, every one of which was opened and visually
 * verified before being listed (owner-provided set, 2026-07-23).
 */

export type EduImage = { src: string; alt: string };

export type ServiceEducation = {
  /** matches WorkshopService.id */
  id: string;
  /** One-paragraph plain-language explanation of what the component does. */
  whatItIs: string;
  /** Why it fails — real, ranked causes. */
  causes: { title: string; detail: string }[];
  /** Symptoms the operator sees (client-facing). */
  symptoms: string[];
  /** How EmersonEIMS repairs it — the technician's sequence. */
  repairSteps: string[];
  /** How it is tested before handover. */
  testing: string[];
  /** Parts and materials typically used. */
  parts: string[];
  /** What the owner should do to prevent recurrence. */
  prevention: string[];
  /** Verified photographs for this service. */
  images: EduImage[];
};

const IMG = (slug: string, n: number, alt: string): EduImage => ({
  src: `/images/workshop/${slug}/${slug}-${n}.webp`,
  alt,
});

export const WORKSHOP_EDUCATION: ServiceEducation[] = [
  // ─── COOLING / RADIATORS ────────────────────────────────────────────────
  {
    id: 'cooling-systems',
    whatItIs:
      'A generator radiator is a heat exchanger: hot coolant from the engine passes through a matrix of thin tubes bonded to fins, and the engine-driven fan pulls air across that matrix to carry the heat away. It has to reject the full waste heat of the engine — roughly as much energy as the set delivers as electricity — every second it runs on load. When it cannot, cylinder-head and liner temperatures rise and the damage that follows is measured in whole engines, not radiators.',
    causes: [
      { title: 'Airside blockage', detail: 'Dust, chaff, insects and oily film bridge the fins and choke airflow. This is the single most common cause on Kenyan sites — dusty yards, grass, and cooling air drawn through an unfiltered louvre. The core looks intact but cannot breathe.' },
      { title: 'Internal scaling and silting', detail: 'Hard water, plain water without inhibitor, and mixed coolants leave scale inside the tubes. Scale is an insulator; a thin layer collapses heat transfer and blocks the smaller tubes entirely.' },
      { title: 'Corrosion and electrolysis', detail: 'Missing supplemental coolant additive lets the tube-to-fin bond corrode. Stray current through the coolant (a bad earth) pits the tubes electrolytically, producing pinhole leaks.' },
      { title: 'Mechanical and thermal fatigue', detail: 'Vibration cracks the header-tank seams and solder joints; repeated heat cycling splits end tanks. A missing or wrong-rated pressure cap raises system pressure and finds the weakest seam.' },
      { title: 'Fan and shroud faults', detail: 'A slipping fan belt, a failed viscous drive or a missing shroud all reduce airflow and are frequently mistaken for a blocked core.' },
    ],
    symptoms: ['Coolant temperature climbing under load', 'High-temperature shutdown after minutes on load', 'Coolant loss with no puddle (internal or evaporative)', 'Visible weep or scale trails on the core', 'Warm air blowing weakly through the radiator'],
    repairSteps: [
      'Pressure-test the cold system to locate leaks before stripping anything — a leak found under pressure is a leak, a wet patch is a guess.',
      'Remove the radiator, drain and inspect the core, tanks and seams.',
      'Rod-out and back-flush the tubes; chemically de-scale where internal fouling is found.',
      'Repair serviceable cores — re-solder or seal leaking tubes, or block off a small number of dead tubes within the derating limit; recore where the matrix is beyond repair.',
      'Repair or replace end tanks and header seams; renew the filler neck and test the pressure cap.',
      'Renew hoses, clamps and the thermostat as required, and check the fan, belt and shroud before refit.',
    ],
    testing: [
      'Pressure test to the system rated pressure and hold — no drop permitted.',
      'Flow check to confirm the core is not internally restricted.',
      'Run the set up to operating temperature and verify it holds temperature on load, not just at idle.',
      'Confirm the thermostat opens at its rated temperature and the fan moves the expected air.',
    ],
    parts: ['Radiator cores / recore kits', 'End tanks and header gaskets', 'Pressure caps rated to the system', 'Thermostats', 'Hoses, clamps and fan belts', 'Coolant and supplemental coolant additive (SCA)'],
    prevention: [
      'Clean the core on a schedule matched to the site — weekly in dusty or agricultural yards, not annually.',
      'Use the correct coolant with inhibitor, never plain water; top up with the same coolant, never mixed types.',
      'Fit and maintain intake louvres and keep the plant room free of grass and litter.',
      'Replace the pressure cap when it is due — it is the cheapest part on the engine and protects every seam.',
      'Fix a slipping belt or a bad earth immediately; both destroy radiators indirectly.',
    ],
    images: [
      IMG('cooling-systems', 1, 'Close-up of a generator radiator fin-and-tube core behind its protective mesh guard, the surface loaded with dust that restricts cooling airflow'),
      IMG('cooling-systems', 2, 'Top header tank and fabricated side plates of a large industrial generator radiator during workshop inspection and cleaning'),
    ],
  },

  // ─── STARTERS & CHARGING ALTERNATORS ────────────────────────────────────
  {
    id: 'starters-alternators',
    whatItIs:
      'The starter motor is a heavy series-wound DC motor that spins the engine fast enough to fire; the charging alternator keeps the starting batteries topped up while the set runs. Both are small next to the engine, but a standby set that will not crank, or whose batteries are flat on the day of an outage, has failed completely regardless of engine condition. Most "the generator won\'t start" call-outs end here, not in the engine.',
    causes: [
      { title: 'Worn brushes and commutator (starter)', detail: 'Carbon brushes wear and the copper commutator glazes or grooves, so current cannot reach the armature. The starter clicks or spins weakly.' },
      { title: 'Failed solenoid or contacts', detail: 'The solenoid both throws the pinion and switches the heavy current. Burnt contacts give a loud click with no crank — one of the most common single faults.' },
      { title: 'Bearing and bush wear', detail: 'Worn end bushes let the armature rub the field poles; a dragging starter draws huge current and cranks slowly.' },
      { title: 'Bendix / pinion drive wear', detail: 'A worn one-way clutch or chipped pinion grinds on the ring gear instead of engaging.' },
      { title: 'Charging faults (alternator)', detail: 'A failed diode/rectifier pack, worn slip-ring brushes or a faulty regulator stops the batteries charging, so the set runs but the batteries die unnoticed until the next start fails.' },
      { title: 'Cabling and connections', detail: 'Corroded battery terminals and undersized or loose cables mimic a failed starter — the classic misdiagnosis. Voltage drop under crank is the giveaway.' },
    ],
    symptoms: ['Engine will not crank, or cranks slowly', 'Single loud click and nothing (solenoid)', 'Grinding on engagement', 'Batteries flat after standing', 'Charge-fault warning while running'],
    repairSteps: [
      'Confirm the battery and cabling first — measure voltage drop under crank; a good starter cannot work through a bad connection.',
      'Bench-strip the starter: inspect armature, commutator, field coils and brushes.',
      'Skim or undercut the commutator, fit new brushes, renew bushes/bearings and clean or replace the solenoid contacts.',
      'Inspect the Bendix drive and pinion; renew if worn, and check the ring gear it meshes with.',
      'For the charging alternator: test diodes/rectifier, slip rings, brushes and the regulator; renew the failed items and the bearings.',
      'Reassemble to specification and clean all current-carrying faces — resistance is the enemy in a starting circuit.',
    ],
    testing: [
      'No-load bench test the starter for correct speed and current draw.',
      'Loaded/stall test where facilities allow, to prove torque and current are within limits.',
      'Test the charging alternator for rated output voltage and current across the speed range.',
      'On the set: confirm clean crank, and confirm charge voltage settles to the correct float once running.',
    ],
    parts: ['Brush sets and brush holders', 'Solenoids and contact kits', 'Bushes, bearings and thrust washers', 'Bendix / one-way clutch drives', 'Rectifier/diode packs and voltage regulators', 'Slip rings and field service items'],
    prevention: [
      'Keep starting batteries on a maintained float charge between runs — the biggest single cause of failed standby starts.',
      'Clean and grease battery terminals; renew corroded or undersized cables.',
      'Exercise standby sets under load regularly so charging faults surface before an emergency.',
      'Do not crank in long bursts — it overheats the starter; investigate why it will not fire instead.',
    ],
    images: [
      IMG('starters-alternators', 1, 'Starter motor and solenoid mounted on a Cummins generator engine, with battery cables and red terminal boots, before removal for overhaul'),
      IMG('starters-alternators', 2, 'Starter motor components on the workshop bench during inspection and repair'),
      IMG('starters-alternators', 3, 'Generator starting and charging components assessed on the bench at EmersonEIMS'),
    ],
  },

  // ─── MOTOR & ALTERNATOR REWINDING ───────────────────────────────────────
  {
    id: 'motor-rewinding',
    whatItIs:
      'Rewinding replaces the copper windings in an electric motor or a generator alternator end. The winding is where electrical and magnetic energy meet, and it fails when its insulation fails — from heat, moisture, dirt or age. Rewinding is skilled work: the new winding must match the original turns, wire gauge, pitch and connection exactly, or the machine will run hot, draw wrong current, or not produce rated output.',
    causes: [
      { title: 'Insulation breakdown from heat', detail: 'Every 10 °C of sustained overheating roughly halves insulation life. Overload, single-phasing, blocked ventilation and high ambient all cook the winding until it shorts turn-to-turn or to earth.' },
      { title: 'Moisture and contamination', detail: 'Standby machines that sit idle absorb moisture; flooding, condensation and conductive dust all drop insulation resistance and cause earth faults — very common on coastal and highland sites without anti-condensation heaters.' },
      { title: 'Single-phasing and voltage imbalance', detail: 'Losing one phase, or a large voltage imbalance, overheats the remaining windings rapidly and is a frequent killer of three-phase motors.' },
      { title: 'Bearing failure leading to winding damage', detail: 'A collapsed bearing lets the rotor touch the stator; the rub destroys the winding in seconds. Many "burnt motors" started as a dry bearing.' },
      { title: 'Repeated starting and electrical stress', detail: 'Frequent starts, stalls and switching surges stress the insulation and end-turns until they fail.' },
    ],
    symptoms: ['No output voltage, or output that collapses under load', 'Burning smell or visibly discoloured windings', 'Motor trips its protection on start', 'Low insulation-resistance reading', 'Uneven running, noise or excessive vibration'],
    repairSteps: [
      'Test and record insulation resistance and winding resistance before stripping, to confirm the diagnosis.',
      'Record the original winding data — turns, wire gauge, span, connection and lead arrangement — before removing anything.',
      'Strip the old winding, clean the slots and inspect the core laminations for damage or shorting.',
      'Re-insulate the slots and rewind to the recorded data with the correct wire and insulation class.',
      'Connect, lace and brace the end-turns, then varnish-impregnate and cure to lock and seal the winding.',
      'Fit new bearings and seals, reassemble, and check the airgap and rotor balance.',
    ],
    testing: [
      'Insulation-resistance (megger) test winding-to-earth and between phases.',
      'Winding-resistance test for balance across the three phases.',
      'Surge/comparison test where equipment is available, to prove turn-to-turn integrity.',
      'No-load run for current balance, temperature and vibration; output test on generator ends.',
    ],
    parts: ['Enamelled copper winding wire (correct gauge)', 'Slot insulation, sleeving and lacing tape', 'Impregnating varnish', 'Bearings and shaft seals', 'Terminal blocks and lead wire', 'Anti-condensation heaters where fitted'],
    prevention: [
      'Fit and power the anti-condensation heaters on standby machines — they prevent the moisture that causes most winding failures.',
      'Protect against single-phasing and overload with correctly set protection.',
      'Keep the machine clean and ventilated; conductive dust and blocked cooling both cook windings.',
      'Renew bearings on condition, before they fail into the winding.',
      'Address the CAUSE at rewind time — a motor that burnt from single-phasing will burn again if the supply fault is not fixed.',
    ],
    images: [
      IMG('motor-rewinding', 1, 'Three-phase stator freshly rewound with copper windings laced and taped, showing the core laminations and slot insulation'),
      IMG('motor-rewinding', 2, 'Electric motor stator winding during the rewinding process in the EmersonEIMS workshop'),
      IMG('motor-rewinding', 3, 'Rewound motor windings being laced and braced before varnish impregnation'),
      IMG('motor-rewinding', 4, 'Copper stator winding work on an industrial electric motor at EmersonEIMS'),
    ],
  },

  // ─── INJECTOR NOZZLES ───────────────────────────────────────────────────
  {
    id: 'injectors',
    whatItIs:
      'A diesel injector atomises fuel into the combustion chamber at very high pressure, in a precise spray pattern and at an exact moment. The nozzle tip has microscopic spray holes; when they wear, coke up or the needle no longer seats, the fuel dribbles instead of atomising. The result is smoke, wasted fuel and burnt pistons — and it is often misdiagnosed as engine wear.',
    causes: [
      { title: 'Dirty fuel and water', detail: 'Abrasive particles wear the needle and seat; water corrodes them and causes the tip to erode. Poor fuel filtration is the root cause of most injector failure in the field.' },
      { title: 'Carbon build-up (coking)', detail: 'Idling, poor combustion and low-quality fuel coke the spray holes, distorting the pattern so one side of the chamber is over-fuelled.' },
      { title: 'Worn nozzle and needle', detail: 'The needle-to-seat fit is a lapped, matched pair. Wear raises leak-back, drops opening pressure and ruins the spray.' },
      { title: 'Wrong or weak opening pressure', detail: 'A tired spring or wrong shim opens the nozzle early or late, mis-timing delivery.' },
      { title: 'Over-heating from a stuck or leaking injector', detail: 'A leaking injector washes the cylinder and can hole a piston — the most expensive downstream consequence.' },
    ],
    symptoms: ['Black smoke, especially under load', 'Rough or uneven running and misfire', 'Hard starting', 'Knocking concentrated on one cylinder', 'High fuel consumption'],
    repairSteps: [
      'Remove the injectors and test each on the injector tester: spray pattern, opening pressure, chatter and leak-back.',
      'Dismantle, ultrasonically clean and de-carbon the nozzle and body.',
      'Replace the nozzle tip (needle-and-seat assembly) where it is worn — these are matched, lapped parts, not cleaned back to new.',
      'Reset opening pressure with the correct shim/spring and re-test.',
      'Renew copper sealing washers and confirm cylinder-to-cylinder consistency before refit.',
    ],
    testing: [
      'Spray-pattern test — clean, sharp, symmetrical spray from every hole.',
      'Opening-pressure test to the manufacturer\'s specification.',
      'Leak-back / dry-seat test to confirm the needle holds pressure.',
      'On the engine: confirm smoke clears and each cylinder contributes evenly.',
    ],
    parts: ['Nozzle tips (needle-and-seat assemblies)', 'Injector springs and shims', 'Copper sealing washers and sealing rings', 'Nozzle nuts and internal parts'],
    prevention: [
      'Maintain fuel filtration — the primary defence; change filters on schedule and drain water separators.',
      'Keep fuel clean and dry in storage; water in the day tank ruins injectors and pumps together.',
      'Avoid prolonged light-load idling, which cokes nozzles.',
      'Test injectors at overhaul rather than assuming — a marginal injector destroys a piston cheaply.',
    ],
    images: [
      IMG('injectors', 1, 'Row of diesel fuel injectors removed from a generator engine and laid out on the bench for testing at EmersonEIMS'),
      IMG('injectors', 2, 'Diesel injectors under inspection during nozzle testing and cleaning'),
      IMG('injectors', 3, 'Injector nozzle components assessed on the workshop bench'),
      IMG('injectors', 4, 'Diesel injector detail during spray-pattern and opening-pressure testing'),
    ],
  },

  // ─── INJECTION PUMPS ────────────────────────────────────────────────────
  {
    id: 'injection-pumps',
    whatItIs:
      'The injection pump is the heart of a mechanical diesel: it meters exactly the right quantity of fuel to each cylinder and delivers it at exactly the right instant, at very high pressure, through the governor that controls engine speed. It is a precision instrument built to fine tolerances. Faults here affect starting, power, smoke and fuel consumption together, and reconditioning is bench work requiring calibration, not a roadside swap.',
    causes: [
      { title: 'Dirty and watery fuel', detail: 'The plunger-and-barrel elements are lapped to a few microns. Abrasive fuel wears them so delivery falls; water corrodes and seizes them. Fuel contamination is the dominant cause.' },
      { title: 'Wear in elements and delivery valves', detail: 'Worn elements lose the pressure and volume needed, so the engine is down on power and smokes; worn delivery valves upset timing and cut-off.' },
      { title: 'Governor faults', detail: 'Wear or sticking in the governor causes hunting, surging or an inability to hold speed under changing load.' },
      { title: 'Seized or sticking plungers', detail: 'Corrosion from water or long standing seizes a plunger — the engine will not start or runs on fewer cylinders.' },
      { title: 'Seal and timing faults', detail: 'Perished seals leak fuel; incorrect timing after careless refit gives hard starting and poor combustion.' },
    ],
    symptoms: ['Hard starting', 'Down on power and smoking', 'Hunting or surging at steady load', 'Excessive fuel consumption', 'Fuel leaks around the pump'],
    repairSteps: [
      'Mount the pump on the test bench and record its as-received delivery and timing.',
      'Dismantle in clean conditions; inspect elements, delivery valves, cam and governor.',
      'Replace worn elements and delivery valves as matched sets; renew all seals and gaskets.',
      'Reassemble and CALIBRATE on the bench — set delivery per cylinder, timing and governor response to the manufacturer\'s test data.',
      'Confirm even delivery across all elements and correct cut-off before release.',
    ],
    testing: [
      'Calibrated bench test: delivery quantity per element across the speed range against the specification.',
      'Timing and phasing check between elements.',
      'Governor test for correct speed control and cut-off.',
      'On the engine: verify clean start, rated power and stable running after correct pump timing.',
    ],
    parts: ['Plunger-and-barrel elements', 'Delivery valves and holders', 'Governor components', 'Seal and gasket kits', 'Drive and timing components'],
    prevention: [
      'Filtration and water separation are everything — the pump lives or dies by fuel cleanliness.',
      'Drain water separators and keep storage tanks free of water and rust.',
      'Do not let a set stand for long periods with untreated fuel; corrosion seizes elements.',
      'Have timing set correctly whenever the pump is refitted — guesswork here wastes fuel and power.',
    ],
    images: [
      IMG('injection-pumps', 1, 'Inline diesel injection pump removed from a generator engine for reconditioning at EmersonEIMS'),
      IMG('injection-pumps', 2, 'Bosch inline injection pump on the rebuild bench with the governor cover removed, showing the internal governor mechanism and a new gasket'),
      IMG('injection-pumps', 3, 'Injection pump internal components during inspection and reconditioning'),
      IMG('injection-pumps', 4, 'Diesel injection pump on the calibration bench with service tools'),
    ],
  },

  // ─── TURBOCHARGERS ──────────────────────────────────────────────────────
  {
    id: 'turbochargers',
    whatItIs:
      'A turbocharger uses the engine\'s own exhaust to spin a turbine, which drives a compressor that forces more air into the cylinders — more air means more fuel can be burnt, so more power. The shaft spins at tens of thousands of rpm on a thin film of engine oil. That is why almost every turbo failure traces back to oil supply, oil quality or something entering the wheels — not to the turbo itself. Fit a new turbo without finding the cause and it will fail again.',
    causes: [
      { title: 'Oil starvation', detail: 'A restricted or delayed oil feed, or starting hard after standing, runs the bearings dry for the critical first seconds. The commonest killer.' },
      { title: 'Dirty or degraded oil', detail: 'Contaminated or overdue oil scores the journal bearings and blocks the fine oil feed. Turbo life is oil life.' },
      { title: 'Foreign-object damage', detail: 'A split intake hose or failed air filter lets grit strike the compressor wheel; a broken valve or carbon from upstream damages the turbine wheel.' },
      { title: 'Over-speeding and over-fuelling', detail: 'A tuned-up pump, air leaks or altitude effects over-speed the turbo until the wheels burst or the bearings fail.' },
      { title: 'Blocked oil drain / seal failure', detail: 'A restricted oil drain pressurises the centre housing and pushes oil past the seals into the intake or exhaust — seen as blue or white smoke and mistaken for engine wear.' },
    ],
    symptoms: ['Loss of power and slow load acceptance', 'Blue smoke (oil) or black smoke (poor boost)', 'Whining or siren-like noise', 'Oil in the intake or exhaust pipework', 'Excessive shaft play felt by hand'],
    repairSteps: [
      'Inspect for shaft radial and axial play, wheel damage and oil carry-over BEFORE condemning it.',
      'Establish the CAUSE — check the oil feed and drain, the air filter and intake, and the fuelling — or the rebuild will fail.',
      'Dismantle; assess compressor wheel, turbine wheel, shaft, bearings, seals and housings.',
      'Rebuild with a bearing, seal and (where needed) CHRA kit, or fit a new/reconditioned unit where the wheels or housings are beyond use.',
      'Balance the rotating assembly where the equipment is available; renew oil feed and drain lines.',
    ],
    testing: [
      'Check shaft free play and rotation for smoothness after rebuild.',
      'Balance verification of the rotating assembly where equipment allows.',
      'On the engine: prime the oil feed before first start; confirm boost, no smoke and no oil carry-over under load.',
    ],
    parts: ['Turbo repair / CHRA kits (bearings, seals, thrust)', 'Compressor and turbine wheels where required', 'Oil feed and drain lines and gaskets', 'Complete new or reconditioned turbochargers'],
    prevention: [
      'Change engine oil and filters on schedule — the turbo depends on clean oil more than any other part.',
      'Let the engine idle briefly before shutdown after hard running, so the turbo cools with oil still flowing.',
      'Keep the air filter and all intake joints sealed — one split hose destroys a compressor wheel.',
      'Fix the root cause (oil feed, filtration, over-fuelling) at rebuild — a replacement turbo fitted to the same fault fails the same way.',
    ],
    images: [
      IMG('turbochargers', 1, 'Turbocharger with the compressor housing exposed, showing the compressor wheel and carbon and oil deposits, during inspection at EmersonEIMS'),
      IMG('turbochargers', 2, 'Turbocharger assessed for shaft play and wheel damage on the workshop bench'),
      IMG('turbochargers', 3, 'Turbocharger turbine and housing detail during teardown and inspection'),
      IMG('turbochargers', 4, 'Turbocharger components during rebuild at EmersonEIMS'),
    ],
  },

  // ─── UPS REPAIRS ────────────────────────────────────────────────────────
  {
    id: 'ups-repairs',
    whatItIs:
      'A UPS bridges the gap between mains failing and the generator taking load, and cleans the power in between. It has three things that age: the batteries that store the energy, the power electronics that convert it, and the capacitors and fans that support them. A UPS that has never been load-tested is an assumption, not a backup — and the most common discovery is a healthy-looking UPS sitting on an exhausted battery bank.',
    causes: [
      { title: 'Battery bank ageing', detail: 'Sealed lead-acid batteries lose capacity with heat and cycles; after a few years they hold minutes, not the rated runtime. The dominant cause of "UPS failed at the wrong moment".' },
      { title: 'Capacitor ageing', detail: 'Electrolytic capacitors on the DC bus and boards dry out with heat and time, causing instability, alarms and eventual shutdown.' },
      { title: 'Fan failure and overheating', detail: 'A stalled cooling fan lets the power stage overheat and derate or trip — a cheap part that takes out expensive ones.' },
      { title: 'Inverter / charger / power-stage faults', detail: 'IGBT/MOSFET, driver or rectifier failures put the unit on permanent bypass or shut it down, often triggered by overload or a surge.' },
      { title: 'Bad connections and control faults', detail: 'Loose battery links, corroded terminals and control-board faults produce misleading alarms and intermittent behaviour.' },
    ],
    symptoms: ['UPS alarming or stuck on bypass', 'No runtime when mains fails', 'Batteries not holding charge', 'Overheating or noisy/failed fans', 'Repeated unexplained faults or shutdowns'],
    repairSteps: [
      'Diagnose the whole system — UPS AND battery bank together; test the batteries under load, not just their standing voltage.',
      'Inspect the DC-bus and board capacitors, the power semiconductors, the charger and inverter stages, and the cooling fans.',
      'Renew failed capacitors, fans and power devices; repair connections and terminations.',
      'Replace battery blocks as a matched set where capacity has fallen — mixing old and new blocks shortens the whole bank.',
      'Recalibrate/settle the unit and confirm clean transfer between mains, battery and bypass.',
    ],
    testing: [
      'Battery load / runtime test against the actual connected load.',
      'Transfer test — mains to battery to bypass and back — for clean, break-free switching.',
      'Output waveform and voltage checks under load.',
      'Thermal check that fans and the power stage hold temperature under sustained load.',
    ],
    parts: ['Sealed lead-acid battery blocks (matched sets)', 'Electrolytic capacitors', 'Cooling fans', 'Power semiconductors and driver components', 'Fuses, connectors and battery links'],
    prevention: [
      'Load-test the UPS and battery bank periodically — the only honest proof it will hold when needed.',
      'Keep the UPS cool and ventilated; heat halves both battery and capacitor life.',
      'Replace the battery bank on age, before it fails — most banks need renewal every few years in Kenyan ambient.',
      'Do not overload the UPS; sustained overload stresses the power stage and cuts runtime.',
    ],
    images: [
      IMG('ups-repairs', 1, 'Online UPS opened on the bench showing DC-bus capacitors, power-stage heatsink, toroidal chokes and control boards during diagnosis at EmersonEIMS'),
      IMG('ups-repairs', 2, 'UPS internal boards and components under inspection during repair'),
      IMG('ups-repairs', 3, 'UPS power electronics assessed on the workshop bench'),
      IMG('ups-repairs', 4, 'UPS internal wiring and components during fault diagnosis'),
    ],
  },

  // ─── PUMP REPAIRS ───────────────────────────────────────────────────────
  {
    id: 'pump-repairs',
    whatItIs:
      'Borehole, booster and process pumps move water or fluid, driven by an electric motor. They usually fail through the seals, bearings or the driving motor rather than the pump body, so diagnosing which saves replacing a pump that is still good. A submersible borehole pump works unseen down a well, which is why symptoms — falling flow, tripping, dry running — matter more than appearance.',
    causes: [
      { title: 'Mechanical seal failure', detail: 'The seal that keeps water out of the motor wears or is damaged by dry running or abrasives; water then enters and destroys the motor.' },
      { title: 'Bearing wear', detail: 'Worn bearings cause noise, vibration and eventually a rubbing, seizing rotor.' },
      { title: 'Impeller wear and blockage', detail: 'Sand and grit erode the impellers and wear rings, dropping flow and pressure; debris blocks or jams the impeller.' },
      { title: 'Dry running', detail: 'Running a pump with no water burns the seal and overheats the motor in minutes — a leading cause of borehole-pump failure when the water level drops.' },
      { title: 'Electrical and control faults', detail: 'Motor winding failure, cable faults down the borehole, and control-panel/protection faults stop the pump or trip it repeatedly.' },
    ],
    symptoms: ['Reduced flow or pressure', 'Pump tripping on overload', 'Leaking at the seal (surface pumps)', 'Noise or vibration', 'Motor overheating or repeatedly cutting out'],
    repairSteps: [
      'Withdraw and inspect the pump; test the motor windings and the down-hole cable for insulation and continuity.',
      'Dismantle; assess seals, bearings, impellers, wear rings and shaft.',
      'Renew mechanical seals and bearings; replace or skim worn impellers and wear rings; check shaft straightness.',
      'Rewind or replace the motor where the winding has failed (see motor rewinding).',
      'Check alignment on coupled surface sets and diagnose the control panel and protection.',
    ],
    testing: [
      'Insulation-resistance test of motor and cable before re-installation.',
      'Performance test for flow and pressure against the duty.',
      'Dry-run and overload protection check on the control panel.',
      'Confirm correct rotation and clean, vibration-free running.',
    ],
    parts: ['Mechanical seals', 'Bearings', 'Impellers and wear rings', 'Shafts and sleeves', 'Motor winding materials (see rewinding)', 'Control and protection components'],
    prevention: [
      'Fit and set dry-run / low-level protection on borehole pumps — the single best defence against seal and motor loss.',
      'Match the pump to the borehole yield so it is not run dry as the water level draws down.',
      'Manage sand — worn wells and sandy water destroy impellers and seals quickly.',
      'Protect the motor with correctly rated overload and earth-fault protection, and keep the down-hole cable sound.',
    ],
    images: [
      IMG('pump-repairs', 1, 'Stainless-steel submersible borehole pump at the wellhead during removal and inspection by EmersonEIMS'),
      IMG('pump-repairs', 2, 'Pump assessed for seal, bearing and impeller condition during overhaul'),
    ],
  },

  // ─── CANOPIES ───────────────────────────────────────────────────────────
  {
    id: 'canopies',
    whatItIs:
      'A generator canopy is a fabricated acoustic enclosure that does three jobs at once: reduce noise, keep weather out, and still let the machine breathe. Get the airflow wrong and a noise solution becomes an overheating problem, so a canopy is designed around the specific set — its cooling-air demand, its exhaust route and its service access — not bought as a standard box.',
    causes: [
      { title: 'Why sets need one', detail: 'Noise complaints and by-law limits, weather and dust protection, security of the asset and its fuel, and a tidy, professional installation.' },
      { title: 'Where poor canopies fail', detail: 'Undersized air paths cause the set to overheat under load; a badly routed exhaust cooks the enclosure; doors and panels that block service access mean maintenance is skipped.' },
    ],
    symptoms: ['Excessive noise from an unenclosed set', 'Weather and dust reaching the machine', 'Exposed, un-secured generator and fuel', 'Overheating inside a poorly ventilated existing canopy'],
    repairSteps: [
      'Establish the set\'s cooling-air volume and radiator discharge requirement first — this governs the whole design.',
      'Design the frame and panels in the correct sheet thickness with an air path that feeds the radiator and clears hot air.',
      'Route the exhaust and separate its heat from the enclosure; provide access doors for service and refuelling.',
      'Line acoustically to the noise objective and apply a protective finish for the installation environment.',
      'Fabricate, fit and confirm the set runs at temperature on load inside the finished canopy.',
    ],
    testing: [
      'Run the enclosed set on load and confirm it holds operating temperature — airflow proven, not assumed.',
      'Check service access, door sealing and weather protection.',
    ],
    parts: ['Steel frame and sheet panels', 'Acoustic lining', 'Louvres and attenuated air paths', 'Access doors, locks and hinges', 'Protective coating'],
    prevention: [
      'Never trade cooling airflow for noise reduction — a quiet set that overheats is a failed set.',
      'Keep louvres and air paths clear in service.',
      'Design in the exhaust route and service access from the start.',
    ],
    images: [],
  },

  // ─── EXHAUST SYSTEMS ────────────────────────────────────────────────────
  {
    id: 'exhaust-systems',
    whatItIs:
      'The exhaust system carries hot, toxic gas safely away from people and plant, and controls noise. Done poorly it is a carbon-monoxide hazard and a source of back-pressure that robs the engine of power. It is fabricated to the installation — pipe runs, silencer grade, flexible connections and safe discharge — not cut to a generic length.',
    causes: [
      { title: 'Why it is fabricated', detail: 'Every plant room routes differently; the system must match the engine outlet, the building penetration and the safe discharge point, with the right silencer grade for the location.' },
      { title: 'Where exhausts fail', detail: 'A missing flexible connection cracks the manifold; excessive back-pressure from undersized or blocked pipework loses power and overheats the engine; a leaking joint indoors is a CO danger.' },
    ],
    symptoms: ['Excessive exhaust noise', 'Fumes in the plant room', 'Cracked manifold or exhaust joints', 'Soot staining at leaking joints', 'Power loss from high back-pressure'],
    repairSteps: [
      'Assess the plant room, engine outlet and required discharge point; select the silencer grade for the location (industrial, residential or critical).',
      'Fabricate pipework and bends to suit, sized to keep back-pressure within the engine\'s limit.',
      'Fit a flexible connection at the engine to isolate movement and protect the manifold.',
      'Mount the silencer, form wall/roof penetrations, and route to a safe discharge clear of intakes and occupied areas.',
      'Insulate or guard hot sections to protect personnel and reduce plant-room heat.',
    ],
    testing: [
      'Check for leaks along the finished run — no fumes may enter occupied space.',
      'Confirm back-pressure is within the engine manufacturer\'s limit where measurement is available.',
      'Verify safe, clear discharge and that hot surfaces are guarded.',
    ],
    parts: ['Exhaust pipe, bends and supports', 'Flexible connections (bellows)', 'Silencers (industrial / residential / critical grade)', 'Flanges, gaskets and clamps', 'Thermal insulation and guarding', 'Rain caps and wall/roof penetration sleeves'],
    prevention: [
      'Always fit and maintain the flexible connection — its absence cracks manifolds.',
      'Keep the system sound and leak-free indoors; an exhaust leak in a plant room is a carbon-monoxide risk, not a nuisance.',
      'Do not add length or bends that raise back-pressure beyond the engine\'s limit.',
    ],
    images: [
      IMG('exhaust-systems', 1, 'Fabricated generator exhaust pipework with mandrel bends and newly welded flanges in the EmersonEIMS workshop'),
      IMG('exhaust-systems', 2, 'Two fabricated exhaust silencers manufactured for generator installations'),
      IMG('exhaust-systems', 3, 'Large fabricated industrial exhaust silencer with flanged inlet and support feet'),
    ],
  },

  // ─── FUEL TANKS ─────────────────────────────────────────────────────────
  {
    id: 'fuel-tanks',
    whatItIs:
      'Fuel storage decides how long a set runs unattended and, with automation, how reliably it is kept fed. Tanks are fabricated to the site — capacity, bulk-and-day-tank arrangement, containment and connections — and this is where fire and environmental requirements apply most directly. Poor tank work causes the two commonest diesel problems: a day tank that runs dry and a bulk tank nobody noticed was empty.',
    causes: [
      { title: 'Why tanks are fabricated to order', detail: 'Runtime target, footprint, bulk-vs-day arrangement and containment all vary by site; a tank must be built for the actual installation and its compliance needs.' },
      { title: 'Where fuel systems fail', detail: 'Water and rust in neglected tanks ruin injectors and pumps; a day tank with no automatic fill starves the engine; no containment turns a leak into an environmental incident.' },
    ],
    symptoms: ['Set running out of fuel unexpectedly', 'Water or rust in the fuel', 'Day tank not being refilled', 'No spill containment on a commercial site'],
    repairSteps: [
      'Confirm capacity, material, structural support and containment against the site and its compliance requirements.',
      'Fabricate the tank (base, day or bulk) with proper support and, where required, a bund.',
      'Form fill, vent, suction, return, drain and inspection connections; add level indication.',
      'Apply protective coating for the environment; pressure/leak-check before commissioning.',
      'Where automation is required, integrate transfer, level control and monitoring (see fuel automation).',
    ],
    testing: [
      'Leak / pressure test of the fabricated tank before installation.',
      'Function-check fill, vent, suction and return, and level indication.',
      'Confirm containment and safe filling arrangements.',
    ],
    parts: ['Steel plate and sections', 'Bund / containment fabrication', 'Fill, vent, suction, return and drain fittings', 'Level gauges and senders', 'Protective coating', 'Tank supports and frames'],
    prevention: [
      'Keep tanks free of water — drain and inspect; water is the enemy of injectors and pumps.',
      'Maintain the day-tank fill and level controls so the engine is never starved.',
      'Provide and maintain containment where required, for compliance and to contain leaks.',
    ],
    images: [
      IMG('fuel-tanks', 1, 'Fabricated rectangular steel diesel fuel tank under construction with welded seams in the EmersonEIMS workshop'),
      IMG('fuel-tanks', 2, 'Diesel fuel storage tank fabrication showing welded steel plate construction'),
      IMG('fuel-tanks', 3, 'Fuel tank fabrication with connections and supports being formed'),
      IMG('fuel-tanks', 4, 'Completed fabricated diesel fuel tank for a generator installation'),
    ],
  },

  // ─── FUEL AUTOMATION ────────────────────────────────────────────────────
  {
    id: 'fuel-automation',
    whatItIs:
      'Fuel automation removes the two most common diesel failures on a standby installation: a day tank that runs dry and a bulk tank nobody realised was empty. It adds level monitoring, automatic transfer from bulk to day tank, alarms and, where specified, remote alerts — so the fuel side looks after itself and warns before it becomes a problem.',
    causes: [
      { title: 'Why sites add it', detail: 'Manual fuel management fails when nobody is watching — which is exactly when a standby set is needed. Automation makes the fuel side self-managing and auditable.' },
      { title: 'What it prevents', detail: 'Engine starvation from an empty day tank, unnoticed bulk depletion, overfills and spills, and undetected fuel loss.' },
    ],
    symptoms: ['Day tank running dry during outages', 'Bulk tank emptying unnoticed', 'No warning of low fuel', 'Manual, error-prone refuelling'],
    repairSteps: [
      'Establish the tanks, levels and functions required for the specific installation.',
      'Install level sensing with high and low alarms on the relevant tanks.',
      'Set up automatic bulk-to-day transfer with pump start/stop control and manual override.',
      'Add overflow protection and, where specified, bund/leak alarms and consumption monitoring.',
      'Provide panel indication and, where required, GSM or network remote alerts and event history.',
    ],
    testing: [
      'Function-test automatic transfer, high/low alarms and manual override.',
      'Confirm overflow protection operates and remote alerts (where fitted) are received.',
    ],
    parts: ['Level sensors and float assemblies', 'Transfer pumps and controls', 'Alarm and indication panel', 'Overflow and bund-alarm devices', 'GSM / network alert modules where specified'],
    prevention: [
      'Advertise and supply only the monitoring functions specified for the project — the scope above is the menu, not a standard package.',
      'Test the automation periodically so it is proven before it is relied on.',
    ],
    images: [],
  },

  // ─── PLINTHS ────────────────────────────────────────────────────────────
  {
    id: 'plinths',
    whatItIs:
      'A generator plinth is the reinforced concrete base the machine sits on. It carries the weight, controls vibration transmitted into the building, and keeps the set clear of water. It is designed from the actual generator weight and footprint and the actual ground conditions — there is no universal size, and a plinth quoted from a photograph is guesswork.',
    causes: [
      { title: 'What the plinth must do', detail: 'Support the static and dynamic load without settling, anchor the set, isolate vibration through anti-vibration mounts, drain water away and give safe working clearance around the machine.' },
      { title: 'Where poor foundations fail', detail: 'An undersized or poorly reinforced base cracks and settles; no drainage lets water pool under the set; missing anchor and AV provisions transmit vibration into the structure.' },
    ],
    symptoms: ['New or relocated set needing a foundation', 'Cracked or settling existing base', 'Vibration transmitted into the building', 'Water pooling around the set'],
    repairSteps: [
      'Measure the site and confirm the generator weight and footprint and the ground conditions.',
      'Design the reinforced concrete base to carry the static and dynamic load.',
      'Set out anchor points and anti-vibration mounting provisions, cable-entry provisions and drainage.',
      'Form, reinforce and cast the base with correct reinforcement and cover.',
      'Cure and confirm level, anchor positions and clearance before the set is placed.',
    ],
    testing: [
      'Confirm the cured base is level, correctly dimensioned and cured before loading.',
      'Verify anchor and AV-mount positions match the set.',
    ],
    parts: ['Reinforcement steel (rebar / mesh)', 'Concrete to the design mix', 'Anchor bolts and AV-mount provisions', 'Cable-entry and drainage provisions'],
    prevention: [
      'Design every plinth for the specific set and ground — never reuse a generic size.',
      'Provide drainage so water never stands under the machine.',
      'Fit the anti-vibration mounts the plinth was designed for; they protect both set and building.',
    ],
    images: [
      IMG('plinths', 1, 'Freshly cast reinforced concrete generator plinth showing the embedded steel reinforcement grid and formed edges'),
      IMG('plinths', 2, 'Reinforced concrete generator foundation base constructed by EmersonEIMS on site'),
    ],
  },

  // ─── SECURITY CAGES & HOUSING ───────────────────────────────────────────
  {
    id: 'security-cages',
    whatItIs:
      'Outdoor generators and their fuel systems are theft and tamper targets, and often need weather protection beyond a canopy. EmersonEIMS builds both welded steel security cages and full masonry generator houses — walk-in enclosures with louvred ventilation and secure doors. Either way the rule is the same: protect the asset without choking the machine.',
    causes: [
      { title: 'Why sites need enclosure', detail: 'Security of the generator, batteries and fuel; weather protection; noise containment; and a safe, controlled space for maintenance.' },
      { title: 'The critical constraint', detail: 'The enclosure must never obstruct radiator airflow, exhaust discharge or maintenance access. Ventilation is sized to the cooling requirement — a secure box that overheats the set has failed.' },
    ],
    symptoms: ['Exposed, un-secured outdoor generator and fuel', 'Theft or tamper risk', 'Need for weather and dust protection', 'Requirement for a walk-in, serviceable generator room'],
    repairSteps: [
      'Establish the set\'s ventilation requirement and access needs first — these govern the design.',
      'For a steel cage: fabricate welded steel construction with lockable access doors and ventilation sized to the cooling requirement.',
      'For a generator house: build masonry walls with louvred ventilation openings, reinforced columns, and secure steel doors.',
      'Provide maintenance and refuelling access and provision for fuel and electrical connections.',
      'Finish for the environment; confirm the set runs at temperature inside the finished enclosure.',
    ],
    testing: [
      'Run the enclosed set on load and confirm it holds operating temperature — ventilation proven.',
      'Check secure locking, weather protection and full service access.',
    ],
    parts: ['Welded steel sections and mesh (cages)', 'Masonry, reinforced columns and louvre blocks (houses)', 'Secure steel doors, locks and hinges', 'Ventilation louvres sized to the cooling load', 'Protective finish'],
    prevention: [
      'Size ventilation to the cooling requirement, never below it — security must not cost airflow.',
      'Keep louvres and vents clear in service.',
      'Preserve full maintenance and refuelling access in the design.',
    ],
    images: [
      IMG('security-cages', 1, 'Completed masonry generator house with large louvre ventilation panels and secure steel double doors'),
      IMG('security-cages', 2, 'Masonry generator house under construction with ventilation-block walls and reinforced concrete columns'),
      IMG('security-cages', 3, 'Generator enclosure construction showing ventilation openings and secure structure'),
    ],
  },

  // ─── HAMMER MILLS ───────────────────────────────────────────────────────
  {
    id: 'hammer-mills',
    whatItIs:
      'A hammer mill reduces material — grain, minerals, agricultural or industrial feedstock — by beating it with swinging hammers against a screen inside a grinding chamber. Output size is set by the screen; capacity by the rotor, hammers and drive power. EmersonEIMS fabricates, repairs and rebuilds hammer mills to a defined duty, because the same frame with the wrong screen, hammer or motor gives the wrong product at the wrong rate.',
    causes: [
      { title: 'What determines the design', detail: 'The material being processed, the required output size, the expected capacity, the motor power available, the duty cycle and the feeding method — all of these set the specification.' },
      { title: 'Where hammer mills wear', detail: 'Hammers and screens are wear parts and need periodic renewal; bearings and shafts wear under the beating load; feed and discharge arrangements block or bridge with the wrong material.' },
    ],
    symptoms: ['Output size or rate off target', 'Worn or broken hammers and screens', 'Bearing noise or shaft vibration', 'Feed blockage or uneven feeding', 'Need for a new machine to a defined duty'],
    repairSteps: [
      'Establish the material, target output size, capacity, motor power, duty and feed method before any fabrication or quote.',
      'Fabricate or repair the frame and grinding chamber; assess and true the rotor.',
      'Renew hammers and screens to the required output size; renew bearings, housings and shaft as needed.',
      'Set up the belt/pulley drive and motor mounting; form the feed hopper and discharge.',
      'Fit safety guarding to all rotating and drive parts.',
    ],
    testing: [
      'Confirm correct rotation, balanced running and no undue vibration.',
      'Trial the machine on the intended material and verify output size against the requirement.',
      'Check guarding and safe operation.',
    ],
    parts: ['Hammers and hammer pins', 'Screens to the required output size', 'Bearings and bearing housings', 'Rotor and shaft components', 'Belts, pulleys and drive parts', 'Safety guarding'],
    prevention: [
      'Renew hammers and screens on wear — worn parts drop output and overload the drive.',
      'Feed the correct material and size; tramp metal and oversize wreck the rotor.',
      'Keep bearings lubricated and guarding in place.',
      'Match capacity claims to what the machine was actually specified to do — no unsupported throughput figures.',
    ],
    images: [
      IMG('hammer-mills', 1, 'Fabricated industrial hammer mill with feed hopper and gearbox drive, mounted on a steel frame'),
      IMG('hammer-mills', 2, 'Hammer mill construction showing the grinding chamber and drive arrangement'),
      IMG('hammer-mills', 3, 'Industrial hammer mill fabrication in progress at EmersonEIMS'),
      IMG('hammer-mills', 4, 'Fabricated hammer mill and its drive and framing'),
    ],
  },

  // ─── INDUSTRIAL GRINDERS ────────────────────────────────────────────────
  {
    id: 'industrial-grinders',
    whatItIs:
      'Industrial grinders and size-reduction machines are built to a defined duty — the material, the target particle size and the throughput determine the machine, not the other way round. EmersonEIMS both fabricates grinder/size-reduction equipment and carries out the precision machining (turning, boring and cylindrical grinding of shafts and journals) that keeps rotating machinery true.',
    causes: [
      { title: 'What the enquiry must define', detail: 'The material to be processed, the required particle or output size, the expected throughput, operating hours, available motor power and supply, the construction material required, guarding needs and the installation location.' },
      { title: 'Where machining is needed', detail: 'Worn shafts, journals and bores on pumps, motors and machinery are restored by precision turning and grinding to the correct size and finish — a core workshop capability.' },
    ],
    symptoms: ['Output size or throughput off target', 'Worn shafts, journals or bores needing precision restoration', 'Need for size-reduction equipment to a defined duty'],
    repairSteps: [
      'Collect the full duty — material, output size, throughput, hours, motor and supply, construction material, guarding and location — before fabricating or quoting.',
      'Fabricate the machine in the material suited to the process, with the drive matched to the available supply.',
      'For precision work: set up the shaft or component and turn, bore or cylindrically grind to the correct size and surface finish.',
      'Form feed and discharge, fit guarding and safety interlocks.',
      'Support installation and commissioning.',
    ],
    testing: [
      'Precision work: verify dimensions and surface finish to the drawing/specification.',
      'Machinery: confirm rotation, balance and safe running, and trial on the intended material.',
    ],
    parts: ['Fabricated frame and chamber', 'Drive, motor mounting and guarding', 'Bearings and shafts', 'Wear liners suited to the material'],
    prevention: [
      'Do not fabricate or quote from a photograph alone — material and duty details are required first.',
      'Publish no throughput figure that has not been established for the specific machine.',
    ],
    images: [
      IMG('industrial-grinders', 1, 'Precision cylindrical grinding of a shaft on a machine tool in the EmersonEIMS workshop, with coolant and sparks'),
      IMG('industrial-grinders', 3, 'Industrial size-reduction grinder machine with feed chute and drive'),
      IMG('industrial-grinders', 2, 'Industrial grinder fabrication and assembly at EmersonEIMS'),
      IMG('industrial-grinders', 4, 'Grinder machinery components during fabrication'),
    ],
  },
];

export function getEducation(id: string): ServiceEducation | undefined {
  return WORKSHOP_EDUCATION.find((e) => e.id === id);
}

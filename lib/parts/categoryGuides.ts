/**
 * categoryGuides — descriptive content for each spare-parts category.
 *
 * WHY (owner direction 2026-07-21): "you don't have to put the real prices, if
 * you don't have the part number you don't have to, but we need enough
 * description and names."
 *
 * This is the honest way to add depth. Part numbers and selling prices are data
 * I cannot invent — but what a component DOES, how it fails, and what we need
 * from a customer to supply the right one is engineering knowledge that can be
 * written accurately. It is also what a buyer actually searches for: far more
 * people type "generator AVR not charging" or "changeover switch for generator
 * Kenya" than a part number.
 *
 * RULES FOLLOWED
 *   - Component NAMES are generic industry terms, not invented SKUs.
 *   - Descriptions state function and failure symptoms — verifiable engineering,
 *     not marketing claims.
 *   - NO prices, NO stock claims, NO delivery promises, NO dealership claims.
 *   - Nothing here contradicts the site-survey fee policy or the dispatch
 *     wording used elsewhere in the parts section.
 */

export type ComponentType = {
  /** Generic industry name — what the customer would call it. */
  name: string;
  /** What it does and, where useful, how it fails. */
  description: string;
};

export type CategoryGuide = {
  /** Opening paragraph — what this category covers and who needs it. */
  overview: string;
  /** Named component types within the category. */
  components: ComponentType[];
  /** Symptoms that point at this category. */
  symptoms?: string[];
};

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  filters: {
    overview:
      'Filtration is the cheapest insurance a diesel generator has. Oil, fuel, air and coolant filters all protect surfaces that cost many times more to replace than the filter itself, and nearly every premature engine failure we are called to has a filtration history behind it. Filters are consumables tied to running hours, so they are the parts most sets need most often.',
    components: [
      { name: 'Oil filters (spin-on and cartridge)', description: 'Trap combustion soot and wear metal before they reach bearings and journals. A blocked element opens the bypass valve and circulates unfiltered oil, so an old filter is worse than no protection at all.' },
      { name: 'Fuel filters and pre-filters', description: 'Remove particulate that would otherwise score injectors and high-pressure pump elements. Common-rail engines are far less tolerant of dirty fuel than older mechanical injection.' },
      { name: 'Fuel/water separators', description: 'Drop free water out of the fuel before it reaches the injection system. Essential in Kenya where storage tanks collect condensation; the bowl needs draining as routine, not only at service.' },
      { name: 'Air filters (primary and safety)', description: 'Stop airborne dust reaching the bores. In dusty and up-country sites the primary element loads far faster than the service interval assumes, and a safety element protects the engine during primary changes.' },
      { name: 'Coolant / water filters', description: 'Dose supplemental coolant additive and filter the cooling circuit, controlling liner pitting and corrosion on wet-liner engines.' },
      { name: 'Hydraulic and breather filters', description: 'Fitted to sets with hydraulic governing or crankcase ventilation; a blocked breather raises crankcase pressure and pushes oil past seals.' },
    ],
    symptoms: ['Low oil pressure warning', 'Loss of power under load', 'Black smoke', 'Frequent injector problems', 'Coolant loss with no visible leak'],
  },
  'pistons-rings': {
    overview:
      'Pistons, rings and their associated components are the wearing heart of the engine. They are replaced during overhaul, after overheating, or when oil consumption and blow-by show the rings are no longer sealing. Correct grade and oversize matter — these are not interchangeable between builds of the same model.',
    components: [
      { name: 'Pistons (standard and oversize)', description: 'Supplied to match the bore after reboring. Oversize selection must follow the machining actually done to the block.' },
      { name: 'Piston ring sets', description: 'Compression and oil-control rings. Worn rings show as blow-by at the breather, rising oil consumption and blue smoke.' },
      { name: 'Gudgeon (wrist) pins and circlips', description: 'Locate the piston to the connecting rod. Replaced with pistons as a matter of course.' },
      { name: 'Piston cooling nozzles', description: 'Spray oil to the piston underside on higher-output engines; a blocked or bent nozzle causes localised piston overheating.' },
    ],
    symptoms: ['Blue exhaust smoke', 'High oil consumption', 'Excessive crankcase breather blow-by', 'Loss of compression'],
  },
  'injectors-fuel': {
    overview:
      'Fuel-system components determine how cleanly and efficiently the engine burns. Injector and pump faults show up as smoke, rough running, hard starting and poor load acceptance. Precision components in this category should be tested on a bench rather than swapped by guesswork.',
    components: [
      { name: 'Injectors / injector nozzles', description: 'Atomise fuel into the cylinder. Worn or coked nozzles dribble instead of atomising, producing black smoke and uneven running.' },
      { name: 'Injection pumps (inline and rotary)', description: 'Meter and time delivery. Usually reconditioned and calibrated rather than replaced outright.' },
      { name: 'Fuel lift pumps and transfer pumps', description: 'Draw fuel from tank to injection system. Failure shows as fuel starvation under load or an engine that starts and dies.' },
      { name: 'Fuel solenoids (stop/run)', description: 'Energise to allow the engine to run. A failed solenoid is a very common cause of a set that cranks strongly but will not fire.' },
      { name: 'High-pressure pipes and unions', description: 'Carry injection pressure; must be the correct length and bend, and are not reusable indefinitely.' },
      { name: 'Governor components and actuators', description: 'Control speed against load. Hunting or surging at steady load usually points here or at fuel supply.' },
    ],
    symptoms: ['Black smoke', 'Hard starting', 'Hunting or surging', 'Cranks but will not fire', 'Poor load acceptance'],
  },
  'cooling-system': {
    overview:
      'Standby sets in Kenya frequently run at high ambient temperature and dust loading, which puts the cooling system under more stress than the original design assumed. Overheating is one of the fastest routes to a destroyed engine, so cooling components are worth treating as critical rather than incidental.',
    components: [
      { name: 'Radiators and radiator cores', description: 'Reject engine heat. Blocked fins from dust and chaff are as common a cause of overheating as any internal fault.' },
      { name: 'Water pumps', description: 'Circulate coolant. Failure usually announces itself as a weep from the telltale hole or bearing noise before it becomes a seizure.' },
      { name: 'Thermostats and housings', description: 'Control warm-up and operating temperature. A thermostat stuck open causes chronic under-temperature running and carbon build-up.' },
      { name: 'Fans, fan belts and viscous drives', description: 'Move air through the radiator. Slipping belts or a failed viscous coupling cause overheating that looks like a radiator problem.' },
      { name: 'Hoses, clamps and expansion tanks', description: 'Contain the circuit. Perished hoses are a leading cause of sudden coolant loss on standby sets that sit idle between runs.' },
      { name: 'Coolant and supplemental additive', description: 'Correct inhibitor levels protect liners and cores. Plain water is a frequent and expensive shortcut.' },
    ],
    symptoms: ['High coolant temperature alarm', 'Coolant loss', 'Steam or sweet smell', 'Set shutting down on temperature under load'],
  },
  alternators: {
    overview:
      'The alternator end converts mechanical power to electrical power and holds output voltage steady as load changes. Faults here show as voltage that will not build, drifts, or collapses under load — and they are frequently misdiagnosed as engine problems.',
    components: [
      { name: 'Automatic Voltage Regulators (AVRs)', description: 'Sense output voltage and adjust excitation to hold it steady. The single most commonly replaced electrical part on a generator, and the usual suspect when voltage is high, low or unstable.' },
      { name: 'Rotating rectifier / diode assemblies', description: 'Rectify exciter output on brushless machines. A failed diode typically gives low or unstable output and can take the AVR with it.' },
      { name: 'Exciter stator and rotor windings', description: 'Provide field excitation. Insulation failure here usually follows moisture ingress on sets left standing.' },
      { name: 'Main stator and rotor assemblies', description: 'Generate the output. Rewinding is often more economic than replacement on larger frames.' },
      { name: 'Bearings and bearing housings', description: 'Support the rotor. Noise or vibration from the alternator end is normally a bearing approaching failure.' },
      { name: 'Anti-condensation heaters', description: 'Keep windings above dew point on standby sets, preventing the moisture damage that causes most winding failures in coastal and highland sites.' },
    ],
    symptoms: ['No output voltage', 'Voltage too high or too low', 'Voltage fluctuating', 'Output collapses under load', 'Noise from the alternator end'],
  },
  'electrical-components': {
    overview:
      'The sensors and switchgear around the engine tell the controller what is happening and shut the set down before damage occurs. When these fail the set often stops for no apparent reason, or worse, fails to stop when it should.',
    components: [
      { name: 'Oil pressure sensors and switches', description: 'Provide the shutdown that protects the bearings. A faulty sender causes spurious low-pressure shutdowns — never bypass one to keep a set running.' },
      { name: 'Coolant temperature sensors', description: 'Drive gauges, alarms and high-temperature shutdown.' },
      { name: 'Magnetic pickups (speed sensors)', description: 'Read flywheel teeth for speed and crank detection. Gap setting is critical; too far and the set will not detect crank.' },
      { name: 'Starter motors and solenoids', description: 'Crank the engine. Slow cranking is more often batteries and cabling than the motor itself.' },
      { name: 'Charging alternators and belts', description: 'Keep starting batteries charged while running. A failed charge alternator is a common reason a standby set is flat when finally needed.' },
      { name: 'Relays, contactors and fuses', description: 'Switch and protect control and power circuits.' },
      { name: 'Wiring looms and connectors', description: 'Carry it all. Corroded connectors cause intermittent faults that are far harder to trace than outright failures.' },
    ],
    symptoms: ['Set will not crank', 'Spurious shutdowns', 'Flat starting batteries', 'Intermittent alarms', 'Gauges reading incorrectly'],
  },
  'control-panels': {
    overview:
      'The control system starts the set, protects it, and — on mains-failure systems — decides when to transfer load. Modern controllers also log the faults that make diagnosis possible. Choosing a controller is about the application (single set, mains failure, or multiple sets in parallel) as much as the brand.',
    components: [
      { name: 'Auto-start controllers', description: 'Start and stop the set on a remote signal, with engine protection and instrumentation. Suited to single sets without automatic mains transfer.' },
      { name: 'AMF (Automatic Mains Failure) controllers', description: 'Detect a mains outage, start the set, transfer load, then return and stop when mains is restored. The standard choice for standby installations.' },
      { name: 'Synchronising and load-sharing controllers', description: 'Bring multiple sets onto a common bus, sharing load in proportion. Required for parallel installations and mains-parallel schemes.' },
      { name: 'Manual-start control modules', description: 'Basic instrumentation and protection for sets started by an operator.' },
      { name: 'Battery chargers', description: 'Hold the starting batteries at float while the set is standing. As important to standby reliability as the controller itself.' },
      { name: 'Expansion and communication modules', description: 'Add inputs, outputs and remote monitoring over Ethernet or GSM.' },
      { name: 'Panel instrumentation and meters', description: 'Voltmeters, ammeters, frequency meters and hour counters, whether discrete or built into the controller.' },
    ],
    symptoms: ['Set will not auto-start on mains failure', 'Controller display blank or locked', 'Repeated unexplained shutdown codes', 'No transfer to load'],
  },
  turbochargers: {
    overview:
      'Turbochargers raise output by forcing more air into the cylinders. They spin at very high speed on a thin oil film, so almost every turbo failure traces back to oil supply, oil quality or ingested debris rather than the turbo itself. Replacing one without finding the cause usually destroys the replacement.',
    components: [
      { name: 'Turbochargers (complete units)', description: 'Supplied new or reconditioned and matched to the engine rating.' },
      { name: 'Turbo repair and CHRA kits', description: 'Bearings, seals and centre housing rotating assemblies for rebuilding a serviceable casing.' },
      { name: 'Oil feed and drain lines', description: 'A restricted feed line starves the bearing; a blocked drain pressurises the housing and pushes oil past the seals.' },
      { name: 'Wastegates and actuators', description: 'Limit boost pressure. A stuck wastegate gives either overboost or a marked loss of power.' },
      { name: 'Intercoolers and charge-air pipework', description: 'Cool the compressed charge; leaks here show as smoke and lost power.' },
      { name: 'Air intake hoses and clamps', description: 'A split hose downstream of the filter admits unfiltered air straight into the engine.' },
    ],
    symptoms: ['Loss of power', 'Blue or black smoke', 'Whining or siren noise', 'Oil in the intake pipework'],
  },
  'bearings-seals': {
    overview:
      'Bearings, seals and gaskets are what keep an engine oil-tight and its moving parts located. They are the bulk of any overhaul kit, and the parts most often needed at short notice when a set is stripped and waiting.',
    components: [
      { name: 'Main and big-end bearing shells', description: 'Carry crankshaft loads on a pressurised oil film. Supplied in standard and undersize to match crank grinding.' },
      { name: 'Thrust washers', description: 'Control crankshaft end-float; excessive end-float damages the flywheel housing and clutch or drive components.' },
      { name: 'Crankshaft front and rear oil seals', description: 'A leaking rear main seal is one of the more labour-intensive repairs, so seals are normally renewed whenever the engine is opened.' },
      { name: 'Valve stem seals', description: 'Control oil entering the ports; hardened seals cause smoke on start-up after standing.' },
      { name: 'Head gaskets and gasket sets', description: 'Full sets, top sets and bottom sets to suit the depth of work being done.' },
      { name: 'O-rings and liner seals', description: 'Seal wet liners against coolant leaking into the sump — a classic cause of oil contamination.' },
    ],
    symptoms: ['Oil leaks', 'Oil in coolant or coolant in oil', 'Low oil pressure', 'Knocking under load'],
  },
  'valves-train': {
    overview:
      'The valve train controls gas exchange and directly governs compression, starting and power. Valve clearances drift with running hours, so periodic adjustment is a maintenance task rather than a repair — and neglecting it burns valves.',
    components: [
      { name: 'Inlet and exhaust valves', description: 'Seal the combustion chamber. Burnt or receded valves cause hard starting and misfire.' },
      { name: 'Valve guides and seats', description: 'Locate and seal the valve; worn guides admit oil and cause smoke.' },
      { name: 'Valve springs, collets and retainers', description: 'Close the valve and hold it. Weak springs cause valve float at speed.' },
      { name: 'Rocker arms, shafts and pushrods', description: 'Transmit cam motion to the valve. A bent pushrod usually follows over-fuelling or a hydraulic lock.' },
      { name: 'Camshafts, followers and tappets', description: 'Set valve timing and lift.' },
      { name: 'Cylinder heads (complete and reconditioned)', description: 'Supplied assembled or bare where a head is beyond skimming.' },
    ],
    symptoms: ['Hard starting', 'Misfire or rough running', 'Tapping noise from the head', 'Low compression on one cylinder'],
  },
  'crankshafts-rods': {
    overview:
      'The rotating assembly converts combustion into torque. Components here are usually needed after a bearing failure, hydraulic lock or serious overheating, and are almost always supplied alongside machining work rather than on their own.',
    components: [
      { name: 'Crankshafts (new and reground)', description: 'Reground shafts are matched to undersize bearing shells; the grind and the shells must agree.' },
      { name: 'Connecting rods', description: 'Checked for straightness and big-end ovality before reuse; bent rods follow hydraulic lock.' },
      { name: 'Connecting rod bolts', description: 'Stretch bolts are single-use — reusing them is a common and expensive shortcut.' },
      { name: 'Flywheels and ring gears', description: 'A worn ring gear causes the grinding engagement that eventually destroys the starter pinion.' },
      { name: 'Vibration dampers / harmonic balancers', description: 'Absorb torsional vibration. A failed damper leads to crankshaft fatigue and is easy to overlook.' },
    ],
    symptoms: ['Knocking under load', 'Metal in the oil or filter', 'Vibration that worsens with speed', 'Starter grinding on engagement'],
  },
  'cylinder-liners': {
    overview:
      'Liners provide the running surface for the pistons. Wet-liner engines allow liners to be replaced without reboring the block, which makes a full overhaul far more economic — provided the correct seals and protrusion are used.',
    components: [
      { name: 'Wet cylinder liners', description: 'In direct contact with coolant, sealed by O-rings at the base. Protrusion above the deck must be set to specification or the head gasket will fail.' },
      { name: 'Dry cylinder liners', description: 'Pressed into the block where the bore is worn beyond limits.' },
      { name: 'Liner seal and O-ring kits', description: 'Renewed whenever a liner is disturbed; the usual cause of coolant appearing in the sump.' },
      { name: 'Liner shims', description: 'Used to set correct protrusion during assembly.' },
    ],
    symptoms: ['Coolant in the oil', 'Loss of compression', 'Heavy blow-by', 'Coolant loss with no external leak'],
  },
  'engine-block': {
    overview:
      'Core components supplied when an engine is beyond repair at component level, or when a major structural part has cracked. These are normally quoted alongside machining and assembly rather than as parts alone.',
    components: [
      { name: 'Cylinder blocks', description: 'Bare or part-dressed, supplied when a block is cracked or bored beyond limits.' },
      { name: 'Complete short and long engines', description: 'Frequently the faster and more economic route than a full strip-and-rebuild on a set that is needed back in service.' },
      { name: 'Core plugs and gallery plugs', description: 'Renewed during rebuild; corroded core plugs are a common cause of coolant leaks on older sets.' },
      { name: 'Front covers and sump pans', description: 'Structural covers that are damaged in handling or corroded on coastal installations.' },
    ],
  },
  'timing-gears': {
    overview:
      'Timing components keep the crankshaft, camshaft and injection pump in step. Failure is usually sudden and, on interference engines, expensive — which is why timing components are renewed on schedule rather than on condition.',
    components: [
      { name: 'Timing gears and idler gears', description: 'Gear-driven timing is common on industrial diesels; backlash is checked at rebuild.' },
      { name: 'Timing chains and tensioners', description: 'A rattling chain on start-up indicates a worn tensioner and should not be left.' },
      { name: 'Timing belts and kits', description: 'Where fitted, replaced strictly by interval regardless of appearance.' },
      { name: 'Timing covers and gaskets', description: 'Seal the gear train and are renewed whenever the cover is removed.' },
    ],
    symptoms: ['Rattle on start-up', 'Engine out of time', 'Hard starting with correct compression'],
  },
  'oil-pumps': {
    overview:
      'Lubrication components maintain the oil film that everything else depends on. Low oil pressure is one of the few faults that justifies stopping a set immediately and not restarting it until the cause is known.',
    components: [
      { name: 'Oil pumps', description: 'Deliver pressure and flow. Wear shows first as low pressure when hot at idle.' },
      { name: 'Oil pressure relief valves', description: 'Cap maximum pressure; a stuck valve gives low pressure across the range.' },
      { name: 'Oil coolers and heat exchangers', description: 'Control oil temperature on higher-output sets; internal failure lets oil and coolant mix.' },
      { name: 'Oil pick-up strainers', description: 'A partially blocked strainer starves the pump and mimics pump wear.' },
      { name: 'Dipsticks, tubes and filler caps', description: 'Routine items usually needed after service damage or loss.' },
    ],
    symptoms: ['Low oil pressure warning', 'Pressure falling when hot', 'Oil and coolant mixing'],
  },
  'exhaust-system': {
    overview:
      'The exhaust system carries gas safely away and controls noise. On generator installations it is also a safety system: a leaking exhaust inside a plant room is a carbon monoxide hazard, not merely a nuisance.',
    components: [
      { name: 'Exhaust silencers (industrial, residential, critical)', description: 'Graded by attenuation. Grade is selected from the site — a residential or hospital installation needs more than an industrial one.' },
      { name: 'Flexible exhaust connectors / bellows', description: 'Isolate engine movement from fixed pipework. Omitting or over-stretching one cracks the manifold.' },
      { name: 'Exhaust manifolds', description: 'Collect gas from the ports; cracking follows thermal cycling and overloading.' },
      { name: 'Exhaust pipes, bends and lagging', description: 'Routed to discharge clear of air intakes and occupied areas; lagging protects personnel and reduces plant-room heat.' },
      { name: 'Rain caps and wall/roof penetrations', description: 'Keep water out of the system on outdoor terminations.' },
    ],
    symptoms: ['Excessive noise', 'Exhaust fumes in the plant room', 'Cracked manifold', 'Soot staining at joints'],
  },
  'belts-pulleys': {
    overview:
      'Belt drives run the cooling fan, water pump and charging alternator. They are inexpensive and easy to inspect, yet a failed belt stops cooling and charging simultaneously and can put a set out of service in minutes.',
    components: [
      { name: 'V-belts and matched sets', description: 'Multi-belt drives are replaced as matched sets so tension is shared evenly.' },
      { name: 'Poly-V / serpentine belts', description: 'Single belt driving several accessories; failure stops all of them at once.' },
      { name: 'Tensioners and idler pulleys', description: 'Maintain tension automatically; a seized idler shreds a new belt quickly.' },
      { name: 'Crankshaft, fan and water pump pulleys', description: 'Worn pulley grooves destroy belts however well tensioned.' },
    ],
    symptoms: ['Squealing on start-up', 'Belt dust around the front of the engine', 'Battery not charging', 'Overheating'],
  },
  'hoses-clamps': {
    overview:
      'Flexible connections carry coolant, fuel and air between components that move relative to one another. They perish with heat and age, and on standby sets that sit idle they often fail on the day the set is finally needed.',
    components: [
      { name: 'Radiator and heater hoses', description: 'Moulded and straight hoses; perished or spongy hose is replaced rather than clamped tighter.' },
      { name: 'Fuel hoses and lines', description: 'Rated for diesel; substituting general-purpose rubber leads to softening and leaks.' },
      { name: 'Air intake and charge-air hoses', description: 'Carry filtered and compressed air; any split admits unfiltered air directly to the engine.' },
      { name: 'Hose clamps and clips', description: 'Correct size and type; over-tightening a worm-drive clamp cuts the hose it is meant to seal.' },
      { name: 'Pipe fittings, unions and adaptors', description: 'Connect the system together at tanks, filters and pumps.' },
    ],
    symptoms: ['Coolant or fuel leaks', 'Soft or bulging hoses', 'Air leaks after the filter', 'Loss of power under load'],
  },
  batteries: {
    overview:
      'Starting batteries are the most common single reason a standby generator fails to start when called. They degrade quietly while the set sits idle, which is exactly when nobody is watching them.',
    components: [
      { name: 'Starting batteries (lead-acid and maintenance-free)', description: 'Sized by cold cranking amps for the engine, not by physical size or price.' },
      { name: 'Deep-cycle batteries', description: 'For control supplies and hybrid or solar applications where sustained discharge matters more than cranking current.' },
      { name: 'Battery chargers and float chargers', description: 'Hold batteries at correct float voltage between runs; without one a standby set is on borrowed time.' },
      { name: 'Battery cables, terminals and isolators', description: 'Corroded terminals mimic a failed battery and are a frequent misdiagnosis.' },
      { name: 'Battery racks, trays and enclosures', description: 'Secure and contain batteries safely in the plant room.' },
    ],
    symptoms: ['Set will not crank when called', 'Slow cranking', 'Battery flat after standing', 'Corrosion at the terminals'],
  },
  gauges: {
    overview:
      'Instrumentation is how an operator sees what the set is doing. Inaccurate gauges are worse than none, because they invite decisions based on wrong information.',
    components: [
      { name: 'Voltmeters and ammeters', description: 'Show output voltage and current per phase.' },
      { name: 'Frequency meters', description: 'Frequency reflects engine speed and is the first indication of a governing problem.' },
      { name: 'Oil pressure and temperature gauges', description: 'Paired with their senders; a gauge and sender must be matched to read correctly.' },
      { name: 'Hour counters (run-hour meters)', description: 'The basis of all service scheduling — without accurate hours, maintenance intervals are guesswork.' },
      { name: 'Fuel level gauges and senders', description: 'Tank-mounted senders driving panel indication.' },
      { name: 'Power and energy meters', description: 'Multifunction meters logging kW, kVA, power factor and energy for load studies.' },
    ],
  },
  hardware: {
    overview:
      'Mounting and fastening components hold the set together and control how much of its vibration reaches the building. Unglamorous, but the cause of a surprising share of noise complaints and cracked pipework.',
    components: [
      { name: 'Anti-vibration mounts', description: 'Isolate the set from its base. Selected by weight and speed; wrong mounts transmit vibration into the structure.' },
      { name: 'Engine and alternator mounting feet', description: 'Locate the machine on the bedframe.' },
      { name: 'High-tensile bolts, nuts and studs', description: 'Correct grade matters on structural and rotating assemblies; ordinary fasteners fail in fatigue.' },
      { name: 'Bedframes and skid components', description: 'Structural base carrying engine, alternator and tank.' },
      { name: 'Fixings, washers and clips', description: 'General assembly hardware for panels, guards and covers.' },
    ],
  },
  'fuel-tanks': {
    overview:
      'Fuel storage determines how long a set can run unattended and is the part of the installation most often modified after commissioning. Tank work is also where fire and environmental requirements bite hardest.',
    components: [
      { name: 'Base and belly tanks', description: 'Integral to the skid, sized for a target runtime at full load.' },
      { name: 'Bulk and day tanks', description: 'Bulk storage feeding a smaller day tank, used where extended autonomy is needed.' },
      { name: 'Fuel transfer pumps', description: 'Move fuel from bulk to day tank, usually under level-switch control.' },
      { name: 'Level switches, gauges and float assemblies', description: 'Provide level indication and low-level alarms.' },
      { name: 'Tank breathers, fill points and caps', description: 'Allow safe filling and venting while keeping water and debris out.' },
      { name: 'Bunds and spill containment', description: 'Contain leaks; commonly required for compliance on commercial installations.' },
    ],
    symptoms: ['Set running out of fuel unexpectedly', 'Water in fuel', 'Transfer pump not filling day tank'],
  },
  lubricants: {
    overview:
      'Oils and fluids are consumables, but specification is not optional. Using the wrong grade or a passenger-vehicle oil in an industrial diesel shortens component life in ways that only show up much later.',
    components: [
      { name: 'Diesel engine oils', description: 'Selected by API/ACEA specification and viscosity for the engine and ambient conditions.' },
      { name: 'Coolants and antifreeze concentrate', description: 'Provide corrosion and cavitation protection as much as freeze protection — which is why they matter in Kenya.' },
      { name: 'Supplemental coolant additive (SCA)', description: 'Maintains inhibitor levels in wet-liner engines between coolant changes.' },
      { name: 'Hydraulic and gear oils', description: 'For hydraulic governing, ancillaries and driven equipment.' },
      { name: 'Greases', description: 'Bearing and general-purpose greases for alternator and ancillary lubrication.' },
      { name: 'Cleaners, flushes and degreasers', description: 'System cleaning during service and overhaul.' },
    ],
  },
  tools: {
    overview:
      'Servicing and diagnostic equipment for technicians and in-house maintenance teams. Buying the right tool is usually cheaper than the damage caused by improvising without it.',
    components: [
      { name: 'Filter wrenches and service tools', description: 'Remove spin-on filters without crushing the canister.' },
      { name: 'Torque wrenches', description: 'Essential for head, rod and main bearing work where torque sequence and value are specified.' },
      { name: 'Load banks and load testing equipment', description: 'Prove a set can actually take rated load — the only honest way to verify standby capability.' },
      { name: 'Multimeters, clamp meters and insulation testers', description: 'Electrical fault-finding and winding insulation testing.' },
      { name: 'Compression and pressure test equipment', description: 'Diagnose cylinder condition and fuel-system pressure.' },
      { name: 'Battery testers and hydrometers', description: 'Assess battery condition before it causes a failed start.' },
    ],
  },
  enclosures: {
    overview:
      'Canopies and enclosures control noise, protect the set from weather and keep unauthorised people away from rotating and live parts. Acoustic performance is a design property, not something that can be added later with padding.',
    components: [
      { name: 'Acoustic canopies', description: 'Weatherproof enclosures with acoustic lining and attenuated airflow paths.' },
      { name: 'Canopy doors, locks and hinges', description: 'Frequently damaged in service and on relocated sets.' },
      { name: 'Acoustic insulation and foam', description: 'Lining material selected for absorption and fire performance.' },
      { name: 'Louvres, attenuators and ventilation grilles', description: 'Admit cooling air while limiting noise breakout.' },
      { name: 'Containerised housings', description: '20ft and 40ft container conversions for larger or temporary installations.' },
      { name: 'Weather protection and covers', description: 'Protects sets in exposed or coastal locations.' },
    ],
  },
  'wiring-electrical': {
    overview:
      'Power and control cabling connects the set to the installation. It is where a good generator meets a poor installation, and where most avoidable site problems originate.',
    components: [
      { name: 'Power cables (single and multicore)', description: 'Sized by current, run length, grouping and permitted volt drop — not by connector size.' },
      { name: 'Control and instrument cables', description: 'Screened cable for sensor and communication runs, kept clear of power routes to avoid interference.' },
      { name: 'Cable glands, lugs and terminations', description: 'Correctly crimped terminations are a common failure point; a poor lug generates heat under load.' },
      { name: 'Cable trays, trunking and conduit', description: 'Mechanical support and protection for cable routes.' },
      { name: 'Earthing and bonding components', description: 'Earth rods, conductors and clamps for a compliant earthing arrangement.' },
      { name: 'Junction boxes and enclosures', description: 'Environmentally rated housings for field connections.' },
    ],
  },
  'safety-fire': {
    overview:
      'Safety equipment in the generator room protects people and the installation. These items are also what an insurer, auditor or county inspector looks for first.',
    components: [
      { name: 'Fire extinguishers (CO2 and dry powder)', description: 'Rated for electrical and fuel fires and mounted at the plant-room exit.' },
      { name: 'Fire and smoke detection', description: 'Detection heads and panels covering the generator room.' },
      { name: 'Emergency stop devices', description: 'Local and remote emergency stops so the set can be shut down from a safe position.' },
      { name: 'Warning signage and labelling', description: 'Hazard, isolation and permit signage as required in a plant room.' },
      { name: 'First aid and PPE', description: 'Ear protection, gloves and eye protection for personnel working around a running set.' },
      { name: 'Spill kits and containment', description: 'Absorbents and bunding for fuel and oil spill response.' },
    ],
  },
};

/** Convenience: does a category have a written guide? */
export function getCategoryGuide(id: string): CategoryGuide | undefined {
  return CATEGORY_GUIDES[id];
}

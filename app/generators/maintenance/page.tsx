// Generator Maintenance & Engine Overhaul Services - All 47 Counties Kenya
// SEO-OPTIMIZED: World's Most Comprehensive Generator Service Coverage
'use client';
import { useState } from 'react';

// Metadata moved to layout or generateMetadata for client components
// SEO metadata is in the head section below

// All 47 Counties with specific generator service data
const counties = [
  { name: 'Nairobi', region: 'Central', industries: 'Corporate HQs, Data Centers, Hospitals, Hotels, Malls', generators: '50,000+', responseTime: '30 mins' },
  { name: 'Mombasa', region: 'Coast', industries: 'Port Operations, Tourism, Manufacturing, Cold Storage', generators: '15,000+', responseTime: '45 mins' },
  { name: 'Kisumu', region: 'Western', industries: 'Port, Fish Processing, Manufacturing, Healthcare', generators: '8,000+', responseTime: '1 hour' },
  { name: 'Nakuru', region: 'Rift Valley', industries: 'Agriculture, Floriculture, Manufacturing', generators: '7,500+', responseTime: '1 hour' },
  { name: 'Eldoret', region: 'Rift Valley', industries: 'Agriculture, Athletics, Universities, Textile', generators: '6,000+', responseTime: '1.5 hours' },
  { name: 'Kiambu', region: 'Central', industries: 'Manufacturing, Agriculture, Residential', generators: '25,000+', responseTime: '45 mins' },
  { name: 'Machakos', region: 'Eastern', industries: 'Manufacturing, Tech Parks, Agriculture', generators: '12,000+', responseTime: '1 hour' },
  { name: 'Kajiado', region: 'Rift Valley', industries: 'Cement, Mining, Tourism, Real Estate', generators: '10,000+', responseTime: '1 hour' },
  { name: 'Meru', region: 'Eastern', industries: 'Agriculture, Miraa, Banking, Healthcare', generators: '8,000+', responseTime: '2 hours' },
  { name: 'Kilifi', region: 'Coast', industries: 'Tourism, Agriculture, Salt Mining', generators: '7,000+', responseTime: '1.5 hours' },
  { name: 'Uasin Gishu', region: 'Rift Valley', industries: 'Agriculture, Universities, Manufacturing', generators: '6,500+', responseTime: '1.5 hours' },
  { name: 'Kakamega', region: 'Western', industries: 'Sugar, Gold Mining, Agriculture', generators: '5,000+', responseTime: '2 hours' },
  { name: 'Nyeri', region: 'Central', industries: 'Coffee, Tea, Tourism, Healthcare', generators: '5,500+', responseTime: '1.5 hours' },
  { name: 'Muranga', region: 'Central', industries: 'Coffee, Tea, Agriculture', generators: '4,500+', responseTime: '1.5 hours' },
  { name: 'Bungoma', region: 'Western', industries: 'Sugar, Maize, Manufacturing', generators: '4,000+', responseTime: '2.5 hours' },
  { name: 'Kisii', region: 'Nyanza', industries: 'Soapstone, Banking, Agriculture', generators: '4,500+', responseTime: '2 hours' },
  { name: 'Trans Nzoia', region: 'Rift Valley', industries: 'Maize, Wheat, Dairy', generators: '3,500+', responseTime: '2 hours' },
  { name: 'Kericho', region: 'Rift Valley', industries: 'Tea Multinationals, Dairy', generators: '4,000+', responseTime: '2 hours' },
  { name: 'Narok', region: 'Rift Valley', industries: 'Tourism (Maasai Mara), Wheat', generators: '3,000+', responseTime: '2.5 hours' },
  { name: 'Bomet', region: 'Rift Valley', industries: 'Tea, Dairy, Agriculture', generators: '2,500+', responseTime: '2.5 hours' },
  { name: 'Homa Bay', region: 'Nyanza', industries: 'Fishing, Agriculture', generators: '2,500+', responseTime: '2.5 hours' },
  { name: 'Migori', region: 'Nyanza', industries: 'Gold Mining, Tobacco, Sugar', generators: '3,000+', responseTime: '3 hours' },
  { name: 'Siaya', region: 'Nyanza', industries: 'Fishing, Agriculture, Cotton', generators: '2,000+', responseTime: '2.5 hours' },
  { name: 'Kitui', region: 'Eastern', industries: 'Mining, Agriculture, Basket Weaving', generators: '2,500+', responseTime: '3 hours' },
  { name: 'Makueni', region: 'Eastern', industries: 'Fruit Processing, Agriculture', generators: '2,000+', responseTime: '2.5 hours' },
  { name: 'Embu', region: 'Eastern', industries: 'Coffee, Tea, Agriculture', generators: '3,000+', responseTime: '2 hours' },
  { name: 'Kirinyaga', region: 'Central', industries: 'Rice, Coffee, Horticulture', generators: '2,500+', responseTime: '1.5 hours' },
  { name: 'Nyandarua', region: 'Central', industries: 'Dairy, Potatoes, Vegetables', generators: '2,000+', responseTime: '2 hours' },
  { name: 'Laikipia', region: 'Rift Valley', industries: 'Ranching, Tourism, Conservation', generators: '2,500+', responseTime: '2.5 hours' },
  { name: 'Nyamira', region: 'Nyanza', industries: 'Tea, Bananas, Agriculture', generators: '1,500+', responseTime: '2.5 hours' },
  { name: 'Vihiga', region: 'Western', industries: 'Tea, Agriculture', generators: '1,500+', responseTime: '2.5 hours' },
  { name: 'Busia', region: 'Western', industries: 'Cross-border Trade, Fishing', generators: '2,000+', responseTime: '3 hours' },
  { name: 'Nandi', region: 'Rift Valley', industries: 'Tea, Athletics, Agriculture', generators: '2,500+', responseTime: '2 hours' },
  { name: 'Baringo', region: 'Rift Valley', industries: 'Livestock, Honey, Tourism', generators: '1,500+', responseTime: '3 hours' },
  { name: 'Elgeyo Marakwet', region: 'Rift Valley', industries: 'Athletics, Agriculture', generators: '1,200+', responseTime: '3 hours' },
  { name: 'Kwale', region: 'Coast', industries: 'Mining (Titanium), Tourism', generators: '3,000+', responseTime: '2 hours' },
  { name: 'Taita Taveta', region: 'Coast', industries: 'Mining, Tourism, Sisal', generators: '2,000+', responseTime: '3 hours' },
  { name: 'Tharaka Nithi', region: 'Eastern', industries: 'Tea, Miraa, Agriculture', generators: '1,500+', responseTime: '2.5 hours' },
  { name: 'Samburu', region: 'Rift Valley', industries: 'Tourism, Livestock', generators: '800+', responseTime: '4 hours' },
  { name: 'West Pokot', region: 'Rift Valley', industries: 'Livestock, Agriculture', generators: '1,000+', responseTime: '4 hours' },
  { name: 'Turkana', region: 'Rift Valley', industries: 'Oil, Fishing, Livestock', generators: '2,000+', responseTime: '6 hours' },
  { name: 'Marsabit', region: 'Eastern', industries: 'Livestock, Trade', generators: '1,200+', responseTime: '6 hours' },
  { name: 'Isiolo', region: 'Eastern', industries: 'LAPSSET, Livestock, Trade', generators: '1,500+', responseTime: '4 hours' },
  { name: 'Mandera', region: 'North Eastern', industries: 'Trade, Livestock', generators: '1,500+', responseTime: '8 hours' },
  { name: 'Wajir', region: 'North Eastern', industries: 'Livestock, Trade', generators: '1,200+', responseTime: '8 hours' },
  { name: 'Garissa', region: 'North Eastern', industries: 'Livestock, Trade, Solar', generators: '2,000+', responseTime: '6 hours' },
  { name: 'Tana River', region: 'Coast', industries: 'Agriculture, Livestock', generators: '800+', responseTime: '5 hours' },
  { name: 'Lamu', region: 'Coast', industries: 'LAPSSET Port, Tourism, Fishing', generators: '1,500+', responseTime: '5 hours' },
];

// Generator Brands We Service
const generatorBrands = [
  { name: 'Cummins', origin: 'USA', powerRange: '7.5kVA - 3,500kVA', specialization: 'Industrial & Commercial' },
  { name: 'Caterpillar (CAT)', origin: 'USA', powerRange: '10kVA - 17,500kVA', specialization: 'Heavy Industrial & Mining' },
  { name: 'Perkins', origin: 'UK', powerRange: '7kVA - 2,500kVA', specialization: 'Commercial & Agricultural' },
  { name: 'FG Wilson', origin: 'UK', powerRange: '6.8kVA - 2,500kVA', specialization: 'Rental & Standby' },
  { name: 'Kohler', origin: 'USA', powerRange: '8kVA - 4,000kVA', specialization: 'Data Centers & Hospitals' },
  { name: 'MTU', origin: 'Germany', powerRange: '50kVA - 4,000kVA', specialization: 'Critical Infrastructure' },
  { name: 'Deutz', origin: 'Germany', powerRange: '10kVA - 500kVA', specialization: 'Agricultural & Construction' },
  { name: 'Volvo Penta', origin: 'Sweden', powerRange: '85kVA - 700kVA', specialization: 'Marine & Industrial' },
  { name: 'John Deere', origin: 'USA', powerRange: '30kVA - 500kVA', specialization: 'Agricultural & Commercial' },
  { name: 'Mitsubishi', origin: 'Japan', powerRange: '10kVA - 2,500kVA', specialization: 'Commercial & Industrial' },
  { name: 'Sdmo', origin: 'France', powerRange: '6kVA - 3,300kVA', specialization: 'Rental & Events' },
  { name: 'Aksa', origin: 'Turkey', powerRange: '9kVA - 2,500kVA', specialization: 'Cost-Effective Solutions' },
  { name: 'Kipor', origin: 'China', powerRange: '2kVA - 1,000kVA', specialization: 'Portable & Small Business' },
  { name: 'Himoinsa', origin: 'Spain', powerRange: '3kVA - 2,500kVA', specialization: 'Telecom & Construction' },
  { name: 'Atlas Copco', origin: 'Sweden', powerRange: '8kVA - 1,250kVA', specialization: 'Rental & Construction' },
  { name: 'Doosan', origin: 'South Korea', powerRange: '25kVA - 750kVA', specialization: 'Industrial & Marine' },
  { name: 'Yanmar', origin: 'Japan', powerRange: '5kVA - 500kVA', specialization: 'Compact & Marine' },
  { name: 'Lister Petter', origin: 'UK', powerRange: '5kVA - 150kVA', specialization: 'Agricultural & Remote' },
  { name: 'Lombardini', origin: 'Italy', powerRange: '3kVA - 100kVA', specialization: 'Small Commercial' },
  { name: 'Iveco', origin: 'Italy', powerRange: '30kVA - 700kVA', specialization: 'Commercial Vehicles' },
];

// Service Packages
const servicePackages = [
  {
    name: 'Basic Service',
    interval: 'Every 250 Hours',
    includes: ['Engine oil change', 'Oil filter replacement', 'Fuel filter inspection', 'Air filter inspection', 'Battery check', 'Coolant level check', 'Belt tension inspection', 'Visual inspection report'],
  },
  {
    name: 'Standard Service',
    interval: 'Every 500 Hours',
    includes: ['All Basic Service items', 'Fuel filter replacement', 'Air filter replacement', 'Coolant testing & top-up', 'Battery load testing', 'Fuel system bleeding', 'Injector inspection', 'Governor adjustment', 'Load bank testing (2 hours)', 'Detailed service report'],
  },
  {
    name: 'Major Service',
    interval: 'Every 1,000 Hours',
    includes: ['All Standard Service items', 'Coolant system flush', 'Valve clearance adjustment', 'Injector testing & calibration', 'Turbocharger inspection', 'Alternator testing', 'AVR inspection', 'Control panel diagnostics', 'Exhaust system inspection', 'Full load bank testing (4 hours)', 'Comprehensive report with photos'],
  },
  {
    name: 'Complete Overhaul',
    interval: 'Every 10,000+ Hours',
    includes: ['Complete engine disassembly', 'Crankshaft inspection/grinding', 'Cylinder liner replacement', 'Piston & ring replacement', 'Bearing replacement', 'Valve & seat reconditioning', 'Cylinder head overhaul', 'Turbocharger rebuild', 'Injector pump overhaul', 'Alternator rewinding', 'Control panel upgrade', 'Full load testing certification', '12-month warranty'],
  },
];

// Engine Overhaul Types
const overhaulTypes = [
  { name: 'Top-End Overhaul', description: 'Cylinder head, valves, gaskets, and upper engine components', duration: '3-5 days', warranty: '6 months', suitable: 'Generators with valve issues, head gasket failures, or compression loss' },
  { name: 'In-Frame Overhaul', description: 'Pistons, rings, liners, bearings without removing engine', duration: '5-7 days', warranty: '9 months', suitable: 'Generators with oil consumption, blow-by, or bearing noise' },
  { name: 'Complete Overhaul', description: 'Full engine rebuild including crankshaft, block, and all components', duration: '10-14 days', warranty: '12 months', suitable: 'High-hour generators, seized engines, or major failures' },
  { name: 'Exchange Program', description: 'Factory-rebuilt engine exchange for minimal downtime', duration: '1-2 days', warranty: '12 months', suitable: 'Critical operations requiring minimal downtime' },
];

// Common Issues with Detailed Information
const commonIssues = [
  {
    name: 'Generator not starting',
    causes: ['Dead or weak battery', 'Faulty starter motor', 'Fuel system blockage', 'Glow plug failure (diesel)', 'Control panel malfunction', 'Safety switch activation', 'Low oil level triggering shutdown'],
    repairs: ['Battery replacement or charging', 'Starter motor repair/replacement', 'Fuel system cleaning and bleeding', 'Glow plug replacement', 'Control panel diagnostics and repair', 'Safety switch reset or replacement', 'Oil top-up and sensor check'],
    consequences: 'Complete power outage during emergencies, potential damage to connected equipment from sudden shutdowns, loss of critical operations, spoilage of perishable goods, data loss in IT systems.',
    cascadingDamage: 'Repeated failed start attempts can drain battery completely, damage starter motor windings, flood engine with fuel causing hydrostatic lock, and damage flywheel ring gear teeth.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Low power output',
    causes: ['Clogged fuel filters', 'Worn injectors', 'Turbocharger issues', 'Air filter restriction', 'Governor malfunction', 'Compression loss', 'Alternator problems'],
    repairs: ['Fuel filter replacement', 'Injector cleaning or replacement', 'Turbocharger inspection and rebuild', 'Air filter replacement', 'Governor adjustment or replacement', 'Compression test and engine overhaul', 'Alternator testing and rewinding'],
    consequences: 'Unable to handle full load requirements, voltage drops affecting sensitive equipment, motor burnouts, compressor failures, production line stoppages.',
    cascadingDamage: 'Running under load with insufficient power causes extreme stress on alternator windings, overheating of engine components, accelerated wear on all moving parts, and potential complete engine failure.',
    urgency: 'HIGH'
  },
  {
    name: 'Engine overheating',
    causes: ['Low coolant level', 'Radiator blockage', 'Failed water pump', 'Thermostat stuck closed', 'Fan belt slippage', 'Head gasket failure', 'Blocked coolant passages'],
    repairs: ['Coolant system refill and pressure test', 'Radiator cleaning or replacement', 'Water pump replacement', 'Thermostat replacement', 'Belt tensioning or replacement', 'Head gasket replacement', 'Engine block flush'],
    consequences: 'Automatic shutdown causing power loss, warped cylinder head, cracked engine block, seized pistons, complete engine destruction.',
    cascadingDamage: 'Overheating causes metal expansion leading to piston seizure, head gasket blow-out, warped cylinder head requiring machining, cracked block (unrepairable), and destroyed turbocharger bearings.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Excessive fuel consumption',
    causes: ['Dirty injectors causing poor atomization', 'Air filter restriction', 'Incorrect injection timing', 'Worn piston rings causing blow-by', 'Engine running rich', 'Fuel leaks', 'Overloading'],
    repairs: ['Injector cleaning and calibration', 'Air filter replacement', 'Injection timing adjustment', 'Piston ring replacement', 'Fuel system adjustment', 'Leak repair', 'Load assessment and redistribution'],
    consequences: 'Dramatically increased operating costs, carbon buildup in engine, exhaust system damage, environmental violations, premature engine wear.',
    cascadingDamage: 'Rich fuel mixture washes oil from cylinder walls causing accelerated wear, carbon deposits damage valves and seats, unburnt fuel destroys catalytic converters, and dilutes engine oil.',
    urgency: 'MEDIUM'
  },
  {
    name: 'Black smoke emission',
    causes: ['Overloading', 'Restricted air intake', 'Faulty injectors', 'Incorrect injection timing', 'Turbocharger failure', 'Worn piston rings', 'EGR valve problems'],
    repairs: ['Load reduction', 'Air filter and intake cleaning', 'Injector replacement', 'Timing adjustment', 'Turbocharger rebuild', 'Engine overhaul', 'EGR valve cleaning/replacement'],
    consequences: 'Environmental violations and fines, carbon buildup in exhaust system, turbocharger damage, increased fuel costs, engine damage.',
    cascadingDamage: 'Excessive carbon clogs DPF filters (if equipped), destroys turbocharger seals and bearings, contaminates engine oil, blocks exhaust manifold, and can cause fire risk.',
    urgency: 'HIGH'
  },
  {
    name: 'White smoke emission',
    causes: ['Coolant entering combustion chamber', 'Head gasket failure', 'Cracked cylinder head', 'Cracked engine block', 'Injector timing too late', 'Cold engine operation'],
    repairs: ['Cooling system pressure test', 'Head gasket replacement', 'Cylinder head replacement or repair', 'Engine block replacement', 'Injection timing correction', 'Allow proper warm-up'],
    consequences: 'Coolant loss leading to overheating, engine oil contamination, bearing damage, complete engine failure.',
    cascadingDamage: 'Coolant in oil destroys bearing surfaces within hours, causes piston seizure, corrodes internal engine components, and contaminates lubrication system permanently.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Blue smoke emission',
    causes: ['Worn piston rings', 'Worn valve stem seals', 'Turbocharger seal failure', 'Overfilled oil level', 'PCV system malfunction', 'Worn cylinder walls'],
    repairs: ['Piston ring replacement', 'Valve stem seal replacement', 'Turbocharger rebuild or replacement', 'Oil level correction', 'PCV valve replacement', 'Cylinder honing or liner replacement'],
    consequences: 'Rapid oil consumption, spark plug fouling (petrol), catalytic converter damage, environmental issues, engine damage.',
    cascadingDamage: 'Oil burning fouls combustion chamber, destroys oxygen sensors, clogs DPF/catalytic converters, causes carbon buildup on valves, and accelerates wear of remaining seals.',
    urgency: 'HIGH'
  },
  {
    name: 'Oil leaks',
    causes: ['Worn gaskets and seals', 'Crankshaft seal failure', 'Valve cover gasket deterioration', 'Oil pan gasket failure', 'Loose drain plug', 'Cracked oil cooler', 'Over-pressurized crankcase'],
    repairs: ['Gasket replacement', 'Crankshaft seal replacement', 'Valve cover gasket replacement', 'Oil pan gasket replacement', 'Drain plug replacement', 'Oil cooler repair', 'PCV system repair'],
    consequences: 'Low oil level causing bearing failure, fire hazard, environmental contamination, slip hazard, equipment damage.',
    cascadingDamage: 'Oil starvation destroys bearings within minutes, causes piston seizure, crankshaft damage, connecting rod failure, and catastrophic engine destruction.',
    urgency: 'HIGH'
  },
  {
    name: 'Coolant leaks',
    causes: ['Radiator corrosion', 'Hose deterioration', 'Water pump seal failure', 'Head gasket failure', 'Freeze plug corrosion', 'Thermostat housing crack', 'Heat exchanger damage'],
    repairs: ['Radiator repair or replacement', 'Hose replacement', 'Water pump replacement', 'Head gasket replacement', 'Freeze plug replacement', 'Housing replacement', 'Heat exchanger repair'],
    consequences: 'Engine overheating, automatic shutdown, warped cylinder head, engine seizure, complete power loss.',
    cascadingDamage: 'Coolant loss leads to overheating within minutes, causing head gasket failure, warped head, cracked block, bearing failure from oil breakdown at high temps.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Fuel leaks',
    causes: ['Deteriorated fuel lines', 'Loose fittings', 'Cracked fuel tank', 'Injector seal failure', 'Fuel pump leak', 'Filter housing cracks', 'Return line damage'],
    repairs: ['Fuel line replacement', 'Fitting tightening or replacement', 'Fuel tank repair/replacement', 'Injector seal replacement', 'Fuel pump repair', 'Filter housing replacement', 'Return line replacement'],
    consequences: 'Fire and explosion hazard, fuel wastage, environmental contamination, engine performance issues, regulatory violations.',
    cascadingDamage: 'Fuel leaking on hot engine components causes fire, diesel on rubber components causes deterioration, fuel dilutes engine oil, and contaminates surrounding equipment.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Battery not charging',
    causes: ['Failed charging alternator', 'Broken or loose belt', 'Faulty voltage regulator', 'Bad battery connections', 'Defective battery', 'Wiring issues', 'Failed rectifier'],
    repairs: ['Charging alternator repair/replacement', 'Belt replacement and tensioning', 'Voltage regulator replacement', 'Connection cleaning and tightening', 'Battery replacement', 'Wiring repair', 'Rectifier replacement'],
    consequences: 'Battery depletion leading to starting failure, control panel malfunction, protection system failure, data loss.',
    cascadingDamage: 'Depleted battery causes control panel reset losing settings, damages battery cells from deep discharge, may cause generator to run unprotected risking equipment damage.',
    urgency: 'HIGH'
  },
  {
    name: 'Alternator failure',
    causes: ['Bearing failure', 'Winding burnout', 'Diode failure', 'AVR damage', 'Overloading', 'Insulation breakdown', 'Rotor damage'],
    repairs: ['Bearing replacement', 'Stator rewinding', 'Diode pack replacement', 'AVR replacement', 'Load assessment', 'Insulation varnishing', 'Rotor repair or replacement'],
    consequences: 'Complete loss of electrical output, no power generation despite engine running, equipment damage from unstable power.',
    cascadingDamage: 'Shorted windings can damage AVR, cause fire, destroy connected equipment, and if bearing seizes, can damage rotor and stator requiring complete alternator replacement.',
    urgency: 'CRITICAL'
  },
  {
    name: 'AVR failure',
    causes: ['Power surge', 'Age deterioration', 'Moisture ingress', 'Overloading', 'Manufacturing defect', 'Poor ventilation', 'Incorrect adjustment'],
    repairs: ['AVR replacement', 'System inspection for root cause', 'Waterproofing improvement', 'Load balancing', 'Quality AVR installation', 'Ventilation improvement', 'Professional calibration'],
    consequences: 'Unstable voltage output damaging sensitive equipment, overvoltage destroying electronics, undervoltage causing motor burnout.',
    cascadingDamage: 'Failed AVR can cause overvoltage destroying all connected equipment, burn alternator windings, damage control panel electronics, and cause fire.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Control panel faults',
    causes: ['Component failure', 'Wiring issues', 'Software glitches', 'Moisture damage', 'Voltage spikes', 'Age deterioration', 'Vibration damage'],
    repairs: ['Component replacement', 'Wiring repair', 'Software update or reset', 'Panel drying and sealing', 'Surge protection installation', 'Panel upgrade', 'Mount improvement'],
    consequences: 'Loss of automatic operation, protection systems disabled, no monitoring capability, manual operation only.',
    cascadingDamage: 'Failed panel means no protection - engine can overheat, over-speed, or run without oil leading to catastrophic failure. No fault codes means hidden problems go undetected.',
    urgency: 'HIGH'
  },
  {
    name: 'Voltage fluctuations',
    causes: ['AVR issues', 'Speed governor problems', 'Alternator winding issues', 'Loose connections', 'Load imbalances', 'Fuel supply issues', 'Engine hunting'],
    repairs: ['AVR adjustment or replacement', 'Governor calibration', 'Alternator inspection', 'Connection tightening', 'Load balancing', 'Fuel system service', 'Engine tuning'],
    consequences: 'Damage to sensitive electronics, motor overheating, lighting flickering, equipment malfunction, data corruption.',
    cascadingDamage: 'Voltage spikes destroy electronics instantly, low voltage burns motor windings, fluctuations damage power supplies, UPS systems, and can cause fire in electrical equipment.',
    urgency: 'HIGH'
  },
  {
    name: 'Frequency instability',
    causes: ['Governor malfunction', 'Fuel delivery issues', 'Engine mechanical problems', 'Actuator failure', 'Speed sensor problems', 'Control module issues', 'Load variations'],
    repairs: ['Governor repair or replacement', 'Fuel system service', 'Engine repair', 'Actuator replacement', 'Speed sensor replacement', 'Control module repair', 'Load management'],
    consequences: 'Motor speed variations, clock errors, equipment malfunction, synchronization failures, power quality issues.',
    cascadingDamage: 'Frequency variations damage motor bearings, cause overheating, affect electronic timing circuits, can prevent synchronization with grid or other generators.',
    urgency: 'HIGH'
  },
  {
    name: 'Engine knocking',
    causes: ['Worn bearings', 'Piston slap', 'Incorrect injection timing', 'Carbon buildup', 'Low oil pressure', 'Worn piston pins', 'Detonation'],
    repairs: ['Bearing replacement', 'Piston replacement', 'Timing adjustment', 'Carbon cleaning', 'Oil system repair', 'Piston pin replacement', 'Fuel system adjustment'],
    consequences: 'Rapid bearing wear, connecting rod failure, piston damage, crankshaft damage, catastrophic engine failure.',
    cascadingDamage: 'Knocking rapidly destroys bearings, leads to connecting rod breakage which can punch through engine block, destroy crankshaft, and turn repairable issue into total engine loss.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Turbocharger failure',
    causes: ['Oil starvation', 'Foreign object damage', 'Bearing wear', 'Seal failure', 'Excessive exhaust temperatures', 'Shaft damage', 'Compressor wheel damage'],
    repairs: ['Turbo rebuild or replacement', 'Oil system inspection', 'Intake system inspection', 'Bearing replacement', 'Seal kit installation', 'Shaft replacement', 'Complete turbo replacement'],
    consequences: 'Severe power loss, black smoke, oil consumption, potential engine damage from debris.',
    cascadingDamage: 'Failed turbo can send metal fragments into engine destroying cylinders, oil from failed seals fouls exhaust system, and running without boost overstresses engine components.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Injector problems',
    causes: ['Nozzle wear', 'Carbon deposits', 'Contaminated fuel', 'Spring fatigue', 'Needle seizure', 'O-ring failure', 'Electrical failure (common rail)'],
    repairs: ['Injector cleaning', 'Nozzle replacement', 'Fuel system cleaning', 'Spring replacement', 'Complete injector replacement', 'O-ring replacement', 'Electrical repair'],
    consequences: 'Poor combustion, power loss, excessive smoke, fuel dilution of oil, rough running, increased emissions.',
    cascadingDamage: 'Leaking injector washes cylinder walls causing rapid wear, dilutes oil destroying bearings, causes piston seizure, and can hydrolock engine if severe.',
    urgency: 'HIGH'
  },
  {
    name: 'Governor issues',
    causes: ['Actuator failure', 'Linkage wear', 'Electronic control failure', 'Speed sensor problems', 'Fuel rack sticking', 'Spring fatigue', 'Contamination'],
    repairs: ['Actuator replacement', 'Linkage adjustment or replacement', 'Control unit replacement', 'Sensor replacement', 'Fuel rack cleaning', 'Spring replacement', 'Governor overhaul'],
    consequences: 'Speed hunting, inability to maintain frequency, over-speed risk, under-speed shutdowns.',
    cascadingDamage: 'Over-speed can cause catastrophic engine destruction, throw connecting rods, destroy alternator from over-frequency, and endanger personnel.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Starter motor failure',
    causes: ['Solenoid failure', 'Brush wear', 'Armature damage', 'Bendix gear failure', 'Ring gear damage', 'Wiring issues', 'Bearing failure'],
    repairs: ['Solenoid replacement', 'Brush replacement', 'Armature repair', 'Bendix replacement', 'Ring gear replacement', 'Wiring repair', 'Bearing replacement'],
    consequences: 'Unable to start generator, complete reliance on manual starting (if possible), power unavailability during emergencies.',
    cascadingDamage: 'Grinding starter damages ring gear teeth making future starting impossible, seized starter can drain battery completely, damaged bendix can jam against flywheel.',
    urgency: 'HIGH'
  },
  {
    name: 'Glow plug failure',
    causes: ['Age deterioration', 'Overheating', 'Incorrect voltage', 'Carbon buildup', 'Controller failure', 'Relay failure', 'Wiring issues'],
    repairs: ['Glow plug replacement', 'System inspection', 'Voltage regulation check', 'Carbon cleaning', 'Controller replacement', 'Relay replacement', 'Wiring repair'],
    consequences: 'Hard starting in cold weather, excessive cranking damaging starter, white smoke on startup, rough initial running.',
    cascadingDamage: 'Extended cranking drains battery, damages starter motor, incomplete combustion fouls injectors, and causes excessive engine wear during cold starts.',
    urgency: 'MEDIUM'
  },
  {
    name: 'Fuel pump failure',
    causes: ['Wear from contaminated fuel', 'Seal deterioration', 'Plunger wear', 'Governor section failure', 'Timing mechanism wear', 'Drive coupling failure'],
    repairs: ['Fuel pump overhaul', 'Seal replacement', 'Plunger replacement', 'Governor repair', 'Timing adjustment', 'Coupling replacement', 'Complete pump replacement'],
    consequences: 'No fuel delivery - engine won\'t run, insufficient fuel causing power loss, erratic operation.',
    cascadingDamage: 'Running with failing pump causes injector damage, air in system damages pump further, metal particles contaminate entire fuel system.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Water in fuel',
    causes: ['Condensation in tank', 'Contaminated fuel delivery', 'Tank vent issues', 'Storage tank problems', 'Seal failures', 'Poor fuel handling'],
    repairs: ['Fuel tank draining and cleaning', 'Water separator service', 'Filter replacement', 'Tank vent repair', 'Seal replacement', 'Fuel system purging'],
    consequences: 'Injector damage, poor combustion, corrosion of fuel system components, engine damage.',
    cascadingDamage: 'Water causes immediate injector tip erosion, corrodes injection pump internals, promotes bacterial growth clogging filters, and can cause hydraulic lock destroying engine.',
    urgency: 'HIGH'
  },
  {
    name: 'Clogged filters',
    causes: ['Normal accumulation', 'Contaminated fuel/oil/air', 'Extended service intervals', 'Poor quality consumables', 'Environmental conditions', 'Tank corrosion'],
    repairs: ['Filter replacement', 'System cleaning', 'Tank inspection and cleaning', 'Quality consumable sourcing', 'Service interval adjustment', 'Environmental protection'],
    consequences: 'Restricted flow causing starvation, power loss, overheating, accelerated component wear.',
    cascadingDamage: 'Clogged fuel filter starves engine causing power loss and injector damage, clogged oil filter causes bearing failure, clogged air filter causes rich running and turbo damage.',
    urgency: 'MEDIUM'
  },
  {
    name: 'Belt failures',
    causes: ['Age and wear', 'Misalignment', 'Incorrect tension', 'Pulley damage', 'Oil contamination', 'Overloading', 'Environmental damage'],
    repairs: ['Belt replacement', 'Pulley alignment', 'Tension adjustment', 'Pulley replacement', 'Oil leak repair', 'Load assessment', 'Belt guard installation'],
    consequences: 'Loss of cooling causing overheating, loss of charging causing battery drain, loss of accessories.',
    cascadingDamage: 'Broken belt causes immediate overheating (minutes to damage), battery drain leaves generator unable to restart, and debris can damage other components.',
    urgency: 'HIGH'
  },
  {
    name: 'Radiator blockage',
    causes: ['Scale buildup', 'Corrosion debris', 'External contamination', 'Silicate dropout', 'Oil contamination', 'Improper coolant', 'Age deterioration'],
    repairs: ['Radiator flush', 'Chemical cleaning', 'External cleaning', 'Coolant system service', 'Oil leak repair', 'Coolant replacement', 'Radiator replacement'],
    consequences: 'Reduced cooling efficiency, engine overheating, automatic shutdown, potential engine damage.',
    cascadingDamage: 'Restricted cooling causes progressive overheating, head gasket failure, warped cylinder head, cracked block - turning a cleaning job into major overhaul.',
    urgency: 'HIGH'
  },
  {
    name: 'Thermostat failure',
    causes: ['Age deterioration', 'Corrosion', 'Contamination', 'Thermal fatigue', 'Incorrect installation', 'Wrong temperature rating'],
    repairs: ['Thermostat replacement', 'Cooling system flush', 'Proper installation verification', 'Correct rating selection'],
    consequences: 'Stuck open: engine runs cold, poor efficiency, wear. Stuck closed: rapid overheating, engine damage.',
    cascadingDamage: 'Stuck closed causes overheating within minutes - head gasket failure, warped head. Stuck open causes constant cold running - fuel dilution, excessive wear, carbon buildup.',
    urgency: 'HIGH'
  },
  {
    name: 'Head gasket failure',
    causes: ['Overheating history', 'Age deterioration', 'Improper installation', 'Incorrect torque', 'Warped surfaces', 'Detonation damage', 'Coolant chemistry'],
    repairs: ['Head gasket replacement', 'Cylinder head resurfacing', 'Block deck inspection', 'Proper torque application', 'Cooling system repair', 'Complete top-end overhaul'],
    consequences: 'Coolant-oil mixing destroying bearings, compression loss, overheating, white smoke, engine failure.',
    cascadingDamage: 'Coolant in oil destroys bearings within hours of operation, compression gases in coolant cause overheating, oil in coolant blocks passages - rapid cascade to total engine failure.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Crankshaft damage',
    causes: ['Bearing failure', 'Oil starvation', 'Over-revving', 'Fatigue cracking', 'Improper machining', 'Hydraulic lock', 'Manufacturing defect'],
    repairs: ['Crankshaft grinding and polishing', 'Bearing replacement with undersize', 'Crankshaft replacement', 'Complete engine overhaul', 'Oil system repair'],
    consequences: 'Bearing noise, oil pressure loss, vibration, catastrophic failure with connecting rod through block.',
    cascadingDamage: 'Worn crankshaft destroys new bearings quickly, vibration damages all engine components, sudden failure throws connecting rods destroying entire engine.',
    urgency: 'CRITICAL'
  },
  {
    name: 'Piston ring wear',
    causes: ['Normal wear', 'Contaminated oil', 'Overheating', 'Poor combustion', 'Abrasive particles', 'Fuel dilution', 'Improper break-in'],
    repairs: ['Piston ring replacement', 'Cylinder honing', 'Piston replacement', 'Liner replacement', 'Oil system service', 'Complete overhaul'],
    consequences: 'Oil consumption, blow-by, power loss, blue smoke, compression loss, increased emissions.',
    cascadingDamage: 'Worn rings cause blow-by contaminating oil, increasing wear rate. Oil burning fouls valves, turbo, exhaust. Compression loss increases fuel consumption and wear.',
    urgency: 'HIGH'
  },
  {
    name: 'Bearing failure',
    causes: ['Oil starvation', 'Contaminated oil', 'Overloading', 'Age wear', 'Incorrect clearances', 'Misalignment', 'Fatigue'],
    repairs: ['Bearing replacement', 'Shaft inspection/grinding', 'Oil system repair', 'Clearance checking', 'Alignment correction', 'Complete overhaul'],
    consequences: 'Knocking noise, oil pressure loss, vibration, seizure, catastrophic engine failure.',
    cascadingDamage: 'Failing bearing generates metal particles destroying all other bearings, contaminates oil system, can cause crankshaft seizure and connecting rod failure within minutes.',
    urgency: 'CRITICAL'
  },
];

// Issues List Component with expandable details
function IssuesList({ issues }: { issues: typeof commonIssues }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {issues.map((issue, i) => (
        <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          {/* Issue Header */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(issue.urgency)}`}>
                {issue.urgency}
              </span>
              <h3 className="font-semibold text-white">{issue.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-400 text-sm font-medium">Learn More</span>
              <svg 
                className={`w-5 h-5 text-orange-400 transition-transform ${expandedIndex === i ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedIndex === i && (
            <div className="border-t border-gray-800 p-6 bg-black/30">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Causes */}
                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-red-400 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Possible Causes
                  </h4>
                  <ul className="space-y-2">
                    {issue.causes.map((cause, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-red-400 mt-1">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Repairs Needed */}
                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-green-400 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Repairs Needed
                  </h4>
                  <ul className="space-y-2">
                    {issue.repairs.map((repair, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-400 mt-1">✓</span>
                        {repair}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consequences if Not Fixed */}
                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl p-5 border border-orange-500/30">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-orange-400 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    Damage If Not Fixed
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{issue.consequences}</p>
                </div>

                {/* Cascading Damage */}
                <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 rounded-xl p-5 border border-red-500/30">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-red-400 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What It Keeps Destroying
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{issue.cascadingDamage}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+254768860665" 
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Fix This Issue: 0768 860 655
                </a>
                <a 
                  href="#service-request" 
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  Request Service Quote
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function GeneratorMaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-orange-300 text-sm font-medium">24/7 Emergency Service Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-orange-500">Generator Maintenance</span>
            <br />& Engine Overhaul Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Kenya&apos;s most comprehensive generator maintenance network. Expert technicians serving all 47 counties with preventive maintenance, emergency repairs, and complete engine overhauls for every brand.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+254768860665" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Emergency: 0768 860 655
            </a>
            <a href="#service-request" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all">
              Request Service Quote
            </a>
          </div>
          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: '47', label: 'Counties Covered' },
              { value: '20+', label: 'Brands Serviced' },
              { value: '15,000+', label: 'Generators Maintained' },
              { value: '98%', label: 'First-Time Fix Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Generator Service Packages</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive maintenance programs designed to maximize generator lifespan and reliability. All packages include genuine parts and certified technicians.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePackages.map((pkg, i) => (
              <div key={i} className={`rounded-2xl p-6 border ${i === 3 ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/10 border-orange-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-sm text-orange-400 font-medium mb-1">Call for Quote</div>
                <div className="text-sm text-gray-400 mb-4">{pkg.interval}</div>
                <ul className="space-y-2">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="tel:+254768860665" className="mt-6 block w-full py-3 text-center bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors">
                  Book Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine Overhaul Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Engine Overhaul Services</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Complete engine rebuild and overhaul services to restore your generator to factory performance. Expert machinists and genuine OEM parts.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {overhaulTypes.map((overhaul, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800">
                <h3 className="text-2xl font-bold text-orange-500 mb-3">{overhaul.name}</h3>
                <p className="text-gray-300 mb-4">{overhaul.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase">Duration</div>
                    <div className="text-white font-semibold">{overhaul.duration}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase">Warranty</div>
                    <div className="text-white font-semibold">{overhaul.warranty}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <strong className="text-gray-300">Best for:</strong> {overhaul.suitable}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands We Service */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Generator Brands We Service</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Factory-trained technicians for all major generator brands. Genuine parts and manufacturer-approved service procedures.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {generatorBrands.map((brand, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-orange-500/30 transition-colors">
                <h3 className="font-bold text-white text-lg">{brand.name}</h3>
                <div className="text-xs text-orange-400 mb-2">{brand.origin}</div>
                <div className="text-sm text-gray-400">
                  <div><span className="text-gray-500">Range:</span> {brand.powerRange}</div>
                  <div><span className="text-gray-500">Focus:</span> {brand.specialization}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All 47 Counties Coverage */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Generator Service in All 47 Counties</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            No matter where you are in Kenya, our mobile service teams reach you. Dedicated technicians stationed across all regions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {counties.map((county, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900/80 to-gray-950 rounded-xl p-5 border border-gray-800 hover:border-orange-500/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">{county.name}</h3>
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full">{county.region}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Key Industries:</span>
                    <span className="text-gray-300 text-right text-xs max-w-[60%]">{county.industries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. Generators:</span>
                    <span className="text-orange-400">{county.generators}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="text-green-400">{county.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues We Fix */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Common Generator Issues We Fix</h2>
          <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Click &quot;Learn More&quot; on any issue to see detailed causes, repairs needed, and what damage can occur if not fixed urgently.
          </p>
          <IssuesList issues={commonIssues} />
        </div>
      </section>

      {/* Service Request Form */}
      <section id="service-request" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Request Generator Service</h2>
          <p className="text-gray-400 text-center mb-12">
            Fill out the form below and our team will contact you within 2 hours.
          </p>
          <form className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                <input type="tel" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white" placeholder="0712 345 678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">County *</label>
                <select className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white">
                  <option value="">Select County</option>
                  {counties.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generator Brand *</label>
                <select className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white">
                  <option value="">Select Brand</option>
                  {generatorBrands.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generator Capacity (kVA)</label>
                <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white" placeholder="e.g., 500 kVA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Type *</label>
                <select className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white">
                  <option value="">Select Service</option>
                  <option value="emergency">Emergency Repair</option>
                  <option value="maintenance">Scheduled Maintenance</option>
                  <option value="overhaul">Engine Overhaul</option>
                  <option value="diagnosis">Diagnostic Inspection</option>
                  <option value="installation">New Installation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
                <select className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white">
                  <option value="normal">Normal (Within 48 hours)</option>
                  <option value="urgent">Urgent (Within 24 hours)</option>
                  <option value="emergency">Emergency (ASAP)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Describe the Issue</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white" placeholder="Please describe the generator issue or service needed..." />
            </div>
            <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-lg">
              Submit Service Request
            </button>
          </form>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Need Emergency Generator Service?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Our 24/7 emergency response team is ready. Average response time: 45 minutes in Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254768860665" className="px-8 py-4 bg-white text-orange-600 font-bold rounded-lg text-lg hover:bg-gray-100 transition-colors">
              📞 Call: 0768 860 655
            </a>
            <a href="tel:+254782914717" className="px-8 py-4 bg-black/20 text-white font-bold rounded-lg text-lg hover:bg-black/30 transition-colors">
              📞 Alt: 0782914717
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">About EmersonEIMS Generator Maintenance Services</h2>
          <div className="prose prose-invert prose-orange max-w-none text-gray-400 space-y-4">
            <p>
              EmersonEIMS is Kenya&apos;s leading provider of generator maintenance, repair, and engine overhaul services. With certified technicians stationed across all 47 counties, we deliver professional generator servicing for residential, commercial, and industrial applications.
            </p>
            <p>
              Our comprehensive maintenance programs cover all major generator brands including Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU, Deutz, Volvo Penta, John Deere, Mitsubishi, Sdmo, Aksa, Kipor, Himoinsa, Atlas Copco, Doosan, Yanmar, Lister Petter, Lombardini, and Iveco generators.
            </p>
            <p>
              Whether you need preventive maintenance to extend generator life, emergency repairs to restore power quickly, or complete engine overhauls to bring high-hour generators back to peak performance, EmersonEIMS has the expertise, genuine parts, and commitment to quality that Kenya&apos;s businesses trust.
            </p>
            <h3 className="text-white text-xl font-bold mt-6">Why Choose EmersonEIMS for Generator Maintenance?</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Factory-trained and certified technicians</li>
              <li>Genuine OEM parts for all brands</li>
              <li>24/7 emergency response nationwide</li>
              <li>Comprehensive service documentation</li>
              <li>Transparent pricing with no hidden costs</li>
              <li>Extended warranties on all overhaul work</li>
              <li>Mobile workshops for on-site service</li>
              <li>Load bank testing capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Generator Maintenance & Engine Overhaul Services",
            "provider": {
              "@type": "Organization",
              "name": "EmersonEIMS",
              "telephone": "+254768860665",
              "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" }
            },
            "areaServed": counties.map(c => ({ "@type": "State", "name": c.name + " County, Kenya" })),
            "serviceType": ["Generator Maintenance", "Generator Repair", "Engine Overhaul", "Generator Servicing"],
            "description": "Professional generator maintenance and engine overhaul services across all 47 Kenya counties."
          })
        }}
      />
    </div>
  );
}



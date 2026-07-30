import type { RepairArticle } from '../types';

export const dieselValveTrainAndClearances: RepairArticle = {
  slug: 'diesel-valve-train-and-clearances',
  hub: 'engine-systems',
  header: {
    title: 'Valve Train and Clearances — Reading Wear Before It Becomes Damage',
    equipmentCategory: 'Diesel engine',
    appliesTo:
      'Diesel generating set engines with mechanical or hydraulic valve actuation, overhead camshaft and pushrod designs, naturally aspirated and turbocharged',
    difficulty: 'advanced',
    diagnosisComplexity:
      'The measurement is simple and the interpretation is not — a clearance out of specification is a symptom, and the wear pattern behind it is the diagnosis',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Not applicable — mechanical system; generator output 415 V three-phase 50 Hz nominal',
    safetyClass: 'rotating-machinery',
  },

  directAnswer:
    'Valve clearance is the designed gap that allows for thermal expansion and guarantees the valve closes fully onto its seat. Too little and the valve is held off its seat as the engine reaches temperature, losing compression and losing the seat cooling that the valve depends on — which burns valves. Too much and the valve opens late, closes early and is hammered by the train, which accelerates wear and produces the characteristic tapping. Both directions cause damage, so the clearance is not a tolerance to be approximated. Every figure — the clearance itself, whether it is set hot or cold, the crank position for each cylinder and the torque on the adjuster lock — belongs to the engine manufacturer for that specific engine, and using a remembered value from a similar engine is how valves get burned. The diagnostic value is not in the number but in the pattern: clearances that have closed up point at seat and valve face recession, clearances that have opened up point at wear in the train, and one cylinder differing from the rest points at a developing fault in that cylinder.',

  symptoms: {
    display: [
      'Set unable to reach rated output, with no air or fuel restriction found',
      'Exhaust temperature elevated on one cylinder where individual monitoring is fitted',
      'Engine ECU reporting misfire or cylinder balance deviation on electronic engines',
    ],
    indicators: [
      'Compression low on one or more cylinders where a test has been done',
      'Blow-by increased compared with the engine history',
      'Load acceptance poorer than it used to be',
    ],
    sounds: [
      'Regular light tapping from the valve cover area, rising and falling with speed — the excessive clearance signature',
      'A heavier, deeper knock that is not the light tap, which indicates something other than clearance and is a stop-now sound',
      'Uneven running or a misfire note at light load',
      'Hissing back through the intake, which suggests an inlet valve not seating',
      'Puffing at the exhaust in time with one cylinder, suggesting an exhaust valve not seating',
    ],
    smells: [
      'Burnt smell in the exhaust from a burning valve',
      'Fuel smell from a cylinder that is not firing properly',
    ],
    behaviour: [
      'Tapping present from cold and quieter when hot — clearance opening as components wear',
      'No tapping at all but power down and compression low — clearances closed up, which is the dangerous direction and is silent',
      'Gradual loss of power over months rather than a sudden failure',
      'Hard starting, particularly when hot',
      'Engine that has never had its clearances checked at the manufacturer interval',
      'Symptoms appearing after a top-end repair, suggesting incorrect adjustment or an assembly error',
    ],
    visible: [
      'Wear pattern on rocker pads, cam followers or pushrod ends',
      'Valve stem tip cupped or mushroomed',
      'Adjuster screw or lock nut showing thread damage or previously overtightened',
      'Valve stem seals hardened or missing',
      'Carbon build-up on valve heads and seats',
      'Valve recession into the seat, visible as the valve sitting lower than its neighbours',
      'Bent or bowed pushrods',
      'Oil starvation marks — scoring or discolouration on the camshaft, followers or rocker shaft',
    ],
  },

  whatItMeans: {
    plain:
      'Each cylinder has valves that must open to let air in and exhaust out, then close completely to seal. There is a deliberate small gap in the mechanism that opens them, because metal expands as the engine gets hot. If that gap is too small, the valve is held slightly open when hot — it cannot seal, and it also cannot shed its heat into the seat, so it overheats and eventually burns. If the gap is too big, the valve opens late and gets hammered, which wears the parts out faster and makes the tapping noise people notice. The tapping is the safer of the two problems. The silent one is the one that destroys valves.',
    technical:
      'Valve clearance accommodates differential thermal expansion between the valve, its train and the head, ensuring the valve returns fully to its seat across the operating temperature range. Seat contact performs two functions: it seals the combustion chamber, and it is the primary heat path out of the valve head, particularly for the exhaust valve which has no other significant cooling. Insufficient clearance holds the valve fractionally off its seat at temperature, simultaneously losing compression and removing that heat path, so the valve head runs progressively hotter until the face and seat erode — the classic burnt valve, which develops silently because there is no tapping to warn of it. Excessive clearance delays opening and advances closing, reducing effective valve timing and volumetric efficiency, and imposes impact loading on the train that accelerates wear at every interface. Diagnostically, the direction of drift is informative: clearances that reduce over time indicate valve and seat recession, as the valve sinks into the seat; clearances that increase indicate wear in the actuating train. A single cylinder deviating from an otherwise consistent set is a stronger signal than the absolute value of any one measurement.',
  },

  causes: {
    mostLikely: [
      'Clearances never checked or adjusted at the engine manufacturer interval',
      'Valve and seat recession from normal service, closing the clearance progressively',
      'Wear at rocker pads, cam followers, pushrod ends or the rocker shaft, opening the clearance',
      'Clearance set incorrectly at a previous service — wrong figure, wrong crank position, or set hot when the specification is cold',
    ],
    possible: [
      'Valve stem tip wear from long service or from a previously incorrect clearance',
      'Adjuster lock nut not torqued correctly, allowing the setting to drift',
      'Hydraulic lifter failure on engines fitted with them, giving a clearance fault where none should exist',
      'Carbon build-up on the seat preventing full closure',
      'Valve spring weakness or breakage allowing valve float at speed',
    ],
    lessCommon: [
      'Bent pushrod from a previous overspeed or an assembly error',
      'Camshaft lobe wear from oil starvation or from an incorrect oil specification',
      'Cylinder head distortion from a previous overheat, changing the geometry',
      'Valve guide wear allowing the valve to sit off-centre on its seat',
      'Wrong parts fitted at a previous repair — valves, seats or train components not to specification',
    ],
    modelSpecific: [
      'The clearance figures themselves, and whether they are specified hot or cold, are engine-specific and must be taken from the manufacturer service data for that exact engine — this is not a value to be remembered or borrowed',
      'The adjustment procedure, crank position for each cylinder and firing order are engine-specific',
      'Adjuster lock torque is specified by the manufacturer and matters, because an undertorqued lock lets the setting drift',
      'Adjustment interval is specified in hours or in years, whichever comes first',
      'Some engines use hydraulic lash adjusters and have no user-adjustable clearance at all',
    ],
    environmental: [
      'High operating temperature accelerating valve and seat recession',
      'Dusty intake conditions where filtration has failed, abrading valves and seats',
      'Poor fuel quality contributing to deposit build-up on valves and seats',
      'Sustained light-load running promoting deposits and incomplete combustion',
      'Sustained overload running raising exhaust valve temperature toward its limit',
    ],
    installation: [
      'Air filtration inadequate for the environment, so abrasive material reaches the valves',
      'Engine consistently run at a load fraction it was not intended for',
      'Cooling system under-specified, so the engine runs hotter than design',
      'Exhaust back pressure raising exhaust valve temperature',
    ],
    maintenance: [
      'Clearance adjustment interval ignored — the single most common cause on generating sets, because a set that starts and runs is assumed healthy',
      'Adjustment carried out without the manufacturer procedure, at the wrong crank position',
      'Feeler gauge technique poor, giving a reading that is not the actual clearance',
      'Oil change interval or specification not observed, wearing the train',
      'Records not kept, so drift between services is never seen',
    ],
    componentLevel: [
      'Valve face and seat recession',
      'Valve stem tip wear',
      'Rocker pad, follower and pushrod end wear',
      'Camshaft lobe wear',
      'Valve spring fatigue',
      'Hydraulic lifter failure where fitted',
    ],
  },

  safety: {
    isolation: [
      'Isolate the generator supply, disable and lock the auto-start, and isolate the starting battery before removing any valve cover.',
      'A set that can auto-start will crank with the valve cover off and your hands inside.',
      'Where the set feeds a changeover, isolate and lock that as well.',
    ],
    lockoutTagout: [
      'Disable and lock the auto-start and disconnect the starting battery — both, not either.',
      'Lock the generator output isolator and tag it.',
      'Tag the set as out of service so nobody attempts a test run.',
      'Agree the outage with whoever depends on the set before starting.',
    ],
    ppe: [
      'Eye protection whenever working around the valve train',
      'Heat-resistant gloves where clearances are specified hot and the engine has just run',
      'Hearing protection for any running checks',
      'Close-fitting clothing with no loose sleeves near belts, fans and couplings',
      'Nitrile gloves when handling hot oil',
    ],
    storedEnergy: [
      'Valve springs are under substantial compression. Never release a spring retainer without the correct compressor.',
      'The engine can be turned by the driven load or by residual compression; secure it before working.',
      'Starting batteries store very high short-circuit energy.',
      'Cooling and lubrication systems are hot and, in the case of coolant, pressurised.',
    ],
    specificHazards: [
      'Barring the engine over with hands in the valve train is how fingers get crushed. Use the correct barring tool and keep hands clear of the mechanism while turning.',
      'Where the manufacturer specifies clearances hot, the components are hot enough to cause serious burns and the procedure demands care rather than haste.',
      'Running an engine with the valve cover removed throws hot oil; only do so where the manufacturer procedure requires it and with proper shielding.',
      'A valve dropped into a cylinder during work destroys the engine on the next rotation.',
      'Incorrect clearance returned to service burns valves silently over subsequent hours of running.',
    ],
    stopAndCallProfessional: [
      'A heavy knock rather than a light tap — stop the engine now; that is not a clearance fault.',
      'Compression found low across multiple cylinders, indicating a top-end condition beyond adjustment.',
      'A bent pushrod, worn camshaft lobe or broken valve spring found — these require the head or train to be worked on properly.',
      'The engine manufacturer clearance figures and procedure cannot be obtained.',
      'The engine is under warranty.',
      'Any engine where valve recession has progressed to the point that adjustment can no longer bring the clearance into specification — that is a head overhaul.',
    ],
  },

  tools: [
    { tool: 'Feeler gauge set in good condition', why: 'The measurement itself; a bent, worn or dirty blade gives a false reading and false confidence' },
    { tool: 'Engine manufacturer service data', why: 'Clearance figures, hot or cold specification, crank positions, firing order and adjuster torque — every number in this job comes from here' },
    { tool: 'Correct barring tool for the engine', why: 'Turning the engine safely and precisely to each measurement position without hands in the mechanism' },
    { tool: 'Torque wrench suited to the adjuster lock torque', why: 'An undertorqued lock lets the setting drift straight back out; an overtightened one damages the thread' },
    { tool: 'Dial indicator', why: 'Confirming valve position and lift where the procedure requires it, and checking pushrod straightness' },
    { tool: 'Compression or cylinder leak-down test equipment', why: 'Distinguishes a clearance problem from a sealing problem, which the clearance measurement alone cannot' },
    { tool: 'Bore scope', why: 'Inspects valve and seat condition without removing the head' },
    { tool: 'Record sheet for every cylinder', why: 'The pattern across cylinders and across services is the diagnosis; a measurement not written down is a measurement wasted' },
  ],

  decisionTree: [
    {
      question: 'Is the noise a light regular tap, or a heavy knock?',
      yes: 'A light tap is consistent with excessive clearance — continue',
      no: 'A heavy knock is not a clearance fault. Stop the engine and work the abnormal noise guide.',
    },
    {
      question: 'Have clearances been measured against the manufacturer figure, hot or cold as specified?',
      yes: 'Compare the pattern across cylinders',
      no: 'Measure first. Adjusting to a remembered figure from another engine burns valves.',
    },
    {
      question: 'Have clearances closed up compared with the manufacturer figure?',
      yes: 'Valve and seat recession — the dangerous direction, and it is silent. Investigate seat condition.',
      no: 'Continue',
    },
    {
      question: 'Have clearances opened up?',
      yes: 'Wear in the actuating train — inspect rockers, followers, pushrod ends and cam lobes',
      no: 'Continue',
    },
    {
      question: 'Does one cylinder differ markedly from an otherwise consistent set?',
      yes: 'That cylinder has a developing fault — inspect it specifically rather than adjusting it to match',
      no: 'Uniform drift across all cylinders is normal service wear; adjust and record',
    },
    {
      question: 'After adjustment, is compression restored and power recovered?',
      yes: 'Clearance was the fault — record and set the next interval',
      no: 'Sealing is compromised beyond what adjustment can correct; a leak-down test will localise it',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Characterise the noise before removing anything',
      inspect: 'The character, location and speed-dependence of any mechanical noise',
      where: 'At the valve cover area, with the set running',
      instrument: 'Mechanic\'s stethoscope or sounding rod, and the ear',
      expected:
        'A light, regular tapping that follows engine speed is consistent with excessive clearance',
      ifAbnormal:
        'A heavy knock, a rhythmic thump, or a noise from the crankcase rather than the head is not a clearance fault and requires the engine stopped',
      next: 'Note whether the noise is present cold, hot, or both — clearance noise typically reduces as the engine warms',
      warning:
        'Hearing protection before the set runs. Do not remove a valve cover with the engine running unless the manufacturer procedure specifically calls for it.',
    },
    {
      step: 2,
      title: 'Obtain the manufacturer figures and procedure first',
      inspect: 'Clearance specification, whether hot or cold, crank positions, firing order and adjuster torque',
      where: 'Engine manufacturer service data for the exact engine',
      instrument: 'The service manual',
      expected: 'A complete, unambiguous specification for this engine',
      ifAbnormal:
        'Without the correct figures the job cannot be done. Inlet and exhaust clearances usually differ, and hot and cold specifications are different numbers for the same engine.',
      next: 'Confirm whether the engine uses hydraulic lash adjusters, in which case there is no clearance to set',
      verify:
        'This is the step that protects the engine. A clearance from a similar engine is not a substitute and is the direct route to burnt valves.',
    },
    {
      step: 3,
      title: 'Isolate the engine completely before opening it',
      inspect: 'That auto-start is disabled and locked and the starting battery is disconnected',
      where: 'Control panel and battery',
      instrument: 'Visual confirmation and a meter',
      expected: 'No possibility of the engine cranking',
      ifAbnormal: 'Any live start path means the engine must not be opened',
      next: 'Allow the engine to reach the temperature state the specification requires — cold means genuinely cold, not merely stopped',
      warning:
        'Disabling the panel is not enough. Disconnect the battery. A set that cranks with the valve cover off will take fingers.',
    },
    {
      step: 4,
      title: 'Measure every valve, on every cylinder, and write it down',
      inspect: 'Clearance at each valve with the engine at the specified crank position for that cylinder',
      where: 'Between the rocker pad and valve stem tip, or as the manufacturer procedure specifies',
      instrument: 'Feeler gauge, with the correct barring tool to reach each position',
      expected:
        'Clearances at the manufacturer figure, consistent across cylinders, with inlet and exhaust each to their own specification',
      ifAbnormal:
        'Record the actual figure for every valve before adjusting anything. The pattern across the engine is the diagnosis and it is destroyed the moment you start adjusting.',
      next: 'Use correct feeler gauge technique — a light drag, not forced and not loose; a poor technique gives a confident wrong answer',
      verify: 'Crank position for each cylinder comes from the manufacturer procedure and the firing order',
      warning:
        'Keep hands clear of the valve train while barring the engine. Use the barring tool, never the alternator or the belt.',
    },
    {
      step: 5,
      title: 'Read the pattern, not just the numbers',
      inspect: 'Whether clearances have closed up, opened up, or one cylinder differs from the rest',
      where: 'Your record sheet',
      instrument: 'Comparison against the specification and against previous service records',
      expected: 'A consistent, interpretable pattern',
      ifAbnormal:
        'Uniformly reduced clearances indicate valve and seat recession. Uniformly increased clearances indicate train wear. A single deviating cylinder indicates a fault developing in that cylinder specifically.',
      next:
        'A deviating cylinder must be investigated, not simply adjusted back into specification — adjustment hides the developing fault',
      verify:
        'Compare against previous service records where they exist; the rate of drift is more informative than any single reading',
    },
    {
      step: 6,
      title: 'Inspect the train while it is open',
      inspect: 'Rocker pads, followers, pushrod ends and straightness, valve stem tips, springs, and oil supply evidence',
      where: 'The exposed valve train',
      instrument: 'Visual with good light, dial indicator for pushrod straightness',
      expected: 'Even wear patterns, straight pushrods, intact springs, clean oil feed evidence',
      ifAbnormal:
        'Cupped valve stem tips, scored followers or worn rocker pads explain an opening clearance. Scoring or discolouration on the camshaft or rocker shaft indicates oil starvation, which is a separate and more serious problem.',
      next: 'Photograph anything abnormal before adjusting, since it will not be visible again until the next service',
    },
    {
      step: 7,
      title: 'Confirm sealing separately from clearance',
      inspect: 'Cylinder compression or leak-down, particularly on any cylinder that measured differently',
      where: 'Each cylinder',
      instrument: 'Compression tester or cylinder leak-down tester',
      expected: 'Consistent readings across cylinders, within the manufacturer expectation',
      ifAbnormal:
        'Low compression with correct clearance points at seat, valve, guide or ring condition. A leak-down test tells you where the loss is going — intake, exhaust or crankcase.',
      next:
        'A burnt valve will show as loss audible at the exhaust on a leak-down test, which distinguishes it from ring wear',
      verify: 'Expected compression and acceptable variation between cylinders come from the manufacturer data',
    },
    {
      step: 8,
      title: 'Adjust, torque, and verify after running',
      inspect: 'Clearances reset to specification, adjuster locks torqued, and clearances re-checked after a run',
      where: 'Each valve',
      instrument: 'Feeler gauge and torque wrench',
      expected:
        'Every clearance at specification, locks torqued to the manufacturer figure, and the setting holding after a heat cycle',
      ifAbnormal:
        'A clearance that has moved after running indicates an untorqued lock, a worn adjuster thread, or a component still moving',
      next:
        'Record every final figure, the date and the running hours, so the next service can measure the drift rather than start blind',
      warning:
        'Re-check after a run. A clearance that appears correct on the bench and drifts in service burns the valve just as effectively as one set wrongly.',
    },
  ],

  repair: [
    {
      level: 'mechanical',
      title: 'Clearance adjustment done correctly',
      steps: [
        'Work to the manufacturer procedure, at the specified crank position for each cylinder, in the specified sequence.',
        'Observe whether the specification is hot or cold and meet that condition genuinely — a "cold" engine means one that has stood, not one that stopped twenty minutes ago.',
        'Set inlet and exhaust to their own figures; they are usually different.',
        'Hold the adjuster while torquing the lock, and re-check the clearance after torquing — the act of locking frequently moves the setting.',
        'Torque adjuster locks to the manufacturer figure rather than by feel.',
        'Re-check all clearances after a heat cycle before returning the set to service.',
      ],
      note:
        'Most valve damage attributed to wear is in fact damage from a clearance set to the wrong figure or at the wrong crank position. The procedure is the repair.',
    },
    {
      level: 'component-replacement',
      title: 'Train components',
      steps: [
        'Replace worn rockers, followers and pushrods rather than adjusting around the wear; the wear continues.',
        'Replace bent pushrods and establish what bent them — an overspeed, an assembly error, or a seized valve.',
        'Replace weak or broken valve springs as a set for that cylinder, using the correct spring compressor.',
        'Replace hardened or missing valve stem seals while access is available.',
        'Replace hydraulic lash adjusters as units where fitted and failed; they are not field-serviceable.',
        'Where camshaft lobe wear is found, investigate oil supply and oil specification before fitting replacements.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'When the head must come off',
      steps: [
        'Valve or seat recession beyond the point where adjustment restores specification requires the head to be worked on.',
        'Burnt valves require valve and seat renewal, not adjustment.',
        'Confirm head condition and flatness after any overheat event before reassembly.',
        'Establish the cause — clearance, cooling, fuel, load profile or air restriction — or the reconditioned head follows the original.',
        'Follow the manufacturer head bolt torque sequence and any angle-tightening procedure exactly.',
      ],
      note:
        'A head overhaul that does not address why the valves burned is a repeat overhaul. The most common underlying cause on generating sets is a clearance that was never checked.',
    },
    {
      level: 'configuration',
      title: 'Correcting service and duty causes',
      steps: [
        'Set the clearance check interval from the manufacturer figure and hold to it, including on sets that appear to run perfectly.',
        'Correct air filtration where abrasive ingress is evident.',
        'Correct exhaust back pressure and cooling deficiencies that raise exhaust valve temperature.',
        'Address sustained light-load running, which promotes deposits on valves and seats.',
        'Keep a service record so clearance drift is visible between services rather than rediscovered each time.',
      ],
    },
  ],

  validation: [
    'Every valve clearance at the manufacturer specification, measured and recorded individually',
    'Adjuster locks torqued to the manufacturer figure',
    'Clearances re-checked after a heat cycle and holding',
    'Compression or leak-down consistent across cylinders and within the manufacturer expectation',
    'Valve train noise reduced to a normal running note',
    'Rated load accepted and held with normal exhaust temperature',
    'All measurements, the date and running hours recorded for comparison at the next service',
  ],

  whenNotToRepair: [
    'Burnt or recessed valves — these require head work, not adjustment, and adjusting them masks the condition',
    'Camshaft lobe wear, which indicates oil supply or specification problems requiring investigation before any parts are fitted',
    'Engines where compression is low across multiple cylinders, indicating general top-end or ring condition',
    'Any engine where the manufacturer clearance figures and procedure cannot be obtained',
    'Engines under warranty',
    'Engines where valve recession has consumed the available adjustment range — the head is due for overhaul',
  ],

  prevention: [
    'Check and adjust clearances at the manufacturer interval, including on sets that start and run perfectly — the dangerous direction of drift is silent',
    'Record every clearance at every service so drift is measured rather than guessed',
    'Keep air filtration correct for the environment; abrasive ingress attacks valves and seats directly',
    'Address exhaust back pressure and cooling deficiencies, both of which raise exhaust valve temperature',
    'Avoid sustained light-load running, and exercise standby sets under real load',
    'Observe the oil specification and change interval — the valve train depends entirely on it',
    'Keep the engine service data available on site so nobody has to work from memory',
  ],

  relatedSlugs: [
    'diesel-engine-abnormal-noise',
    'generator-excessive-smoke',
    'generator-air-restriction-turbocharger',
    'generator-low-oil-pressure-shutdown',
  ],

  faq: [
    {
      q: 'The engine is tapping. Is that dangerous?',
      a: 'Tapping usually means excessive clearance, which accelerates wear and reduces performance but is the less dangerous direction. The direction that destroys valves is the opposite one — clearances closing up — and it makes no noise at all. That is exactly why clearances are checked on interval rather than when something sounds wrong.',
    },
    {
      q: 'Can I use the clearance figure from a similar engine?',
      a: 'No. Clearances differ between engines, between inlet and exhaust on the same engine, and between hot and cold specifications for the same engine. Using a borrowed figure is one of the most direct ways to burn a valve. The number must come from the manufacturer service data for your exact engine.',
    },
    {
      q: 'Why does too little clearance burn valves?',
      a: 'The valve sheds most of its heat through contact with its seat. If the clearance is too small, thermal expansion holds the valve slightly off the seat when hot, so it loses both its seal and its cooling path. It then runs hotter, which erodes the face and seat further, which makes it worse. The process is progressive and silent.',
    },
    {
      q: 'One cylinder reads differently from the others. Should I just adjust it to match?',
      a: 'Not without investigating. A single cylinder deviating from an otherwise consistent set is telling you something is developing in that cylinder — recession, a worn component, or a seating problem. Adjusting it back into specification hides the signal without addressing it.',
    },
    {
      q: 'How often should clearances be checked on a standby generator?',
      a: 'At the manufacturer interval, which is usually stated in running hours or in calendar time, whichever comes first. The calendar figure matters on standby sets, because a set with very few running hours can still be years overdue. Sets that start and run perfectly are the ones most often left unchecked.',
    },
    {
      q: 'Do all engines need clearance adjustment?',
      a: 'No. Engines fitted with hydraulic lash adjusters maintain clearance automatically and have nothing to set. Check the engine manufacturer data before starting — attempting to adjust a hydraulic system, or assuming a mechanical one is self-adjusting, both cause damage.',
    },
  ],

  references: [
    'Engine manufacturer service manual — valve clearance figures for inlet and exhaust, hot or cold specification, adjustment procedure, crank positions, firing order and adjuster lock torque',
    'Engine manufacturer maintenance schedule — clearance check interval in running hours and calendar time',
    'Engine manufacturer data — expected compression values and permissible variation between cylinders',
    'Cylinder head overhaul specification, including valve and seat renewal limits and head bolt torque sequence',
    'ISO 8528 series — reciprocating internal combustion engine driven alternating current generating sets',
    'Site maintenance records, including previous clearance measurements and running hours',
  ],
};

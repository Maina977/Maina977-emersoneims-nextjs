/**
 * What each FMI (Failure Mode Identifier) means for a given SPN.
 *
 * WHY THIS EXISTS (2026-10-16). Search Console showed people searching the
 * full code — "spn 100 fmi 2" (233 impressions), "spn 100 fmi 1", "spn 94 fmi
 * 18 cummins" — while our SPN pages explained the SPN only and never said
 * what the FMI number means. An SPN names WHAT is measured; the FMI says HOW
 * it is wrong. SPN 190 is engine speed: FMI 0 is overspeed, FMI 18 is
 * underspeed. Without the FMI, the page cannot answer the question.
 *
 * SCOPE, on purpose: only the five SPN pages Google already shows most (100,
 * 190, 157, 94, 102 — owner decision). Each entry is written for its own
 * sensor; nothing here is a shared block pasted onto many pages. Check the
 * Search Console results in 4–6 weeks before extending it.
 *
 * FMI definitions follow SAE J1939-73 (0/1 = most severe, 16/18 = moderately
 * severe, 15/17 = least severe; 2 = erratic; 3/4 = signal voltage above/below
 * normal; 8 = abnormal frequency). The "first check" lines are standard
 * diagnostic practice, not figures.
 */

export interface FmiEntry {
  fmi: number;
  meaning: string;
  firstCheck: string;
}

export const FMI_BY_SPN: Record<string, { measures: string; entries: FmiEntry[]; note?: string }> = {
  'SPN-100': {
    measures: 'engine oil pressure',
    entries: [
      { fmi: 0, meaning: 'Oil pressure far above normal — usually a cold start, a stuck relief valve or a faulty sender, not a low-oil emergency.', firstCheck: 'Confirm with a mechanical gauge when warm; check the relief valve and the sender.' },
      { fmi: 1, meaning: 'Oil pressure far below normal (most severe). Most controllers treat this as a shutdown.', firstCheck: 'Stop the engine. Check the oil level, then confirm the real pressure with a mechanical gauge before any restart.' },
      { fmi: 18, meaning: 'Oil pressure below normal (moderately severe).', firstCheck: 'Oil level and grade, oil filter, and a mechanical gauge reading at idle and at rated speed.' },
      { fmi: 17, meaning: 'Oil pressure slightly below normal (least severe) — an early warning.', firstCheck: 'Oil level, filter condition and whether the last oil change used the correct viscosity.' },
      { fmi: 2, meaning: 'The pressure signal is erratic or does not make sense.', firstCheck: 'Sensor connector, harness chafing and the sensor ground.' },
      { fmi: 3, meaning: 'Sensor signal voltage above normal — usually an open circuit or a short to the supply.', firstCheck: 'Open signal or return wire, corroded connector pins, the 5 V sensor supply.' },
      { fmi: 4, meaning: 'Sensor signal voltage below normal — usually a short to ground.', firstCheck: 'A chafed wire touching the engine or chassis, or a failed sensor.' },
    ],
    note: 'FMI 2, 3 and 4 point at the sensor circuit rather than the oil system. Confirm the actual pressure with a mechanical gauge before replacing parts.',
  },
  'SPN-190': {
    measures: 'engine speed',
    entries: [
      { fmi: 0, meaning: 'Engine speed far above normal — overspeed (most severe). The controller shuts the engine down.', firstCheck: 'Governor and actuator, fuel control, and whether a large load was suddenly dropped. Do not restart until the cause is found.' },
      { fmi: 16, meaning: 'Engine speed above normal (moderately severe).', firstCheck: 'Governor settings, actuator response, behaviour on load rejection.' },
      { fmi: 1, meaning: 'Engine speed far below normal (most severe) — severe underspeed; the engine cannot hold its speed.', firstCheck: 'Load against the set rating, then fuel supply: filters, water separator, air in the fuel, lift pump and tank level.' },
      { fmi: 18, meaning: 'Engine speed below normal (moderately severe) — underspeed.', firstCheck: 'Overload, fuel supply restriction, governor response under load.' },
      { fmi: 2, meaning: 'The speed signal is erratic.', firstCheck: 'Magnetic pickup air gap, damaged flywheel teeth, a loose sensor, wiring.' },
      { fmi: 8, meaning: 'Abnormal frequency or pulse from the speed sensor.', firstCheck: 'Sensor air gap, interference from nearby power cables, sensor condition.' },
    ],
    note: 'FMI 2 and 8 usually mean the speed reading is wrong, not the engine speed itself. Check the pickup before the governor.',
  },
  'SPN-157': {
    measures: 'fuel injector metering rail pressure (common rail)',
    entries: [
      { fmi: 1, meaning: 'Rail pressure far below normal (most severe).', firstCheck: 'Fuel level, lift pump, blocked fuel filters, air in the fuel.' },
      { fmi: 18, meaning: 'Rail pressure below normal (moderately severe).', firstCheck: 'Fuel filters and water separator, high-pressure pump output, injector leak-off.' },
      { fmi: 16, meaning: 'Rail pressure above normal (moderately severe).', firstCheck: 'Rail pressure control valve and the pressure relief valve.' },
      { fmi: 2, meaning: 'The rail pressure reading jumps about or does not match engine behaviour.', firstCheck: 'The connector on the rail pressure sensor at the end of the common rail — fuel and heat there loosen and corrode it.' },
      { fmi: 3, meaning: 'The rail pressure sensor is reporting a voltage too high to be real — typically a broken wire or a short to the sensor supply.', firstCheck: 'The rail sensor harness where it runs close to the injector lines; it is often damaged when injectors or lines are refitted.' },
      { fmi: 4, meaning: 'The rail pressure sensor is reporting a voltage too low to be real — typically a short to ground.', firstCheck: 'Harness clips near the high-pressure pump and rail; a pinched wire grounding on the block is common after engine work.' },
    ],
  },
  'SPN-94': {
    measures: 'engine fuel delivery pressure (low-pressure side)',
    entries: [
      { fmi: 1, meaning: 'Fuel delivery pressure far below normal (most severe).', firstCheck: 'Fuel level, blocked filters, a failing lift pump, air leaks on the suction side.' },
      { fmi: 18, meaning: 'Fuel delivery pressure below normal (moderately severe).', firstCheck: 'Fuel filters and water separator, lift pump output, fuel line restrictions.' },
      { fmi: 2, meaning: 'The low-side fuel pressure reading is unstable — it swings while the engine runs steadily.', firstCheck: 'Air entering the suction side (loose filter bowl, cracked line) can cause this as well as a wiring fault; check both.' },
      { fmi: 3, meaning: 'The fuel delivery pressure sensor is reporting a voltage too high to be real — usually a broken wire.', firstCheck: 'The sensor connector at the fuel filter head; diesel spills during filter changes are the usual cause of corrosion here.' },
      { fmi: 4, meaning: 'The fuel delivery pressure sensor is reporting a voltage too low to be real — usually a short to ground.', firstCheck: 'The harness run past the filter housing and lift pump, where it can be crushed when filters are changed.' },
    ],
  },
  'SPN-102': {
    measures: 'intake manifold (boost) pressure',
    entries: [
      { fmi: 0, meaning: 'Boost pressure far above normal (most severe) — overboost.', firstCheck: 'Wastegate or turbo control, and the sensor reading against a gauge.' },
      { fmi: 16, meaning: 'Boost pressure above normal (moderately severe).', firstCheck: 'Wastegate operation and actuator.' },
      { fmi: 18, meaning: 'Boost pressure below normal (moderately severe) — low boost.', firstCheck: 'Air filter restriction, charge-air or intake leaks, the turbocharger, exhaust leaks before the turbo.' },
      { fmi: 2, meaning: 'The boost reading is unstable or does not rise with load.', firstCheck: 'Oil or soot fouling the sensing port on the intake manifold, and the sensor connector.' },
      { fmi: 3, meaning: 'The boost sensor on the intake manifold is reporting a voltage too high to be real — usually a broken wire.', firstCheck: 'On many engines this sensor also reads intake air temperature; check its connector and the wiring to the manifold.' },
      { fmi: 4, meaning: 'The boost sensor is reporting a voltage too low to be real — usually a short to ground.', firstCheck: 'Wiring near the hot turbo and exhaust side, where insulation hardens and cracks.' },
    ],
    note: 'SPN 102 covers both high and low boost; the FMI tells you which.',
  },
};

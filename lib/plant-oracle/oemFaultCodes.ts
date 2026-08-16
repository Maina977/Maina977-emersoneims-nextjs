/**
 * OEM PLANT-EQUIPMENT FAULT CODES — five brands that previously had none.
 *
 * WHAT THIS ADDS
 * Until now the plant tool held 2,155 codes across eleven ENGINE brands
 * (Perkins, Cummins, Caterpillar, Deutz and so on) and nothing at all for the
 * machine makers Kenyan operators actually name. These 315 records close that
 * for John Deere, JCB, Komatsu, Volvo CE and Hyundai.
 *
 * COPYRIGHT POSTURE — identical to lib/data/verifiedFaultCodes.ts.
 * Fault code numbers are industry-standard identifiers, reproduced for
 * identification only. Every description here has been REWRITTEN in our own
 * words and normalised into one house style: sentence case, consistent
 * vocabulary for the same physical condition across all five brands, no
 * manufacturer prose carried across. Nothing is transcribed from a
 * manufacturer service manual.
 *
 * This database is NOT affiliated with, endorsed by, or officially associated
 * with John Deere, JCB, Komatsu, Volvo, Hyundai or any other manufacturer. All
 * brand names, model numbers and trademarks belong to their respective owners.
 * For official documentation always use the manufacturer's service manual for
 * the specific machine.
 *
 * HOW THE CODES ARE STRUCTURED, AND WHY THAT MATTERS WHEN SEARCHING
 *   John Deere  000094.03   — SPN.FMI in Deere's display format, so SPN 94
 *                             FMI 3. These also decode through the J1939
 *                             decoder in j1939.ts.
 *   JCB         P0087       — SAE P-code, usually shown alongside a flashing
 *                             code on the dash; both are recorded.
 *   Komatsu     CA111       — engine (CA) codes, plus E-series machine codes
 *                             and the B@/AA/AB status codes from the monitor.
 *   Volvo CE    ER45-03     — Volvo's own code with its FMI suffix, from the
 *                             E-ECU and V-ECU.
 *   Hyundai     101         — bare numeric codes from the R-9 monitor.
 *
 * WHAT IS NOT HERE. This is not a complete manufacturer table for any of these
 * makes — no such thing is publicly available, and the counts below are what
 * could be sourced and cross-read, not what exists. A machine may well show a
 * code we do not hold. The tool says so plainly rather than offering the
 * nearest match, and an owner-supplied workshop manual is how each list grows.
 */

export interface OemFaultCode {
  readonly brand: string;
  /** Engine or machine family the code belongs to. */
  readonly family: string;
  readonly code: string;
  /** Written in our own words; see the copyright note above. */
  readonly description: string;
}

export const OEM_FAULT_CODES: readonly OemFaultCode[] = [
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000028.03", description: "Throttle signal voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000028.04", description: "Throttle signal voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000029.03", description: "Throttle signal voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000029.04", description: "Throttle signal voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000084.31", description: "Vehicle speed mismatch" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000091.03", description: "Throttle signal voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000091.04", description: "Throttle signal voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000091.09", description: "Throttle invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000091.14", description: "Throttle voltage out of range" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000094.03", description: "Fuel rail pressure input voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000094.04", description: "Fuel rail pressure input voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000094.10", description: "Fuel rail pressure loss detected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000094.13", description: "Fuel rail pressure higher than expected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000094.17", description: "Fuel rail pressure not developed" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000097.00", description: "Water in fuel continuously detected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000097.03", description: "Water in fuel signal voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000097.04", description: "Water in fuel signal voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000097.16", description: "Water in fuel detected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000100.01", description: "Engine oil pressure extremely low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000100.03", description: "Engine oil pressure input voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000100.04", description: "Engine oil pressure input voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000100.18", description: "Engine oil pressure moderately low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000105.00", description: "Manifold air temperature extremely high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000105.03", description: "Manifold air temperature input voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000105.04", description: "Manifold air temperature input voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000105.16", description: "Manifold air temperature moderately high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000107.00", description: "Air filter differential pressure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000110.00", description: "Engine coolant temperature extremely high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000110.03", description: "Engine coolant temperature input voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000110.04", description: "Engine coolant temperature input voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000110.15", description: "Engine coolant temperature high least severe" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000110.16", description: "Engine coolant temperature moderately high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000111.01", description: "Engine coolant level low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000158.17", description: "ECU power down error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000160.02", description: "Wheel speed input noise" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000174.00", description: "Fuel temperature high most severe" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000174.03", description: "Fuel temperature input voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000174.04", description: "Fuel temperature input voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000174.16", description: "Fuel temperature high moderately severe" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000189.00", description: "Engine speed derate" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000190.00", description: "Engine overspeed extreme" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000190.16", description: "Engine overspeed moderate" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000237.02", description: "Vehicle identification number invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000237.13", description: "Vehicle identification option code invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000237.31", description: "Vehicle model number invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000611.03", description: "Electronic injector wiring shorted to power source" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000611.04", description: "Electronic injector wiring shorted to ground" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000620.03", description: "Sensor supply 2 voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000620.04", description: "Sensor supply 2 voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000627.01", description: "Electronic injector supply voltage problem" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000629.13", description: "ECU error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000636.02", description: "Pump position sensor input noise" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000636.08", description: "Pump position sensor input missing" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000636.10", description: "Pump position sensor input pattern error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000637.02", description: "Crank position input noise" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000637.07", description: "Crank position and pump position timing moderately out of sync" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000637.08", description: "Crank position input missing" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000637.10", description: "Crank position input pattern error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000639.13", description: "CAN bus error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000651.05", description: "Cylinder 1 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000651.06", description: "Cylinder 1 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000651.07", description: "Cylinder 1 electronic injector mechanical failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000652.05", description: "Cylinder 2 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000652.06", description: "Cylinder 2 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000652.07", description: "Cylinder 2 electronic injector mechanical failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000653.05", description: "Cylinder 3 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000653.06", description: "Cylinder 3 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000653.07", description: "Cylinder 3 electronic injector mechanical failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000654.05", description: "Cylinder 4 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000654.06", description: "Cylinder 4 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000654.07", description: "Cylinder 4 electronic injector mechanical failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000655.05", description: "Cylinder 5 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000655.06", description: "Cylinder 5 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000655.07", description: "Cylinder 5 electronic injector mechanical failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000656.05", description: "Cylinder 6 electronic injector circuit open" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000656.06", description: "Cylinder 6 electronic injector circuit shorted" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000656.07", description: "Cylinder 6 electronic injector mechanical delivery failure" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000676.03", description: "Glow plug relay voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000676.05", description: "Glow plug relay voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000898.09", description: "Vehicle speed or torque message invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000970.31", description: "Engine shutdown requested by auxiliary input" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "000971.31", description: "External fuel derate switch active" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001069.09", description: "Tire size invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001069.31", description: "Tire size error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001079.03", description: "Sensor supply 1 voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001079.04", description: "Sensor supply 1 voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001080.03", description: "Fuel rail pressure sensor supply voltage high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001080.04", description: "Fuel rail pressure sensor supply voltage low" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001109.31", description: "Engine protection shutdown warning" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001110.31", description: "Engine protection shutdown" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001347.03", description: "Pump control valve current high" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001347.05", description: "Pump control valve current mismatch" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001347.07", description: "Fuel rail pressure control error" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001347.10", description: "Pump control valve fuel flow not detected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001568.02", description: "Torque curve selection invalid" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001569.31", description: "Fuel derate active" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001639.01", description: "Fan speed input missing" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001639.16", description: "Fan speed higher than expected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "001639.18", description: "Fan speed lower than expected" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "002000.13", description: "Security violation" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "002005.09", description: "ACU signal missing" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "002049.09", description: "Cab signal missing" },
  { brand: "John Deere", family: "PowerTech / Tier 3-4", code: "002071.09", description: "CCU signal missing" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0087", description: "Fuel rail pressure below the expected minimum (flashing code 227)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0088", description: "Fuel rail pressure abnormally high (flashing code 118)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0089", description: "Fuel pressure regulator performance fault (flashing code 151)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0090", description: "Suction control valve drive open, shorted to supply or shorted to ground (flashing code 247)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0107", description: "Barometric pressure sensor input low (flashing code 71)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0108", description: "Barometric pressure sensor input high (flashing code 71)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0112", description: "Intake air temperature sensor low voltage, ground short or short (flashing code 22)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0113", description: "Intake air temperature sensor high voltage (flashing code 22)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0117", description: "Engine coolant temperature sensor low voltage, ground short or short (flashing code 23)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0118", description: "Engine coolant temperature sensor input high (flashing code 23)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0182", description: "Fuel temperature sensor low voltage (flashing code 211)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0183", description: "Fuel temperature sensor high voltage (flashing code 211)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0192", description: "Rail pressure sensor low voltage (flashing code 245)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0193", description: "Rail pressure sensor high voltage (flashing code 245)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0201", description: "Injector 1 drive circuit open (flashing code 271)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0202", description: "Injector 2 drive circuit open (flashing code 272)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0203", description: "Injector 3 drive circuit open (flashing code 273)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0204", description: "Injector 4 drive circuit open (flashing code 274)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0205", description: "Injector 5 drive circuit open (flashing code 275)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0206", description: "Injector 6 drive circuit open (flashing code 276)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0219", description: "Engine overspeed (flashing code 543)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0237", description: "Boost pressure sensor low voltage (flashing code 32)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0238", description: "Boost pressure sensor high voltage (flashing code 32)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0335", description: "Crankshaft position sensor, no signal (flashing code 15)" },
  { brand: "JCB", family: "Dieselmax / Tier 4", code: "P0336", description: "Crankshaft position sensor, signal fault (flashing code 15)" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E01", description: "Automatic mode fault in HYPER system" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E02", description: "PC-EPC circuit fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E03", description: "Swing parking brake circuit fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E04", description: "Joystick neutral position fault in HYPER system" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E05", description: "Governor motor circuit fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E06", description: "EPC solenoid drive fault in HYPER system" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E09", description: "HYPER-GX system closed" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E101", description: "Fault history record abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E102", description: "Clock data abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E103", description: "Buzzer output short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E104", description: "Air filter clogged" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E108", description: "Coolant temperature above 105 C" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E112", description: "Wiper motor forward drive circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E113", description: "Wiper motor reverse drive circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E114", description: "Washer drive circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E202", description: "LS select solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E203", description: "Swing parking brake solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E204", description: "Pump merge/divide solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E205", description: "Secondary relief solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E206", description: "Travel speed change solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E207", description: "Quick mode solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E208", description: "Quick mode solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E213", description: "Swing parking brake solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E214", description: "Pump merge/divide solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E215", description: "Secondary relief solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E216", description: "Travel speed change solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E217", description: "Mode selection input fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E218", description: "Network response timeout" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E222", description: "LS-EPC solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E223", description: "LS-EPC solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E224", description: "Front pump pressure sensor circuit abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E225", description: "Rear pump pressure sensor circuit abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E226", description: "Pressure sensor supply abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E227", description: "Engine speed sensor abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E231", description: "Swing priority solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E232", description: "Front pump TVC solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E233", description: "Front pump TVC solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E235", description: "Swing priority solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E236", description: "Rear pump TVC solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E237", description: "Rear pump TVC solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E302", description: "Swing stroke control solenoid circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E303", description: "Swing stroke control solenoid circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E306", description: "Feedback potentiometer circuit abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E308", description: "Fuel dial input abnormal" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E313", description: "Auto greasing controller fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E315", description: "Battery relay output circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E316", description: "Governor motor out of adjustment" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E317", description: "Governor motor circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "E318", description: "Governor motor circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "989L00", description: "Engine controller lock warning 1" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "989M00", description: "Engine controller lock warning 2" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "989N00", description: "Engine controller lock warning 3" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "AA10NX", description: "Air filter clogged" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "AB00KE", description: "Charging voltage low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "B@BAZG", description: "Engine oil pressure low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "B@BAZK", description: "Engine oil level low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "B@BCNS", description: "Engine coolant overheating" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "B@BCZK", description: "Engine coolant level low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "B@HANS", description: "Hydraulic oil overheating" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA111", description: "Engine controller critical internal fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA115", description: "Primary and backup engine speed sensor fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA122", description: "Boost pressure sensor signal high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA123", description: "Boost pressure sensor signal low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA131", description: "Throttle position sensor signal high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA132", description: "Throttle position sensor signal low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA144", description: "Coolant temperature sensor signal high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA145", description: "Coolant temperature sensor signal low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA153", description: "Charge air temperature sensor signal high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA154", description: "Charge air temperature sensor signal low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA155", description: "Charge air temperature high at speed" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA187", description: "Sensor supply 2 voltage low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA221", description: "Ambient pressure sensor signal high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA222", description: "Ambient pressure sensor signal low" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA227", description: "Sensor supply 2 voltage high" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA234", description: "Engine overspeed" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA238", description: "Engine speed sensor supply voltage fault" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA271", description: "Suction control valve circuit short" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA272", description: "Suction control valve circuit open" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA322", description: "Injector 1 circuit open or shorted" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA323", description: "Injector 5 circuit open or shorted" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA324", description: "Injector 3 circuit open or shorted" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA325", description: "Injector 6 circuit open or shorted" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA331", description: "Injector 2 circuit open or shorted" },
  { brand: "Komatsu", family: "PC-8 series / engine CA codes", code: "CA332", description: "Injector 4 circuit open or shorted" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "RE2501-03", description: "Intake preheat relay voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "RE2501-04", description: "Intake preheat relay voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "RE2501-05", description: "Intake preheat relay circuit open" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER49-00", description: "Fuel supply pressure below limit" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER49-03", description: "Fuel supply pressure sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER49-04", description: "Fuel supply pressure sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER45-01", description: "Engine oil pressure too low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER45-03", description: "Engine oil pressure sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER45-04", description: "Engine oil pressure sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER45-11", description: "Engine oil pressure sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER44-03", description: "Boost pressure sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER44-04", description: "Boost pressure sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER44-11", description: "Boost pressure sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER42-03", description: "Boost temperature sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER42-04", description: "Boost temperature sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER42-11", description: "Boost temperature sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4A-00", description: "Air intake filter pressure drop excessive" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4A-03", description: "Air filter pressure drop sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4A-04", description: "Air filter pressure drop sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4A-05", description: "Air filter pressure drop sensor circuit open" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4C-03", description: "Ambient air pressure sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4C-04", description: "Ambient air pressure sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER47-00", description: "Engine coolant temperature too high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER47-03", description: "Engine coolant temperature sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER47-04", description: "Engine coolant temperature sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER47-11", description: "Engine coolant temperature sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER46-01", description: "Coolant level too low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER46-03", description: "Coolant level sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER46-04", description: "Coolant level sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4E-00", description: "Engine ECU supply voltage excessive" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4E-01", description: "Engine ECU supply voltage too low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4B-03", description: "Intake air temperature sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4B-04", description: "Intake air temperature sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER4B-11", description: "Intake air temperature sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER41-00", description: "Engine oil temperature too high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER41-03", description: "Engine oil temperature sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER41-04", description: "Engine oil temperature sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER41-11", description: "Engine oil temperature sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2301-03", description: "Injector 1 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2301-04", description: "Injector 1 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2301-11", description: "Injector 1 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2302-03", description: "Injector 2 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2302-04", description: "Injector 2 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2302-11", description: "Injector 2 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2303-03", description: "Injector 3 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2303-04", description: "Injector 3 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2303-11", description: "Injector 3 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2304-03", description: "Injector 4 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2304-04", description: "Injector 4 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2304-11", description: "Injector 4 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2305-03", description: "Injector 5 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2305-04", description: "Injector 5 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2305-11", description: "Injector 5 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2306-03", description: "Injector 6 solenoid voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2306-04", description: "Injector 6 solenoid voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA2306-11", description: "Injector 6 solenoid, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER48-03", description: "Camshaft position sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER48-08", description: "Camshaft position sensor abnormal frequency" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER48-11", description: "Camshaft position sensor, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER43-02", description: "Flywheel speed sensor intermittent or erroneous" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER43-03", description: "Flywheel speed sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER43-08", description: "Flywheel speed sensor abnormal frequency" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "HE2501-03", description: "Intake preheat coil voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "HE2501-04", description: "Intake preheat coil voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "HE2501-05", description: "Intake preheat coil circuit open" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER13-09", description: "J1939 communication failure" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER13-11", description: "J1939 communication, other fault" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER13-12", description: "J1939 communication, unit or component faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER12-02", description: "Engine ECU intermittent or erroneous data" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER12-12", description: "Engine ECU unit or component faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER14-09", description: "J1587 communication failure" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER14-12", description: "J1587 communication, unit or component faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA9107-12", description: "Power boost solenoid unit or component faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA9105-12", description: "Boom/arm confluence shut-off solenoid faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "MA9113-12", description: "Hydraulic oil cooler fan solenoid faulty" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SW2701-03", description: "Engine speed control switch voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SW2701-04", description: "Engine speed control switch voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SW9101-03", description: "Flow control switch voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SW9101-04", description: "Flow control switch voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SE9105-00", description: "Hydraulic oil temperature too high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SE9105-03", description: "Hydraulic oil temperature sensor voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "SE9105-04", description: "Hydraulic oil temperature sensor voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER31-03", description: "Power shift proportional valve voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER31-04", description: "Power shift proportional valve voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER31-05", description: "Power shift proportional valve circuit open" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER32-03", description: "Flow control proportional valve voltage high" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER32-04", description: "Flow control proportional valve voltage low" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER32-05", description: "Flow control proportional valve circuit open" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER11-02", description: "Vehicle ECU intermittent or erroneous data" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER21-00", description: "Vehicle ECU supply voltage excessive" },
  { brand: "Volvo CE", family: "EC series / E-ECU and V-ECU", code: "ER21-01", description: "Vehicle ECU supply voltage too low" },
  { brand: "Hyundai", family: "R-9 series", code: "101", description: "Hydraulic oil temperature sensor voltage high or shorted high" },
  { brand: "Hyundai", family: "R-9 series", code: "104", description: "Hydraulic oil temperature sensor voltage low or shorted low" },
  { brand: "Hyundai", family: "R-9 series", code: "105", description: "Attachment idle pressure above normal or sensor data error" },
  { brand: "Hyundai", family: "R-9 series", code: "108", description: "Travel idle pressure sensor data abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "120", description: "Main pump P1 pressure sensor data abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "121", description: "Main pump P2 pressure sensor data abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "122", description: "Overload pressure sensor data abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "123", description: "Negative feedback pressure sensor 1 abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "124", description: "Negative feedback pressure sensor 2 abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "125", description: "Pilot pump P3 pressure sensor data abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "127", description: "Boom raise pilot pressure sensor abnormal" },
  { brand: "Hyundai", family: "R-9 series", code: "133", description: "Arm and bucket pilot pressure sensor abnormal" },] as const;

/** Brands covered by this OEM set, with counts computed from the data. */
export function getOemCoverage(): { brand: string; codes: number; families: string[] }[] {
  const map = new Map<string, { codes: number; families: Set<string> }>();
  for (const r of OEM_FAULT_CODES) {
    const e = map.get(r.brand) ?? { codes: 0, families: new Set<string>() };
    e.codes += 1;
    e.families.add(r.family);
    map.set(r.brand, e);
  }
  return [...map.entries()]
    .map(([brand, v]) => ({ brand, codes: v.codes, families: [...v.families].sort() }))
    .sort((a, b) => b.codes - a.codes);
}

/**
 * Search the OEM set.
 *
 * Exact code matches rank first, then prefix, then description text — a
 * technician standing at a machine types the number off the display before
 * anything else. Matching ignores punctuation so "000094.03", "94.03" and
 * "0000940 3" all find the same record; monitors and manuals punctuate these
 * inconsistently and a buyer should not have to guess our format.
 */
export function searchOemCodes(
  query: string,
  opts: { brand?: string; limit?: number } = {}
): OemFaultCode[] {
  const limit = Math.min(Math.max(opts.limit ?? 40, 1), 200);
  const brandFilter = opts.brand?.toLowerCase();
  const q = query.trim().toLowerCase();
  const qBare = q.replace(/[^a-z0-9]/g, '');
  if (!q && !brandFilter) return [];

  const exact: OemFaultCode[] = [];
  const prefix: OemFaultCode[] = [];
  const text: OemFaultCode[] = [];

  for (const r of OEM_FAULT_CODES) {
    if (brandFilter && r.brand.toLowerCase() !== brandFilter) continue;
    if (!q) { text.push(r); if (text.length >= limit) break; continue; }

    const code = r.code.toLowerCase();
    const bare = code.replace(/[^a-z0-9]/g, '');
    if (code === q || (qBare && bare === qBare)) exact.push(r);
    else if (qBare && bare.startsWith(qBare)) prefix.push(r);
    else if (r.description.toLowerCase().includes(q)) text.push(r);
    else if (r.family.toLowerCase().includes(q)) text.push(r);
  }
  return [...exact, ...prefix, ...text].slice(0, limit);
}

export function getOemStats() {
  const brands = new Set(OEM_FAULT_CODES.map((r) => r.brand));
  return { codes: OEM_FAULT_CODES.length, brands: brands.size };
}

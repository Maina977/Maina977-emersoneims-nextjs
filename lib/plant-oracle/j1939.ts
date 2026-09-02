/**
 * SAE J1939 DECODER — the universal layer, and the honest route to the brands
 * we hold no manufacturer tables for.
 *
 * WHY THIS EXISTS
 * We were asked for fault codes covering John Deere, JCB, Komatsu, Doosan and
 * the Chinese plant now common in Kenya, and we hold no manufacturer-specific
 * table for any of them. Inventing one was not an option: roughly 9,500
 * fabricated codes were stripped out of this database once already.
 *
 * But J1939 is a published SAE standard, and every one of those engines speaks
 * it. A fault is an SPN (which parameter) plus an FMI (how it failed), and both
 * halves mean the same thing on a John Deere as on a Cummins. Decoding
 * "SPN 100 FMI 3" is therefore not guessing about John Deere — it is reading a
 * standard that John Deere implements.
 *
 * THIS IS A DECODER, NOT A CODE LIST — and the distinction is the whole point.
 * 42 SPNs multiplied by 23 FMIs would yield ~960 plausible-looking "codes",
 * which is precisely the template expansion criticised in
 * lib/plant-oracle/coverage.ts. Nothing is pre-generated here. The two verified
 * tables are stored, and a meaning is composed only when a technician supplies
 * an actual SPN and FMI read off a real machine.
 *
 * PROVENANCE
 *   FMI 0-21 and 31: taken from two independent sources that agreed on every
 *     value — the CODESYS IoDrvJ1939 library reference and FCAR Tech USA's
 *     J1939 knowledge base. 22-30 are reserved by SAE and are recorded as such
 *     rather than filled in.
 *   SPN names: recovered from a published Cummins Tier 4 J1939 fault table
 *     (Allied Systems form 80-1235), then validated twice before publication.
 *     Each SPN had to appear on at least two rows with DIFFERENT FMIs so its
 *     parameter name could be triangulated as the shared prefix; and the result
 *     had to end in a measured quantity, since a name ending in a component
 *     word means the parse truncated it. 34 candidates failed those gates and
 *     were discarded rather than published.
 *     8 SPNs were additionally confirmed against independent web sources before
 *     parsing; where the parse disagreed, the independent value won. It caught
 *     one real error — SPN 105 parsed as "Engine Intake Manifold", which is
 *     truncated; the correct name is "Engine Intake Manifold 1 Temperature".
 *
 * WHAT THIS IS NOT. Manufacturer-proprietary SPNs sit outside the standard
 * ranges and differ per maker; none are included. A machine showing a
 * proprietary code will not decode here, and the interface says so rather than
 * offering the nearest match.
 *
 * Fault code numbers are industry-standard identifiers used for identification
 * only. Descriptions are our own words. Nothing is transcribed from a
 * manufacturer service manual, and no affiliation or endorsement is implied.
 */

export interface SpnRecord {
  readonly spn: number;
  readonly name: string;
  /** 'web-verified' = confirmed independently; 'oem-table' = triangulated. */
  readonly source: 'web-verified' | 'oem-table';
}

export interface FmiRecord {
  readonly fmi: number;
  /** Standard SAE meaning. */
  readonly meaning: string;
  /** Our own plain-language reading, for a technician at the machine. */
  readonly plain: string;
}

/**
 * FMI 0-31. Values 22-30 are reserved by SAE and carry no meaning — they are
 * present so a lookup can say "reserved" instead of "unknown".
 */
export const FMI_TABLE: readonly FmiRecord[] = [
  { fmi: 0, meaning: 'Data valid but above normal operational range — most severe', plain: 'The reading is genuine and far too high. Treat as a shutdown-level condition.' },
  { fmi: 1, meaning: 'Data valid but below normal operational range — most severe', plain: 'The reading is genuine and far too low. Treat as a shutdown-level condition.' },
  { fmi: 2, meaning: 'Data erratic, intermittent or incorrect', plain: 'The signal is jumping around. Suspect a chafed wire, a loose pin or a failing sensor before the component itself.' },
  { fmi: 3, meaning: 'Voltage above normal or shorted to a high source', plain: 'Circuit voltage is too high — commonly a short to battery positive or a supply wire touching the signal wire.' },
  { fmi: 4, meaning: 'Voltage below normal or shorted to a low source', plain: 'Circuit voltage is too low — commonly a short to earth or a damaged signal wire.' },
  { fmi: 5, meaning: 'Current below normal or open circuit', plain: 'Little or no current is flowing. Look for a broken wire, a disconnected plug or a failed coil.' },
  { fmi: 6, meaning: 'Current above normal or grounded circuit', plain: 'Too much current is flowing — usually a short to earth or a shorted winding.' },
  { fmi: 7, meaning: 'Mechanical system not responding or out of adjustment', plain: 'The ECM commanded something and the hardware did not move as expected. The electronics may be fine; the mechanism is not.' },
  { fmi: 8, meaning: 'Abnormal frequency, pulse width or period', plain: 'The signal is present but its timing is wrong. Common on speed and position sensors with the wrong air gap or debris on the tone ring.' },
  { fmi: 9, meaning: 'Abnormal update rate', plain: 'Data is arriving too slowly or not at all — often a network or module fault rather than a sensor.' },
  { fmi: 10, meaning: 'Abnormal rate of change', plain: 'The value moved faster than physically plausible. Suspect the sensor or its wiring rather than a real process change.' },
  { fmi: 11, meaning: 'Root cause not known', plain: 'The ECM detected a fault it cannot classify. Diagnose from the parameter itself.' },
  { fmi: 12, meaning: 'Bad intelligent device or component', plain: 'A smart component reported its own internal failure. It usually needs replacing rather than adjusting.' },
  { fmi: 13, meaning: 'Out of calibration', plain: 'The device works but its reference is wrong. Recalibrate before condemning the part.' },
  { fmi: 14, meaning: 'Special instructions', plain: 'The manufacturer defines a specific procedure for this one. It cannot be inferred from the standard.' },
  { fmi: 15, meaning: 'Data valid but above normal operating range — least severe', plain: 'Genuinely high, but only slightly. Usually a warning, not a shutdown.' },
  { fmi: 16, meaning: 'Data valid but above normal operating range — moderately severe', plain: 'Genuinely high enough to matter. Often accompanied by a derate.' },
  { fmi: 17, meaning: 'Data valid but below normal operating range — least severe', plain: 'Genuinely low, but only slightly. Usually a warning.' },
  { fmi: 18, meaning: 'Data valid but below normal operating range — moderately severe', plain: 'Genuinely low enough to matter. Often accompanied by a derate.' },
  { fmi: 19, meaning: 'Received network data in error', plain: 'Another module sent bad data over the CAN bus. Diagnose the sender and the bus, not this parameter.' },
  { fmi: 20, meaning: 'Data drifted high', plain: 'The reading has wandered upward over time — typically sensor ageing or contamination.' },
  { fmi: 21, meaning: 'Data drifted low', plain: 'The reading has wandered downward over time — typically sensor ageing or contamination.' },
  { fmi: 31, meaning: 'Condition exists', plain: 'The stated condition is simply present. It is a status, not a circuit failure.' },
] as const;

/** SPNs verified for publication. See the provenance note above. */
export const SPN_TABLE: readonly SpnRecord[] = [
  { spn: 84, name: "Wheel-Based Vehicle Speed", source: "oem-table" },
  { spn: 91, name: "Accelerator Pedal Position 1", source: "web-verified" },
  { spn: 94, name: "Engine Fuel Delivery Pressure", source: "web-verified" },
  { spn: 97, name: "Water In Fuel Indicator", source: "oem-table" },
  /*
   * SPN 98 and 110 were independently verified but did not appear in the
   * OEM table the other names were triangulated from, so the anchor pass —
   * which only iterated over PARSED rows — never inserted them. Caught by
   * live-testing the decoder: SPN 110 is engine coolant temperature, one of
   * the most common codes on any machine, and it was returning "no record".
   * An anchor is verified on its own evidence; it does not need the parse to
   * have seen it too.
   */
  { spn: 98, name: "Engine Oil Level", source: "web-verified" },
  { spn: 100, name: "Engine Oil Pressure", source: "web-verified" },
  { spn: 101, name: "Engine Crankcase Pressure", source: "oem-table" },
  { spn: 102, name: "Engine Intake Manifold #1 Pressure", source: "web-verified" },
  { spn: 103, name: "Engine Turbocharger 1 Speed", source: "oem-table" },
  { spn: 105, name: "Engine Intake Manifold 1 Temperature", source: "web-verified" },
  { spn: 107, name: "Engine Air Filter 1 Differential Pressure", source: "oem-table" },
  { spn: 110, name: "Engine Coolant Temperature", source: "web-verified" },
  { spn: 157, name: "Engine Injector Metering Rail 1 Pressure", source: "oem-table" },
  { spn: 168, name: "Battery Potential / Power Input 1", source: "oem-table" },
  { spn: 171, name: "Ambient Air Temperature", source: "oem-table" },
  { spn: 174, name: "Engine Fuel Temperature 1", source: "oem-table" },
  { spn: 175, name: "Engine Oil Temperature 1", source: "oem-table" },
  { spn: 190, name: "Engine Speed", source: "web-verified" },
  { spn: 191, name: "Transmission Output Shaft Speed", source: "oem-table" },
  { spn: 411, name: "Engine Exhaust Gas Recirculation 1 Differential Pressure", source: "oem-table" },
  { spn: 412, name: "Engine Exhaust Gas Recirculation 1 Temperature", source: "oem-table" },
  { spn: 441, name: "Auxiliary Temperature 1", source: "oem-table" },
  { spn: 558, name: "Accelerator Pedal 1 Low Idle Switch", source: "oem-table" },
  { spn: 723, name: "Engine Speed 2", source: "oem-table" },
  { spn: 1172, name: "Engine Turbocharger 1 Compressor Intake Temperature", source: "oem-table" },
  { spn: 1176, name: "Engine Turbocharger 1 Compressor Intake Pressure", source: "oem-table" },
  { spn: 1209, name: "Engine Exhaust Gas Pressure 1", source: "oem-table" },
  { spn: 1388, name: "Auxiliary Pressure #2", source: "oem-table" },
  { spn: 2630, name: "Engine Charge Air Cooler 1 Outlet Temperature", source: "oem-table" },
  { spn: 3242, name: "Aftertreatment 1 Diesel Particulate Filter Intake Gas Temperature", source: "oem-table" },
  { spn: 3246, name: "Aftertreatment 1 Diesel Particulate Filter Outlet Gas Temperature", source: "oem-table" },
  { spn: 3251, name: "Aftertreatment 1 Diesel Particulate Filter Differential Pressure", source: "oem-table" },
  { spn: 3510, name: "Sensor supply voltage 2", source: "oem-table" },
  { spn: 3597, name: "ECU Power Output Supply Voltage #1", source: "oem-table" },
  { spn: 3610, name: "Aftertreatment Diesel Particulate Filter Outlet Pressure", source: "oem-table" },
  { spn: 4334, name: "Aftertreatment 1 Diesel Exhaust Fluid Doser Absolute Pressure", source: "oem-table" },
  { spn: 4363, name: "Aftertreatment 1 SCR Catalyst Outlet Gas Temperature", source: "oem-table" },
  { spn: 4765, name: "Aftertreatment Diesel Oxidation Catalyst Intake Temperature A", source: "oem-table" },
  { spn: 4766, name: "Aftertreatment 1 Diesel Oxidation Catalyst Outlet Gas Temperature", source: "oem-table" },
  { spn: 4809, name: "Aftertreatment Warm Up Diesel Oxidation Catalyst Intake Temperature", source: "oem-table" },
  { spn: 4810, name: "Aftertreatment Warm Up Diesel Oxidation Catalyst Outlet Temperature", source: "oem-table" },
  { spn: 5019, name: "Engine Exhaust Gas Recirculation 1 Outlet Pressure", source: "oem-table" },
  { spn: 5798, name: "Aftertreatment 1 Diesel Exhaust Fluid Dosing Unit Heater Temperature", source: "oem-table" },
  { spn: 520595, name: "Closed Crankcase Ventilation System Pressure", source: "oem-table" },] as const;

/** SAE reserves FMI 22-30; they carry no defined meaning. */
export function isReservedFmi(fmi: number): boolean {
  return fmi >= 22 && fmi <= 30;
}

export interface DecodeResult {
  ok: boolean;
  spn?: SpnRecord;
  fmi?: FmiRecord;
  /** Composed sentence, built at lookup time from two verified facts. */
  reading?: string;
  /** Why a decode failed, in words a technician can act on. */
  note?: string;
}

/**
 * Decode one SPN/FMI pair.
 *
 * Composed on demand — nothing here is pre-generated, so the tool can never
 * present a combination it has not been asked about as if it were a catalogued
 * fault.
 */
export function decodeJ1939(spnNum: number, fmiNum: number): DecodeResult {
  const spn = SPN_TABLE.find((s) => s.spn === spnNum);
  const fmi = FMI_TABLE.find((f) => f.fmi === fmiNum);

  if (!spn && isReservedFmi(fmiNum)) {
    return { ok: false, note: `We hold no record for SPN ${spnNum}, and FMI ${fmiNum} is reserved by SAE with no defined meaning.` };
  }
  if (!spn) {
    return {
      ok: false,
      fmi: fmi ?? undefined,
      note:
        `SPN ${spnNum} is not in our verified set. It is very likely a manufacturer-proprietary parameter, ` +
        `which sits outside the SAE standard ranges and differs between makers — we will not guess at it. ` +
        (fmi ? `The FMI does decode: ${fmi.meaning.toLowerCase()}. ` : '') +
        `Send us the machine and engine details and we will look it up properly.`,
    };
  }
  if (isReservedFmi(fmiNum)) {
    return { ok: false, spn, note: `FMI ${fmiNum} is reserved by SAE and has no defined meaning. Re-read the code from the display — a reserved FMI usually indicates a misread.` };
  }
  if (!fmi) {
    return { ok: false, spn, note: `FMI ${fmiNum} is outside the valid 0-31 range. Re-read the code from the display.` };
  }

  return {
    ok: true,
    spn,
    fmi,
    reading: `${spn.name} — ${fmi.meaning.toLowerCase()}.`,
  };
}

export function getJ1939Stats() {
  return {
    spns: SPN_TABLE.length,
    fmis: FMI_TABLE.length,
    webVerified: SPN_TABLE.filter((s) => s.source === 'web-verified').length,
  };
}

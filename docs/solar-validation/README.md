# Solar Genius Pro: datasheet library and real-system comparison

## 1. Datasheet import and verification (`lib/solar/design/datasheet.ts`)

1. **Entry:** fill one row per product in `datasheet-module-template.csv`, `datasheet-inverter-template.csv` or `datasheet-battery-template.csv`.
   - Use the manufacturer's own datasheet (an https link), with its revision and date.
   - Numbers only, in the unit named in the column header.
2. **Import checks:** an entry is refused if:
   - a value is missing or carries text units;
   - the signs or units of the temperature coefficients are wrong;
   - Vmp ≥ Voc, Imp ≥ Isc, or Vmp × Imp differs from Pmax by more than 3 %;
   - the MPPT window is inconsistent;
   - a battery fraction is out of range.
   Unusual values are imported with a warning.
3. **Verification:** a second person compares every field with the datasheet and signs the entry off. The verifier cannot be the person who entered it.
4. **Use:** only verified entries may be used in a design that is quoted (`usableForQuotation`).

## 2. Real-system comparison (`real-system-comparison-template.csv`)

Ten EmersonEIMS installations, each with its design file and measured data. **No row may be filled from memory, estimates or the design itself.** Every measured value names its source (inverter portal export, meter reading with date, utility bill), and the file reference must exist.

Per system, the comparison takes:
- the design's predicted monthly kWh, with the Solar Genius Pro version and inputs;
- the measured monthly kWh, from the inverter or meter export;
- the error (predicted − measured);
- the reason for any month with more than 15 % error (outage, soiling, curtailment, shading added later, data gap).

Months with data gaps are excluded and listed, never filled in.

**Status:** template only. No system data has been collected yet.

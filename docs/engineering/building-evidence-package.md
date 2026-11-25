# Building Suite Pro: what a real-project validation needs

This note does not repeat the protocol. The governing procedure is:

`C:\Users\User\Documents\EmersonEIMS-proposals\pilot-protocols-2026-11-25\PILOT-PROTOCOL-BUILDING-SUITE-PRO.md` (Pilot 4)

It covers:
- roles and BORAQS registration (section 4);
- consent and the Data Protection Act (section 5);
- the blind procedure with custodian and SHA-256 manifests (section 6);
- drawing grades, separate quantity and pricing errors, and the nine assessments (section 7);
- the five evidence items (section 8);
- sign-off (sections 11–12).

Use it as written. Below is only what the 2026-11-25 increment (MEP trades, rate build-ups, price status) adds.

## Why the current tests are not validation

- Every test and benchmark in `tests/regression/qs-mep-*.test.ts` is **synthetic**.
- They show that the engine does what its formulas say, and that the screen, Excel and PDF agree.
- They cannot show that a real BOQ is right: completeness, conventions, drawing reading, or whether prices are fit for a quotation.
- Pilot 4 section 3 currently **excludes MEP**.

## To extend a pilot to MEP

**(a) Drawings**
- Electrical layout and plumbing/drainage layout, at a stated scale and revision.
- A distribution-board and circuit schedule.
- A sanitary schedule.
- A section giving ceiling and fixture heights (for drops and rises).

**(b) Independent reference**
- An MEP BOQ for the same revision, prepared by a BORAQS-registered QS.
- It must state its method of measurement and whether point rates include wiring.

**(c) Conventions signed before measurement (step 6.3)**
- Point method or measured runs.
- The drop/rise rule.
- The termination allowance.
- The fittings rule (allowance per metre, or counted from an isometric).
- Whether gradients are added.

**(d) Same blind procedure**
- The custodian hashes and seals the reference BOQ.
- The operator receives only the drawings.
- The tool exports (Excel including the "Rate build-ups" sheet, PDF, project .json) are hashed before the reveal.

**(e) Comparison**
- Use the existing checker (item ±2 %, total ±1 % at the reference QS rates).
- Map cable and conduit by size, pipes by diameter, fittings by type. A fittings allowance is compared against counted fittings and reported as a convention difference, not hidden.

## To validate pricing (separate from quantities)

1. **Rate-application check (Pilot 4 section 7.2).** Enter the reference QS rates as single rates, or as build-ups. Check that:
   - amount = quantity × rate (2 dp);
   - the build-up sum = rate;
   - the Excel formulas reproduce the figures.
2. **Price-status check.** Every line's status (verified / indicative / unpriced) must match its evidence:
   - a verified line needs a dated supplier quotation or the company rate list, filed with the evidence;
   - an indicative line needs its public source record;
   - the PRELIMINARY BUDGET notice must appear whenever any line is not verified.
3. **Indicative-rate benchmark (information only).** Compare the indicative unit rates (PPRA June 2026) with the reference QS rates. Report the ratio per item. This is not a pass criterion: indicative rates are not under test and are never a quotation.

## Sign-off

- Reviewer: BORAQS-registered and independent.
- Structural engineer: EBK-registered, only if structural checks are used.
- Signatures go in Pilot 4 sections 11 (criteria, before testing) and 12 (assessment).
- Until a signed pilot exists, every output stays **DRAFT — not certified**.

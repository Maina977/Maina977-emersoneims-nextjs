# Solar Genius Pro: evidence package for real-installation validation

2026-11-25, branch `ws/solar-genius-design`. This is the checklist of evidence needed before any statement that the tool agrees with a real installation. The procedure itself is the signed pilot protocol:

`C:\Users\User\Documents\EmersonEIMS-proposals\pilot-protocols-2026-11-25\PILOT-PROTOCOL-SOLAR-GENIUS-PRO.md`

That protocol governs: roles, blind packets, acceptance criteria, consent under the Kenya Data Protection Act 2019, and sign-off. This file does not change it. It lists what this branch adds, and the evidence each output needs.

## 1. Current evidence status

| Output | Evidence today | Class | Field validation |
|---|---|---|---|
| String / cable / battery checks | Hand-calculated cases, including safety-critical cases on manufacturer specifications (`solar-benchmark-cases.test.ts` C1–C6) | SYN / MS + UA | **None** |
| Hourly production | pvlib benchmark on identical synthetic inputs; PVWatts v5 equations B1–B3 | SYN / PR | **None** |
| Horizon shading (new) | Hand worked example (13.40 % vs engine 13.39 %); Meeus sun-position check | SYN / PR | **None** |
| Single-line diagram (new) | Labels equal the check values; refused designs marked; TBS for undetermined items | SYN | Not applicable: reviewed by the engineer |
| Equipment data | 5 datasheet records, unverified | MS | Second-person check pending |

**No measured data exists in this package.** Synthetic benchmarks are not field validation.

## 2. What this branch changes for the pilot

- The protocol says (§2) that the tool has no geometric shading model. On this branch it has one: a horizon profile with beam blocking.
  - When a pilot site has a surveyed horizon, the survey (instrument, date, surveyor, photo) goes in **Packet D** as a design-time input, recorded before unsealing.
  - The run records `solar-horizon-shading 1.0.0` and `solar-proposal 1.2.0`.
  - If no survey exists at design time, the run uses the shipped PVWatts 3 % shading allowance, as the protocol requires. A survey made after the reveal must not be used to explain a miss (protocol §6).
- The single-line diagram is not graded. The reviewer may compare it with the as-built drawing, and differences are reported as findings.

## 3. Evidence to collect (per site)

| Item | Content | Custodian | Packet |
|---|---|---|---|
| Metered output | ≥ 12 consecutive months in complete past calendar years; meter/inverter export with timestamps, units, gaps listed (not filled) | Records custodian | S (sealed) |
| As-built record | As-built single-line diagram; string layout (modules per string, strings per MPPT); cable sizes and lengths; protection devices with ratings | Custodian | D |
| Datasheets | Exact revision and date for module, inverter and battery as installed; serials and nameplate photos; second-person verification (name, date) | Custodian / operator | D |
| Site data | Coordinates (kept in the pilot folder only), tilt, azimuth, mounting; horizon survey if made at design time; record-low / max-ambient source | Operator | D |
| Availability and curtailment | Outage log, export limits, inverter alarms | Custodian | S |
| Irradiance (optional) | Site pyranometer record | Custodian | S (information only) |

## 4. Reviewer

The reviewer is an electrical engineer registered with the **Engineers Board of Kenya (EBK)**, with PV design or commissioning experience. They must be independent of the site (protocol §4) and are appointed by management. **Not yet appointed.**

## 5. Blind procedure (summary; the protocol prevails)

1. The custodian splits the records into Packet D (design-time inputs) and Packet S (outcome), seals S, and records the hashes.
2. The operator runs the tool on Packet D only. The run records the commit hash, the engine versions and the NASA POWER source strings, and exports the PDF and XLSX. Those exports carry the revision hash of their inputs.
3. The criteria signed under protocol §14 apply. Packet S is unsealed in the presence of the reviewer.
4. Comparisons: monthly and annual energy on the weather-matched run, the string-check verdicts against the as-built design, and (information only) horizon-shading loss against any measured shade evidence.
5. The verdict is recorded as written. Factors found later are findings, not corrections.

## 6. Comparisons and sign-off

| Comparison | Metric | Acceptance |
|---|---|---|
| Monthly energy | (tool − metered) / metered, per complete month | Per protocol §9 (PROPOSED until signed) |
| Annual energy | Same, annual | Per protocol §9 |
| String-check verdicts | Agreement with the reviewer's own check of the as-built design | Per protocol §9 |
| SLD | Items differing from the as-built | Finding only |

Sign-off: management and the reviewer sign the criteria before the run, and the results after it (protocol §14). **No project, reviewer, consent or records exist yet** (protocol status line). Until they do, every result of this tool stays a modelled estimate, and every proposal stays DRAFT.

# Generator Oracle — OEM source register (2026-11-25)

Research done 2026-11-25 from publicly accessible pages and PDFs only. No login, licence wall, bot challenge or paywall was bypassed. Facts are summarised with attribution and page; no manual or fault-code database is reproduced. Datasets: `data/generator-oracle/references/`. Loader and applicability rule: `lib/generator-oracle/diagnostics/oemReferences.ts`.

**Applicability rule.** Every entry names the manufacturer, the exact engine or controller model(s) the source covers, the variant/configuration it is limited to, firmware where stated, the manual ID and revision, the page, the parameter and its units (or "none"), its classification as stated by the source (shutdown / warning / not a limit) and its applicability restrictions; `tests/regression/oracle-exact-threshold.test.ts` fails if any record lacks one. An entry is shown only when that exact model is selected; nothing is matched by make, series similarity or guess. Reference data is never entered automatically. One entry (Perkins 1104D coolant maximum) is a **published limit**: for that exact model the technician may press "Use published value", which enters 110 °C, classification shutdown and the source citation; the technician must check the variant (48 kPa pressurised system) matches the set. All other entries are context only. Safety-critical limits with no documentation for the selected model show "per OEM manual — NOT VERIFIED"; the limit rules then apply no threshold until the technician enters one, while the family's mandatory safety is always shown.

**Independent check.** All 14 reference values and the 3 file hashes were independently re-checked by a second person on 2026-11-25 (`C:\Users\User\Documents\EmersonEIMS-proposals\source-verification-2026-11-25\INDEPENDENT-SOURCE-CHECK.md`). That check found the ComAp page references wrong; they are corrected below and in the dataset (power supply and D+ on PDF p. 3, protections on PDF p. 4). Values unchanged.

## 1. Sources used (verified from the public document)

| Dataset | Source | Number / revision / date | Applies to | Where obtained (retrieved 2026-11-25) | SHA-256 of the copy read | Permitted use (licensing) |
|---|---|---|---|---|---|---|
| `dse-057-074-issue13.json` | Deep Sea Electronics, *DSE7200 / 7300 Series Operators Manual* | 057-074, Issue 13; no date printed (host file name says 2014 — not verified) | DSE7200 series, DSE7300 series | https://www.wincogen.com/wp-content/uploads/PD/Manuals/GR/winco_dse7310_opm_rev13_(2014).pdf (public copy on a generator maker's site, not DSE's) | 917462942156775a55065d0b843f9572d2c310b910ef11ea9012b44971bb5e27 | Publicly downloadable; copy is **third-party hosted** (Winco), copyright DSE ("no part may be reproduced" without permission). Use: short factual summaries cited with attribution and page; no reproduction of text, tables or figures; the PDF is not redistributed. |
| `perkins-sebu8325-01.json` | Perkins, *Operation and Maintenance Manual — 1104D (Mech) Industrial Engine NK, NL, NM* | SEBU8325-01, July 2012 | 1104D (Mech) Industrial Engine NK / NL / NM | https://www.bbapumps.com/content/files/BBA-Pumps/Support/User_manuals/Perkins%20Operation%20and%20Maintenance%20Manual%20-%201104D.pdf (public copy on an equipment maker's site) | 6d50189aaee9c861543fa622a9c0e3fb20399573a47a64b206564608948b5c8a | Publicly downloadable; copy is **third-party hosted** (BBA Pumps), copyright Perkins. Use: short factual summaries cited with attribution and page; no reproduction; the PDF is not redistributed. |
| `comap-il4-amf25-datasheet-2021-04-29.json` | ComAp, *InteliLite 4 AMF 25 Datasheet* | HW 1.0, SW 1.0.0, issued 2021-04-29 | InteliLite 4 AMF 25 (SW 1.0.0) | https://penncatenergy.com/wp-content/uploads/2024/03/intelilite-4-amf-25-spec-sheet-21-04.pdf (public copy on a dealer site) | e629be93d9f6feb9a1af5ad58002f8c2d84b128a363788eeab5aac041b911f94 | Publicly downloadable; copy is **third-party hosted** (Penn CAT dealer), copyright ComAp. Use: short factual summaries cited with attribution and page; no reproduction; the PDF is not redistributed. |

### What each dataset contributes

- **DSE 057-074 Issue 13** (alarm meanings and procedures, DSE7200/7300 only): CHARGE FAILURE = charge-alternator voltage low at the W/L terminal (PDF p. 95); PROTECTIONS DISABLED — shutdowns can be configured off, alarm shows but the engine continues to run (p. 96, V4 onwards); OVERSPEED shutdown and the configurable start-up "Overspeed Overshoot" margin (p. 97); LOSS OF SPEED SIGNAL (p. 98); speed source factory-set to alternator frequency, MPU or CAN by configuration (pp. 85, 88); controller DC-supply check 9–35 V when the unit shuts down (p. 114 — the module's own supply, not a charging limit); MPU screen earthed at one end only, pickup distance (p. 114).
- **Perkins SEBU8325-01** (1104D Mech NK/NL/NM only, PDF p. 22): "if no oil pressure is indicated, STOP the engine; if maximum coolant temperature is exceeded, STOP the engine"; typical oil pressure 207–413 kPa with SAE10W30 at rated rpm (**typical, not a minimum — never used as the OEM minimum**); jacket water typical 71–96 °C, maximum allowable 110 °C with a 48 kPa pressurised system (**engine maximum, not the controller alarm setting**); never exceed high idle rpm.
- **ComAp IL4 AMF 25 datasheet** (SW 1.0.0): controller supply 8–36 V DC (PDF p. 3); D+ output max 250 mA with adjustable charging-fail threshold (PDF p. 3); protection functions (PDF p. 4) listed by ANSI number (overspeed 12, underspeed 14, undervoltage 27, aux battery undervoltage 27X, over/under-frequency 81O/81U, reverse power 32R …), no trip settings.

These agree with, and in two places directly support, the rules shipped: the Perkins "STOP if no oil pressure / maximum coolant exceeded" NOTICE matches the low-oil-pressure and overheating STOPs; the DSE MPU-screen procedure matches the speed-sensor action in the hunting and overspeed families.

**Comparison wording (exact-threshold rule).** Management ruled that equality with a verified limit counts as reaching it unless the OEM document explicitly defines a different comparison. The Perkins manual says "if maximum coolant temperature is *exceeded*, STOP the engine"; it does not define equality separately, so equality is treated as reaching (recorded in the dataset entry `documentComparison`). No other entry carries a numeric limit used by a rule.

**Classifications as recorded.** DSE CHARGE FAILURE — warning; DSE OVERSPEED and LOSS OF SPEED SIGNAL — shutdown (listed under shutdowns; trip values not published); Perkins "no oil pressure → STOP" and coolant maximum — shutdown (manual instruction to stop, not a controller trip); every other entry — not a limit.

## 2. Gaps (searched, not obtained) and precise reasons

| Wanted | Result | Reason |
|---|---|---|
| Cummins engine and PowerCommand manuals | Not used | Cummins QuickServe Online is login/licence-gated; not bypassed. No public PDF with the needed limits was found in this session. |
| Perkins generator (ElectropaK) manuals, "My Engine" | Not used | "My Engine" is login-gated; the public 1104D industrial manual above applies only to the models it names. |
| Caterpillar, Volvo Penta, FG Wilson, SDMO/Kohler | Not researched to completion | Time-boxed session; dealer portals (Cat SIS, Volvo Penta) are gated. Next action: search each maker's public literature pages. |
| DSE7310 MKII / DSE7320 MKII operator manual 057-253 | Not obtained | DSE's site serves downloads behind a form; only third-party mirrors (Scribd etc.) were found — not used. 057-074 entries are **not** applied to MKII models. |
| DSE factory defaults (overspeed, battery, charge alternator) | None published | The 057-074 configuration listing (PDF p. 110) shows placeholders (0 rpm, 0 V, 0 %), not defaults. |
| SmartGen HGM6100N / HGM7200 / HGM9510 manuals | Not obtained | The smartgen.cn download links returned an HTML page, not the PDF; manualshive.com mirror is protected by an anti-bot challenge (Anubis) — not bypassed; manuals.plus returned HTTP 403. |
| Datakom D-300 / 309 user manual | Not obtained | datakom.com.tr connection timed out (21 s) from this environment. |
| ComAp InteliLite 4 AMF 25 Global Guide (setpoints, defaults) | Not obtained | Not found as a public download in this session. |
| Woodward easYgen manuals | Not researched to completion | Time-boxed; next action: Woodward public manual library. |
| Any OEM oil-pressure *trip* value | None found | The Perkins section read gives a typical range, not a minimum. The STOP stays on the technician's entry. |

## 3. How to add a source

1. Public document only; record publisher, title, number, revision, date, URL, who hosts the copy (`accessedVia`), retrieval date and SHA-256 of the file read.
2. One entry per fact, with `equipment.models` exactly as the source names them, the page, and `kind` (`typical-range` entries must say they are not a limit).
3. Run `tests/regression/oracle-references-benchmark.test.ts`: schema, applicability (model A vs model B) and "never changes the diagnosis" checks must pass.

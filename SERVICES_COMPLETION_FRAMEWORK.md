# Service Page Content — How It Works and How to Extend It

**Status: all 10 service slugs have full technical content, live and rendering.**

This document replaces an earlier version that gave incorrect instructions. If you
are working from a copy of that version, stop and read the "What changed and why"
section at the bottom — it directed engineers to write into a field that renders
nowhere, and its example content contained technical errors.

---

## Where service content actually lives

| What | File | Renders via |
|---|---|---|
| Technical reference ("the bible") | `lib/services/serviceBibles.ts` | `components/services/ServiceBiblePanel.tsx`, mounted unconditionally in `ServiceDetailClient.tsx` |
| Diagnostics panel | `lib/services/serviceDiagnostics.ts` | `components/services/ServiceDiagnosticsPanel.tsx` |
| Commercial copy, pricing, FAQs | `lib/services/allServices.ts` | `ServiceDetailClient.tsx` |

Eight bibles cover ten slugs. The generator bible is shared by three:

```
GENERATOR_BIBLE     → cummins-generators, generator-repairs, ats-changeover
DISTRIBUTION_BIBLE  → distribution-boards
SOLAR_BIBLE         → solar-energy
MOTOR_BIBLE         → motor-rewinding
AC_BIBLE            → ac-installation
UPS_BIBLE           → ups-systems
PUMP_BIBLE          → borehole-pumps
INCINERATOR_BIBLE   → hospital-incinerators
```

**There is no renderer to write.** Every field on the `ServiceBible` interface is
already rendered and is covered by the panel's search filter. Add content to the
data and it appears on the page.

---

## To extend a service

1. Open `lib/services/serviceBibles.ts`.
2. Find the bible for the slug (see table above).
3. Add entries to the existing arrays. The fields are:

```
intro                 string[]              paragraphs of engineering context
topBrands             BrandProfile[]        capability summaries
installPhases         InstallPhase[]        phase + goal + checklist
partsManual           PartsManualGroup[]    grouped items, optional interval/note
repairManual          RepairProcedure[]     fault + priority + steps + optional warning
errorCodes            ErrorCodeEntry[]      code + family + meaning + severity + fix[]
roi                   ROIRow[]              scenario + capex + saving + payback + notes
warrantyOptions       string[]
qualityChecks         string[]
fastRepairCallouts    string[]
references            string[]              standards and sources
diagrams              string[]              ids from BibleDiagrams.tsx
```

4. Verify, then commit (see Verification below).

**Depth benchmark.** `GENERATOR_BIBLE` is the reference. As of the last content
pass every bible meets or exceeds it: 9+ repair procedures, 12+ error codes,
5+ ROI rows, 6+ parts groups, and 8+ standards references.

---

## Content discipline — this is the part that matters

The site is used by engineers who will act on what it says. Accuracy is the
product. The rules below are not style preferences.

**Error codes: cite families, never invent mappings.**
Use standards-based families the reader can verify — J1939 SPN/FMI, ANSI/IEEE
C37.2 device numbers, IEC series, controller categories (DSE 7000-series,
ComAp, PowerCommand), EASA test criteria, motor current signature analysis.
Do **not** invent OEM-looking codes such as `F001` or `D01` with specific
meanings. A technician who cannot match our code against the service manual in
their hand loses confidence in everything else on the page. If a specific OEM
code is genuinely needed, cite the manual it came from.

**Numbers must be checkable, and units stated.**
Every figure should be one a reader can verify against a standard, a datasheet
or arithmetic they can repeat. Where a rule of thumb is quoted in a particular
unit — BTU/h per m², mV per amp per metre — state that unit explicitly and give
the conversion. Prefer a worked example over a bare number.

**Cite the live standard.**
Check for supersession before adding a reference (ISO 10816 → ISO 20816,
ISO 1940-1 → ISO 21940-11). Where the old number is still in common field use,
write it as `ISO 20816 (formerly ISO 10816)` so both are searchable.

**Distinguish limits from targets.**
A legal emission limit value and a BAT-AEL are different numbers with different
consequences. Say which one you mean.

**Label estimates as estimates.**
All KES figures in ROI tables are indicative planning estimates and the panel
renders a caveat saying so. Do not present them as quotations. The same applies
to OEM warranty terms on brand cards, which vary by model, market and channel.

**Do not invent company policy or client history.**
Write engineering guidance, not claims about jobs we have done, volumes we
handle, or commitments we have not agreed to.

---

## Verification before commit

```bash
# Type-check the data file standalone (it has no imports, so this is fast)
node <path-to>/typescript/bin/tsc --noEmit --strict --target ES2020 \
  --skipLibCheck lib/services/serviceBibles.ts

# Full project type-check. Baseline is 18 pre-existing errors, all in
# _archive/dead-mirrors/, DiagnosticTools.tsx and ElectricalSchematics.tsx.
# If you see 18 and none in your files, you are clean.
node <path-to>/typescript/bin/tsc --noEmit -p tsconfig.json
```

Then read back every line you changed. A clean grep proves nothing — it only
shows the pattern you searched for, not whether the sentence still reads
correctly. Note that these files use **CRLF** line endings; any script that
rewrites them must preserve that.

Deploy is `git push origin worktree-market-leader-transformation:main`, which
auto-deploys via Vercel in roughly four minutes. Confirm with the owner first.

---

## What changed and why

The previous version of this document instructed engineers to fill a
`technicalContent` field on `Service` in `lib/services/allServices.ts`, and
supplied seed content for eight services.

That field has been **removed**, along with the two blocks that had been written
into it and the two now-orphaned interfaces (`TechnicalContent`, `ErrorCode`).
Three independent reasons:

1. **It rendered nowhere.** Nothing in `app/`, `components/` or `lib/` ever read
   it. Content written there was invisible to users and to search engines.
2. **It duplicated the bibles** by roughly 80% — a second, invisible copy of
   content that already existed and was maintained elsewhere.
3. **It was factually wrong** in ways that would have damaged credibility if it
   had ever rendered. Documented examples from the removed content:
   - Diesel compression given as "150–180 psi per cylinder". Diesel cranking
     compression is roughly 300–500 psi; an engine at 150 psi will not
     compression-ignite at all. This same figure appeared in the old seed text
     for Generator Repairs, so it would have propagated.
   - Generator derating given as "1–3% per 1 °C above 35 °C". ISO 3046 derating
     is on the order of 0.2–0.4% per °C — overstated by roughly an order of
     magnitude.
   - A troubleshooting step instructing the technician to "measure DC voltage at
     alternator output (150–500 V DC pulsing)". An alternator outputs AC; the
     DC is in the excitation circuit. The step is not performable as written.
   - AVR regulation given as ±5%; real AVR regulation is ±0.5–1%.
   - "AVR voltage output (should be 110 V DC)" presented as a universal test
     value. Excitation voltage is machine-specific and load-dependent.
   - Solar temperature derating stated as "0.5% per °C" in one field and
     "−1.2% per °C" in another field **of the same object**. Modern modules are
     roughly −0.29 to −0.40 %/°C for Pmax. The object contradicted itself.
   - Eighteen fabricated OEM-style error codes (`F001`–`F010`, `E001`–`E008`).

The removal is 227 lines, purely deletions, with no user-visible change —
verified by confirming zero consumers before removal and an unchanged
type-check baseline after.

**If you want to add technical content, add it to `serviceBibles.ts`.**

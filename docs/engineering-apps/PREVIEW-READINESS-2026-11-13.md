# Preview readiness report

13 Nov 2026 · branch `dev/p0-aquascan-pump-test-integrity` (local, uncommitted) · production unchanged at `079d0188` (`dpl_5SSpj75HqtUG7xjZYLtufj3uj6HB`).

## Verdict

**Ready to request approval for a protected preview.**

- Every preview-gate item management listed is **PASS**, except the items below, which need a decision or a live preview.
- **BLOCKED:**
  - dedicated test AI keys (provisioning and cost);
  - SEO approval of the /solar content changes before any production release;
  - Cummins 111 applicability (manual edition).
- **UNTESTED:** live-preview checks and the performance comparison, which need the preview itself.
- **FAILED:** two pricing items outside the authorised nine locations, which need a management decision.

Nothing has been committed, pushed or deployed.

## 1. Preview gate (management item 8)

| Item | Status | Evidence |
|---|---|---|
| Change inventory and diff summary | PASS | 49 modified files (+1,034 / −757 lines) and 26 new files (3 documents, 4 source, 19 tests). Full list in §4 |
| Preview secret isolation | PASS | Preview-scoped `GROQ_API_KEY` and `GEMINI_API_KEY` **deleted** (Vercel API, HTTP 200 each). Preview now has **0** environment variables; production keeps all 40, including both AI keys. No database, email, payment or messaging credential is in Preview. Vercel Authentication protects all preview URLs (`all_except_custom_domains`); 0 bypass tokens exist |
| Preview noindex | PASS (code) · UNTESTED (live) | A preview build sends `X-Robots-Tag: noindex, nofollow` on every path, and robots.txt disallows everything. A production build is unchanged (`preview-noindex`, 3 tests). Check the headers on the live preview |
| Form isolation | PASS (code) · UNTESTED (live) | Server guard `lib/env/liveDelivery.ts`: live delivery only when `VERCEL_ENV` is `production` (confirmed on live `/api/health`). Preview and local runs return a marked mock: nothing sent, nothing stored. Applied to `/api/contact`, `/api/notifications`, `/api/notifications/new-lead` and the order-email service. 6 tests prove that FormSubmit, Resend, SMTP, webhook, SMS and WhatsApp are not called and no lead is written, and that production still delivers |
| API compatibility | PASS | 13 route-level tests (§3). Every consumer of the changed solar API fields updated: Calculator, Analytics, Designer, Report, the BOQ engine and Solar Bible (reads sun-hours only) |
| Solar pricing corrections | PASS (authorised 9 locations, plus 3 found on the way) | §2; 10 unit tests plus 5 browser checks |
| Cummins fault-code regression | PASS | 7 tests. "Cummins 111" → SPN 629 FMI 12 (ECM, critical); "SPN 111" → coolant level. The test fails when the mapping is deliberately broken |
| Build and test report | PASS | Release check 13 Nov 20:46–21:10: lint 0 errors, build pass, AquaScan repeatability pass, route audit 18/18, site audit 0 errors on 433 pages, Googlebot audit pass, SEO compare pass. STEP2 (browser checks) passed at 21:19 after its three price checks were updated to the new policy. The first re-run hit two 502s from NASA POWER and Open-Meteo, a brief upstream outage: both answered 200 when probed, and the next run passed. Unit tests **816 / 816**; type check clean |
| SEO comparison | PASS (structure) · BLOCKED (content approval) | SEO compare vs production passed: titles, canonicals, robots, structured-data presence. The visible /solar wording changed (package prices → "Request a quotation", cost and payback FAQ answers, one stat), as did the solar FAQ answer in `ToolSeoContent`, which feeds FAQPage structured data. **Needs SEO approval before production** |
| Performance comparison | UNTESTED | The agreed method is an A/B of the old and new deployment, median of 3 Lighthouse runs. It needs the preview deployment. No new dependency; changes are logic and text |
| Security review | PASS | Secret scan of the full change: 0 findings (only test placeholders such as "not-a-secret" and `.invalid` hosts). No dependency changes. No new `eval` or raw HTML. Wizard error text sanitised. New inputs range-checked. Delivery guard closes the FormSubmit no-key path |
| Rollback procedure | PASS | §5 |
| Remaining risks | Listed | §6 |

## 2. Solar pricing corrections (management item 4)

**Policy:** the rates in `lib/solar/sizing.ts` are recorded as `PRICE_BASIS { verified: false, source: null, verifiedOn: null, KES, before VAT }`. With no verified basis, no tool shows them. Customers see "Request a quotation", or their own cost and tariff labelled as user-provided assumptions. Default tariffs (KES 25, and 18 for large users) and the default diesel price are no longer applied.

| # | Location | Change |
|---|---|---|
| 1 | `/api/solar/calculate` | `publicSizing()`: cost null, savings only from the customer's tariff or diesel price, payback only with a cost; optional `installedCostKes` (range-checked); no assumed commercial tariff |
| 2 | `/solar` page | Package cards show "Request a quotation" and expected kWh/month; cost and payback FAQ answers carry no figures; payback stat replaced |
| 3 | `ToolSeoContent` | Solar cost FAQ without prices (**SEO approval**) |
| 4 | Solar Design Studio Pro | Customer tariff and quoted cost inputs; no defaults |
| 5 | ROI calculator | Rewritten on the customer's tariff, quote and battery-replacement quote; "System quality" price selector removed |
| 6 | Equipment packages and Solar Bible | Cost analysis, report section and WhatsApp budget shown only with verified prices |
| 7 | Advanced features dashboard | Sample capex and savings (KSh 1,247,500 / 240,000 / 4,500,000 / 1,200,000) removed; customer inputs; runs refused without figures |
| 8 | BOQ engine and advanced calculator | Cost estimate null → "Request a quotation"; troubleshooting "~KSH cost" and "% success" removed |
| 9 | Designer | Customer capex only; BOM prices hidden; savings only with the customer's tariff (the engine's hidden KES 25 default bypassed) |
| 10 | Quote Checker | Price verdicts need verified references; until then it offers a free engineer review of the quotation |
| 11 | Proposal (PDF, Word, Excel) | No priced BOM; the client's quoted capex labelled as theirs; refuses to build a proposal without a cost |
| 12 | Calculator page | Blank tariff and diesel fields; quoted-cost input; null-safe |
| 13 | Analytics | "Request a quotation" / "Enter your tariff" instead of KSh 0 |

## 3. API compatibility (management item 2)

- `/api/solar/calculate`: legacy requests still return every engineering field. The price fields are present but null. Validation is unchanged (bad consumption, tariff or DoD → 400).
- `/api/building/comprehensive-report`: GET and POST return 501 `not_available`, with a message naming measured drawings and the engineer's number. It had no consumers.
- `/api/qs/takeoff/slab` (protected testing):
  - 12 × 8 × 0.15 m = 14.40 m³; openings deducted (13.842 m³);
  - negative dimensions, a negative thickness, mm typed as m, a missing thickness, negative openings, malformed openings and reserved names are all refused with 400;
  - other `/api/qs/*` endpoints still return 501;
  - no authentication, like the other stateless calculation endpoints: it stores nothing, and the site rate limits apply.

## 4. Change inventory

**Modified (49):**

- **Generator Oracle:** `lib/generator-oracle/server/faultIndex.ts`, `answer.ts`; `lib/data/cumminsErrorCodes.ts`, `generatorErrorCodes.ts`; `components/generator-oracle/GeneratorOracleModule.tsx`.
- **Solar:** `lib/solar/sizing.ts`, `solar3DDesignEngine.ts`; `lib/solar-genius/server/engineering-pro.js`, `engineering-elite.js`, `solar-engineering.js`; `app/api/solar/calculate/route.ts`; `app/solar/page.tsx`; `components/seo/ToolSeoContent.tsx`; `components/solar/Solar3DDesignStudio.tsx`, `SolarDesignStudioPro.tsx`, `SolarROICalculator.tsx`, `SolarBibleEngine.tsx`; `components/solar-modules/crc/…` (AdvancedFeaturesDashboard, AdvancedSolarCalculator, SolarCalculatorEngine, AnalyticsPage, CalculatorPage, DesignerPage, QuoteCheckerPage, ReportPage).
- **AquaScan:** `external/borehole-ai-engine/src/` boreholeAnalyzer, engineerConfidenceEngine, fieldCalibrationEngine, index, pumpTestAnalyzer, reliableFetch, reportGenerator, satelliteWaterEngine, scienceData, smartSurveyPlanner, types; `app/api/borehole/data-relay/route.ts`.
- **Building Suite:** `lib/wizard-api/buildingCalcs.ts`, `dispatcher.ts`; `app/api/building/comprehensive-report/route.ts`; `public/eims-building-suite-v20261105.html`.
- **Preview safety:** `lib/email/emailService.ts`; `app/api/contact/route.ts`; `app/api/notifications/route.ts`, `new-lead/route.ts`; `app/robots.ts`; `next.config.ts`.
- **Tests and checks:** `tests/api/contact-route.test.ts` (WhatsApp scan moved out; tests declare that they simulate production); `scripts/verify/step2.cjs` (three price checks updated to the new policy).

**New (26):**

- `lib/env/liveDelivery.ts`
- `lib/generator-oracle/calc/electrical.ts`
- `components/generator-oracle/panels/EngineeringCalculatorsPanel.tsx`
- `lib/solar-genius/server/seeded-random.js`
- 3 documents in `docs/engineering-apps/`
- 19 test files

## 5. Rollback procedure

1. **Production:** unchanged. If a later release misbehaves, promote `dpl_5SSpj75HqtUG7xjZYLtufj3uj6HB` again (Vercel instant rollback); `dpl_6dz9cCRxBqyqNDX3eDnF3fA2pgwE` stays as the older fallback. There are no data migrations, so rollback is code-only.
2. **Preview:** delete the preview deployment. Production keeps its keys, so no production setting depends on the Preview environment variables.
3. **Branch:** local and uncommitted. Any file can be restored from `079d0188` with `git checkout -- <path>`.

## 6. Remaining risks and items

| Item | Status | Needed |
|---|---|---|
| Dedicated non-production AI keys with caps and monitoring | BLOCKED | Provisioning and cost approval. Until then the AI features show "unavailable" on the preview |
| `/solar` and `ToolSeoContent` FAQ wording changes | BLOCKED | SEO approval before production |
| Cummins 111 applicability | BLOCKED | Cummins manual edition; flagged as pending in the audit |
| Pro Tools "sample proposal" with fixed example prices (labelled "fixed example, not a quotation") | FAILED vs policy | Decision: keep as a labelled sample, or remove |
| Other unsourced prices in SEO content: borehole survey KSh 40k–110k, diagnostic visit KSh 5k–15k, generator AMC KSh 60k–250k a year | FAILED vs policy (outside the authorised solar scope) | Management to confirm these as EmersonEIMS service rates with a date, or approve removal |
| Live preview checks (auth, noindex headers, form mock, AI unavailable) | UNTESTED | Run on the preview |
| Performance A/B | UNTESTED | Run on the preview |
| Independent published references beyond IRR and the directive benchmarks | UNTESTED | Continue (management item 6) |
| Building wizard file at release | BLOCKED | A new versioned file name (new public static URL) needs approval |
| Development-environment copies of the AI keys | Noted | Outside the instruction; unchanged |

P1 work (Oracle guided diagnostics, Solar design-to-proposal, AquaScan validation and soil data, Building take-off and BOQ) has not started, as instructed.

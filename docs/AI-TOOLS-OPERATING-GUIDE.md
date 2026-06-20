# EmersonEIMS — AI Tools Operating Guide

**Audience:** Business owner, sales team, and field technicians.
**Purpose:** Step-by-step "how to drive each AI tool, what result to expect, what report/quote it gives."
**Method:** Each tool below was documented by reading its actual source code (read-only — no tool file was modified). Where a feature is marketing copy rather than working code, it is flagged honestly so you never promise a customer something the tool cannot deliver.

> **The 6 flagship AI tools** (as listed in the homepage promo band, `components/ai/AIToolsPromo.tsx`):
> 1. Generator Oracle — `/generator-oracle`
> 2. Solar Genius Pro — `/solar-genius-pro`
> 3. AquaScan Pro — `/aquascan-pro-v3`
> 4. Pro Building Suite — `/pro-building-suite` (a.k.a. `/solutions/building`, `/eims-pro`)
> 5. Diagnostic Suite — `/diagnostics`
> 6. Solar & UPS Intelligence Hub — `/hub` (flagship sub-tool `/hub/solar-ups`)
>
> All 6 are also gathered on the **AI Tools hub: `/ai-tools`**.

---

## Honesty legend

- ✅ **Works now** — functional in code, safe to demo to a customer.
- ⚠️ **Partly real** — the screen works but the data is sample/estimated/hardcoded; fine as guidance, not as a binding figure.
- ❌ **Marketing only / not wired** — claim appears in copy but the code does not do it yet. Do **not** promise this to a customer.

A recurring theme across all tools: **the engineering calculations are real, but the prices, tariffs and "live/real-time/195-country" claims are mostly hardcoded Kenya snapshots.** Treat every shilling figure as an *estimate to be confirmed on a letterhead quote*, not a firm price.

---

# 1) Generator Oracle — `/generator-oracle`

**What it is:** An AI-assisted generator fault-diagnosis system: search fault codes, read causes and step-by-step repairs, view controller simulators and wiring diagrams, then build a professional PDF service report.

### How to operate it
1. **Open** `/generator-oracle`. On first use, accept the legal disclaimer (it is not affiliated with any controller maker) and pick a language (English, Swahili, French, Arabic, Portuguese, Amharic, Somali).
2. **Search a fault.** In the Command tab, type the code shown on the controller (e.g. `190-0`, `E020`) **or** a symptom ("low oil pressure", "overspeed"). Press search.
3. **Narrow it** with the **Brand** dropdown (DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, Cummins/CAT) and then **Model**.
4. **Open a result** to read: severity, full explanation, ranked causes, numbered diagnostic steps (with tools + expected reading), reset procedure for that controller, and repair solutions with difficulty/time/parts.
5. **(Optional) Controller Simulator** tab — shows a realistic on-screen replica of the controller so a technician can rehearse the button sequence.
6. **(Optional) AI photo analysis** — upload a photo of the controller/nameplate. ⚠️ The UI is there; the actual image AI is thin — treat results as a hint only.

### Result you get
- A full diagnosis: severity, causes, test steps, reset steps, and repair options with **indicative KES cost ranges**. ✅
- Wiring diagrams and manual references. ✅
- Live parameter gauges (RPM, oil pressure, voltages…). ⚠️ **The numbers are demo values, not a live feed from a real generator.**

### Report & quotation
- **Report builder** (Tools & Reports → Generate Report): fill Equipment, Customer, Photos, and a **Parts Quote** table (part, qty, unit price → auto total), add technician/customer signatures, then **Download PDF**. ✅
- The parts quote is **manual entry** — you type the prices. There is no automatic live parts-price catalogue. ⚠️

### Pricing / payment (for the tool itself)
- Tiered subscription with **M-Pesa STK-push** payment (Free / Basic KES 1,500 mo / Pro KES 4,500 mo / Enterprise KES 15,000 mo). ✅ (requires M-Pesa Daraja credentials configured on the server).
- Card payment shows "coming soon". ❌

### What to expect / caveats
- Fault search, detailed guidance, report PDF, offline mode (IndexedDB), and M-Pesa all work. ✅
- The "400,000+ codes" figure mixes manufacturer-verified codes with AI-template-extended entries — always tell certified customers to confirm against the OEM manual.
- Photo AI, live OBD-II/CAN telemetry, fleet/team, and API access are **UI shells**, not productive features yet. ❌

---

# 2) Solar Genius Pro — `/solar-genius-pro`

**What it is:** Designs a solar system and produces a branded multi-page proposal in minutes. It pulls **real** NASA irradiance, live weather, and OpenStreetMap roof data, then sizes the array/inverter/battery and builds a PDF/Word/Excel proposal.

### Sub-pages
- `/solar-genius-pro/solar-dashboard` — site assessment ("Mission Control").
- `/solar-genius-pro/calculator-advanced` — sizing & quoting.
- `/solar-genius-pro/design-studio` — place panels on a satellite map.
- `/solar-genius-pro/fault-codes` — inverter fault-code lookup.

### How to operate it
1. **Dashboard:** type the customer address → **Find site** → pick the suggestion. The tool fetches **real** solar irradiance (NASA POWER), **real** temperature (Open-Meteo) and **real** roof area (OpenStreetMap). ✅
2. **Calculator:** enter **Monthly consumption (kWh)** from the customer's bill, choose **Location** and **Roof type**, optionally a **Budget cap**, then **Calculate**.
3. Read the results grid: **system size (kW), panel count, inverter (kW), battery (kWh), CAPEX (KES), monthly savings, payback (years), annual production (MWh).** Values auto-save to the project.
4. **(Optional) Design Studio:** load the site, click on the roof to place panels, read live shading losses and production forecast.
5. **Report:** fill client name + contact → **Generate PDF**. Also exports **Word** and **Excel**.

### Result you get
- Real site data (irradiance, temperature, roof area) + a sized system + 25-year cash-flow proposal. ✅ for the engineering/site data.

### Report & quotation
- An **11-page branded proposal**: cover, exec summary, site assessment, system design, **bill of materials**, financial analysis, 25-year cash-flow, financing options, warranties, scope of work, environmental impact, data-source appendix. ✅
- This proposal **is** the customer quotation.

### What to expect / caveats
- ⚠️ **Prices are hardcoded Kenya values** (panel ≈ KES 12,500, inverter ≈ 35,000/kW, battery ≈ 36,000/kWh, tariff ≈ 25 KES/kWh). Accuracy ≈ ±20%. **Confirm against supplier prices before sending as a firm quote.**
- ⚠️ IRR/NPV use placeholder formulas (IRR fixed ~25%).
- ❌ No payment/"Accept & Pay" step — the flow ends at PDF download; follow up manually.
- ❌ "195+ countries / real-time pricing" is not real — it is Kenya-tuned.

---

# 3) AquaScan Pro — `/aquascan-pro-v3`

**What it is:** Pre-drilling borehole site intelligence. Give it a location (GPS, address, or a geotagged photo) and it estimates drilling success probability, depth, yield, water quality and cost, then produces a professional report — ideal for choosing the best of several candidate sites *before* spending on drilling.

### Sub-pages
- `/aquascan-pro-v3/reports` — report history (view/download/share).
- `/aquascan-pro-v3/compare` — rank multiple candidate sites side by side.

### How to operate it
1. **Set location** one of three ways: type GPS coordinates, fill the address form (geocoded), or upload a site photo (GPS read from the photo's EXIF). ✅
2. **(Optional)** add **Project type** (Domestic/Agri/Commercial/Industrial) and **expected daily demand (m³/day)**.
3. Click **Analyze Site.** The tool runs a multi-step pipeline using **real free data**: soil moisture & rainfall (Open-Meteo/GLDAS proxy), satellite-derived vegetation/water indices, nearby boreholes (OpenStreetMap + Kenya WRA county stats), reverse-geocoding. ✅
4. **Read the dashboard:** success-probability gauge, recommended depth, estimated yield, water-quality rating, risk matrix, soil profile, nearby boreholes, cost breakdown, recommendations.
5. **(Optional) Compare** up to 3 sites and let it pick the best by weighted score.

### Result you get
- A data-backed **pre-assessment** with depth, yield, quality and cost estimates. ✅ for the data fusion; ⚠️ for the predictions (rule-based scoring, not a trained lab-grade model).

### Report & quotation
- A 10+ page report (PDF/DOCX/CSV/JSON) with cover, executive summary, satellite & soil analysis, water-quality table, risk matrix, financial analysis, and a **formal quotation** section (drilling per metre, casing, pump, mobilisation, contingency) with payment terms (30% deposit / 40% mobilisation / 30% completion) and warranty. ✅

### What to expect / caveats
- ⚠️ Water-quality numbers are **geological estimates, not lab results.** NDVI/NDWI are derived from weather, not true satellite imagery (Sentinel/Landsat referenced but not fetched).
- ⚠️ Cost rates are **hardcoded Kenya 2024 figures** (~KES 5,500–6,500/m). The report itself states final cost may vary with actual ground conditions — keep that disclaimer visible to customers.
- ❌ The model is Kenya-tuned; don't rely on it outside Kenya. Payment (M-Pesa) is a stub.

---

# 4) Pro Building Suite — `/pro-building-suite` (also `/solutions/building`, `/eims-pro`)

**What it is:** Generates an architectural design, simplified structural design, and a detailed Bill of Quantities (BOQ) / quotation for a building from a few inputs.

### How to operate it
1. **Open** `/pro-building-suite`. Work through the phases / builder.
2. **Site & plot:** enter location and plot dimensions (terrain/soil are auto-suggested — ⚠️ these are seeded, not real survey data).
3. **Building:** choose type (house, apartment, office, warehouse, hospital, school, hotel…), **total area (m²)**, **floors**, bedrooms/bathrooms, **roof type**, **finish level** (Basic→Luxury), style.
4. **Generate Design** → floor plans, room layout, doors/windows, electrical/plumbing points; editable.
5. **Engineering+** → foundation type, concrete/steel grades, dead/live/wind loads, member sizing (⚠️ simplified factor-of-safety, not full FEA).
6. **3D View / Drawings** → interactive 3D model + site plan, floor plans, 4 elevations, 2 sections, roof plan.
7. **Costing / QS+** → choose currency → **BOQ** of 134+ line items across 10 sections.

### Result you get
- Floor plans, 3D model, drawings, structural summary, and a **134+ item BOQ with subtotal, preliminaries, contingency, overhead, VAT, grand total and cost/m².** ✅ as a concept-level deliverable.

### Report & quotation
- **The BOQ is the quotation.** Export the full **PDF report** (20–40 pages: drawings + structural summary + full BOQ + professional certification block), plus **Excel (BOQ), DXF (CAD), FBX/NWD/IFC (3D/BIM).** ✅

### What to expect / caveats
- ⚠️ Costing accuracy is concept-level (±30–40%). Material prices are a **Q1-2026 Kenya snapshot**; only ~14 countries have real multipliers; the rest fall back to Kenya×region. Exchange rates are static, not live.
- ❌ "195+ countries real-time pricing", "NASA satellite site analysis", "99.8% accuracy" are overstated — the environmental/soil/flood data is **pseudo-random seeded**, not real remote sensing.
- ⚠️ Structural output is for feasibility/budgeting — a registered engineer must sign off before construction.
- ❌ No payment processing; the BOQ is a document only.

---

# 5) Diagnostic Suite — `/diagnostics`

**What it is:** A free, lead-generating diagnostics centre: a fault-code library, an interactive symptom-to-cause troubleshooting wizard, and physics-based sizing calculators across 9 equipment types.

### Related pages
- `/diagnostics` — 9-service calculators + Q&A + gauges.
- `/faults` and `/faults/[code]` — searchable fault-code library.
- `/troubleshooting` — step-by-step decision-tree wizard.
- `/booking` — book a technician.

### How to operate it
- **Have a code?** Go to `/faults`, search the code (e.g. `SPN-111`), filter by brand, open the page for causes, steps, related parts and codes, then a WhatsApp/Call/Book CTA.
- **Have a symptom?** Go to `/troubleshooting`, pick the equipment (generator, solar, UPS, AC, motor, pump), answer the questions, and get a diagnosis with severity, causes, solutions, **estimated cost/time**, and a "DIY vs expert needed" flag.
- **Need a size?** Go to `/diagnostics`, pick a service, use the calculator (generator kVA, solar panels, UPS runtime, AC BTU, motor FLA, pump power, voltage drop, tank capacity, incinerator capacity). Formulas are correct and live. ✅

### Result you get
- Reasonable causes/solutions and **indicative** cost/time guidance. ✅ (every calculator carries an "indicative, not a binding quote" disclaimer.)

### Report & quotation
- ❌ **No PDF/report export here.** The customer screenshots or contacts you. The path to a quote is: diagnose → **Book Service** / WhatsApp / Call → your team quotes manually.

### What to expect / caveats
- ⚠️ The "400,000+ codes / 12+ brands" copy overstates what this page exposes (the curated set is ~36 codes / ~7 brands; the large vendor databases exist but aren't wired into this UI).
- ⚠️ Gauges show **demo values**, not live sensors.
- ❌ **The booking form is UI-only — it shows a confirmation but does not actually send/store the booking.** This is a lead-loss risk; see the SEO/visibility audit. Route it to `/api/contact` (which does deliver) before relying on it.

---

# 6) Solar & UPS Intelligence Hub — `/hub` (flagship `/hub/solar-ups`)

**What it is:** A professional workspace for sizing, **auditing supplier quotes**, verifying that a proposed system actually fits the load, checking product authenticity, and producing commissioning paperwork.

### The working sub-tools
| Sub-tool | URL | What it does |
|---|---|---|
| Smart Sizing Cockpit | `/hub/simulator` | Generator/UPS/fuel sizing with altitude+temperature derate and load profile. ✅ |
| UPS Live Lab | `/hub/ups-lab` | Add UPS models + appliance loads → live input/output, headroom, runtime, alarms. ✅ |
| Quotation Audit | `/hub/quote-audit` | Line-by-line review of a supplier quote vs benchmark; flags over-pricing, missing scope, vague/misleading wording; **exports PDF + Excel.** ✅ |
| Combination Verifier | `/hub/verifier` | Enter appliances + quote + budget → verdict + missing items + **10-year cost comparison** (3 tiers). ✅ |
| Authenticity Verification | `/hub/authenticity` | Weighted checklist + red flags for Pylontech, Victron, Jinko, Eaton → accept/caution/reject score. ✅ |
| Product Intelligence | `/hub/product-intelligence` | Searchable 130+ SKU catalogue with A–G suitability grade, stock, lead time. ⚠️ sample data. |
| Solar & UPS reference | `/hub/solar-ups` | PV generation + isolation gauges; UPS load/autonomy/topology reference. ✅ |
| Diagnostics cockpit | `/hub/diagnostics` | Live KPI/asset/event cockpit. ⚠️ sample data (no real telemetry yet). |
| Documentation Pack | `/hub/doc-pack` | Fill project header → printable SLD notes, commissioning checklist, acceptance record → **Save as PDF.** ✅ |

> ❌ **Stub pages** (titles exist, no working tool yet): `/hub/installation`, `/hub/maintenance`, `/hub/safety`, `/hub/abuse`, `/hub/power-quality`, `/hub/lifecycle`, `/hub/learn`.

### How to operate the two most useful ones
**Quotation Audit (`/hub/quote-audit`):** load/enter the supplier's BOQ lines → the tool compares each price to a benchmark, checks 15 required scopes, flags vague ("allowance", "to suit") and misleading ("genuine", "lifetime warranty") wording, checks the labour ratio, and proposes Premium/Balanced/Budget-safe alternatives → **Download PDF / Excel** to send back to the supplier.

**Combination Verifier (`/hub/verifier`):** tick the customer's appliances + quantities → enter the proposed products + budget → get **OK / Caution / Not adequate**, a missing-items & risk list, runtime at night load, and a **10-year cost-of-ownership** comparison across three tiers.

### What to expect / caveats
- ✅ All the calculators/auditors above are genuinely functional and client-side (no API key needed).
- ⚠️ Fuel price (195 KES/L), grid tariff (28 KES/kWh), derate and battery-life numbers are **sample defaults** — replace with your validated figures before quoting.
- ⚠️ Every page already carries a "SAMPLE" badge and PDF exports carry an "indicative pricing — final quote on letterhead" disclaimer. Keep these.
- ❌ Authenticity risk %s and the diagnostics cockpit are sample/illustrative, not a live feed or a manufacturer accusation.

---

## One-line summary for the sales team

| Tool | Use it to… | Gives a downloadable report? | Gives a price/quote? |
|---|---|---|---|
| Generator Oracle | Diagnose a generator fault | ✅ PDF service report | ⚠️ manual parts quote |
| Solar Genius Pro | Design + propose a solar system | ✅ PDF/Word/Excel proposal | ⚠️ estimate (confirm prices) |
| AquaScan Pro | Assess a borehole site before drilling | ✅ PDF/DOCX/CSV/JSON | ✅ drilling quotation (estimate) |
| Pro Building Suite | Design + cost a building | ✅ PDF + Excel/CAD/BIM | ✅ BOQ quotation (concept) |
| Diagnostic Suite | Free self-diagnosis → capture lead | ❌ (screenshot/contact) | ❌ → book service |
| Solar & UPS Hub | Size + audit quotes + verify products | ✅ audit PDF/Excel + doc-pack | audits/compares quotes |

**Golden rule for all six:** the *engineering* is trustworthy as guidance; the *prices* are estimates. Always close with a letterhead quote and a real engineer's sign-off where safety matters.

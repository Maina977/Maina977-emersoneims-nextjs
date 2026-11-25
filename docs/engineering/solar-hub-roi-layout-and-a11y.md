# /solar hub: ROI layout shift, accessibility and mobile fixes (2026-11-25)

Branch `ws/solar-hub-roi-ux`, based on production 34072f31. No calculation was changed.

## 1. The layout shift (CLS 0.28 on a 390 px phone, above 1.0 on slow loads)

**Cause.** Every lazily loaded /solar tool (`resilient(...)` or `next/dynamic`) showed the same
placeholder while its code downloaded: `animate-pulse ... h-96`, a fixed **384 px** box. The
Savings (ROI) Calculator is about **2,230 px** tall on a 390 px phone and about 1,100 px on a
1024 px laptop. When the module arrived late (after the 500 ms input grace period of a tab click),
everything below the panel (the rest of the page, the CTA band and the footer) jumped down by
1,800 px or more. After 12 s the "Still downloading ... Reload page" note was added below the
placeholder as well, which shifted the content again.

**Fix** (`components/solar/toolReserve.tsx`, used in `app/solar/page.tsx`):

* `ToolPlaceholder`: the pulse box, sized per breakpoint to the tool's final height minus 160 px,
  with `data-tool-reserve`, `role="status"` and a name ("Loading the Savings Calculator").
* `TOOL_SLOT`: on each tool's tab panel (`motion.div`),
  `has-[[data-tool-reserve]]:min-h-[...]`. While the panel contains the placeholder, it holds the
  tool's full final height, so the slow note appears inside the reserved space. As soon as the
  tool has arrived the rule no longer matches and the panel is exactly the tool's own height, so
  there is no empty gap when the user, for example, turns the battery off.
* No change to `lib/loading/*` or to the calculator logic. `sessionStorage` persistence is
  untouched. The tests confirm this.

| Tool | < 640 px | 640-1023 px | 1024-1279 px | >= 1280 px |
|---|---|---|---|---|
| Savings (ROI) Calculator | 2230 | 1820 | 1100 | 1050 |
| Size My System (SolarBibleEngine, step 1) | 1140 | 900 | 670 | 670 |
| Shop, booking, maintenance hub, 3D studio, 3D viewer | one screen (`100svh`) | same | same | same |

**How the heights were found.** I worked them out from the markup in the tool's default state.
I could not measure them, because a browser was out of scope for this work. The inputs were Inter
at the Tailwind sizes and line heights, and the paddings, gaps and grids. I also applied the
mobile rules in `app/globals.css` at 768 px and below: `p { line-height: 1.7; font-size: 1rem }`
and `a, button { min-height: 48px }`. Example for ROI at 390 px: the card padding and heading come
to 81 px, the inputs to 764 px, the gap to 32 px, the results to 1,325 px and the bottom padding
to 25 px, which gives about 2,227 px. The text-wrapping estimates are accurate to roughly ±5%.

**Why ±5% is enough.** When a tab is clicked, the panel starts just under the tab bar. A
reservation taller than the viewport leaves everything below the panel off screen when the tool
arrives. Moving content that is out of view does not count as a layout shift. For the same reason,
the tools whose height cannot be calculated simply reserve one screen height. A residual shift
only shows up if the visitor scrolls to the bottom of the placeholder while it is loading.

### 1b. Browser acceptance result and second fix (2026-11-25)

The coordinator measured the first fix with `solar-perf-bench.cjs TARGETS=roi PROFILE=mobile`, the
same instrument that found 0.282. It **failed**: production 0.282 ×3, branch 0.2796 ×3.

The trace showed a single shift, and its source was the page footer (previous height 238 px in
view, then 0). The visitor taps "Savings Calculator" before hydration. At that moment the tools
area in the server HTML is short and the footer is in view. After hydration the ROI panel is
inserted and pushes the footer down. The per-panel reservation could not prevent this, because it
does not exist until after hydration.

**Second fix:** `ToolPanelArea` (`components/solar/toolReserve.tsx`) wraps all tab panels in
`app/solar/page.tsx` with a `<div data-tool-panels class="min-h-screen">`. This div is in the
server HTML, so it is there from the first paint and causes no load shift.

* Because the container starts below the tab bar and is at least one screen tall, the footer
  begins below the screen after the tap. A panel arriving later moves only content that is out of
  view.
* `100vh` (`min-h-screen`) is used rather than `svh` because on phones `vh` is the large viewport.
  The footer therefore stays out of view even when the address bar is hidden.
* One screen is the smallest reservation that does this. Every tab is taller than one phone
  screen, so no tab gets an empty gap on a phone. On a large desktop, a short tab can leave space
  up to one screen tall.

`tests/regression/solar-tool-panels-ssr.test.tsx` renders the real `/solar` page with
`renderToString`. It asserts the container is in the server HTML with `min-h-screen`, sits after
the tab bar and before the footer, and contains the server-rendered panel. It also checks that
every `activeTab ===` panel is inside the container.

**Pass criterion (coordinator):** CLS below 0.1 on roi/mobile over 3 runs, and no regression on
load CLS. This has not been re-measured yet.

### 1c. The real cause, found by a browser trace (2026-11-25)

The second fix also failed: the branch measured 0.2796 ×3. The coordinator's trace again showed one
shift, from the footer. Before the tap, the footer's top (11,247 px) was reported *inside* the
tool-panel range (10,561 to 11,840 px), which cannot happen in normal flow.

**Mechanism.** `app/globals.css`, inside `@media (max-width: 768px)`, contains this rule:

```css
section:not(:first-child) { content-visibility: auto; contain-intrinsic-size: 0 500px; }
```

On a phone, every /solar section except the first is laid out at a 500 px placeholder height
while it is off screen. There is no `auto` keyword, so the real size is not remembered once the
section leaves the screen again.

* The tools section is really about 1,800 px tall and was counted as 500. Its content overflowed
  that 500 px box, which is why the footer appeared to overlap the panels.
* The final CTA section is about 1,300 px and was also counted as 500.
* Before the tap, the whole page was reported at 21,093 px. Fully rendered it is 37,060 px.
* When the tap scrolls the tool tabs into view, those sections are rendered at their real height.
  This pushes the footer, which was in view at the top of the screen, out of view. That is the
  0.28 shift.
* Production has the same rule and the same 0.282. The cause was never the ROI module's late
  arrival.

**Experiments.** I ran the coordinator's `roi-shift-diag.cjs` against preview 88197c93, adding
scroll, history and mutation logging, plus a CSS override injected before the page loads. Same
profile as the bench (390×844, 150 ms, 1.6 Mbps, CPU ×4, cold).

| Run | CLS (no recent input) |
|---|---|
| Unmodified | 0.2796 |
| A: `content-visibility: visible` on every section | 0.0000 ×2 |
| B: `visible` only on the tools section and the section between it and the footer | 0.0000 ×2 |

**Fix (B).** Both sections in `app/solar/page.tsx` carry `![content-visibility:visible]`.
Tailwind generates `content-visibility: visible !important`; I confirmed this with the project's
Tailwind CLI. The `!important` is needed because the global rule's selector
`section:not(:first-child)` is more specific than a single class.

* The rest of the page keeps the content-visibility optimisation.
* The shared `globals.css` is not changed.
* The one-screen panel container (1b) and the per-panel reservation (1) stay. They hold the space
  while a tool downloads, once the sections are rendered at their real height.

Test: `solar-tool-panels-ssr.test.tsx` asserts that the global rule is still present and that, in
the server HTML, the tools section and every section between the tab bar and the footer carry the
opt-out.

Limitation: another page whose sections sit below the viewport with tall real content has the same
500 px estimate on phones. That is a site-wide CSS question for the owner of `globals.css`, outside
the Solar hub.

## 2. Accessibility (axe on /solar)

| axe finding | Where | Change |
|---|---|---|
| **select-name** (critical, 1) | Location select, `app/solar/page.tsx` | `<span>Your Location:</span>` became `<label htmlFor="solar-location">`, and the select has `id="solar-location"` |
| **link-name** (1) | Floating WhatsApp button (`FloatingWhatsApp`). Its only text, "Chat Now", is `hidden` until hover | `aria-label="Chat with us on WhatsApp (opens in a new tab)"`; the svg is `aria-hidden` |
| **scrollable-region-focusable** (3) | Horizontal scrollers with nothing focusable inside: the brand comparison table, the photo carousel (`CinematicImageGallery`, carousel layout only, which is used only on /solar), and the tables and wiring diagrams in the Equipment, Wiring and Repair tabs | `tabIndex={0} role="region" aria-label="..."` on every one (9 in total) |
| **color-contrast** (8) | Open tool tab: white on amber-500, 2.1:1 | `bg-amber-500 text-slate-950` (the page's own amber/black CTA style) |
| | Tab badges: white on red-500, 3.8:1 | `bg-red-600`, 4.8:1 |
| | System-type capacity text and other `text-slate-500` / `text-gray-500` on dark backgrounds, about 3.6-4.2:1 | `-400`, about 7:1 |
| | "Talk to a Solar Engineer" and "Book a Site Survey": orange-600 on white, 3.6:1 | `text-orange-700`, 5.2:1 |
| | ROI calculator hints and the "How this is worked out" text (slate-500) | slate-400 |
| | Sizing calculator: active mode tab (amber-600 on white) and footer (gray-500) | amber-800 and gray-400 |
| | Booking form: white on amber-500 (current step, Next, Book another) | slate-950 text |

Also in this change: `aria-pressed` on the system-type buttons, the tab emoji are `aria-hidden`,
and all ten booking-form fields are given `htmlFor`/`id` labels (they had none).

The brand design is unchanged except where contrast required it: the colours are the same hues,
one step darker, or dark text on the same amber.

## 3. Mobile (390 px)

* Tap targets: the tool tabs have `min-h-[44px]`. The ROI sliders are now `h-11` (44 px hit area;
  the track looks the same). The "Include Battery Storage" row has `min-h-[44px]`. The location
  select has `min-h-[44px]`. Text inputs were already 50 px.
* Horizontal overflow: the booking step bar needed 400 px of a 292 px card. Its connectors are now
  `w-6 sm:w-16 md:w-24 mx-1 sm:mx-2`, so 256 px at 390 px. ROI result values carry
  `[overflow-wrap:anywhere]`, so a 7-digit "KES 1,234,567" cannot widen the two-column grid. The
  tables were already in scroll containers.
* Labels: all ROI inputs keep their visible labels (14 px, slate-300). The hints moved from
  slate-500 to slate-400.

## 4. Tests

* `tests/regression/solar-roi-results-unchanged.test.tsx`: three worked examples and a
  missing-input case, pinned against production 34072f31 before any change. They also cover
  remount and reload persistence through sessionStorage.
* `tests/regression/solar-hub-benchmarks.test.tsx`: the synthetic benchmark programme
  (`data/solar-hub/test-cases/`) with tolerances, invalid-input rejection and the integrity of the
  reference dataset.
* `tests/regression/solar-hub-layout-a11y.test.tsx`: the reservation classes for every tool, the
  label, the name, the focusable regions, contrast classes and tap targets.

## 5. Limitations register

| # | Limitation | Next action |
|---|---|---|
| L1 | The reserved heights are calculated, not measured (no browser in this workstream). Text wrap can differ by about ±5%. | Coordinator: measure the rendered ROI and sizing-calculator heights at 390, 768, 1024 and 1280 px, then adjust the six numbers in `toolReserve.tsx` (placeholder = slot − 160). |
| L2 | CLS before and after has not been measured here. The 0.28 "before" figure is the coordinator's. | Coordinator: run the slow-3G ROI scenario on the preview (see the report). |
| L3 | The reservation matches the default state. A state restored from sessionStorage (values entered) makes the ROI about 150-200 px shorter at 390 px, so content moves up by that much when the tool arrives. That is mostly off screen, for the reason in section 1. | Accept, or keep the reservation after load (this would leave a gap below the calculator). |
| L4 | `:has()` is needed for the full reservation (Chrome 105+, Safari 15.4+, Firefox 121+). Older browsers reserve all but 160 px. | None needed. |
| L5 | When all three download attempts fail, the short "Try again" panel replaces the reservation, which shifts the content once. | Accept: this is an error state. |
| L6 | The sizing calculator's orange header (white and amber-100 text on amber-600/orange-600) is below 4.5:1 for its small text. Fixing it means changing the header colour, which is a brand decision. | Owner decision. |
| L7 | I do not have the coordinator's axe node list, so the findings were matched by reading the code. Shared components on /solar (navigation, footer, B2B band, CTA section, inquiry form) were not changed, by rule. | Coordinator: rerun axe; report anything left in a shared component to its owner. |

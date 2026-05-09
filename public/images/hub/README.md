# /public/images/hub/ — Solar & UPS Intelligence Hub photos

Drop your real site photos here. The Hub renders them automatically via
`components/hub/hub-photos.ts`. Until a file exists the matching slot
shows a tasteful gradient placeholder (no broken image).

## Naming + format

- **One file per slot**, names listed below.
- **Format:** `.webp` preferred (smaller). `.jpg` is also OK — if you use
  JPG, update the matching `src` in `components/hub/hub-photos.ts`.
- **Recommended source size:** 1600 × 900 (16:9). Compress to under 250 KB.
- **Hero (`hub-hero.webp`):** 2400 × 900 (16:6). Compress to under 400 KB.

## Filenames expected

| Filename                       | What to show                                                            |
|--------------------------------|-------------------------------------------------------------------------|
| `hub-hero.webp`                | A wide, flagship shot — solar PV array + UPS room serving a real site.   |
| `verifier.webp`                | Engineer verifying a UPS + battery quote against a load schedule.        |
| `simulator.webp`               | Generator nameplate + sizing worksheet during a commercial site survey.  |
| `ups-lab.webp`                 | Three-phase online UPS rack with battery cabinets in a server room.      |
| `quote-audit.webp`             | Engineer reviewing a vendor BoQ + single-line diagram on a tablet.       |
| `product-intelligence.webp`    | Cummins genset alongside Eaton UPS units staged for delivery.            |
| `installation.webp`            | Distribution board with breakers, surge arrestors and labelled cabling.  |
| `authenticity.webp`            | Genuine Cummins engine nameplate / serial decal on an installed genset.  |
| `maintenance.webp`             | Technician performing scheduled service on a diesel generator.           |
| `safety.webp`                  | Battery room with ventilation, clearance and fire-suppression signage.   |
| `abuse.webp`                   | Damaged lead-acid battery showing thermal abuse — case-study reference.  |
| `power-quality.webp`           | Power-quality analyser clamped onto a three-phase distribution panel.    |
| `lifecycle.webp`               | Hybrid solar + diesel installation supporting a manufacturing site.      |
| `doc-pack.webp`                | Printed commissioning documentation pack with sign-off sheets and SLD.   |
| `learn.webp`                   | Training session with engineers reviewing a controller wiring schematic. |
| `diagnostics.webp`             | DeepSea controller display showing an active fault code on a generator.  |
| `solar-ups.webp`               | Roof-mounted solar PV combined with battery storage and UPS room.        |
| `library.webp`                 | A completed industrial power room — case-study reference image.          |

## Captions / credits (data-policy)

Captions render automatically from `hub-photos.ts`. By default every photo
captions as **"EmersonEIMS site photo"**.

If a particular slot is filled with **OEM press imagery** (Cummins, Eaton, APC,
Trojan, Victron, etc.) edit the matching entry in `hub-photos.ts` and set
`credit: 'Image: Cummins press kit'` (or similar).

If a slot is temporarily filled with **license-clean stock** (Unsplash /
Pexels / Pixabay) **you MUST** set `credit: 'Illustrative'` so the caption
renders as **"Illustrative photo"** — this prevents users from believing it
is one of our installs.

**Never** drop AI-generated composites that look like real installs we did
not perform. That is the visual equivalent of fabricated data.

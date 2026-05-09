/**
 * Hub Photo Manifest
 * ------------------
 * Single source of truth for every photoreal image used in the
 * Solar & UPS Intelligence Hub.
 *
 * Drop your real site photos into `public/images/hub/` using the
 * filenames below. The Hub renders them automatically. Until a file
 * exists the matching slot shows a tasteful gradient placeholder
 * (no broken image, no fake content).
 *
 * Naming convention: `<slug>.webp` (preferred — smaller) or `.jpg`.
 * Recommended source size: 1600x900 (16:9). Compress to <250 KB.
 *
 * Per data policy: every photo MUST be one of
 *   1. A real EmersonEIMS site photo (preferred — strongest trust + EEAT),
 *   2. Genuine OEM product imagery (Cummins / Eaton / APC / Trojan / Victron
 *      press kits — used per their media-room terms, with credit), or
 *   3. License-clean stock (Unsplash / Pexels / Pixabay) — and ONLY if the
 *      `credit` field below is set to "Illustrative" so the caption renders
 *      as "Illustrative photo" on the page.
 *
 * NEVER use AI-generated composites that look like real installs we did
 * not perform. That is the visual equivalent of fabricated data.
 */

export interface HubPhoto {
  /** Path under /public — must start with `/images/hub/`. */
  src: string;
  /** Accessibility + SEO. Describe the actual scene. */
  alt: string;
  /**
   * Caption credit. Use one of:
   *   - "EmersonEIMS site photo · <site name>, <town> · <year>"
   *   - "Image: <Brand> press kit"
   *   - "Illustrative" (forces the caption to render as
   *     "Illustrative photo" so users know this isn't our install)
   */
  credit: string;
}

/** Hero photo above the Smart Sizing Cockpit on /hub. */
export const HUB_HERO_PHOTO: HubPhoto = {
  src: '/images/hub/hub-hero.webp',
  alt: 'Solar PV array and UPS room serving a Kenyan facility',
  credit: 'EmersonEIMS site photo',
};

/**
 * Per-tool thumbnails.
 * Key = `/hub/<slug>` href, value = HubPhoto.
 */
export const HUB_TOOL_PHOTOS: Record<string, HubPhoto> = {
  '/hub/verifier': {
    src: '/images/hub/verifier.webp',
    alt: 'Engineer verifying a UPS + battery quote against a load schedule on site',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/simulator': {
    src: '/images/hub/simulator.webp',
    alt: 'Generator nameplate and sizing worksheet during a commercial site survey',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/ups-lab': {
    src: '/images/hub/ups-lab.webp',
    alt: 'Three-phase online UPS rack with battery cabinets installed in a server room',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/quote-audit': {
    src: '/images/hub/quote-audit.webp',
    alt: 'Engineer reviewing a vendor BoQ and single-line diagram on a tablet',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/product-intelligence': {
    src: '/images/hub/product-intelligence.webp',
    alt: 'Cummins generator alongside Eaton UPS units staged for delivery',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/installation': {
    src: '/images/hub/installation.webp',
    alt: 'Distribution board with breakers, surge arrestors and labelled cabling',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/authenticity': {
    src: '/images/hub/authenticity.webp',
    alt: 'Genuine Cummins engine nameplate and serial decal on an installed genset',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/maintenance': {
    src: '/images/hub/maintenance.webp',
    alt: 'Technician performing scheduled service on a diesel generator',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/safety': {
    src: '/images/hub/safety.webp',
    alt: 'Battery room with ventilation, clearance and CO2 fire-suppression signage',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/abuse': {
    src: '/images/hub/abuse.webp',
    alt: 'Damaged lead-acid battery showing thermal abuse — case study reference photo',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/power-quality': {
    src: '/images/hub/power-quality.webp',
    alt: 'Power-quality analyser clamped onto a three-phase distribution panel',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/lifecycle': {
    src: '/images/hub/lifecycle.webp',
    alt: 'Hybrid solar plus diesel installation supporting a manufacturing site',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/doc-pack': {
    src: '/images/hub/doc-pack.webp',
    alt: 'Printed commissioning documentation pack with sign-off sheets and SLD',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/learn': {
    src: '/images/hub/learn.webp',
    alt: 'Training session with engineers reviewing a controller wiring schematic',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/diagnostics': {
    src: '/images/hub/diagnostics.webp',
    alt: 'DeepSea controller display showing an active fault code on a generator',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/solar-ups': {
    src: '/images/hub/solar-ups.webp',
    alt: 'Roof-mounted solar PV array combined with battery storage and UPS room',
    credit: 'EmersonEIMS site photo',
  },
  '/hub/library': {
    src: '/images/hub/library.webp',
    alt: 'Completed industrial power room — case-study reference image',
    credit: 'EmersonEIMS site photo',
  },
};

/**
 * Helper used by HubPhoto.tsx to derive the visible caption.
 * - "Illustrative" → "Illustrative photo" (transparency requirement).
 * - "Image: <Brand> ..." → rendered verbatim (OEM press credit).
 * - Anything else → rendered verbatim.
 */
export function captionFor(photo: HubPhoto): string {
  if (photo.credit === 'Illustrative') return 'Illustrative photo';
  return photo.credit;
}

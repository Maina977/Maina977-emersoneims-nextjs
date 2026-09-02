/**
 * RECENT WORK — real, photographed EmersonEIMS projects.
 *
 * WHY THIS EXISTS
 * A design review found the site had no project evidence: product pages carried
 * one image each, /hub had eighteen empty photo slots, and every "why choose
 * us" claim rested on assertion rather than proof. For a buyer weighing a
 * KES 2,000,000 machine, one photograph of work actually done outranks a page
 * of adjectives.
 *
 * WHAT IS RECORDED HERE, AND WHAT IS NOT
 * Every fact below is either visible in the photographs or was stated by the
 * owner. Nothing is inferred to make a better story:
 *
 *   - The equipment, because it is legible in the images (VOLTKA branding on
 *     the canopies, "WhisperPower / WP-PMG Interface Board" on the PCB).
 *   - The month, from the camera date stamps and file dates (August 2026).
 *   - The location and scope, from the owner.
 *
 * CLIENTS ARE NAMED ON THE OWNER'S INSTRUCTION (2026-08-26): John Muhindi for
 * the Migori installation, Bart Arbman for the Kilifi genverter. A named client
 * is materially stronger evidence than "a mining operation in Migori" — it is
 * checkable, and checkable is the whole point of a case study.
 *
 * One standing caution, recorded here because it outlives this commit: OWNER
 * PERMISSION IS NOT CLIENT CONSENT. Both of these read as individuals rather
 * than companies, and a private customer who finds their name on a public site
 * without being asked can be justifiably annoyed. If either objects, remove the
 * `client` field — the case study still stands on the photographs, which is how
 * it shipped originally.
 *
 * NO OUTCOME IS CLAIMED beyond what the photographs show. The Kilifi board is
 * shown with its heat damage — the repair result is not asserted here because
 * there is no photograph of it working.
 */

export interface ProjectPhoto {
  src: string;
  /** Describe the actual scene — this is the alt text. */
  alt: string;
  /** Shown under the image. States what the photograph shows, nothing more. */
  caption: string;
}

export interface RecentProject {
  slug: string;
  /** Short label for the card. */
  title: string;
  /**
   * Client name, published on the owner's instruction. Optional: a project
   * without consent to be named still stands on its photographs.
   */
  client?: string;
  /** Where, at the level of detail we can publish. */
  location: string;
  /** When, to the month. */
  period: string;
  /** The service line this demonstrates — used to link to the right page. */
  service: string;
  serviceHref: string;
  /** One sentence a buyer would care about. */
  summary: string;
  /** What was actually done, in order. Each point must be evidenced. */
  work: string[];
  photos: ProjectPhoto[];
}

export const RECENT_PROJECTS: readonly RecentProject[] = [
  {
    slug: 'migori-mining-330kva',
    title: '330 kVA VOLTKA Cummins — supplied, delivered and installed',
    client: 'John Muhindi',
    location: 'Mining operation, Migori County',
    period: 'August 2026',
    service: 'Generator sales & installation',
    serviceHref: '/generators/sizes/300-kva',
    summary:
      'A 330 kVA VOLTKA Cummins set taken from our Nairobi warehouse to a mining site in Migori — supplied, transported, installed and commissioned with its changeover panel.',
    work: [
      'Set prepared and wrapped in the Nairobi warehouse, loaded by crane truck for the run to Migori.',
      'Positioned on site under cover, with the exhaust and cable routes set out before connection.',
      'VOLTKA changeover panel mounted at the wall and cabled to the set — the part that makes it start on its own when mains fails.',
      'Four-pole ATS wired through U, V, W and N with the controller commissioned.',
    ],
    photos: [
      {
        src: '/images/projects/migori-voltka-dispatch.webp',
        alt: 'Two VOLTKA generator sets wrapped in the EmersonEIMS Nairobi warehouse beside a crane truck',
        caption: 'Wrapped and loaded in our Nairobi warehouse before the run to Migori.',
      },
      {
        src: '/images/projects/migori-330kva-installed.webp',
        alt: '330 kVA VOLTKA generator installed on site with its changeover panel mounted on the wall',
        caption: 'Installed on site, with the VOLTKA changeover panel mounted and cabled.',
      },
      {
        src: '/images/projects/migori-ats-panel-internals.webp',
        alt: 'Changeover panel opened showing a four-pole automatic transfer switch wired to U, V, W and N terminals',
        caption: 'Inside the changeover panel — four-pole ATS, wired and commissioned.',
      },
      {
        src: '/images/projects/migori-site-work.webp',
        alt: 'EmersonEIMS site work during the Migori generator installation',
        caption: 'Site work during the Migori installation.',
      },
    ],
  },
  {
    slug: 'kilifi-yacht-genverter',
    title: 'Marine genverter — board-level diagnosis and repair',
    client: 'Bart Arbman',
    location: 'Yacht, Kilifi',
    period: 'August 2026',
    service: 'Inverter & electronics repair',
    serviceHref: '/repair-centre/industrial-electronics',
    summary:
      'A WhisperPower genverter off a yacht in Kilifi, stripped and diagnosed at board level in our Embakasi workshop rather than replaced as a unit.',
    work: [
      'Unit opened on the bench and the control electronics removed for inspection.',
      'WP-PMG interface board examined — heat damage found around the output stage, visible as charring on the board.',
      'Motor Connect board and the ten-pin loom connector checked, since a burnt output stage is as often a downstream fault as a board failure.',
      'Diagnosed at component level. Replacing the whole genverter is the usual advice on a marine set; repairing the board is a fraction of that.',
    ],
    photos: [
      {
        src: '/images/projects/kilifi-genverter-pcb-damage.webp',
        alt: 'WhisperPower WP-PMG interface board showing heat damage and charring around the output components',
        caption: 'The WP-PMG interface board — heat damage around the output stage.',
      },
      {
        src: '/images/projects/kilifi-genverter-motor-connect.webp',
        alt: 'Genverter Motor Connect board with a ten-pin loom connector, opened on the workshop bench',
        caption: 'Motor Connect board and the ten-pin loom connector.',
      },
      {
        src: '/images/projects/kilifi-genverter-bench.webp',
        alt: 'Marine genverter unit opened for diagnosis on the EmersonEIMS workshop bench',
        caption: 'The unit stripped for diagnosis at our Embakasi workshop.',
      },
      {
        src: '/images/projects/kilifi-genverter-detail.webp',
        alt: 'Close detail of the genverter control board during repair',
        caption: 'Board detail during diagnosis.',
      },
    ],
  },
] as const;

export function getProject(slug: string): RecentProject | undefined {
  return RECENT_PROJECTS.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return RECENT_PROJECTS.map((p) => p.slug);
}

import Image from 'next/image';
import Link from 'next/link';

/*
 * REPAIRS AND SYNCHRONISATION, IN OUR OWN PHOTOGRAPHS — added 2026-10-13.
 *
 * Owner request: put the new field photographs on the generator page, large,
 * split evenly between repair work and synchronisation work.
 *
 * Sixteen of the 34 photographs added to the owner's "IMAGES AND VIDEOS" folder
 * on 2026-10-12 are used: eight of an engine strip-down and eight of control
 * and AVR work. Duplicates, near-identical crane frames and one photograph of a
 * wall were left out. Every file was looked at before it was captioned.
 *
 * CAPTIONS SAY WHAT THE PHOTOGRAPH SHOWS AND NOTHING MORE. No client is named
 * (none has given a release), no kVA rating is attached to a machine, and no
 * outcome is claimed. The one technical claim, that the controller is a
 * synchronising type, was read off the photograph itself: the front panel in
 * controls-dse8610-on-load.webp is lettered "DEEP SEA ELECTRONICS DSE8610 MKII"
 * and its display reads On Load, 415 V, 50.3 Hz, 68.3 kW. The DSE8610 MKII is
 * Deep Sea's synchronising and load-sharing module.
 *
 * ONE THING WAS EDITED IN TWO PHOTOGRAPHS. controls-two-technicians.webp and
 * controls-engineer-at-panel.webp both show a HIGH VOLTAGE sticker with the
 * client’s company name printed under it, readable at display size. That line
 * of small print is blurred in both files and nothing else is touched. If the
 * client agrees to be named, re-export those two from the originals.
 *
 * Plain <Image> with real width and height, no client-side gallery: the
 * existing "Generator Excellence in Action" carousel above is loaded with
 * ssr: false, so none of its photographs reach the server HTML. These do.
 * Each opens at full size in a new tab, which is the "enlarge" the owner asked
 * for without shipping a lightbox script.
 */

export interface Shot {
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const BASE = '/images/repairs-sync/';

const REPAIR_SHOTS: Shot[] = [
  { file: 'overhaul-head-and-old-gasket.webp', width: 1600, height: 1205, alt: 'Cylinder head and old head gasket laid out beside a generator during an engine overhaul', caption: 'Cylinder head and the old head gasket laid out beside the set' },
  { file: 'overhaul-cylinder-head-removed.webp', width: 1205, height: 1600, alt: 'Six-cylinder cylinder head removed from a generator engine for overhaul', caption: 'Six-cylinder head removed from a generator engine for overhaul' },
  { file: 'overhaul-cylinder-head-valves.webp', width: 1600, height: 1205, alt: 'Close-up of the valves and combustion faces on a removed cylinder head', caption: 'Valves and combustion faces on the removed cylinder head' },
  { file: 'overhaul-block-liners-exposed.webp', width: 1205, height: 1600, alt: 'Generator engine block with the head off and the cylinder liners exposed', caption: 'Engine block with the head off and the cylinder liners exposed' },
  { file: 'overhaul-fuel-injection-pump.webp', width: 1600, height: 1205, alt: 'Inline fuel injection pump on a generator engine during overhaul', caption: 'Inline fuel injection pump on the engine during the overhaul' },
  { file: 'overhaul-crankshaft-main-bearings.webp', width: 1205, height: 1600, alt: 'Underside of an engine block showing the crankshaft and main bearing caps', caption: 'Underside of the block: crankshaft and main bearing caps' },
  { file: 'crane-lifting-canopy-set.webp', width: 1600, height: 1205, alt: 'Crane truck lifting a canopy generator onto a flatbed while the team guides it', caption: 'A canopy set lifted onto a flatbed by crane truck' },
  { file: 'open-frame-set-plant-room.webp', width: 1600, height: 1205, alt: 'Open-frame Perkins generator set in a plant room', caption: 'Open-frame Perkins set in a plant room' },
];

const CONTROL_SHOTS: Shot[] = [
  { file: 'controls-engineer-at-panel.webp', width: 1200, height: 1600, alt: 'EmersonEIMS engineer in branded hi-vis at the control panel of a CAT generator', caption: 'Our engineer at the control panel of a CAT generator' },
  { file: 'controls-dse8610-on-load.webp', width: 1200, height: 1600, alt: 'Deep Sea Electronics DSE8610 MKII controller showing the generator on load at 415 V and 50.3 Hz', caption: 'Deep Sea DSE8610 MKII with the set on load: 415 V, 50.3 Hz, 68.3 kW' },
  { file: 'controls-cabinet-new-controller.webp', width: 1200, height: 1600, alt: 'Generator control cabinet open mid-job with a new controller wired on the door', caption: 'Control cabinet open mid-job, the new controller wired on the door' },
  { file: 'controls-two-technicians.webp', width: 1200, height: 1600, alt: 'Two EmersonEIMS technicians in branded hi-vis working at a CAT generator control panel', caption: 'Two of our technicians working together at the control panel' },
  { file: 'controls-controller-rear-loom.webp', width: 1600, height: 1200, alt: 'Rear of a Deep Sea generator controller on the cabinet door with the wiring loom routed', caption: 'Rear of the controller on the cabinet door, loom routed and tied' },
  { file: 'controls-avr-excitation-module.webp', width: 1200, height: 1600, alt: 'Automatic voltage regulator and excitation module inside a generator terminal box', caption: 'AVR and excitation module inside the generator terminal box' },
  { file: 'controls-finished-panel.webp', width: 1200, height: 1600, alt: 'Finished generator control panel with Deep Sea controller, emergency stop and selector switches', caption: 'Finished panel: controller, emergency stop and selector switches' },
  { file: 'controls-second-set-control-box.webp', width: 1200, height: 1600, alt: 'Open control box on a second canopy generator showing the controller rear, relays, fuses and terminals', caption: 'Control box on the second canopy set: controller, relays, fuses, terminals' },
];

/*
 * PHONE: ONE SWIPEABLE ROW. TABLET: TWO ACROSS. DESKTOP: THREE ACROSS.
 *
 * The first build stacked all sixteen photographs full width on a phone.
 * Measured in Chrome at 390px that made this one section 8,199px tall, about
 * ten screens of scrolling between the gallery and the price list. A
 * scroll-snap row keeps each photograph at 85% of the screen width, which is
 * the "large" the owner asked for, and holds each group to one screen of
 * height. It is CSS only; no script is shipped for it.
 *
 * Desktop went from two across to three for the same reason: at two across each
 * photograph was 580px wide and the section ran to 7,013px, 7.8 screens at
 * 1440x900. Every photograph still opens at full size on a tap or click.
 */
export function ShotGrid({ shots }: { shots: Shot[] }) {
  return (
    <div className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-3 sm:block sm:columns-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:columns-3">
      {shots.map((shot) => (
        <figure
          key={shot.file}
          className="w-[85vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-gray-950 sm:mb-5 sm:w-auto sm:max-w-none sm:break-inside-avoid"
        >
          <a
            href={BASE + shot.file}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full size: ${shot.caption}`}
            className="block"
          >
            <Image
              src={BASE + shot.file}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="h-auto w-full"
            />
          </a>
          <figcaption className="px-4 py-3 text-sm leading-relaxed text-gray-300">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function RepairSyncShowcase() {
  return (
    <section className="border-t border-white/5 bg-black py-20" aria-labelledby="repair-sync-heading">
      <div className="eims-shell">
        <div className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-amber-500">
            Our engineers at work
          </span>
          <h2 id="repair-sync-heading" className="mt-2 mb-4 text-4xl font-bold text-white md:text-5xl">
            Generator Repairs and Synchronisation
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
            Photographs from our own jobs in 2026. Tap any picture to open it at full size.
          </p>
          <p className="mt-3 text-sm text-gray-500 sm:hidden">Swipe sideways to see each set.</p>
        </div>

        <div className="mb-16">
          <h3 className="mb-2 text-2xl font-bold text-white">Engine repair and overhaul</h3>
          <p className="mb-6 max-w-3xl leading-relaxed text-gray-400">
            A six-cylinder generator engine stripped on site: head off, liners and fuel pump exposed,
            and the bottom end opened to the crankshaft. Sets that cannot be repaired where they
            stand are lifted out by crane and taken to the workshop.
          </p>
          <ShotGrid shots={REPAIR_SHOTS} />
        </div>

        <div>
          <h3 className="mb-2 text-2xl font-bold text-white">Controls, AVR and synchronisation</h3>
          <p className="mb-6 max-w-3xl leading-relaxed text-gray-400">
            Deep Sea DSE8610 MKII synchronising and load-sharing controllers fitted to a CAT set and
            a second canopy set, with the AVR and control wiring re-terminated by our own team so
            the sets can run in parallel and share the load.
          </p>
          <ShotGrid shots={CONTROL_SHOTS} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/services/generator-repairs"
            className="rounded-full bg-amber-500 px-7 py-3 font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Generator repair service
          </Link>
          <Link
            href="/solutions/diesel-automation"
            className="rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Automation and synchronisation
          </Link>
        </div>
      </div>
    </section>
  );
}

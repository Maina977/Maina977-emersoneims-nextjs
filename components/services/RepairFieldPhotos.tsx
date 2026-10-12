import { ShotGrid, type Shot } from '@/components/generators/RepairSyncShowcase';

/*
 * FIELD PHOTOGRAPHS ON THE GENERATOR REPAIRS PAGE — added 2026-10-14.
 *
 * The owner asked for the new photographs to be used "at the point of repairs".
 * Sixteen went onto /generators on 2026-10-13. These nine are the ones left
 * over from the same batch that show repair work and are not duplicates, so the
 * two pages carry different photographs rather than the same set twice.
 *
 * Same rules as RepairSyncShowcase, whose grid this reuses: every file was
 * looked at first, captions say only what is in the frame, no client is named,
 * and no rating or outcome is claimed. repair-two-technicians-at-set.webp and
 * repair-engineer-checking-controller.webp have the client's company name on
 * the HIGH VOLTAGE sticker blurred; nothing else in them is altered.
 *
 * Not added: the two crane-delivery videos from the same folder. Their frames
 * were checked, but there was no tool available to listen to or remove the
 * sound track, and footage is not published here with audio nobody has heard.
 */

const SHOTS: Shot[] = [
  { file: 'repair-rewiring-control-cabinet.webp', width: 1200, height: 1600, alt: 'EmersonEIMS technician in a branded hi-vis jacket rewiring the control cabinet of a CAT generator', caption: 'Our technician rewiring the control cabinet of a CAT generator' },
  { file: 'repair-avr-board-terminal-box.webp', width: 1200, height: 1600, alt: 'Automatic voltage regulator board with capacitor inside a generator terminal box', caption: 'AVR board and capacitor inside the generator terminal box' },
  { file: 'repair-engineer-checking-controller.webp', width: 1200, height: 1600, alt: 'EmersonEIMS engineer checking the controller on a CAT generator', caption: 'Our engineer checking the controller on a CAT generator' },
  { file: 'repair-tracing-control-wiring.webp', width: 1200, height: 1600, alt: 'EmersonEIMS technician tracing control wiring inside a generator cabinet', caption: 'Tracing control wiring inside the generator cabinet' },
  { file: 'repair-avr-module-being-fitted.webp', width: 1200, height: 1600, alt: 'Technician working on the AVR and excitation module inside a generator terminal box', caption: 'Working on the AVR and excitation module in the terminal box' },
  { file: 'repair-cabinet-relays-reterminated.webp', width: 1200, height: 1600, alt: 'Generator control cabinet with relays, fuses and control wiring being re-terminated', caption: 'Relays, fuses and control wiring being re-terminated' },
  { file: 'repair-two-technicians-at-set.webp', width: 1200, height: 1600, alt: 'Two EmersonEIMS technicians at a CAT generator, the company logo on the hi-vis jacket', caption: 'Two of our technicians at a CAT generator' },
  { file: 'repair-canopy-set-before-lift.webp', width: 1600, height: 1205, alt: 'FG Wilson canopy generator standing on site before being lifted by crane', caption: 'An FG Wilson canopy set on site before the lift' },
  { file: 'repair-securing-set-on-truck.webp', width: 1600, height: 1205, alt: 'Team securing a canopy generator on a crane truck', caption: 'The team securing the set on the crane truck' },
];

export default function RepairFieldPhotos() {
  return (
    <section className="border-t border-white/5 bg-black py-16" aria-labelledby="repair-field-photos-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="repair-field-photos-heading" className="mb-3 text-3xl font-bold text-white md:text-4xl">
          Our engineers on repair jobs
        </h2>
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-400">
          Photographs from our own repair work in 2026: control cabinets rewired, AVRs replaced and
          tested, and sets lifted out for the workshop. Tap any picture to open it at full size.
        </p>
        <p className="mb-4 text-sm text-gray-500 sm:hidden">Swipe sideways to see them all.</p>
        <ShotGrid shots={SHOTS} />
      </div>
    </section>
  );
}

/**
 * PROPERTY-WIDE ENGINEERING, ORGANISED BY THE CUSTOMER'S PROBLEM.
 *
 * WHY THIS EXISTS
 * /industries/hotels-hospitality is a good page that answers one question:
 * what happens when the power fails. Its hero is "Never Lose a Guest to a Power
 * Outage Again", and every one of its five pain points is an outage — bad
 * reviews, food spoilage, security, events, pool equipment.
 *
 * That is half the conversation. A hotel's engineering problems are not only
 * electrical. Guests complain about cold showers more often than about power,
 * kitchens flood, risers block, and the hot water on the top floor takes a
 * minute to arrive. EmersonEIMS does all of that work and the page never said
 * so, which meant the site approached a hotel saying "we sell generators"
 * instead of "we can maintain the engineering infrastructure of your property".
 *
 * The second proposition is worth considerably more per customer, and it is the
 * one that is actually true.
 *
 * HOW THIS IS ORGANISED, AND WHY NOT BY TRADE
 * lib/services/serviceDivisions.ts already organises the same work by TRADE,
 * which is how an engineer thinks. This file organises it by SYSTEM OF THE
 * BUILDING, which is how a general manager thinks: power, water, guest comfort,
 * kitchen and back of house, and who maintains it afterwards. Same destinations,
 * different question. That is a genuine second cut, not a duplicate — the
 * divisions answer "what do you do", this answers "what do you do for me".
 *
 * EVERY HREF IS A REAL ROUTE, enforced by scripts/check-divisions.mjs, which
 * scans this file as well.
 *
 * KEYED BY INDUSTRY SLUG so other sectors can be added without touching the
 * component. Hotels first because hospitality is the clearest case of a single
 * property needing every trade at once. An industry with no entry renders
 * nothing, which is the correct behaviour for a sector we have not thought
 * through yet.
 */

export interface PropertySystem {
  title: string;
  /** What the manager actually worries about. Plain language, no selling. */
  concern: string;
  icon: string;
  items: { label: string; href: string }[];
}

export interface PropertyProfile {
  heading: string;
  lede: string;
  systems: PropertySystem[];
}

export const PROPERTY_ENGINEERING: Record<string, PropertyProfile> = {
  'hotels-hospitality': {
    heading: 'The whole property, not just the generator',
    lede:
      'A hotel does not have a power contractor, a plumber, an HVAC company and a pump company because it wants four contractors. It has four because nobody offered to do all of it. When a cold shower on the fourth floor turns out to be a booster pump, and the booster pump turns out to be a control fault, one company holding all three ends is the difference between a fix and an argument.',
    systems: [
      {
        title: 'Power',
        concern:
          'The grid fails and the property keeps running — lights, lifts, locks, WiFi, cold rooms — without a guest noticing the changeover.',
        icon: '⚡',
        items: [
          { label: 'Generators — supply and installation', href: '/generators' },
          { label: 'VOLTKA generators, Cummins-powered', href: '/voltka' },
          { label: 'Automatic transfer switches', href: '/services/ats-changeover' },
          { label: 'UPS for reception, servers and security', href: '/services/ups-systems' },
          { label: 'Solar and hybrid generation', href: '/services/solar-energy' },
          { label: 'Distribution boards and switchgear', href: '/services/distribution-boards' },
        ],
      },
      {
        title: 'Water',
        concern:
          'Water reaches every floor at usable pressure, through an intermittent mains supply, without the storage running dry at 07:00.',
        icon: '💧',
        items: [
          { label: 'Plumbing and water distribution', href: '/services/plumbing' },
          { label: 'Storage tanks, booster pumps and pressure systems', href: '/services/plumbing' },
          { label: 'Borehole pumps', href: '/services/borehole-pumps' },
          { label: 'Borehole drilling and yield testing', href: '/services/borehole-drilling' },
          { label: 'Pump repair and pressure vessel faults', href: '/repair-centre/pumps' },
        ],
      },
      {
        title: 'Guest comfort',
        concern:
          'Hot water arrives hot at the far end of the corridor, the room is cool, and the bathroom works — the three things a guest reviews you on.',
        icon: '🚿',
        items: [
          { label: 'Hot water systems and circulation loops', href: '/services/plumbing' },
          { label: 'Bathrooms: WCs, basins, showers and mixers', href: '/services/plumbing' },
          { label: 'Air conditioning installation and repair', href: '/services/ac-installation' },
          { label: 'Ventilation and cooling design', href: '/services/air-conditioning' },
          { label: 'Blocked drains, leaks and low pressure', href: '/maintenance-hub/plumbing' },
        ],
      },
      {
        title: 'Kitchen & back of house',
        concern:
          'The kitchen, laundry and staff facilities run at full load at the worst possible moment, and the drainage keeps up.',
        icon: '🍳',
        items: [
          { label: 'Commercial kitchen plumbing', href: '/services/plumbing' },
          { label: 'Commercial hot water and laundry supply', href: '/services/plumbing' },
          { label: 'Drainage, waste and grease-line pipework', href: '/maintenance-hub/plumbing' },
          { label: 'Kitchen and laundry electrical distribution', href: '/services/distribution-boards' },
          { label: 'Motor and pump repair', href: '/services/motor-rewinding' },
        ],
      },
      {
        title: 'Maintenance',
        concern:
          'Somebody is responsible for all of it on a schedule, so faults are found on a planned visit rather than by a guest at midnight.',
        icon: '🗓️',
        items: [
          { label: 'Scheduled maintenance contracts', href: '/maintenance-hub' },
          { label: 'Generator maintenance', href: '/maintenance-hub/generators' },
          { label: 'Plumbing maintenance', href: '/maintenance-hub/plumbing' },
          { label: 'HVAC maintenance', href: '/maintenance-hub/hvac' },
          { label: 'Solar maintenance', href: '/maintenance-hub/solar' },
          { label: 'Electrical maintenance', href: '/maintenance-hub/electrical' },
          { label: 'Borehole and pump maintenance', href: '/maintenance-hub/borehole' },
        ],
      },
    ],
  },
};

export function getPropertyProfile(industrySlug: string): PropertyProfile | null {
  return PROPERTY_ENGINEERING[industrySlug] ?? null;
}

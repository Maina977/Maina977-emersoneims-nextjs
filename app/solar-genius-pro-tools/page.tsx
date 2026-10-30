import { redirect } from 'next/navigation';

/**
 * Old SolarGenius Pro "tools" route. next.config.ts already sends it to
 * /solar-genius-pro with a 308; this page does the same if that rule is ever
 * bypassed. The component it used to render (with fabricated roof, shading,
 * IRR and incentive figures) was deleted on 2026-10-30.
 */
export default function SolarGeniusProToolsPage() {
  redirect('/solar-genius-pro');
}

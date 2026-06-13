// ═══════════════════════════════════════════════════════════════════════════════
// ServiceDeepDive — surfaces the engineering deep-dives on the LIVE /services/[service]
// pages that several /solutions/* URLs 308-redirect to. Only maps the slugs whose
// canonical home is the /services page (i.e. the orphaned ones) — deliberately does
// NOT render deep-dives whose canonical URL is elsewhere (/generators, /solar,
// /solutions/incinerators) to avoid duplicate content.
// ═══════════════════════════════════════════════════════════════════════════════

import UPSEngineeringDeepDive from '@/components/solutions/UPSEngineeringDeepDive';
import MotorRewindingEngineeringDeepDive from '@/components/solutions/MotorRewindingEngineeringDeepDive';
import MotorSelectionEngineeringDeepDive from '@/components/solutions/MotorSelectionEngineeringDeepDive';
import HVACEngineeringDeepDive from '@/components/solutions/HVACEngineeringDeepDive';
import BoreholePumpEngineeringDeepDive from '@/components/solutions/BoreholePumpEngineeringDeepDive';
import ControlsEngineeringDeepDive from '@/components/solutions/ControlsEngineeringDeepDive';

export default function ServiceDeepDive({ slug }: { slug: string }) {
  switch (slug) {
    case 'ups-systems':
      return <UPSEngineeringDeepDive />;
    case 'motor-rewinding':
      return (
        <>
          <MotorRewindingEngineeringDeepDive />
          <MotorSelectionEngineeringDeepDive />
        </>
      );
    case 'ac-installation':
      return <HVACEngineeringDeepDive />;
    case 'borehole-pumps':
      return <BoreholePumpEngineeringDeepDive />;
    case 'ats-changeover':
      return <ControlsEngineeringDeepDive />;
    default:
      return null;
  }
}

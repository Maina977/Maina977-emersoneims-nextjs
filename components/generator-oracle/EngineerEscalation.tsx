/**
 * Generator Oracle -> engineer (external audit, Nov 2026, §5: "each tool should
 * have a clear escalation route to an engineer").
 *
 * Shown under fault results and inside the fault detail view. It carries the
 * fault code and title only (no personal data) into the booking form and a
 * pre-filled WhatsApp message, so the engineer starts from the same fault the
 * customer looked up. The safety line repeats the tool's rule: guidance is
 * preliminary, and live electrical work is for an engineer.
 */
import { waLink } from '@/lib/serviceConnect/actions';

export function bookingHrefForFault(code: string, title?: string): string {
  const fault = [code, title].filter(Boolean).join(' - ').slice(0, 160);
  return `/booking?type=generator-service&fault=${encodeURIComponent(fault)}`;
}

export default function EngineerEscalation({ code, title }: { code: string; title?: string }) {
  const fault = [code, title].filter(Boolean).join(' - ');
  return (
    <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4" data-testid="engineer-escalation">
      <p className="font-semibold text-amber-200">Need an engineer for this fault?</p>
      <p className="mt-1 text-sm text-slate-300">
        This is preliminary guidance. If the fault persists, or a check would mean working on live
        electrical parts, stop and let an engineer inspect the set.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={bookingHrefForFault(code, title)}
          className="rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-black hover:bg-amber-400"
        >
          Book an engineer
        </a>
        <a
          href={waLink(`Hi EmersonEIMS, I need an engineer for this generator fault: ${fault}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-green-500/50 px-4 py-2 text-center text-sm font-semibold text-green-300 hover:bg-green-500/10"
        >
          Send this fault on WhatsApp
        </a>
      </div>
    </div>
  );
}

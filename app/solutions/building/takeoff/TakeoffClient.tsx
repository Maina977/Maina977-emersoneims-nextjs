'use client';

import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const TakeoffWorkbench = resilient(() => import('@/components/qs/TakeoffWorkbench'), {
  name: 'the take-off workbench',
  subject: 'the take-off workbench',
  variant: 'panel',
  loading: () => <p className="p-4 text-sm text-slate-400">Loading the take-off workbench…</p>,
  failedTitle: 'The take-off workbench did not download.',
  failedBody: 'This is usually a dropped or slow connection. Your autosaved take-off draft stays in this browser. Press Try again to download it again.',
});

export default function TakeoffClient() {
  return <TakeoffWorkbench />;
}

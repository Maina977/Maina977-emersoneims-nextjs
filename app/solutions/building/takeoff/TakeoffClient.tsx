'use client';

import dynamic from 'next/dynamic';

const TakeoffWorkbench = dynamic(() => import('@/components/qs/TakeoffWorkbench'), { ssr: false, loading: () => <p className="p-4 text-sm text-slate-400">Loading the take-off workbench…</p> });

export default function TakeoffClient() {
  return <TakeoffWorkbench />;
}

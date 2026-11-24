/**
 * PER-PAGE CODE LOADING for the Solar Genius Pro workspace (Solar performance,
 * 2026-11-25). Before this, App.tsx imported all 25 pages, so every visit
 * downloaded about 850 KB (three.js, charts, every tool) before the asked-for
 * screen could show: measured 4 in 10 cold Quote Checker loads over 5 s on
 * production, all of them stalls on that one large download.
 *
 * Now each page is its own download. SolarGeniusProV2 starts the page for the
 * current #/route at the SAME moment as the workspace shell (one wave, not
 * two), and App.tsx fetches the remaining pages in the background once the
 * first screen is ready, so moving between tabs stays instant.
 *
 * Page code is unchanged; only how it is loaded.
 */
import type { ComponentType } from 'react';
import { importWithRetry } from '@/lib/loading/resilientImport';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageModule = { default: ComponentType<any> };
export type PageLoader = () => Promise<PageModule>;

/**
 * One shared download per page, retried with back-off (1 s, 2 s) as the
 * workspace download is. A final failure clears the memo, so the recovery
 * message's "Try again" downloads afresh instead of reusing the failure.
 */
function shared(load: () => Promise<PageModule>): PageLoader {
  let p: Promise<PageModule> | null = null;
  return () => (p ??= importWithRetry(load).catch((e) => { p = null; throw e; }));
}

export const PAGE_LOADERS: Record<string, PageLoader> = {
  '/dashboard': shared(() => import('./pages/DashboardPage')),
  '/calculator': shared(() => import('./pages/CalculatorPage')),
  '/intelligent': shared(() => import('./pages/IntelligentCalculatorPage')),
  '/design-check': shared(() => import('./pages/DesignCheckPage')),
  '/proposal': shared(() => import('./pages/ProposalPage')),
  '/designer': shared(() => import('./pages/DesignerPage')),
  '/design-studio': shared(() => import('./pages/DesignStudioPage')),
  '/viewer-3d': shared(() => import('./pages/Viewer3DPage')),
  '/global-3d': shared(() => import('./pages/Global3DPage')),
  '/wiring': shared(() => import('./pages/WiringDiagramPage')),
  '/workflow': shared(() => import('./pages/ProjectWorkflowPage')),
  '/fault-codes': shared(() => import('./pages/FaultCodesPage')),
  '/analytics': shared(() => import('./pages/AnalyticsPage')),
  '/report': shared(() => import('./pages/ReportPage')),
  '/quote-check': shared(() => import('./pages/QuoteCheckerPage')),
  '/voice': shared(() => import('./pages/VoiceCommandPage')),
  '/quote-parser': shared(() => import('./pages/QuoteParserPage')),
  '/repair': shared(() => import('./pages/RepairMaintenancePage')),
  '/panel-layout': shared(() => import('./pages/PanelLayoutPage')),
  '/sun-weather': shared(() => import('./pages/SunWeatherPage')),
  '/videos': shared(() => import('./pages/VideoLibraryPage')),
  '/pro': shared(() => import('./pages/ProToolsPage')),
  '/advanced': shared(() => import('./pages/AdvancedFeaturesPage')),
  '/settings': shared(() => import('./pages/SettingsPage')),
  '/home': shared(() => import('./pages/HomePage')),
};

/** The route "/" (and anything unknown) shows the calculator, as before. */
export const DEFAULT_PAGE = '/calculator';

/** The page path for a location hash such as "#/quote-check?x=1" (unknown or empty: the calculator). */
export function pageForHash(hash: string): string {
  const p = (hash || '').replace(/^#/, '').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return PAGE_LOADERS[p] ? p : DEFAULT_PAGE;
}

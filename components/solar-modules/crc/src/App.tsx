import React, { useState, useEffect } from 'react';
// HashRouter used instead of BrowserRouter so the Solar SPA can mount inside Next.js
// without conflicting with the host app's URL/routing. All internal nav uses #/...
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FiMenu, FiX, FiBarChart2, FiGrid, FiBox, FiTrendingUp, FiSettings, FiStar, FiClipboard, FiTool, FiCpu, FiZap, FiAlertTriangle, FiLayout, FiEye, FiActivity, FiCheckSquare, FiGlobe, FiBell, FiUser, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

// Pages: each one is its own download (Solar performance, 2026-11-25; see ./routes.ts).
// The loaders are shared with SolarGeniusProV2, which starts the current page's
// download together with this file, so the same promise is reused here.
import { PAGE_LOADERS } from './routes';
import { recoveryReload } from '@/lib/loading/resilientImport';
const page = (p: string) => React.lazy(PAGE_LOADERS[p]);
const DashboardPage = page('/dashboard');
const CalculatorPage = page('/calculator');
const DesignerPage = page('/designer');
const AnalyticsPage = page('/analytics');
const SettingsPage = page('/settings');
const ReportPage = page('/report');
const ProToolsPage = page('/pro');
const IntelligentCalculatorPage = page('/intelligent');
const AdvancedFeaturesPage = page('/advanced');
const FaultCodesPage = page('/fault-codes');
const DesignStudioPage = page('/design-studio');
const Viewer3DPage = page('/viewer-3d');
const WiringDiagramPage = page('/wiring');
const ProjectWorkflowPage = page('/workflow');
const Global3DPage = page('/global-3d');
const QuoteCheckerPage = page('/quote-check');
const VoiceCommandPage = page('/voice');
const QuoteParserPage = page('/quote-parser');
const RepairMaintenancePage = page('/repair');
const HomePage = page('/home');
const PanelLayoutPage = page('/panel-layout');
const SunWeatherPage = page('/sun-weather');
const VideoLibraryPage = page('/videos');
const DesignCheckPage = page('/design-check');
const ProposalPage = page('/proposal');
import { useSolarStore } from './services/store';

// ============================================
// APP-STYLE LAYOUT (DESKTOP-FIRST · NOT A WEBSITE)
// Persistent left rail on desktop, off-canvas on mobile.
// No body scroll — each region scrolls independently.
// ============================================

// NOTE: Originally this locked html/body with `overflow: hidden` so the SPA
// could behave like a standalone desktop app. Mounted inside Next.js under a
// global fixed top nav (~80px), that lock trapped the bottom of the workspace
// below the viewport and disabled vertical page scroll on /solar-genius-pro.
// We keep the height baseline but drop the body overflow lock so the host
// page can scroll when the inner regions overflow. Inner panes still have
// their own `overflow-y: auto` so the desktop-app feel is preserved.
const AppGlobal = createGlobalStyle`
  html, body, #root { height: 100%; }
`;

const SIDEBAR_W       = 260;
const SIDEBAR_W_MINI  = 68;

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  /* 100dvh tracks the dynamic viewport (iOS Safari collapsing URL bar);
     100vh fallback for older browsers. Prevents blank-strip + scroll-trap on mobile. */
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #050818;
  color: #E6F1FF;
  font-feature-settings: 'cv02','cv03','cv04','cv11';

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    /* Phones (2026-11-21 walkthrough): the app sits below the site header, so a
       fixed 100dvh frame put its lower part, and buttons such as "Build proposal",
       below the screen with a second scroll area inside. On phones the app
       flows with the page and only the page scrolls. */
    height: auto;
    overflow: visible;
  }
`;

const Sidebar = styled.aside<{ $open: boolean; $mini: boolean }>`
  width: ${p => p.$mini ? SIDEBAR_W_MINI : SIDEBAR_W}px;
  background: rgba(11, 18, 48, 0.92);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border-right: 1px solid rgba(0, 217, 255, 0.18);
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.18s ease, transform 0.22s ease;
  z-index: 50;

  /* Desktop: always visible, never overlays content */
  position: relative;

  /* Mobile (<= 768): off-canvas drawer */
  @media (max-width: 768px) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 280px;
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    box-shadow: ${p => p.$open ? '0 0 40px rgba(0,0,0,0.6)' : 'none'};
  }
`;

const SidebarHeader = styled.div<{ $mini: boolean }>`
  padding: 1rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  h1, .brand {
    line-height: 1.2;
    margin: 0;
    font-size: ${p => p.$mini ? '1.4rem' : '1.05rem'};
    font-weight: 700;
    letter-spacing: 0.02em;
    background: linear-gradient(135deg, #00D9FF, #7B5BFF 60%, #FF2EC4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const RailToggle = styled.button`
  background: transparent;
  border: 1px solid rgba(0, 217, 255, 0.18);
  color: rgba(230, 241, 255, 0.55);
  width: 26px; height: 26px;
  border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  &:hover { color: #00D9FF; border-color: rgba(0, 217, 255, 0.5); }
  @media (max-width: 768px) { display: none; }
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 0 1rem;
`;

const NavGroup = styled.div`
  margin-bottom: 0.75rem;
`;

const GroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(230, 241, 255, 0.42);
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(0, 217, 255, 0.08);
  cursor: pointer;
  margin-bottom: 0.4rem;

  &:hover { color: #00D9FF; }
`;

const GroupChevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transform: rotate(${p => p.$open ? '0deg' : '-90deg'});
  transition: transform 0.18s ease;
`;

const NavBadge = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  padding: 1px 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #00D9FF, #7B5BFF);
  color: #001;
  font-weight: 700;
`;

const SidebarFooter = styled.div`
  padding: 0.75rem 1.5rem;
  border-top: 1px solid rgba(0, 217, 255, 0.08);
  color: rgba(230, 241, 255, 0.32);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
`;

const NavItem = styled.button<{ $active?: boolean; $mini?: boolean }>`
  width: 100%;
  padding: 0.55rem 0.7rem;
  background: ${props => props.$active ? 'rgba(0, 217, 255, 0.14)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'rgba(0, 217, 255, 0.35)' : 'transparent'};
  border-radius: 8px;
  color: ${props => props.$active ? '#E6F1FF' : 'rgba(230, 241, 255, 0.62)'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 2px;
  font-size: 0.84rem;
  letter-spacing: 0.01em;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  position: relative;

  ${p => p.$active && `
    box-shadow: inset 2px 0 0 0 #00D9FF;
  `}

  &:hover {
    background: rgba(0, 217, 255, 0.08);
    color: #E6F1FF;
  }

  svg { width: 16px; height: 16px; flex-shrink: 0; }
  ${p => p.$mini && `
    justify-content: center;
    padding: 0.6rem 0;
    > span { display: none; }
  `}
`;

const MainArea = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  min-width: 0;

  @media (max-width: 768px) {
    height: auto;
    overflow: visible;
  }
`;

const TopBar = styled.div`
  background: rgba(11, 18, 48, 0.72);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border-bottom: 1px solid rgba(0, 217, 255, 0.18);
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00D9FF, transparent);
    opacity: 0.4;
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: rgba(230, 241, 255, 0.55);
  letter-spacing: 0.06em;
`;

const MenuButton = styled.button`
  background: linear-gradient(135deg, #00D9FF, #0099CC);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #E6F1FF;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  &::before {
    content: '';
    width: 3px;
    height: 22px;
    background: linear-gradient(180deg, #00D9FF, #7B5BFF);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(0, 217, 255, 0.55);
  }
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  scroll-behavior: smooth;
  /* every page now scrolls inside this region only */
  & > * { min-height: auto !important; }

  /* Phones: no inner scroll area; the page scrolls (see AppContainer). */
  @media (max-width: 768px) {
    overflow-y: visible;
    flex: none;
  }
`;

/* Command bar (⌘K) inside the top bar */
/* Round icon button used in top bar (notifications, profile) */
const IconBtn = styled.button`
  width: 34px; height: 34px;
  border-radius: 8px;
  background: rgba(5, 8, 24, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  color: rgba(230, 241, 255, 0.65);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  position: relative;
  &:hover { color: #E6F1FF; border-color: rgba(0, 217, 255, 0.45); }
  & .dot {
    position: absolute; top: 6px; right: 6px;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #FF4D6D;
    box-shadow: 0 0 8px rgba(255, 77, 109, 0.7);
  }
`;

/* Breadcrumb + page title combo */
const Breadcrumb = styled.div`
  display: flex; align-items: center; gap: 0.4rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  /* 0.42 alpha failed WCAG AA contrast (axe, 2026-11-21); 0.72 is about 8:1 on the top bar */
  color: rgba(230, 241, 255, 0.72);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  & .sep { opacity: 0.5; }
  & .now { color: #00D9FF; }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

// ============================================
// APP COMPONENT (PROFESSIONAL TOOL LAYOUT)
// ============================================

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Mini = collapsed icon-only desktop rail. Persisted.
  const [mini, setMini] = useState<boolean>(() => {
    try { return localStorage.getItem('sgp.nav.mini') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('sgp.nav.mini', mini ? '1' : '0'); } catch { /* ignore */ }
  }, [mini]);

  // Bootstrap project state from localStorage on app load so EVERY page
  // (Report, Quote Checker, Workflow, etc.) sees the persisted metrics
  // even when entered directly via URL or after a full page reload.
  const bootstrapLoadProject = useSolarStore(s => s.loadProject);
  useEffect(() => { bootstrapLoadProject(); }, [bootstrapLoadProject]);

  const location = useLocation();
  const navigate = useNavigate();


  // ------------------------------------------------------------------
  // GROUPED MENU — 6 workspaces, sci-fi shell. Every existing page is
  // reachable; nothing has been removed. Groups collapse independently.
  // ------------------------------------------------------------------
  type MenuItem = { path: string; label: string; icon: any; badge?: string };
  type MenuGroup = { id: string; label: string; items: MenuItem[] };

  const menuGroups: MenuGroup[] = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { path: '/dashboard', label: 'Mission Control', icon: FiBarChart2 },
      ],
    },
    {
      id: 'sizing',
      label: 'Sizing & Quoting',
      items: [
        { path: '/calculator',   label: 'Solar Calculator',     icon: FiGrid },
        { path: '/intelligent',  label: 'Appliance Calculator', icon: FiCpu },
        { path: '/report',       label: 'Reports & Quotation',  icon: FiClipboard },
        { path: '/quote-check',  label: 'Quote Checker',        icon: FiCheckSquare, badge: 'NEW' },
      ],
    },
    {
      id: 'design',
      label: 'Design & Engineering',
      items: [
        { path: '/design-check',  label: 'Design Check',      icon: FiCheckSquare, badge: 'NEW' },
        { path: '/proposal',      label: 'Proposal',          icon: FiClipboard, badge: 'NEW' },
        { path: '/designer',      label: 'System Designer',   icon: FiBox },
        { path: '/design-studio', label: 'Design Studio',     icon: FiLayout },
        { path: '/voice',         label: 'Voice Commands',    icon: FiBell },
        { path: '/viewer-3d',     label: 'True 3D Viewer',    icon: FiEye },
        { path: '/global-3d',     label: 'Global 3D Map',     icon: FiGlobe },
        { path: '/panel-layout',  label: 'Panel Layout',      icon: FiGrid },
        { path: '/sun-weather',   label: 'Sun & Weather',     icon: FiActivity, badge: 'NEW' },
        { path: '/wiring',        label: 'Wiring Diagram',    icon: FiActivity },
      ],
    },
    {
      id: 'operations',
      label: 'Operations & Service',
      items: [
        { path: '/workflow',    label: '8-Step Project Wizard', icon: FiCheckSquare },
        { path: '/fault-codes', label: 'Fault Codes DB',        icon: FiAlertTriangle },
        { path: '/repair',      label: 'Repair & Maintenance',  icon: FiTool },
        { path: '/videos',      label: 'Video Tutorials',       icon: FiEye, badge: 'NEW' },
      ],
    },
    {
      id: 'business',
      label: 'Business Intelligence',
      items: [
        { path: '/analytics', label: 'Analytics',     icon: FiTrendingUp },
        { path: '/pro',       label: 'Pro Tools',     icon: FiTool },
        { path: '/advanced',  label: 'Advanced Suite', icon: FiZap, badge: 'PRO' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { path: '/settings', label: 'Settings', icon: FiSettings },
      ],
    },
  ];

  const allItems = menuGroups.flatMap(g => g.items);
  const currentPage = allItems.find(item => item.path === location.pathname);
  const pageTitle = currentPage?.label || 'SolarGeniusPro';
  const currentGroupLabel =
    menuGroups.find(g => g.items.some(i => i.path === location.pathname))?.label
    || 'Workspace';

  // Persist collapsed groups in localStorage so user pref survives reloads
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('sgp.nav.collapsed');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem('sgp.nav.collapsed', JSON.stringify(collapsed)); } catch { /* ignore */ }
  }, [collapsed]);
  const toggleGroup = (id: string) =>
    setCollapsed(s => ({ ...s, [id]: !s[id] }));

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      <AppGlobal />
      <AppContainer>
      <Sidebar $open={sidebarOpen} $mini={mini}>
        <SidebarHeader $mini={mini}>
          {/* Not an h1: the page's server-rendered h1 names the tool (2026-10-19). */}
          <div className="brand" role="heading" aria-level={2}>{mini ? '⚡' : '⚡ SolarGeniusPro'}</div>
          <RailToggle
            onClick={() => setMini(m => !m)}
            title={mini ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mini ? <FiChevronsRight size={14} /> : <FiChevronsLeft size={14} />}
          </RailToggle>
        </SidebarHeader>


        <NavMenu>
          {menuGroups.map(group => {
            const isCollapsed = !!collapsed[group.id];
            return (
              <NavGroup key={group.id}>
                {!mini && (
                  <GroupHeader
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={!isCollapsed}
                  >
                    <span>{group.label}</span>
                    <GroupChevron $open={!isCollapsed}>▾</GroupChevron>
                  </GroupHeader>
                )}
                {(mini || !isCollapsed) && group.items.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <NavItem
                      key={item.path}
                      $active={active}
                      $mini={mini}
                      title={mini ? item.label : undefined}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon />
                      <span>{item.label}</span>
                      {!mini && item.badge && <NavBadge>{item.badge}</NavBadge>}
                    </NavItem>
                  );
                })}
              </NavGroup>
            );
          })}
        </NavMenu>

        {!mini && (
          <SidebarFooter>
            <small style={{ display: 'block', lineHeight: 1.55 }}>
              © {new Date().getFullYear()} <strong>EmersonEIMS</strong><br/>
              Engineering Better Energy<br/>
              <a href="mailto:sally@emersoneims.com" style={{ color: 'inherit', textDecoration: 'none' }}>sally@emersoneims.com</a><br/>
              <a href="tel:+254768860665" style={{ color: 'inherit', textDecoration: 'none' }}>+254 768 860 665</a>
            </small>
          </SidebarFooter>
        )}
      </Sidebar>

      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <MainArea>
        <TopBar>
          <TopBarLeft>
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} aria-expanded={sidebarOpen}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </MenuButton>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Breadcrumb>
                <span>{currentGroupLabel}</span>
                <span className="sep">/</span>
                <span className="now">{pageTitle}</span>
              </Breadcrumb>
              <PageTitle>{pageTitle}</PageTitle>
            </div>
          </TopBarLeft>
          <TopBarRight>
            {/* A "Search anything… Ctrl K" bar that only alerted "coming soon", a
                "NOMINAL" status and a notification bell with an unread dot that
                did nothing were removed 2026-10-19. */}
            <IconBtn title="Account" onClick={() => navigate('/settings')}>
              <FiUser size={16} />
            </IconBtn>
          </TopBarRight>
        </TopBar>

        <Content>
          <BackgroundPageFetch />
          <PageErrorBoundary>
          <React.Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/intelligent" element={<IntelligentCalculatorPage />} />
            <Route path="/design-check" element={<DesignCheckPage />} />
            <Route path="/proposal" element={<ProposalPage />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/design-studio" element={<DesignStudioPage />} />
            <Route path="/viewer-3d" element={<Viewer3DPage />} />
            <Route path="/global-3d" element={<Global3DPage />} />
            {/* Smart Home showed the same invented result for any photo (2026-10-19). */}
            <Route path="/smart-home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/wiring" element={<WiringDiagramPage />} />
            <Route path="/workflow" element={<ProjectWorkflowPage />} />
            <Route path="/fault-codes" element={<FaultCodesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            {/* Was a marketing list of "100+ features" (many not built), "24/7 support" and "∞ scalable" — removed 2026-10-18. */}
            <Route path="/features" element={<Navigate to="/dashboard" replace />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/quote-check" element={<QuoteCheckerPage />} />
            <Route path="/voice" element={<VoiceCommandPage />} />
            <Route path="/quote-parser" element={<QuoteParserPage />} />
            <Route path="/repair" element={<RepairMaintenancePage />} />
            <Route path="/sales" element={<Navigate to="/dashboard" replace />} />
            <Route path="/panel-layout" element={<PanelLayoutPage />} />
            <Route path="/sun-weather" element={<SunWeatherPage />} />
            <Route path="/videos" element={<VideoLibraryPage />} />
            <Route path="/pro" element={<ProToolsPage />} />
            <Route path="/advanced" element={<AdvancedFeaturesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/home" element={<HomePage />} />
            {/* The page is titled "Calculator": open on it (2026-10-20 audit). */}
            <Route path="/" element={<CalculatorPage />} />
          </Routes>
          </React.Suspense>
          </PageErrorBoundary>
        </Content>
      </MainArea>
      </AppContainer>
    </>
  );
};

/**
 * If a page's download still fails after its retries (dropped connection), say so
 * plainly and offer a reload that keeps drafts (recoveryReload flushes them first),
 * as the workspace download already does. Never a blank area.
 */
class PageErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#e2e8f0', textAlign: 'center', padding: 16 }}>
        <strong>This tool did not download.</strong>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>This is usually a dropped or slow connection. Nothing you entered is lost: drafts are kept in this browser.</span>
        <button type="button" onClick={() => recoveryReload()} style={{ padding: '8px 16px', borderRadius: 6, background: '#f59e0b', color: '#000', fontWeight: 700, border: 0, cursor: 'pointer' }}>Try again</button>
      </div>
    );
  }
}

/** Shown while a page's code is still arriving (first visit to that page only). */
const PageLoading: React.FC = () => (
  <div role="status" aria-live="polite" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
    Loading this tool…
  </div>
);

/**
 * After the first screen is ready and the browser is idle, fetch the other
 * pages one at a time, so moving between tabs is instant. Waits for any
 * engineering download and the page hold to finish first (window.__eimsEngineeringBusy),
 * and stops on Save-Data or 2G connections, where each tab loads on demand instead.
 */
const BackgroundPageFetch: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') return;
    let cancelled = false;
    const w = window as unknown as { __eimsEngineeringBusy?: number; requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const idle = (fn: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 1500));
    const queue = Object.values(PAGE_LOADERS);
    const next = () => {
      if (cancelled || !queue.length) return;
      if ((w.__eimsEngineeringBusy ?? 0) > 0) { setTimeout(next, 1000); return; }
      const load = queue.shift()!;
      load().catch(() => { /* fetched on demand later */ }).finally(() => { if (!cancelled) idle(next); });
    };
    const start = setTimeout(() => idle(next), 4000);
    return () => { cancelled = true; clearTimeout(start); };
  }, []);
  return null;
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

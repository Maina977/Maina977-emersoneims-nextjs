import React, { useState, useEffect } from 'react';
// HashRouter used instead of BrowserRouter so the Solar SPA can mount inside Next.js
// without conflicting with the host app's URL/routing. All internal nav uses #/...
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FiMenu, FiX, FiBarChart2, FiGrid, FiBox, FiTrendingUp, FiSettings, FiStar, FiClipboard, FiTool, FiCpu, FiZap, FiAlertTriangle, FiLayout, FiEye, FiHexagon, FiActivity, FiCheckSquare, FiGlobe, FiSearch, FiBell, FiUser, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

// Pages
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import DesignerPage from './pages/DesignerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import FeaturesPage from './pages/FeaturesPage';
import ReportPage from './pages/ReportPage';
import ProToolsPage from './pages/ProToolsPage';
import IntelligentCalculatorPage from './pages/IntelligentCalculatorPage';
import AdvancedFeaturesPage from './pages/AdvancedFeaturesPage';
import FaultCodesPage from './pages/FaultCodesPage';
import DesignStudioPage from './pages/DesignStudioPage';
import Viewer3DPage from './pages/Viewer3DPage';
import SmartHomePage from './pages/SmartHomePage';
import WiringDiagramPage from './pages/WiringDiagramPage';
import ProjectWorkflowPage from './pages/ProjectWorkflowPage';import Global3DPage from './pages/Global3DPage';
import QuoteCheckerPage from './pages/QuoteCheckerPage';
import VoiceCommandPage from './pages/VoiceCommandPage';
import QuoteParserPage from './pages/QuoteParserPage';
import RepairMaintenancePage from './pages/RepairMaintenancePage';
import SalesDashboardPage from './pages/SalesDashboardPage';
import HomePage from './pages/HomePage';
import PanelLayoutPage from './pages/PanelLayoutPage';
import SunWeatherPage from './pages/SunWeatherPage';
import VideoLibraryPage from './pages/VideoLibraryPage';
import { useSolarStore } from './services/store';

// ============================================
// APP-STYLE LAYOUT (DESKTOP-FIRST · NOT A WEBSITE)
// Persistent left rail on desktop, off-canvas on mobile.
// No body scroll — each region scrolls independently.
// ============================================

// Lock body scroll so the shell behaves like a desktop application.
const AppGlobal = createGlobalStyle`
  html, body, #root { height: 100%; overflow: hidden; }
`;

const SIDEBAR_W       = 260;
const SIDEBAR_W_MINI  = 68;

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  overflow: hidden;
  background: #050818;
  color: #E6F1FF;
  font-feature-settings: 'cv02','cv03','cv04','cv11';
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

  h1 {
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

const SidebarTagline = styled.div`
  margin-top: 0.5rem;
  font-size: 0.7rem;
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
  overflow: hidden;
  min-width: 0;
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

const SystemPulse = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &::before {
    content: '';
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #16E29F;
    box-shadow: 0 0 10px #16E29F;
    animation: sf-pulse 2s ease-in-out infinite;
  }
  @keyframes sf-pulse {
    0%, 100% { opacity: 0.55; transform: scale(0.85); }
    50%      { opacity: 1.00; transform: scale(1.10); }
  }
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
`;

/* Command bar (⌘K) inside the top bar */
const CommandBar = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: 320px;
  max-width: 36vw;
  padding: 0.45rem 0.7rem;
  background: rgba(5, 8, 24, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 8px;
  color: rgba(230, 241, 255, 0.55);
  font-size: 0.82rem;
  cursor: pointer;
  text-align: left;
  &:hover { border-color: rgba(0, 217, 255, 0.45); color: #E6F1FF; }
  & .kbd {
    margin-left: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    padding: 1px 6px;
    border: 1px solid rgba(230, 241, 255, 0.2);
    border-radius: 4px;
    color: rgba(230, 241, 255, 0.55);
  }
  @media (max-width: 768px) { display: none; }
`;

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
  color: rgba(230, 241, 255, 0.42);
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

  // Ctrl/⌘+K opens command palette (placeholder)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        alert('Command palette — coming soon');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
        { path: '/features',  label: 'Capability Matrix', icon: FiStar },
      ],
    },
    {
      id: 'sizing',
      label: 'Sizing & Quoting',
      items: [
        { path: '/calculator',   label: 'Solar Calculator',     icon: FiGrid },
        { path: '/intelligent',  label: 'Intelligent Calc',     icon: FiCpu, badge: 'AI' },
        { path: '/report',       label: 'Reports & Quotation',  icon: FiClipboard },
        { path: '/quote-check',  label: 'Quote Checker',        icon: FiCheckSquare, badge: 'NEW' },
        { path: '/quote-parser', label: 'Quote Parser AI',      icon: FiSearch, badge: 'AI' },
      ],
    },
    {
      id: 'design',
      label: 'Design & Engineering',
      items: [
        { path: '/designer',      label: 'System Designer',   icon: FiBox },
        { path: '/design-studio', label: 'Design Studio AI',  icon: FiLayout, badge: 'AI' },
        { path: '/voice',         label: 'Voice Design AI',   icon: FiBell, badge: 'AI' },
        { path: '/viewer-3d',     label: 'True 3D Viewer',    icon: FiEye },
        { path: '/global-3d',     label: 'Global 3D Map',     icon: FiGlobe },
        { path: '/panel-layout',  label: 'Panel Layout AI',   icon: FiGrid, badge: 'NEW' },
        { path: '/sun-weather',   label: 'Sun & Weather',     icon: FiActivity, badge: 'NEW' },
        { path: '/wiring',        label: 'Wiring Diagram',    icon: FiActivity },
      ],
    },
    {
      id: 'operations',
      label: 'Operations & Service',
      items: [
        { path: '/workflow',    label: '8-Step Project Wizard', icon: FiCheckSquare },
        { path: '/smart-home',  label: 'Smart Home',            icon: FiHexagon },
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
        { path: '/sales',     label: 'Sales Dashboard', icon: FiUser, badge: 'LIVE' },
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
          <h1>{mini ? '⚡' : '⚡ SolarGeniusPro'}</h1>
          <RailToggle
            onClick={() => setMini(m => !m)}
            title={mini ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mini ? <FiChevronsRight size={14} /> : <FiChevronsLeft size={14} />}
          </RailToggle>
        </SidebarHeader>

        {!mini && (
          <SidebarTagline style={{ padding: '0 1.25rem 0.5rem' }}>
            <span className="sf-badge sf-badge--ok">v2.0 · Online</span>
          </SidebarTagline>
        )}

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
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
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
            <CommandBar
              onClick={() => alert('Command palette — coming soon')}
              title="Command palette"
            >
              <FiSearch size={14} />
              <span>Search anything…</span>
              <span className="kbd">Ctrl K</span>
            </CommandBar>
            <SystemPulse>NOMINAL</SystemPulse>
            <IconBtn title="Notifications">
              <FiBell size={16} />
              <span className="dot" />
            </IconBtn>
            <IconBtn title="Account" onClick={() => navigate('/settings')}>
              <FiUser size={16} />
            </IconBtn>
          </TopBarRight>
        </TopBar>

        <Content>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/intelligent" element={<IntelligentCalculatorPage />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/design-studio" element={<DesignStudioPage />} />
            <Route path="/viewer-3d" element={<Viewer3DPage />} />
            <Route path="/global-3d" element={<Global3DPage />} />
            <Route path="/smart-home" element={<SmartHomePage />} />
            <Route path="/wiring" element={<WiringDiagramPage />} />
            <Route path="/workflow" element={<ProjectWorkflowPage />} />
            <Route path="/fault-codes" element={<FaultCodesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/quote-check" element={<QuoteCheckerPage />} />
            <Route path="/voice" element={<VoiceCommandPage />} />
            <Route path="/quote-parser" element={<QuoteParserPage />} />
            <Route path="/repair" element={<RepairMaintenancePage />} />
            <Route path="/sales" element={<SalesDashboardPage />} />
            <Route path="/panel-layout" element={<PanelLayoutPage />} />
            <Route path="/sun-weather" element={<SunWeatherPage />} />
            <Route path="/videos" element={<VideoLibraryPage />} />
            <Route path="/pro" element={<ProToolsPage />} />
            <Route path="/advanced" element={<AdvancedFeaturesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </Content>
      </MainArea>
      </AppContainer>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

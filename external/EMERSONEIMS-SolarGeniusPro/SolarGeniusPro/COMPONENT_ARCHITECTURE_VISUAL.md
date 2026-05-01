# SolarGeniusPro UI Architecture & Component Map

## 📐 Complete Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP ROOT (App.tsx)                       │
│                   Styled-Components + Router                    │
└─────────────────────────────────────────────────────────────────┘
        │                          │                          │
        ▼                          ▼                          ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Navigation.tsx  │    │   Routes (v6)    │    │   Footer.tsx     │
│ Styled-Components│    │  React Router    │    │ Styled-Components│
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                  │
                ┌─────────────────┼─────────────────┬────────────────────┐
                ▼                 ▼                 ▼                    ▼
           ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
           │ HomePage   │   │ Dashboard  │   │ Calculator │   │  Designer  │
           │ Styled-CSS │   │ Styled-CSS │   │ Styled-CSS │   │ Styled-CSS │
           └────────────┘   └────────────┘   └────────────┘   └────────────┘
                ▼                 ▼                 ▼                    ▼
          Landing Comps     AdvancedFeatures   AdvancedSolar      SmartHome
           Components       Dashboard.tsx      Calculator.tsx     DesignUI.tsx
                                                  │                    │
                                                  ▼                    ▼
                                              Tab Components      DesignStudioAI
                                              (6 tabs)               RoofAnalyzer
                                                                  True3DViewer
                │                 │                 │                    │
                └─────────────────┼─────────────────┴────────────────────┘
                                  ▼
                    ┌──────────────────────────────────┐
                    │    Pages Continued...            │
                    │  Analytics | Settings            │
                    │  Styled-Components               │
                    └──────────────────────────────────┘
```

---

## 🎭 Feature Components Organization

```
┌──────────────────────────────────────────────────────────────┐
│              FEATURE COMPONENTS TREE                          │
└──────────────────────────────────────────────────────────────┘

                        components/
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌────────┐            ┌────────┐          ┌───────────┐
    │Calculator  │         │Design      │         │Investment  │
    │Components  │         │Components  │         │Components  │
    └────────┘            └────────┘          └───────────┘
        │                     │                     │
    ┌──┴──────────────┐   ┌──┴──────────────────┐  ├──────────────┐
    │                 │   │                    │  │              │
    ▼                 ▼   ▼                    ▼  ▼              ▼
┌──────────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐
│Advanced      │ │3D    │ │Design    │ │Roof      │ │ROI     │ │Payback  │
│Calculator    │ │Map   │ │Studio AI │ │Analyzer  │ │Display │ │Chart    │
│(Plain CSS)   │ │(CSS) │ │(Plain    │ │(Inline)  │ │(React  │ │(React   │
│6 Tabs        │ │      │ │CSS)      │ │ML Model  │ │Native) │ │Native)  │
└──────────────┘ └──────┘ │          │ │Canvas    │ └────────┘ └─────────┘
                          └──────────┘ └──────────┘
                                │
                    ┌───────────┴────────────┐
                    ▼                        ▼
                ┌──────────────┐        ┌────────────┐
                │True3D Viewer │        │Wiring      │
                │(Three.js)    │        │Diagram AI  │
                │React Fiber   │        │(Plain CSS) │
                └──────────────┘        └────────────┘

    ┌────────────────────────────────────────────────────────┐
    │              Decision Components                       │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  RecommendationCard   RiskIndicator   CostBenefit    │
    │  (React Native)       (React Native)   (React Native)  │
    │                                                        │
    │  ProjectStateAI       FaultCodesAI    WhatIfSimulator  │
    │  (Plain CSS)          (Plain CSS)     (React Native)   │
    │                                                        │
    └────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────────────────┐
    │              Investment Components                     │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  ROIDisplay        PaybackChart     FinancingOptions   │
    │  (React Native)    (React Native)   (React Native)     │
    │                                                        │
    │  SavingsProjection                                    │
    │  (React Native)                                        │
    │                                                        │
    └────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────────────────┐
    │              Top-Level Features                        │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  AdvancedFeaturesDashboard        SmartHomeDesignUI    │
    │  (Styled-Components)              (Styled-Components) │
    │  27 Features Integration          House Design Tool   │
    │  Master Dashboard                 Image Upload        │
    │                                                        │
    └────────────────────────────────────────────────────────┘
```

---

## 🎨 Styling Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     GLOBAL STYLING                              │
│                   src/index.css                                 │
│  CSS Variables: colors, shadows, transitions, typography       │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌────────────┐  ┌────────────┐  ┌─────────────┐
        │ STYLED-    │  │ PLAIN CSS  │  │ REACT       │
        │ COMPONENTS │  │ FILES      │  │ NATIVE      │
        │ (60%)      │  │ (25%)      │  │ STYLESHEET  │
        │            │  │            │  │ (15%)       │
        └────────────┘  └────────────┘  └─────────────┘
             │                │                │
    ┌────────┴────────┐  ┌────┴──────────┐  ┌──────┐
    │                 │  │               │  │      │
    ▼                 ▼  ▼               ▼  ▼      ▼
  Pages           Features         Plain CSS    RN Mobile
┌──────────────┐ ┌─────────────┐ ┌──────────┐ ┌────────┐
│Dashboard     │ │Dashboard    │ │Advanced  │ │Investment
│Calculator    │ │SmartHome    │ │Calculator│ │Decision
│Designer      │ │Navigation   │ │Designer  │ │Landing
│Analytics     │ │Footer       │ │Fault Diag│
│Settings      │ │Loading      │ │Wiring    │
│Home          │ │             │ │ProjectAI │
└──────────────┘ └─────────────┘ └──────────┘ └────────┘
   Template       Component       Module          Mobile
   Layout         Styles          Specific        Styles
```

---

## 🔄 Data Flow Architecture

```
                    ┌──────────────────────┐
                    │   User Interaction   │
                    │   (UI Events)        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │ React Component      │
                    │ State Management     │
                    │ (hooks/zustand)      │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │  Local     │      │  Query     │      │ Calculation│
    │  Engines   │      │  Data      │      │  Engines   │
    │            │      │  Fetch     │      │            │
    └────────────┘      └────────────┘      └────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Styled Output      │
                    │  (JSX + CSS)        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  DOM Rendering      │
                    │  (React)            │
                    └─────────────────────┘
```

---

## 📊 Component Complexity Matrix

```
COMPLEXITY                   STYLING              LIBRARIES
   ↑                                              
   │ ┌─────────────────────────────────────┐    
900│ │ AdvancedSolarCalculator            │    • Solar Engines (6)
   │ │ (Complex multi-tab calculator)     │    • Form Validation
 800│ │                                     │    • Date-fns
   │ │                                     │    
 700│ ┌─────────────────────────────────────┐    
   │ │ DesignStudioAI                     │    • Mapbox GL
 600│ │ (Canvas + Drag-drop)               │    • Canvas API
   │ │                                     │    • Solar Geometry
 500│ │ True3DViewer                       │    • Three.js
   │ │ (3D Rendering)                     │    • React Fiber
 400│ └─────────────────────────────────────┐    
   │   │ DashboardPage                      │    • Recharts
 300│   │ (Multi-feature integration)        │    • Zustand
   │   │                                     │    
   │   │ RoofAnalyzer                        │    • TensorFlow.js
   │   │ (Image + ML Analysis)               │    
 200│   └─────────────────────────────────────┐   
   │     │ FinancingOptions                   │   • React Hook Form
   │     │ HomePage                           │   • React Router
   │     │ Navigation                         │   • React Query
 100│     │                                     │   
   │     │ LoadingSpinner                     │   • React Icons
   │     │ Footer                             │   • React Hot Toast
    0└─────────────────────────────────────────┘   
      SC    CSS    RN
```

Legend: SC = Styled-Components, CSS = Plain CSS, RN = React Native

---

## 🎯 Component Purpose Matrix

```
┌────────────────────────────────────────────────────────────────┐
│                     PRIMARY PURPOSES                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ LAYOUT/STRUCTURE       │ DATA VISUALIZATION │ USER INPUT      │
│ ├─ Navigation         │ ├─ DashboardPage   │ ├─ Calculator   │
│ ├─ Footer             │ ├─ AnalyticsPage   │ ├─ Designer     │
│ ├─ App Root           │ ├─ ROIDisplay      │ ├─ SmartHome    │
│ └─ LoadingSpinner     │ ├─ PaybackChart    │ ├─ FileUpload   │
│                       │ ├─ CostBenefit     │ └─ Settings     │
│                       │ ├─ True3DViewer    │                 │
│                       │ └─ Charts/Graphs   │                 │
│                                                                │
│ CALCULATION/LOGIC     │ RECOMMENDATIONS    │ AI FEATURES     │
│ ├─ Advanced Calc      │ ├─ Recommendation  │ ├─ RoofAnalyzer │
│ ├─ DesignStudio       │ ├─ RiskIndicator   │ ├─ FaultCodes   │
│ ├─ WhatIfSimulator    │ ├─ WhatIf          │ ├─ ProjectState │
│ └─ Decision Engines   │ │   Simulator      │ ├─ Wiring       │
│                       │ └─ Financing       │ └─ Design AI    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Responsive Design Flow

```
Desktop (> 1200px)              Tablet (768-1200px)         Mobile (< 768px)
│                               │                           │
├─ Multi-column grids           ├─ 2-column layouts        ├─ Single column
│  (repeat(auto-fit,            │                          │
│   minmax(250-300px, 1fr)))    │                          │
│                               │                          │
├─ Side-by-side sections        ├─ Stacked sections        ├─ Full-width
│                               │                          │
├─ Large fonts (2.5-3rem)       ├─ Medium fonts (2rem)     ├─ Smaller fonts
│                               │                          │  (1.5-1.75rem)
│                               │                          │
├─ Full width containers        ├─ Moderate padding        ├─ Minimal padding
│  (max-width: 1400px)          │  (1.5-2rem)              │  (1rem)
│                               │                          │
└─ Menu visible (flex)          └─ Menu dropdown           └─ Hamburger menu
```

**Breakpoint:** `@media (max-width: 768px)`

---

## 💾 Data & State Management

```
                    ┌─────────────────────────┐
                    │   Global CSS Variables  │
                    │  (index.css)            │
                    └────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │   React Component State  │
                    │   (useState)             │
                    └────────────┬────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
         ┌─────────┐      ┌──────────┐      ┌─────────────┐
         │ Zustand │      │ React    │      │ Form State  │
         │ (Global │      │ Query    │      │ (React Hook │
         │  Store) │      │ (Cache)  │      │ Form)       │
         └─────────┘      └──────────┘      └─────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │   Calculation Engines    │
                    │   (Core Logic)           │
                    └────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │   Rendered Output        │
                    │   (JSX Components)       │
                    └─────────────────────────┘
```

---

## 📦 Component Dependency Graph

```
                        App.tsx
                          │
          ┌───────────────┼───────────────┐
          │               │               │
      Navigation      Routes          Footer
          │             │
    (All Pages) ←────────┤
          │              ├─→ HomePage
          │              │    ├─→ HeroSection
          │              │    ├─→ FeatureShowcase
          │              │    └─→ CTASection
          │              │
          │              ├─→ DashboardPage
          │              │    └─→ AdvancedFeaturesDashboard
          │              │
          │              ├─→ CalculatorPage
          │              │    └─→ AdvancedSolarCalculator
          │              │
          │              ├─→ DesignerPage
          │              │    └─→ SmartHomeDesignUI
          │              │        ├─→ RoofAnalyzer
          │              │        ├─→ DesignStudioAI
          │              │        └─→ True3DViewer
          │              │
          │              ├─→ AnalyticsPage
          │              │    └─→ Chart Components
          │              │
          │              └─→ SettingsPage
          │                   └─→ Settings Sections
          │
      LoadingSpinner
          │
      (All Pages)
```

---

## 🎭 Component Lifecycle Overview

```
Mount Phase:
  1. Component created in React
  2. Styled components compiled
  3. Initial state set (useState, Zustand)
  4. Effects run (useEffect, data fetching)
  5. First render triggered

Update Phase:
  1. User interaction → state change
  2. Component re-renders with new props
  3. Styled components update (if using transients)
  4. DOM updates (React reconciliation)
  5. New styles applied

Unmount Phase:
  1. Component removed from DOM
  2. Event listeners cleaned up
  3. Timers cleared
  4. Styled components cleanup

Data Flow Example (Calculator):
  User Input
     ↓
  Form State Update (react-hook-form)
     ↓
  Validation & Calculation (Solar Engines)
     ↓
  State Update (results)
     ↓
  Component Re-render
     ↓
  Styled Output Displayed
```

---

## 📈 Scalability & Performance Notes

```
✓ Component Splitting:     By feature domain (calculator, design, etc.)
✓ Code Splitting:          Page-level routing with lazy load
✓ State Management:        Local state + Zustand for shared
✓ Data Fetching:           React Query for server state
✓ Memoization:             React.memo for expensive components
✓ CSS Performance:         Styled-Components scoped + critical CSS
✓ Image Optimization:      Mapbox GL for tiles, lazy load others
✓ 3D Optimization:         Three.js LOD and culling systems
✓ Bundle Size:             Tree-shaking enabled, minimal deps
```

---

**Architecture Version:** 3.0  
**Last Updated:** April 21, 2026  
**Framework:** React 18.2 + TypeScript 5.0

# SolarGeniusPro Component Quick Reference

## 📊 Component Count Summary

```
Total Components: 30+
├── Page Components: 6
├── Feature Components: 24+
├── Shared Components: 3
└── Landing Components: 3
```

## 🎯 Component Directory Map

```
crc/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx                    ⭐ Landing page
│   │   ├── DashboardPage.tsx               📊 Metrics & status
│   │   ├── CalculatorPage.tsx              🔢 System sizing
│   │   ├── DesignerPage.tsx                🏗️  Roof design
│   │   ├── AnalyticsPage.tsx               📈 Performance tracking
│   │   └── SettingsPage.tsx                ⚙️  User settings
│   ├── components/
│   │   ├── Navigation.tsx                  🔗 Top navigation bar
│   │   ├── Footer.tsx                      📝 Footer layout
│   │   └── LoadingSpinner.tsx              ⏳ Loading indicator
│   ├── App.tsx                             🎪 Root layout
│   ├── main.tsx                            🚀 Entry point
│   └── index.css                           🎨 Global styles
│
└── components/
    ├── AdvancedFeaturesDashboard.tsx       💎 Master dashboard (27 features)
    ├── SmartHomeDesignUI.tsx               🏠 Home design interface
    │
    ├── calculator/
    │   ├── AdvancedSolarCalculator.tsx     🧮 Multi-tab calculator (CSS)
    │   └── Advanced3DVisualizationMap.tsx  🗺️  Satellite map view (CSS)
    │
    ├── design/
    │   ├── DesignStudioAI.tsx              🎨 Drag-drop panel design (CSS)
    │   ├── RoofAnalyzer.tsx                📐 Roof pitch detection (ML)
    │   ├── True3DViewer.tsx                🏠 3D house model (Three.js)
    │   └── WiringDiagramAI.tsx             ⚡ Circuit diagrams (CSS)
    │
    ├── investment/
    │   ├── ROIDisplay.tsx                  💰 ROI metrics (RN)
    │   ├── PaybackChart.tsx                📉 Payback analysis (RN)
    │   ├── FinancingOptions.tsx            🏦 Financing plans (RN)
    │   └── SavingsProjection.tsx           📊 Savings forecast (RN)
    │
    ├── decision/
    │   ├── RecommendationCard.tsx          ✅ System recommendations (RN)
    │   ├── RiskIndicator.tsx               ⚠️  Risk assessment (RN)
    │   ├── CostBenefitChart.tsx            💹 Cost-benefit analysis (RN)
    │   ├── ProjectStateAI.tsx              📋 Project summary (CSS)
    │   ├── FaultCodesAI.tsx                🐛 Fault diagnosis (CSS)
    │   └── WhatIfSimulator.tsx             🎮 Scenario simulation (RN)
    │
    └── landing/
        ├── HeroSection.tsx                 🦸 Hero content (RN)
        ├── FeatureShowcase.tsx             ⭐ Feature cards (TBD)
        └── CTASection.tsx                  📣 Call-to-action (TBD)

Legend:
⭐ = Main/Important
🔗 = Navigation
📊 = Dashboard/Metrics
🔢 = Calculations
🏗️ = Design Tools
📈 = Analytics
⚙️ = Settings
🏠 = Smart Home
💎 = Premium Feature
🧮 = Complex Logic
🗺️ = Maps/Visualization
🎨 = Design/Styling
📐 = AI Analysis
🏠 = 3D Rendering
⚡ = Electrical
💰 = Financial
📉 = Charts
🏦 = Financing
📊 = Statistics
✅ = Recommendations
⚠️ = Risk/Alerts
💹 = Analysis
📋 = Summaries
🐛 = Diagnostics
🎮 = Interactive
🦸 = Hero/Landing
⭐ = Features
📣 = Engagement
(RN) = React Native
(CSS) = Plain CSS
(ML) = Machine Learning
(TBD) = To Be Determined
```

---

## 🎨 Styling Distribution

```
📊 By Styling Approach:

Styled-Components:    60% (~18 components)
├── All main pages (6)
├── Navigation & Footer (2)
├── Dashboard components (2)
├── Smart home UI (1)
└── Feature cards (7)

Plain CSS:           25% (~8 components)
├── Advanced Calculator
├── Advanced3DMap
├── DesignStudio
├── WiringDiagram
├── ProjectState
├── FaultCodes
└── Other utilities

React Native:        15% (~5 components)
├── Investment suite (4)
├── Landing section (1)

Framework-Specific:
├── React Three Fiber (True3DViewer)
├── Canvas API (RoofAnalyzer, DesignStudio)
└── Mapbox GL (Design/Map integration)
```

---

## 🔄 Data Flow Architecture

```
App Root
│
├─→ Global CSS Variables (index.css)
│   └─→ Color scheme, transitions, shadows
│
├─→ Navigation (fixed header)
│   └─→ Routes to all pages
│
├─→ Page Router (React Router v6)
│   ├─→ HomePage
│   ├─→ DashboardPage
│   ├─→ CalculatorPage
│   ├─→ DesignerPage
│   ├─→ AnalyticsPage
│   └─→ SettingsPage
│
├─→ Feature Components
│   ├─→ Calculation Engines (core/)
│   ├─→ 3D Visualization (Three.js)
│   ├─→ Chart Rendering (Recharts)
│   └─→ Data Processing (ML models)
│
└─→ Footer
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout | Grid Columns |
|-----------|--------|--------------|
| < 768px   | Mobile | 1 (stacked)  |
| ≥ 768px   | Desktop| 2-3 (grid)   |
| ≥ 1200px  | Wide   | 3-4 (grid)   |

---

## 🎯 Main Features by Component

| Component | Key Features | Libraries |
|-----------|------------|-----------|
| **HomePage** | Hero, CTAs, Feature showcase | react-icons, react-router |
| **Dashboard** | Metrics grid, tabs, cards | styled-components, zustand |
| **Calculator** | Multi-tab form, engines | solar engines, date-fns |
| **Designer** | File upload, layout | react-dropzone |
| **Analytics** | Charts, trends, metrics | recharts, date-fns |
| **Settings** | Preferences, toggles | react-hook-form |
| **DesignStudio** | Canvas, drag-drop, shading | mapbox, canvas API |
| **RoofAnalyzer** | Image upload, ML analysis | tensorflow.js |
| **True3DViewer** | 3D house, panels, rotation | three.js, react-three-fiber |
| **Calculator (Advanced)** | 6 tabs, diagnostics, sizing | multiple engines |

---

## 🎨 Color System Quick Reference

```css
Primary Color System:
├── Primary:         #FFB800 (Golden Yellow) ← Main brand
├── Primary-Dark:    #FF9E00 (Dark Gold)
├── Dark:            #001a4d (Navy Blue)     ← Backgrounds
└── Dark-Light:      #0033aa (Lighter Blue)

Semantic Colors:
├── Success:         #22c55e (Green)
├── Warning:         #f59e0b (Amber)
├── Danger:          #ef4444 (Red)
├── Info:            #3b82f6 (Blue)
└── Light:           #f8f9ff

Effects:
├── Shadows:         --shadow-sm to --shadow-xl
├── Transitions:     --transition: 0.3s cubic-bezier
└── Backdrop Filter: blur(10px)
```

---

## 🛠️ Technology Stack

```
Frontend Framework:
├── React 18.2
├── TypeScript 5.0
├── Vite (build tool)
└── React Router 6

Styling:
├── Styled-Components 6.4
├── CSS Variables
└── Plain CSS (specialized modules)

Visualization:
├── Three.js 0.155
├── React Three Fiber 8.13
├── Recharts 2.7
├── Chart.js 4.3
└── Mapbox GL (optional)

State Management:
├── Zustand 4.3
├── React Query 3.39
└── React Hook Form 7.45

AI/ML:
├── TensorFlow.js 4.0
├── Tesseract.js 5.0 (OCR)
└── Custom solar engines

UI Components:
├── React Icons 4.10
├── React Hot Toast 2.4
├── Framer Motion 10.12
└── React Helmet Async 2.0

Data Processing:
├── PapaParse 5.4 (CSV)
├── XLSX 0.18 (Excel)
├── jsPDF 2.5 (PDF export)
└── Date-fns 2.30 (dates)
```

---

## 📊 Component Statistics

```
Code Metrics:
├── Total TypeScript/TSX files:  ~30
├── Total CSS files:             ~6
├── Total Pages:                 6
├── Feature Components:          24+
├── Shared Components:           3
├── Styling approaches:          3 (Styled-Components, CSS, RN)
└── Average lines per component: 100-500

Complexity Distribution:
├── Simple (50-100 lines):       20%
├── Medium (100-300 lines):      50%
├── Complex (300+ lines):        30%
  └── AdvancedSolarCalculator:   ~800+ lines
```

---

## 🚀 Quick Start Reference

### **Start Development Server**
```bash
npm run dev              # Vite dev server + Vite
npm run start           # Server + dev together
```

### **Build for Production**
```bash
npm run build           # TypeScript + Vite build
```

### **Navigation Pattern**
```typescript
// Using React Router in components
import { Link } from 'react-router-dom';

<Link to="/dashboard">Dashboard</Link>
<Link to="/calculator">Calculator</Link>
```

### **Styled Component Pattern**
```typescript
import styled from 'styled-components';

const Container = styled.div`
  background: var(--primary);
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
```

### **Adding New Component**
1. Create file: `crc/components/[category]/NewComponent.tsx`
2. Import styled-components
3. Define styled components
4. Export React FC
5. Import in parent/page component

---

## 📋 Component Status Checklist

- [x] **Home Page** - Hero + landing components
- [x] **Dashboard** - Metrics + feature integration
- [x] **Calculator** - Multi-tab sizing tool
- [x] **Designer** - Roof analysis + panel placement
- [x] **Analytics** - Chart-based analytics
- [x] **Settings** - User preferences
- [x] **3D Viewer** - House model visualization
- [x] **Design Studio** - Canvas-based design
- [x] **Roof Analyzer** - AI image analysis
- [x] **Investment Suite** - Financial analytics
- [x] **Decision Engine** - Recommendations
- [x] **Navigation** - Header navigation
- [x] **Footer** - Footer layout
- [x] **Loading States** - Spinner component
- [x] **Global Styles** - CSS variables

---

## 🔍 Component Search Guide

**Looking for...?**
- Investment calculations → `components/investment/`
- 3D visualizations → `components/design/True3DViewer.tsx`
- System sizing → `components/calculator/AdvancedSolarCalculator.tsx`
- Design/layout tools → `components/design/DesignStudioAI.tsx`
- Diagnostic tools → `components/decision/FaultCodesAI.tsx`
- Page layouts → `src/pages/`
- Navigation → `src/components/Navigation.tsx`
- Global styles → `src/index.css`
- Master dashboard → `components/AdvancedFeaturesDashboard.tsx`

---

**Document Generated:** April 21, 2026  
**Framework Version:** React 18.2 + TypeScript 5.0  
**Status:** ✅ Complete Inventory

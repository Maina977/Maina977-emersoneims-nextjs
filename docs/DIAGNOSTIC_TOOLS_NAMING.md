# DIAGNOSTIC TOOLS - NAMING CONVENTION

## 📋 OVERVIEW

EmersonEIMS has **TWO SEPARATE** diagnostic tools with unique names to avoid confusion:

---

## 🔧 TOOL 1: UNIVERSAL DIAGNOSTIC MACHINE

**Location:** `/diagnostics` page  
**Component:** `UniversalDiagnosticMachine.jsx`  
**Purpose:** Universal diagnostics for ALL 9 services

### Services Covered:
1. Solar Systems
2. Diesel Generators
3. Controls
4. AC & UPS
5. Automation
6. Pumps
7. Incinerators
8. Motors/Rewinding
9. Diagnostics Hub

### Key Features:
- Universal coverage for all energy infrastructure services
- 9 service modes with cockpit switches
- Real-time diagnostic logs
- Radar scope visualization
- Health status indicators (Green/Amber/Red)
- Alert system for HIGH/MED severity issues

### When to Use:
- General diagnostics across all services
- Multi-service monitoring
- Universal power system diagnostics
- Comprehensive infrastructure health checks

---

## ⚡ TOOL 2: GENERATOR CONTROL DIAGNOSTIC HUB

**Location:** `/diagnostic-suite` page  
**Component:** `GeneratorControlDiagnosticHub.jsx`  
**Purpose:** Specialized diagnostics for Generators, Controls, DeepSea, and PowerWizard

### Services Covered:
1. **Diesel Generators** - Generator-specific diagnostics
2. **Generator Controls** - Control system diagnostics
3. **DeepSea Controllers** - DeepSea controller-specific diagnostics
4. **PowerWizard Systems** - PowerWizard system diagnostics

### Key Features:
- Specialized for generator and controller systems
- DeepSea controller integration
- PowerWizard system diagnostics
- Generator-specific fault codes
- Controller firmware monitoring
- Load sharing and synchronization diagnostics

### When to Use:
- Generator-specific troubleshooting
- DeepSea controller diagnostics
- PowerWizard system monitoring
- Generator control system issues
- Controller firmware and configuration checks

---

## 🎯 KEY DIFFERENCES

| Feature | Universal Diagnostic Machine | Generator Control Diagnostic Hub |
|---------|------------------------------|-----------------------------------|
| **Scope** | All 9 services (Universal) | 4 services (Generator-specific) |
| **Focus** | Multi-service infrastructure | Generators & Controllers only |
| **Controllers** | Generic controls | DeepSea & PowerWizard specific |
| **Use Case** | General diagnostics | Generator/controller troubleshooting |
| **Page** | `/diagnostics` | `/diagnostic-suite` |

---

## 📍 NAVIGATION

### Universal Diagnostic Machine
- **URL:** `/diagnostics`
- **Title:** "Universal Diagnostic Machine"
- **Subtitle:** "Awwwards Winning Interface - Universal Power System Diagnostics"
- **Link from Generator Hub:** "Try Universal Diagnostic Machine"

### Generator Control Diagnostic Hub
- **URL:** `/diagnostic-suite`
- **Title:** "Generator Control Diagnostic Hub"
- **Subtitle:** "Specialized diagnostic suite for Diesel Generators, Generator Controls, DeepSea Controllers, and PowerWizard Systems"
- **Link from Universal:** "For generator-specific diagnostics, visit Generator Control Diagnostic Hub"

---

## 🔄 CROSS-REFERENCES

Both tools include cross-references to help users navigate:

1. **Universal Diagnostic Machine** includes:
   - Note: "For generator-specific diagnostics (DeepSea, PowerWizard), visit Generator Control Diagnostic Hub"

2. **Generator Control Diagnostic Hub** includes:
   - Button: "Try Universal Diagnostic Machine" (links to `/diagnostics`)

---

## ✅ NAMING RULES

1. **Universal Diagnostic Machine** = All 9 services (UNIVERSAL)
2. **Generator Control Diagnostic Hub** = Generators, Controls, DeepSea, PowerWizard (SPECIALIZED)

**Never confuse these two tools!** They serve different purposes:
- Universal = Broad coverage
- Generator Hub = Specialized generator/controller focus

---

## 📝 COMPONENT FILES

### Universal Tool:
- `app/components/diagnostics/UniversalDiagnosticMachine.jsx`
- `app/diagnostics/page.tsx`

### Generator-Specific Tool:
- `app/components/diagnostics/GeneratorControlDiagnosticHub.jsx`
- `app/diagnostic-suite/page.tsx`

---

**Last Updated:** 2024  
**Status:** Production Ready ✅









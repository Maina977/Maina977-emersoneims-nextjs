# NO DUPLICATION POLICY - IMPLEMENTATION GUIDE

## ✅ ZERO DUPLICATION RULE

**All data, content, and structures must be centralized with NO duplications across the codebase.**

---

## 📋 CENTRALIZED DATA SOURCES

### 1. **Diagnostic Services** (`lib/data/diagnosticServices.ts`)
**Purpose:** Single source of truth for all service lists

**Exports:**
- `UNIVERSAL_SERVICES` - All 9 services for Universal Diagnostic Machine
- `GENERATOR_SERVICES` - 4 services for Generator Control Diagnostic Hub

**Used By:**
- `UniversalDiagnosticMachine.jsx`
- `NineInOneCalculator.jsx`
- `GeneratorControlDiagnosticHub.jsx`

**✅ Status:** Centralized - No duplications

---

### 2. **Diagnostic Tools** (`lib/data/diagnosticTools.ts`)
**Purpose:** Single source of truth for diagnostic tool definitions

**Exports:**
- `DIAGNOSTIC_TOOLS` - Array of 8 diagnostic tools

**Used By:**
- `diagnostic-suite/page.tsx`

**✅ Status:** Centralized - No duplications

---

### 3. **Error Codes** (`app/data/diagnostic/errorCodes.json`)
**Purpose:** Single source of truth for all error codes

**Used By:**
- `ErrorList.jsx`
- `GlobalSearch.jsx`

**Import Path:** `@/app/data/diagnostic/errorCodes.json` ✅ (Fixed - was `@/app/app/data/...`)

**✅ Status:** Centralized - No duplications

---

## 🚫 DUPLICATION RULES

### ❌ NEVER DO THIS:
```tsx
// ❌ BAD - Duplicated array
const SERVICES = ['Solar Systems', 'Diesel Generators', ...];

// ❌ BAD - Duplicated in multiple files
const diagnosticTools = [{ id: 'fault-lookup', ... }];
```

### ✅ ALWAYS DO THIS:
```tsx
// ✅ GOOD - Import from centralized source
import { UNIVERSAL_SERVICES } from '@/lib/data/diagnosticServices';
import { DIAGNOSTIC_TOOLS } from '@/lib/data/diagnosticTools';
```

---

## 📁 DATA STRUCTURE ORGANIZATION

### Centralized Data Files:
```
lib/data/
  ├── diagnosticServices.ts    # Service lists
  ├── diagnosticTools.ts       # Diagnostic tool definitions
  └── ...

app/data/
  └── diagnostic/
      └── errorCodes.json       # Error code database
```

### Component Files (NO data):
```
app/components/diagnostics/
  ├── UniversalDiagnosticMachine.jsx  # Uses imported data
  ├── GeneratorControlDiagnosticHub.jsx  # Uses imported data
  ├── NineInOneCalculator.jsx  # Uses imported data
  └── ...
```

---

## 🔍 VERIFICATION CHECKLIST

### Data Duplications:
- [x] ✅ SERVICES array - Centralized in `diagnosticServices.ts`
- [x] ✅ GENERATOR_SERVICES array - Centralized in `diagnosticServices.ts`
- [x] ✅ diagnosticTools array - Centralized in `diagnosticTools.ts`
- [x] ✅ errorCodes - Single JSON file, correct import path

### Import Paths:
- [x] ✅ Error codes: `@/app/data/diagnostic/errorCodes.json` (fixed)
- [x] ✅ Services: `@/lib/data/diagnosticServices`
- [x] ✅ Tools: `@/lib/data/diagnosticTools`

### Content Duplications:
- [x] ✅ Branding text ("EmersonEIMS", "Powering Kenya") - Expected, not duplicated
- [x] ✅ Image URLs - Same images used multiple times (OK)
- [x] ✅ Page-specific content - Each page has unique content

---

## 📝 ADDING NEW DATA

### When adding new data:

1. **Check if it exists:**
   - Search codebase for similar data
   - Check `lib/data/` directory
   - Check `app/data/` directory

2. **If it doesn't exist:**
   - Create new file in `lib/data/` or `app/data/`
   - Export as const/interface
   - Document usage

3. **If it exists:**
   - Import from existing source
   - DO NOT duplicate

4. **Update this document:**
   - Add new data source to this list
   - Document where it's used

---

## 🎯 BENEFITS OF NO DUPLICATION

1. **Single Source of Truth:** One place to update data
2. **Consistency:** All components use same data
3. **Maintainability:** Easier to update and fix
4. **Type Safety:** TypeScript types from centralized sources
5. **Performance:** No redundant data in bundle

---

## ✅ CURRENT STATUS

**All duplications eliminated:**
- ✅ Services arrays centralized
- ✅ Diagnostic tools centralized
- ✅ Error codes single source
- ✅ Import paths corrected
- ✅ No duplicate data structures

**Status:** ✅ ZERO DUPLICATIONS

---

**Last Updated:** 2024  
**Policy:** Enforced - No exceptions









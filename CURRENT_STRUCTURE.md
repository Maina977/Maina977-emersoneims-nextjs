# Current Project Structure

## **ROOT DIRECTORY: `C:\Users\PC\my-app\`**

```
my-app/
├── app/                          # Next.js App Router (main directory)
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── components/               # ✅ NEW: Correctly spelled components
│   │   └── contact/
│   │       ├── ErrorBoundary.jsx
│   │       ├── AdaptivePerformanceMonitor.jsx
│   │       ├── CallUs.jsx
│   │       ├── EmailUs.jsx
│   │       ├── VisitUs.jsx
│   │       ├── Gallery.jsx
│   │       ├── ContactForm.jsx
│   │       ├── CountiesGrid.jsx
│   │       ├── HeroSection.jsx
│   │       └── SEOHead.jsx
│   │
│   ├── componets/                # ⚠️ OLD: Typo (should be components)
│   │   ├── common/
│   │   ├── contact us/           # ⚠️ OLD: Space in folder name
│   │   ├── diagnostics/
│   │   ├── generators/
│   │   ├── service/
│   │   └── ...
│   │
│   ├── app/                      # ⚠️ NESTED: Should be flattened
│   │   ├── contact page.tsx
│   │   ├── generators page.tsx
│   │   ├── service page.tsx
│   │   ├── solution page.tsx
│   │   ├── solar page.tsx
│   │   ├── data/
│   │   │   └── diagnostic/
│   │   │       └── errorCodes.json
│   │   └── ...
│   │
│   ├── about-us/                 # ✅ Routes
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── diagnostics/
│   │   └── page.tsx
│   ├── generators/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── used/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── service/
│   │   └── page.tsx
│   ├── solution/
│   │   └── page.tsx
│   ├── solar/
│   │   └── page.tsx
│   │
│   ├── lib/
│   │   └── data/
│   │       ├── cumminsgenerators.ts
│   │       └── generatorservices.ts
│   │
│   └── styles/
│       └── diagnostics.css
│
├── components/                   # Root-level components (if any)
│   └── media/
│       ├── OptimizedImage.tsx
│       └── OptimizedVideo.tsx
│
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## **PROBLEMS WITH CURRENT STRUCTURE:**

1. ❌ **Nested `app/app/`** - Should be flattened
2. ❌ **Typo: `componets`** - Should be `components`
3. ❌ **Space in folder: `contact us`** - Should be `contact`
4. ❌ **Mixed import paths** - Some use `@/app/...`, some use `@/...`

---

## **DESIRED STRUCTURE (After Reorganization):**

```
my-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css
│   │
│   ├── components/               # ✅ All components (correctly spelled)
│   │   ├── contact/
│   │   ├── common/
│   │   ├── diagnostics/
│   │   ├── generators/
│   │   ├── service/
│   │   └── ...
│   │
│   ├── data/                     # ✅ Moved from app/app/data
│   │   └── diagnostic/
│   │       └── errorCodes.json
│   │
│   ├── about-us/
│   ├── contact/
│   ├── diagnostics/
│   ├── generators/
│   ├── service/
│   ├── solution/
│   ├── solar/
│   │
│   ├── lib/
│   │   └── data/
│   │
│   └── styles/
│
├── components/                   # Root-level shared components
│   └── media/
│
└── [config files]
```

---

## **IMPORT PATHS (After Fix):**

- ✅ `@/components/contact/...` (not `@/app/components/...`)
- ✅ `@/componets/...` (or eventually `@/components/...` after rename)
- ✅ `@/lib/data/...` (not `@/app/lib/...`)
- ✅ `@/app/data/...` (for data files)
- ✅ `@/styles/...` (not `@/app/styles/...`)

---

## **NEXT STEPS:**

1. Run `FINAL_REORGANIZE.bat` to flatten structure
2. Eventually rename `componets` → `components`
3. Eventually rename `contact us` → `contact`














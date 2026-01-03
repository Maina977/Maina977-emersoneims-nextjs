# Media Files Location Guide

## Current Situation

### ✅ What EXISTS in `public/` folder:
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (default Next.js files)
- `robots.txt`
- `sounds` (file)

### ❌ What's MISSING but REFERENCED in code:

#### Images Referenced (but folders don't exist):
1. **`/images/` folder** - Referenced in:
   - `app/app/about us page.tsx` - premium images
   - `app/app/about us page.tsx` - GEN-1-1.png, workshop.png, etc.
   - `app/componets/TrustSignals.tsx` - case-placeholder.jpg

2. **`/media/` folder** - Referenced in:
   - `app/app/generatoors case-studies page.tsx` - case-hospital.jpg, case-factory.jpg, etc.
   - `app/app/generators page.tsx` - cummins-warehouse.mp4, cummins-poster.jpg

3. **`/assets/` folder** - Referenced in:
   - `app/componets/contact us/HeroSection.jsx` - nairobi-grid.mp4

4. **Root level files**:
   - `/logo.png` - Referenced in diagnostic page
   - `/og-image.jpg` - Referenced in layout.tsx
   - `/twitter-image.jpg` - Referenced in layout.tsx

### ✅ What's HOSTED on WordPress (working):
Many images are loaded from:
- `https://www.emersoneims.com/wp-content/uploads/2025/10/`
- `https://www.emersoneims.com/wp-content/uploads/2025/11/`

## Where to Place Your Media Files

### Next.js Standard Structure:
```
public/
├── images/          ← Create this folder
│   ├── premium/     ← Create this subfolder
│   │   ├── high-power-infra.jpg
│   │   ├── generator-detail.jpg
│   │   ├── solar-control.jpg
│   │   └── ... (all premium images)
│   ├── GEN-1-1.png
│   ├── workshop.png
│   ├── solar-changeover-control.png
│   ├── 924.png
│   └── case-placeholder.jpg
├── media/           ← Create this folder
│   ├── case-hospital.jpg
│   ├── case-factory.jpg
│   ├── case-farm.jpg
│   ├── case-datacenter.jpg
│   ├── cummins-warehouse.mp4
│   └── cummins-poster.jpg
├── assets/          ← Create this folder
│   └── nairobi-grid.mp4
├── logo.png         ← Place in public root
├── og-image.jpg     ← Place in public root
└── twitter-image.jpg ← Place in public root
```

## How to Add Your Images/Videos

### Step 1: Create Folders
Create these folders in the `public` directory:
- `public/images/`
- `public/images/premium/`
- `public/media/`
- `public/assets/`

### Step 2: Add Your Files
Place your images/videos in the appropriate folders:

**For Premium Images:**
- Put in: `public/images/premium/`
- Files needed:
  - high-power-infra.jpg
  - generator-detail.jpg
  - solar-control.jpg
  - ac-installation.jpg
  - motor-winding.jpg
  - borehole-drill.jpg
  - incinerator-system.jpg
  - metal-fabrication.jpg
  - engineering-team.jpg
  - diagnostic-tool.jpg
  - field-work.jpg
  - cinematic-shot.jpg
  - premium-infrastructure.jpg
  - hybrid-intelligence.jpg

**For General Images:**
- Put in: `public/images/`
- Files needed:
  - GEN-1-1.png
  - workshop.png
  - solar-changeover-control.png
  - 924.png
  - case-placeholder.jpg

**For Case Studies:**
- Put in: `public/media/`
- Files needed:
  - case-hospital.jpg
  - case-factory.jpg
  - case-farm.jpg
  - case-datacenter.jpg
  - cummins-warehouse.mp4 (video)
  - cummins-poster.jpg

**For Assets:**
- Put in: `public/assets/`
- Files needed:
  - nairobi-grid.mp4 (video)

**For Root Files:**
- Put directly in: `public/`
- Files needed:
  - logo.png
  - og-image.jpg
  - twitter-image.jpg

## How to Use in Code

### Images:
```jsx
// In Next.js, reference from public folder:
<img src="/images/premium/generator-detail.jpg" alt="Generator" />
<img src="/logo.png" alt="Logo" />
```

### Videos:
```jsx
<video src="/media/cummins-warehouse.mp4" />
<source src="/assets/nairobi-grid.mp4" type="video/mp4" />
```

## Next Steps

1. **Create the folder structure** (I can do this)
2. **Add your images/videos** to the appropriate folders
3. **Verify paths** match what's referenced in code

Would you like me to:
- Create the folder structure?
- Help organize your media files?
- Update code if file names don't match?



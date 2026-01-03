# CINEMATIC HEADINGS - UNIFIED STYLE GUIDE

## ✅ ALL HEADINGS NOW UNIFIED

**Every heading across all pages uses the same:**
- ✅ **Size** (based on semantic level)
- ✅ **Design** (gold gradient with glow)
- ✅ **Font** (Space Grotesk - font-display)
- ✅ **Color** (gold gradient: #fbbf24 → #f59e0b)
- ✅ **Cinematic Effects** (animated gradient, glow, fade-in)

---

## 🎨 HEADING COMPONENTS

### **Location:** `components/typography/CinematicHeading.tsx`

### **Variants Available:**

#### 1. **HeroHeading** (H1)
- **Size:** `text-6xl md:text-8xl`
- **Use:** Main page titles, hero sections
- **Example:**
```tsx
import { HeroHeading } from '@/components/typography/CinematicHeadingVariants';

<HeroHeading>About EmersonEIMS</HeroHeading>
```

#### 2. **SectionHeading** (H2)
- **Size:** `text-4xl md:text-5xl`
- **Use:** Main section titles
- **Example:**
```tsx
import { SectionHeading } from '@/components/typography/CinematicHeadingVariants';

<SectionHeading>Our Journey</SectionHeading>
<SectionHeading align="left">Left Aligned</SectionHeading>
```

#### 3. **SubsectionHeading** (H3)
- **Size:** `text-2xl md:text-3xl`
- **Use:** Subsection titles
- **Example:**
```tsx
import { SubsectionHeading } from '@/components/typography/CinematicHeadingVariants';

<SubsectionHeading>Subsection Title</SubsectionHeading>
```

#### 4. **CardHeading** (H4)
- **Size:** `text-xl md:text-2xl`
- **Use:** Card titles, smaller headings
- **Example:**
```tsx
import { CardHeading } from '@/components/typography/CinematicHeadingVariants';

<CardHeading>Card Title</CardHeading>
```

---

## 🎬 CINEMATIC FEATURES

### **Visual Effects:**
1. **Gold Gradient:** `from-[#fbbf24] via-[#f59e0b] to-[#fbbf24]`
2. **Animated Gradient:** Smooth shifting animation (3s infinite)
3. **Glow Effect:** `textShadow: '0 0 40px rgba(251, 191, 36, 0.3)'`
4. **Fade-in Animation:** Framer Motion fade-in on scroll
5. **Font:** Space Grotesk (font-display) - Premium sans-serif

### **Consistent Styling:**
- Font weight: `700` (bold)
- Letter spacing: `-0.02em`
- Line height: `1.1`
- Text alignment: Configurable (left/center/right)

---

## 📋 USAGE ACROSS PAGES

### ✅ Updated Pages:
1. **About Us** - All headings updated
2. **Diagnostics** - Hero and section headings updated
3. **Diagnostic Suite** - All section headings updated

### 🔄 To Update Remaining Pages:
Replace all custom heading styles with:

```tsx
// ❌ OLD - Inconsistent
<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
  Title
</h2>

// ✅ NEW - Consistent
import { SectionHeading } from '@/components/typography/CinematicHeadingVariants';

<div className="mb-6">
  <SectionHeading>Title</SectionHeading>
</div>
```

---

## 🎯 HEADING SIZE HIERARCHY

| Level | Component | Size | Use Case |
|-------|-----------|------|----------|
| H1 | HeroHeading | 6xl/8xl | Page titles, hero sections |
| H2 | SectionHeading | 4xl/5xl | Main section titles |
| H3 | SubsectionHeading | 2xl/3xl | Subsection titles |
| H4 | CardHeading | xl/2xl | Card titles, small headings |

---

## 🚫 NEVER USE DIRECT HEADING STYLES

### ❌ DON'T:
```tsx
<h1 className="text-6xl font-bold bg-gradient-to-r...">Title</h1>
<h2 className="text-4xl font-bold text-white">Title</h2>
<h3 className="text-2xl font-semibold">Title</h3>
```

### ✅ DO:
```tsx
<HeroHeading>Title</HeroHeading>
<SectionHeading>Title</SectionHeading>
<SubsectionHeading>Title</SubsectionHeading>
```

---

## 📐 ALIGNMENT OPTIONS

All heading components support alignment:

```tsx
<SectionHeading align="left">Left Aligned</SectionHeading>
<SectionHeading align="center">Center Aligned (default)</SectionHeading>
<SectionHeading align="right">Right Aligned</SectionHeading>
```

---

## 🎨 COLOR & GRADIENT

**Standard Gold Gradient:**
- Start: `#fbbf24` (amber-400)
- Middle: `#f59e0b` (amber-600)
- End: `#fbbf24` (amber-400)
- Animation: Smooth shifting (3s infinite)

**Glow Effect:**
- Shadow: `0 0 40px rgba(251, 191, 36, 0.3)`
- Creates cinematic halo effect

---

## ✨ ANIMATION

**Fade-in on Scroll:**
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: `0.6s`
- Ease: `easeOut`
- Trigger: `whileInView` (viewport once)

**Gradient Animation:**
- CSS animation: `gradient-shift 3s ease infinite`
- Background position shifts smoothly

---

## 📝 IMPLEMENTATION CHECKLIST

### Pages to Update:
- [x] About Us
- [x] Diagnostics
- [x] Diagnostic Suite
- [ ] Home
- [ ] Services
- [ ] Solutions
- [ ] Generators
- [ ] Used Generators
- [ ] Solar
- [ ] Contact

### Steps:
1. Import heading components
2. Replace all custom heading styles
3. Use appropriate variant (Hero/Section/Subsection/Card)
4. Add spacing wrapper (`mb-6`, `mb-4`, etc.)
5. Test responsive sizes

---

## 🎯 BENEFITS

1. **Consistency:** All headings look identical
2. **Maintainability:** Change once, update everywhere
3. **Cinematic:** Professional, award-winning design
4. **Performance:** Optimized animations
5. **Accessibility:** Semantic HTML structure

---

**Last Updated:** 2024  
**Status:** ✅ Core Component Created, Pages Being Updated









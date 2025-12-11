# What Your Homepage Should Look Like

## Expected Appearance

### Initial Load (First 2-3 seconds)
1. **Loading Animation** - Awwwards-style loading sequence
2. **Dark Background** - Deep dark color (#08080C)

### After Loading Animation

### Hero Section (Main View)
1. **Large Animated Headline**:
   - "PREMIUM" (large, white, animated)
   - "POWER" (large, white, animated)
   - "ENGINEERING &" (large, white with amber "&" symbol)

2. **Subheadline**:
   - "Intelligent Energy | Nairobi Engineered"
   - Gradient text (amber to cyan)

3. **3D WebGL Canvas**:
   - Animated 3D "Intelligent Core" visualization
   - Rotating/orbiting geometric shapes
   - Energy particles/effects

4. **CTA Buttons**:
   - "Explore Intelligence" (gradient button - amber to cyan)
   - "Live Demo" (secondary button with play icon)

5. **Scroll Indicator**:
   - Animated line/dot at bottom
   - Indicates you can scroll down

6. **Navigation Bar**:
   - Minimal, sticky navigation at top
   - Theme toggle option

### When Scrolling Down
- **Power Journey Section** - Horizontal scroll narrative
- **Services Showcase** - 3D card interactions
- **Technical Showcase** - Interactive schematics
- **Case Studies** - Award-winning projects
- **Footer** - Tech stack badges (Next.js 15, React Three Fiber, etc.)

## Color Scheme
- **Background**: Dark (#08080C)
- **Text**: White/Light
- **Accent Colors**: Amber (#FFB703) and Cyan (#00FFFF)
- **Gradients**: Amber to Cyan

## What You Should See

### ✅ CORRECT Appearance:
- Dark background
- Large white text headlines
- 3D animated scene
- Smooth animations
- Professional, modern design

### ❌ If You See:
- **White/light background** - Styles not loading
- **Small text** - CSS not applied
- **No 3D scene** - HeroCanvas not loading
- **Error messages** - Component issues
- **Plain Next.js starter page** - Wrong page loaded

## Common Issues & Fixes

### Issue 1: White Background Instead of Dark
**Problem**: CSS not loading
**Fix**: Check browser console for errors

### Issue 2: No 3D Scene
**Problem**: HeroCanvas component error
**Fix**: Check console for React Three Fiber errors

### Issue 3: Loading Forever
**Problem**: Component import error
**Fix**: Check terminal for build errors

### Issue 4: Plain Text, No Styling
**Problem**: Tailwind CSS not loading
**Fix**: Verify `globals.css` is imported

## Quick Check

Open Browser DevTools (F12) and check:
1. **Console Tab** - Any red errors?
2. **Network Tab** - Are CSS files loading?
3. **Elements Tab** - Is HTML structure correct?

## Expected Behavior

- ✅ Smooth animations
- ✅ 3D scene renders and animates
- ✅ Text animates in on load
- ✅ Scroll triggers parallax effects
- ✅ Responsive on mobile

## If Something Looks Wrong

1. **Take a screenshot** of what you see
2. **Check browser console** (F12) for errors
3. **Check terminal** where `npm run dev` is running
4. **Share the errors** and I'll help fix them



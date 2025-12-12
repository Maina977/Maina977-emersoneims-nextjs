# ⚠️ CRITICAL: Path Mapping Issue

## **Problem Identified:**

Your codebase has components in TWO locations:

1. **Root `components/`** (used by homepage)
   - `components/media/OptimizedVideo.tsx`
   - `components/navigation/NavigationBar.tsx`
   - `components/accessibility/...`
   - etc.

2. **`app/components/contact/`** (used by contact page)
   - `app/components/contact/SEOHead.jsx`
   - etc.

## **The Conflict:**

If we change `tsconfig.json` to:
```json
"@/*": ["./app/*"]
```

Then:
- ✅ `@/components/contact/` → `app/components/contact/` ✓
- ❌ `@/components/media/` → `app/components/media/` ✗ (doesn't exist!)
- ❌ Homepage imports will break! ✗

## **Solution Options:**

### **Option 1: Keep Current Mapping, Fix Imports**
- Keep: `"@/*": ["./*"]` (maps to root)
- Fix contact page to use: `@/components/contact/` (move contact components to root)
- **OR** use: `@/app/components/contact/` (but need to check if this works)

### **Option 2: Move All Components to app/**
- Move `components/` → `app/components/`
- Change mapping to `"@/*": ["./app/*"]`
- Update all imports

### **Option 3: Dual Path Mapping**
- Add both mappings (complex, not recommended)

## **Recommended: Option 1 - Move Contact to Root**

Since homepage already uses root `components/`, keep consistency:
1. Move `app/components/contact/` → `components/contact/`
2. Keep `"@/*": ["./*"]`
3. Update contact page imports

This maintains consistency with existing structure.



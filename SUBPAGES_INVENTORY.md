# 📄 Subpages Inventory

## ✅ Confirmed Subpages (1 Subpage)

### 1. **Used Generators** - `/generators/used`
- **Location:** `app/generators/used/page.tsx`
- **Layout:** `app/generators/used/layout.tsx`
- **Parent Page:** `/generators`
- **Description:** Dedicated page for used/pre-owned generators with listings for Cummins, Perkins, and Caterpillar brands

---

## 🔗 Referenced But Not Implemented (Potential Future Subpages)

The code contains links to routes that don't have corresponding page files yet:

### 1. **Individual Generator Model Pages**
- **Referenced Route:** `/generators/{model-name}`
- **Example:** `/generators/cummins-c20d5`
- **Found in:** `app/generators/page.tsx` (line 388)
- **Status:** ❌ **Not Implemented** - Links exist but no dynamic route folder `[model]` or `[slug]`

### 2. **AR Generator Preview Pages**
- **Referenced Route:** `/ar/generator/{model}`
- **Example:** `/ar/generator/Cummins C20D5`
- **Found in:** `app/generators/page.tsx` (lines 64, 396)
- **Status:** ❌ **Not Implemented** - Component exists (`components/ar/ARPreview.tsx`) but no route page

### 3. **Used Generator Specs Pages**
- **Referenced Route:** `/specs/used/{brand}`
- **Example:** `/specs/used/cummins`
- **Found in:** `app/generators/used/page.tsx` (line 435)
- **Status:** ❌ **Not Implemented** - No route folder exists

### 4. **Generator Contact/Trade-in Page**
- **Referenced Route:** `/generator/contact?type=tradein`
- **Found in:** `app/generators/used/page.tsx` (line 499)
- **Status:** ❌ **Not Implemented** - No route folder exists

---

## 📊 Summary

### Current Subpages: **1**
- ✅ `/generators/used` - **ACTIVE**

### Referenced Routes (Not Implemented): **4**
- ❌ Individual generator model pages
- ❌ AR preview pages
- ❌ Used generator specs pages
- ❌ Generator trade-in contact page

---

## 🎯 Recommendations

### To Implement Referenced Routes:

1. **Create Dynamic Generator Model Pages:**
   ```
   app/generators/[model]/page.tsx
   ```
   - This would create pages like `/generators/cummins-c20d5`

2. **Create AR Preview Route:**
   ```
   app/ar/generator/[model]/page.tsx
   ```
   - Use the existing `ARPreview` component

3. **Create Specs Pages:**
   ```
   app/specs/used/[brand]/page.tsx
   ```
   - For detailed specifications of used generators

4. **Create Trade-in Contact Page:**
   ```
   app/generator/contact/page.tsx
   ```
   - Or handle via query params in existing contact page

---

## ✅ Answer: **YES, You Have 1 Subpage**

**Current Subpage:**
- `/generators/used` - Used Generators listing page

**Note:** There are 4 additional routes referenced in the code that could be implemented as subpages in the future.


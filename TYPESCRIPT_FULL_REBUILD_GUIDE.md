# ✅ TypeScript Full Rebuild Guide

## Current Configuration

### ✅ tsconfig.json Settings
```json
{
  "compilerOptions": {
    ...
    "incremental": false,  // ✅ Forces full rebuild (no cache)
    ...
  }
}
```

**Location**: `C:\Users\PC\my-app\tsconfig.json`

## Quick Commands

### 🧹 Clear Caches
```batch
cd /d "C:\Users\PC\my-app" && rmdir /s /q .next node_modules\.cache 2>nul
```

Or use the script:
```batch
QUICK_CLEAR_CACHE.bat
```

### 🔨 Clear and Rebuild
```batch
CLEAR_AND_REBUILD.bat
```

This will:
1. Clear `.next/` cache
2. Clear `node_modules/.cache/` cache
3. Remove TypeScript build info files
4. Run full build

## After Successful Build

### ✅ Revert to Incremental Builds (For Faster Dev)

Once the build succeeds, you can enable incremental builds for faster development:

**Option 1: Use Script**
```batch
REVERT_TO_INCREMENTAL.bat
```

**Option 2: Manual Edit**

In `tsconfig.json`, change:
```json
"incremental": false,
```

To:
```json
"incremental": true,
```

## When to Use Each Mode

### Full Rebuild (`incremental: false`)
- ✅ **Use when**: Final deployment prep
- ✅ **Use when**: Fixing type errors
- ✅ **Use when**: Suspecting cache issues
- ✅ **Benefit**: 100% accurate, no ghost errors
- ⚠️ **Drawback**: Slower builds

### Incremental Build (`incremental: true`)
- ✅ **Use when**: Development (after successful build)
- ✅ **Use when**: Iterating quickly
- ✅ **Benefit**: Faster builds (only checks changed files)
- ⚠️ **Drawback**: May miss some type changes if cache is stale

## Cache Locations

These folders/files are cleared:
- `.next/` - Next.js build cache
- `node_modules/.cache/` - Node modules cache
- `tsconfig.tsbuildinfo` - TypeScript incremental info
- `.tsbuildinfo` - TypeScript build info

## Verification

After clearing cache, verify:
- ✅ `app/contact/page.tsx` has `keywords` prop
- ✅ `components/contact/SEOHead.jsx` accepts `keywords`
- ✅ Build completes without TypeScript errors

## Troubleshooting

If build still fails after clearing cache:

1. **Restart TypeScript Server** in your IDE
2. **Check for duplicate files** - Ensure no `contact page.tsx` (with space)
3. **Verify import paths** - Ensure `@/components/contact/SEOHead` resolves correctly
4. **Check file encoding** - Ensure files are UTF-8

## Summary

✅ **For deployment/fixing errors**: Use `incremental: false` + clear cache
✅ **For development**: Use `incremental: true` (faster)
✅ **Current setting**: `incremental: false` (full rebuild mode)



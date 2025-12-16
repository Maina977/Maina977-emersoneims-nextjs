# ✅ Vercel Deployment Checklist

## Pre-Deployment

- [x] **TypeScript Errors Fixed**
  - Fixed `lib/utils/imageHelper.ts` type error
  - All type checks passing
  - ✅ Verified: `npm run type-check` passes

- [x] **Build Errors Fixed**
  - ✅ Fixed `useSearchParams()` Suspense boundary issue in GoogleAnalytics component
  - ✅ Fixed ESLint configuration for Next.js 16
  - ✅ Build completes successfully: `npm run build` passes
  - ✅ All 24 pages generated successfully

- [x] **Configuration Files Ready**
  - `vercel.json` configured with WordPress rewrites
  - `next.config.ts` optimized for production
  - `package.json` scripts verified
  - `.env.example` created with all required variables
  - `eslint.config.mjs` fixed for Next.js 16 compatibility

- [x] **Build Process Verified**
  - Build command: `npm run build`
  - Install command: `npm install --legacy-peer-deps`
  - ✅ No build errors - Production build successful

## Environment Variables (Set in Vercel Dashboard)

- [ ] `NEXT_PUBLIC_SITE_URL` = `https://emersoneims.com`
- [ ] `WORDPRESS_SITE_URL` = `https://www.emersoneims.com`
- [ ] `WORDPRESS_API_URL` = `https://www.emersoneims.com/wp-json/wp/v2`

## Deployment Steps

### Option 1: Vercel Dashboard (Recommended)

1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Click "Add New Project"
3. [ ] Import Git repository
4. [ ] Configure project settings:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`
5. [ ] Add environment variables
6. [ ] Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Option 3: Git Push (Auto-Deploy)

1. [ ] Push code to GitHub/GitLab/Bitbucket
2. [ ] Connect repository in Vercel
3. [ ] Enable auto-deploy for main branch
4. [ ] Push to main = Production deploy

## Post-Deployment Verification

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images load properly
- [ ] WordPress integration works
- [ ] Forms submit correctly
- [ ] Mobile responsive
- [ ] Performance score > 90
- [ ] No console errors
- [ ] Analytics tracking works

## Quick Commands

```bash
# Test build locally
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Verify dependencies: `npm install --legacy-peer-deps`
- Check build logs in Vercel Dashboard

### Runtime Errors
- Verify environment variables are set
- Check WordPress API accessibility
- Review function logs in Vercel Dashboard

### Image Issues
- Verify image URLs are correct
- Check WordPress image accessibility
- Verify Next.js image config

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** December 16, 2025

# 🚀 Vercel Deployment Guide - Emerson EIMS

## ✅ Pre-Deployment Checklist

### 1. **Code Quality**
- [x] TypeScript errors fixed
- [x] No linting errors
- [x] Build passes locally
- [x] All dependencies installed

### 2. **Configuration Files**
- [x] `vercel.json` configured
- [x] `next.config.ts` optimized
- [x] `package.json` scripts ready
- [x] `.env.example` created

### 3. **Environment Variables**
Set these in Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://emersoneims.com
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
```

---

## 📋 Deployment Steps

### **Option 1: Deploy via Vercel Dashboard (Recommended)**

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install --legacy-peer-deps` (from vercel.json)

3. **Set Environment Variables**
   - Go to Settings > Environment Variables
   - Add all variables from `.env.example`
   - Set for: Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

### **Option 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### **Option 3: Deploy via Git Push (Auto-Deploy)**

1. **Connect Git Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Connect repository in Vercel Dashboard
   - Enable "Auto-Deploy" for main branch

2. **Automatic Deployment**
   - Every push to `main` branch = Production deploy
   - Every push to other branches = Preview deploy
   - Pull requests = Preview deploy

---

## 🔧 Vercel Configuration

### **vercel.json** (Already Configured)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["iad1"],
  "github": {
    "enabled": true,
    "autoAlias": true,
    "autoJobCancelation": true
  },
  "env": {
    "WORDPRESS_SITE_URL": "https://www.emersoneims.com",
    "WORDPRESS_API_URL": "https://www.emersoneims.com/wp-json/wp/v2",
    "NEXT_PUBLIC_SITE_URL": "https://emersoneims.com"
  },
  "rewrites": [
    {
      "source": "/wp-admin/:path*",
      "destination": "https://www.emersoneims.com/wp-admin/:path*"
    },
    {
      "source": "/wp-content/:path*",
      "destination": "https://www.emersoneims.com/wp-content/:path*"
    },
    {
      "source": "/wp-json/:path*",
      "destination": "https://www.emersoneims.com/wp-json/:path*"
    }
  ]
}
```

### **Key Features:**
- ✅ Auto-install with `--legacy-peer-deps` flag
- ✅ WordPress rewrites configured
- ✅ Environment variables pre-set
- ✅ GitHub integration enabled
- ✅ Auto-alias for preview deployments

---

## 🎯 Build Configuration

### **next.config.ts** (Already Optimized)

- ✅ Image optimization enabled
- ✅ Remote patterns configured for WordPress
- ✅ Compression enabled
- ✅ React strict mode enabled
- ✅ TypeScript transpilation configured
- ✅ Performance optimizations enabled

### **package.json** Scripts

```json
{
  "build": "next build",           // Production build
  "dev": "next dev",               // Development server
  "start": "next start",           // Production server
  "lint": "next lint",             // Lint code
  "type-check": "tsc --noEmit"    // Type checking
}
```

---

## 🌐 Domain Configuration

### **Custom Domain Setup**

1. **Add Domain in Vercel**
   - Go to Project Settings > Domains
   - Click "Add Domain"
   - Enter: `emersoneims.com`
   - Enter: `www.emersoneims.com`

2. **DNS Configuration**
   - Add CNAME record: `cname.vercel-dns.com`
   - Or add A record: Vercel IP addresses
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - HTTPS enabled by default
   - Auto-renewal enabled

---

## 🔍 Troubleshooting

### **Build Failures**

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```
   Fix all TypeScript errors before deploying.

2. **Dependency Issues**
   ```bash
   npm install --legacy-peer-deps
   ```
   Already configured in `vercel.json`.

3. **Memory Issues**
   - Vercel provides 4GB RAM by default
   - If needed, upgrade to Pro plan

### **Runtime Errors**

1. **Environment Variables**
   - Verify all env vars are set in Vercel Dashboard
   - Check variable names match exactly
   - Ensure no typos

2. **WordPress API Issues**
   - Verify WordPress site is accessible
   - Check CORS settings on WordPress
   - Verify API endpoints are public

3. **Image Loading Issues**
   - Check image URLs are correct
   - Verify WordPress images are accessible
   - Check Next.js image configuration

---

## 📊 Performance Optimization

### **Already Configured:**

- ✅ Image optimization (Next.js Image component)
- ✅ Font optimization (next/font)
- ✅ Code splitting (automatic)
- ✅ Compression (gzip/brotli)
- ✅ Caching headers
- ✅ CDN distribution (Vercel Edge Network)

### **Vercel Analytics**

Enable in Vercel Dashboard:
- Web Vitals monitoring
- Real User Monitoring (RUM)
- Performance insights

---

## 🔐 Security

### **Already Configured:**

- ✅ HTTPS enforced
- ✅ Security headers (via middleware)
- ✅ Content Security Policy
- ✅ X-Powered-By header removed
- ✅ Environment variables secured

---

## 📈 Monitoring

### **Vercel Dashboard**

- Build logs
- Function logs
- Analytics
- Performance metrics
- Error tracking

### **Recommended Tools**

- Vercel Analytics (built-in)
- Sentry (error tracking)
- Google Analytics (optional)

---

## ✅ Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test all pages
- [ ] Check images load properly
- [ ] Verify WordPress integration works
- [ ] Test forms and interactions
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata
- [ ] Test performance (Lighthouse)
- [ ] Check analytics tracking
- [ ] Monitor error logs

---

## 🚀 Quick Deploy Commands

```bash
# Test build locally
npm run build

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** support@vercel.com

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** December 16, 2025


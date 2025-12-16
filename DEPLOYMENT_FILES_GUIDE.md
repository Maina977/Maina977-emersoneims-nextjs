# 🚀 GitHub & Vercel Deployment Files Guide

## 📦 GitHub Repository Information

### Repository Details:
- **Repository Name:** `emersoneims-nextjs`
- **GitHub URL:** `https://github.com/Maina977/emersoneims-nextjs.git`
- **Owner:** `Maina977`
- **Full Repository Path:** `Maina977/emersoneims-nextjs`

### To Push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Push to GitHub
git push -u origin main
```

---

## ⚙️ Vercel Configuration File

### File Name: `vercel.json`

**Location:** Root directory (`/vercel.json`)

**Current Configuration:**
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

**✅ This file is already configured and ready!**

---

## 📋 Required Files for Deployment

### 1. **Vercel Configuration**
- ✅ **File:** `vercel.json` (Already exists)
- **Purpose:** Vercel deployment settings

### 2. **Next.js Configuration**
- ✅ **File:** `next.config.ts` (Already exists)
- **Purpose:** Next.js build settings

### 3. **Package Configuration**
- ✅ **File:** `package.json` (Already exists)
- **Purpose:** Dependencies and scripts

### 4. **TypeScript Configuration**
- ✅ **File:** `tsconfig.json` (Already exists)
- **Purpose:** TypeScript compiler settings

### 5. **Environment Variables Template**
- ✅ **File:** `.env.example` (Created)
- **Purpose:** Environment variables template

### 6. **Git Ignore**
- ✅ **File:** `.gitignore` (Already exists)
- **Purpose:** Files to exclude from git

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign in with GitHub

3. **Import Project:**
   - Click "Add New Project"
   - Select repository: `Maina977/emersoneims-nextjs`
   - Vercel will auto-detect Next.js

4. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install --legacy-peer-deps` (from vercel.json)

5. **Set Environment Variables:**
   - `NEXT_PUBLIC_SITE_URL` = `https://emersoneims.com`
   - `WORDPRESS_SITE_URL` = `https://www.emersoneims.com`
   - `WORDPRESS_API_URL` = `https://www.emersoneims.com/wp-json/wp/v2`
   - `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` (optional)

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

---

### Option 3: Deploy via npm Script

```bash
# Deploy to production
npm run deploy:prod

# Or deploy preview
npm run deploy:preview
```

---

## 📝 Environment Variables to Set in Vercel

### Required Variables:
```
NEXT_PUBLIC_SITE_URL=https://emersoneims.com
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
```

### Optional Variables:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production
```

**How to Set:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable
5. Redeploy

---

## ✅ Pre-Deployment Checklist

- [x] `vercel.json` exists and is configured
- [x] `next.config.ts` is optimized
- [x] `package.json` has correct scripts
- [x] `.env.example` created
- [x] Build passes: `npm run build`
- [x] TypeScript checks pass: `npm run type-check`
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Domain configured (if needed)

---

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/Maina977/emersoneims-nextjs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Name:** `emersoneims-nextjs`
- **Vercel Project:** Will be created when you import

---

## 📄 File Summary

| File | Purpose | Status |
|------|---------|--------|
| `vercel.json` | Vercel deployment config | ✅ Ready |
| `next.config.ts` | Next.js configuration | ✅ Ready |
| `package.json` | Dependencies & scripts | ✅ Ready |
| `tsconfig.json` | TypeScript config | ✅ Ready |
| `.env.example` | Environment template | ✅ Ready |
| `.gitignore` | Git ignore rules | ✅ Ready |

---

## 🎯 Summary

**GitHub Repository:**
- **Name:** `emersoneims-nextjs`
- **URL:** `https://github.com/Maina977/emersoneims-nextjs.git`

**Vercel Configuration:**
- **File:** `vercel.json` (already configured)
- **Location:** Root directory

**All files are ready for deployment!** 🚀


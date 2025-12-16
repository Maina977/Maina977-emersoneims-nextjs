# 🔗 Complete Integration Guide: GitHub + WordPress + Vercel + Custom Domain

## 🎯 Overview

This guide will help you connect:
- **GitHub** (Version Control & CI/CD)
- **WordPress** (Content Management - Scalahosting)
- **Vercel** (Hosting & Deployment)
- **Custom Domain** (emersoneims.com - Hostinger)

---

## 📋 Step 1: GitHub Setup

### 1.1 Initialize Git Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Awwwards 10/10 website ready"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git

# Push to GitHub
git push -u origin main
```

### 1.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `emersoneims-nextjs`
3. Description: `EmersonEIMS - Awwwards 10/10 Energy Infrastructure Website`
4. Visibility: **Private** (recommended) or **Public**
5. Click **Create repository**

### 1.3 Connect Local to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git
git branch -M main
git push -u origin main
```

---

## 📋 Step 2: WordPress Integration (Scalahosting)

### 2.1 WordPress REST API Configuration

Your WordPress is already configured at: `https://www.emersoneims.com`

**Verify API is working:**
```bash
# Test WordPress API
curl https://www.emersoneims.com/wp-json/wp/v2/posts
```

### 2.2 WordPress Plugin Setup (Optional - for better integration)

Install these WordPress plugins on your Scalahosting WordPress:

1. **JWT Authentication for WP REST API**
   - Enables secure API authentication
   - Download from WordPress.org

2. **CORS Headers**
   - Allows Vercel to access WordPress API
   - Configure: Allow origin: `https://emersoneims.com`

### 2.3 WordPress Settings

In WordPress Admin (`www.emersoneims.com/wp-admin`):

1. **Settings → Permalinks**
   - Set to: **Post name** (recommended)
   - Save changes

2. **Settings → General**
   - WordPress Address (URL): `https://www.emersoneims.com`
   - Site Address (URL): `https://www.emersoneims.com`

---

## 📋 Step 3: Vercel Deployment

### 3.1 Connect GitHub to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Import Git Repository:**
   - Select `emersoneims-nextjs`
   - Click **Import**

### 3.2 Configure Vercel Project

**Project Settings:**
- Framework Preset: **Next.js** (auto-detected)
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install --legacy-peer-deps`

**Environment Variables:**
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://emersoneims.com
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
```

### 3.3 Deploy

Click **Deploy** - Vercel will:
- Build your project
- Deploy to: `https://emersoneims-nextjs.vercel.app`
- Set up automatic deployments from GitHub

---

## 📋 Step 4: Custom Domain Setup (Hostinger → Vercel)

### 4.1 Get Vercel DNS Records

After deploying to Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `emersoneims.com`
4. Vercel will show you DNS records needed

**You'll get something like:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.2 Configure DNS in Hostinger

1. **Login to Hostinger** → **Domains** → **emersoneims.com**
2. Go to **DNS / Name Servers**
3. **Add DNS Records:**

   **For Root Domain (emersoneims.com):**
   ```
   Type: A
   Name: @
   Value: [Vercel IP from step 4.1]
   TTL: 3600
   ```

   **For WWW (www.emersoneims.com):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

4. **Save** all DNS records

### 4.3 Verify Domain in Vercel

1. Go back to **Vercel Dashboard** → **Domains**
2. Click **Verify** next to `emersoneims.com`
3. Wait for DNS propagation (5-30 minutes)
4. Once verified, Vercel will automatically:
   - Issue SSL certificate
   - Configure HTTPS
   - Set up redirects

---

## 📋 Step 5: WordPress → Vercel Integration

### 5.1 Update WordPress Settings

Since your WordPress is on Scalahosting (`www.emersoneims.com`) and Next.js on Vercel (`emersoneims.com`):

**Option A: Subdomain Setup (Recommended)**
- WordPress: `www.emersoneims.com` (Scalahosting)
- Next.js: `emersoneims.com` (Vercel)

**Option B: Path-based Setup**
- WordPress: `www.emersoneims.com/wp-admin` (Admin)
- Next.js: `www.emersoneims.com` (Main site)

### 5.2 Configure Rewrites in Vercel

The `vercel.json` already includes rewrites for WordPress paths:
- `/wp-admin/*` → WordPress admin
- `/wp-content/*` → WordPress media
- `/wp-json/*` → WordPress API

### 5.3 Test WordPress API from Vercel

After deployment, test:
```bash
curl https://emersoneims.com/api/wordpress
```

---

## 📋 Step 6: Final Configuration

### 6.1 Update Environment Variables

**In Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add/Update:
   ```
   NEXT_PUBLIC_SITE_URL=https://emersoneims.com
   WORDPRESS_SITE_URL=https://www.emersoneims.com
   WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
   ```

### 6.2 GitHub Secrets (for CI/CD)

**In GitHub Repository:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VERCEL_TOKEN` - Get from Vercel → Settings → Tokens
   - `VERCEL_ORG_ID` - Get from Vercel API
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings
   - `NEXT_PUBLIC_SITE_URL` - `https://emersoneims.com`
   - `WORDPRESS_SITE_URL` - `https://www.emersoneims.com`
   - `WORDPRESS_API_URL` - `https://www.emersoneims.com/wp-json/wp/v2`

### 6.3 Enable Automatic Deployments

**In Vercel:**
- ✅ Automatic deployments from GitHub (already enabled)
- ✅ Preview deployments for PRs
- ✅ Production deployments from `main` branch

---

## 🔧 Troubleshooting

### DNS Not Working?

1. **Check DNS propagation:**
   ```bash
   nslookup emersoneims.com
   ```

2. **Wait 24-48 hours** for full DNS propagation

3. **Clear DNS cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   ```

### WordPress API Not Accessible?

1. **Check CORS settings** in WordPress
2. **Verify API endpoint:**
   ```bash
   curl https://www.emersoneims.com/wp-json/wp/v2
   ```

3. **Check WordPress .htaccess** for API blocking

### Vercel Build Fails?

1. **Check build logs** in Vercel Dashboard
2. **Verify environment variables** are set
3. **Test build locally:**
   ```bash
   npm run build
   ```

---

## ✅ Verification Checklist

- [ ] GitHub repository created and connected
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] GitHub connected to Vercel
- [ ] Environment variables set in Vercel
- [ ] DNS records added in Hostinger
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] WordPress API accessible from Vercel
- [ ] Site loads at `https://emersoneims.com`
- [ ] Automatic deployments working

---

## 🚀 Quick Deploy Commands

### Initial Setup:
```bash
# 1. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 2. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git
git push -u origin main

# 3. Deploy to Vercel
vercel --prod
```

### Daily Workflow:
```bash
# Make changes, then:
git add .
git commit -m "Your commit message"
git push origin main
# Vercel automatically deploys!
```

---

## 📊 Architecture Overview

```
┌─────────────┐
│   GitHub    │ ← Version Control
│  Repository │
└──────┬──────┘
       │
       │ (Auto Deploy)
       ▼
┌─────────────┐
│   Vercel    │ ← Hosting (emersoneims.com)
│   Next.js   │
└──────┬──────┘
       │
       │ (API Calls)
       ▼
┌─────────────┐
│  WordPress  │ ← CMS (www.emersoneims.com)
│ Scalahosting│
└─────────────┘

Domain: emersoneims.com (Hostinger DNS)
```

---

## 🎯 Next Steps

1. ✅ Complete GitHub setup
2. ✅ Deploy to Vercel
3. ✅ Configure DNS in Hostinger
4. ✅ Verify domain in Vercel
5. ✅ Test WordPress integration
6. ✅ Submit to Awwwards!

---

**Status: Ready for Integration** ✅

*Follow the steps above to connect everything together!*













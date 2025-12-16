# ✅ Complete Integration Checklist

## 🎯 Goal: Connect GitHub + WordPress + Vercel + Custom Domain

**Domain:** emersoneims.com  
**WordPress:** www.emersoneims.com (Scalahosting)  
**Next.js:** emersoneims.com (Vercel)  
**DNS:** Hostinger

---

## 📋 Step-by-Step Checklist

### ✅ Step 1: GitHub Setup

- [ ] **Create GitHub Repository**
  - Go to: https://github.com/new
  - Name: `emersoneims-nextjs`
  - Description: `EmersonEIMS - Awwwards 10/10 Website`
  - Visibility: Private or Public
  - Click "Create repository"

- [ ] **Connect Local to GitHub**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **Verify Push**
  - Check GitHub repository
  - All files should be visible

---

### ✅ Step 2: Vercel Deployment

- [ ] **Login to Vercel**
  ```bash
  vercel login
  ```

- [ ] **Connect GitHub to Vercel**
  - Go to: https://vercel.com/new
  - Click "Import Git Repository"
  - Select `emersoneims-nextjs`
  - Click "Import"

- [ ] **Configure Project Settings**
  - Framework: Next.js (auto-detected)
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Install Command: `npm install --legacy-peer-deps`

- [ ] **Add Environment Variables**
  In Vercel Dashboard → Settings → Environment Variables:
  ```
  NEXT_PUBLIC_SITE_URL=https://emersoneims.com
  WORDPRESS_SITE_URL=https://www.emersoneims.com
  WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
  ```

- [ ] **Deploy**
  - Click "Deploy"
  - Wait for build to complete
  - Note the deployment URL

---

### ✅ Step 3: Add Custom Domain to Vercel

- [ ] **Add Domain in Vercel**
  - Go to: Vercel Dashboard → Your Project → Settings → Domains
  - Click "Add Domain"
  - Enter: `emersoneims.com`
  - Click "Add"

- [ ] **Add WWW Domain**
  - Click "Add Domain" again
  - Enter: `www.emersoneims.com`
  - Click "Add"

- [ ] **Get DNS Records**
  - Vercel will show DNS records needed
  - **Copy these records** (you'll need them for Hostinger)

---

### ✅ Step 4: Configure DNS in Hostinger

- [ ] **Login to Hostinger**
  - Go to: https://hpanel.hostinger.com
  - Login with your account
  - Navigate to: Domains → emersoneims.com → DNS / Name Servers

- [ ] **Add A Record (Root Domain)**
  ```
  Type: A
  Name: @
  Value: [Vercel IP from Step 3]
  TTL: 3600
  ```

- [ ] **Add CNAME Record (WWW)**
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  TTL: 3600
  ```

- [ ] **Keep WordPress Records**
  - Don't delete existing WordPress DNS records
  - WordPress should remain accessible at www.emersoneims.com

- [ ] **Save All Records**

---

### ✅ Step 5: Verify Domain in Vercel

- [ ] **Wait for DNS Propagation** (5-30 minutes)

- [ ] **Verify in Vercel**
  - Go to: Vercel Dashboard → Domains
  - Status should change to "Valid Configuration"
  - SSL certificate will be issued automatically

- [ ] **Test Domain**
  ```bash
  nslookup emersoneims.com
  ```

---

### ✅ Step 6: WordPress Integration

- [ ] **Verify WordPress API**
  - Test: https://www.emersoneims.com/wp-json/wp/v2
  - Should return JSON data

- [ ] **Configure CORS** (if needed)
  - Install CORS plugin in WordPress
  - Allow origin: `https://emersoneims.com`

- [ ] **Test WordPress Connection**
  - Visit: https://emersoneims.com/api/wordpress
  - Should connect to WordPress API

---

### ✅ Step 7: Final Verification

- [ ] **Test Root Domain**
  - Visit: https://emersoneims.com
  - Should show Next.js site
  - SSL certificate working (padlock icon)

- [ ] **Test WWW Domain**
  - Visit: https://www.emersoneims.com
  - Should redirect or show WordPress/Next.js

- [ ] **Test WordPress Admin**
  - Visit: https://www.emersoneims.com/wp-admin
  - Should load WordPress admin

- [ ] **Test All Pages**
  - Homepage: https://emersoneims.com
  - Services: https://emersoneims.com/service
  - Generators: https://emersoneims.com/generators
  - Diagnostics: https://emersoneims.com/diagnostics
  - Solar: https://emersoneims.com/solar
  - Contact: https://emersoneims.com/contact

- [ ] **Check Performance**
  - Run Lighthouse audit
  - Target: 90+ score

---

## 🎯 Quick Commands

### Initial Setup:
```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Awwwards 10/10 website ready"
git push origin main

# 2. Deploy to Vercel
vercel --prod
```

### Daily Workflow:
```bash
# Make changes, then:
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

---

## 📊 Architecture

```
┌─────────────┐
│   GitHub    │ ← Version Control
│  Repository │
└──────┬──────┘
       │
       │ (Auto Deploy)
       ▼
┌─────────────┐
│   Vercel    │ ← Hosting
│   Next.js   │   emersoneims.com
└──────┬──────┘
       │
       │ (API Calls)
       ▼
┌─────────────┐
│  WordPress  │ ← CMS
│ Scalahosting│   www.emersoneims.com
└─────────────┘

DNS: Hostinger
Domain: emersoneims.com
```

---

## 🆘 Troubleshooting

### DNS Not Working?
- Wait 24-48 hours for full propagation
- Check DNS records are correct
- Verify in Vercel dashboard

### WordPress API Not Accessible?
- Check CORS settings
- Verify API endpoint works
- Check WordPress .htaccess

### Build Fails?
- Check Vercel build logs
- Verify environment variables
- Test build locally: `npm run build`

---

## ✅ Success Criteria

- [x] Code in GitHub
- [x] Deployed to Vercel
- [x] Domain connected
- [x] SSL certificate active
- [x] WordPress API accessible
- [x] All pages loading
- [x] Performance optimized

---

**Status: Ready to Integrate** ✅

*Follow the checklist above step by step!*













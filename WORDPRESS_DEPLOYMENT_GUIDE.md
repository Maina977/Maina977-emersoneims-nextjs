# 🚀 WordPress Integration & Deployment Guide

## **CURRENT CONFIGURATION**

Your Next.js app is configured for **WordPress integration** with two deployment options:

### **Option 1: Static Export (WordPress Integration)**
- Exports static HTML/CSS/JS files
- Can be uploaded to WordPress
- No server needed

### **Option 2: Standalone Server (Recommended)**
- Runs as independent Next.js server
- Better performance
- Can integrate with WordPress via API

---

## **DEPLOYMENT METHODS**

### **METHOD 1: Static Export to WordPress** ✅

**Step 1: Build Static Export**
```cmd
cd C:\Users\PC\my-app
set WORDPRESS_INTEGRATION=true
set STATIC_EXPORT=true
npm.cmd run build
```

**Step 2: Files Location**
- Built files in: `out/` folder
- Upload entire `out/` folder to WordPress

**Step 3: WordPress Integration**
- Upload to: `/wp-content/themes/your-theme/` or custom location
- Or use WordPress plugin to serve static files

---

### **METHOD 2: Standalone Deployment (Vercel/Netlify)** ✅ **RECOMMENDED**

**Best Option:** Deploy to Vercel (Next.js native)

**Step 1: Push to GitHub**
```cmd
cd C:\Users\PC\my-app
git init
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
git branch -M main
git add .
git commit -m "Production ready"
git push -u origin main
```

**Step 2: Deploy to Vercel**
1. Go to: https://vercel.com
2. Import GitHub repository
3. Vercel auto-detects Next.js
4. Click Deploy
5. Done! ✅

**Step 3: WordPress API Integration**
- Your Next.js app runs independently
- Connects to WordPress via REST API
- WordPress URL: `https://www.emersoneims.com`

---

### **METHOD 3: Hybrid (Next.js + WordPress)** ✅

**Architecture:**
- Next.js frontend (deployed separately)
- WordPress backend (existing site)
- API integration between them

**Configuration:**
```env
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://your-nextjs-app.vercel.app
```

---

## **QUICK DEPLOYMENT SCRIPT**

I'll create a deployment script that handles everything.


# 🚀 QUICK DEPLOY - 2 MINUTES

## **STEP 1: Push to GitHub**

**Double-click:** `DEPLOY_NOW.bat`

OR manually:
```cmd
cd C:\Users\PC\my-app
git init
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
git branch -M main
git add .
git commit -m "Production ready"
git push -u origin main
```

---

## **STEP 2: Deploy to Vercel**

1. Go to: **https://vercel.com**
2. **Sign up/Login** (use GitHub account)
3. Click **"Import Project"**
4. Select: **Maina977/emersoneims-nextjs**
5. Click **"Deploy"**
6. **Wait 2 minutes**
7. **Done!** ✅

---

## **YOUR SITE WILL BE LIVE AT:**

- `https://emersoneims-nextjs.vercel.app`
- Or add custom domain: `www.emersoneims.com`

---

## **WORDPRESS INTEGRATION**

Your Next.js app:
- ✅ Runs independently on Vercel
- ✅ Connects to WordPress at: `https://www.emersoneims.com`
- ✅ Uses WordPress REST API
- ✅ Images/videos from WordPress work automatically
- ✅ No need to upload files to WordPress

---

## **ENVIRONMENT VARIABLES (Optional)**

If needed, add in Vercel dashboard:
```
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://emersoneims-nextjs.vercel.app
```

---

## **ALTERNATIVE: Static Export to WordPress**

If you MUST upload to WordPress server:

1. **Double-click:** `DEPLOY_TO_WORDPRESS.bat`
2. Upload `out/` folder to WordPress via FTP/cPanel

---

**USE DEPLOY_NOW.bat - DEPLOYS IN 2 MINUTES!** 🚀

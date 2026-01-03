# 🚀 Deploy to Viva Web Host - www.emersoneims.com

## 📋 Your Hosting Information

- **Domain:** www.emersoneims.com
- **Hosting Provider:** Viva Web Host
- **Nameservers:** 
  - ns1-satya.vivawebhost.com
  - ns2-satya.vivawebhost.com
- **Contact:** emersoneimservices@gmail.com

## 🎯 Deployment Options

### ⚡ Option 1: Deploy to Vercel + Point DNS (RECOMMENDED ⭐)

**Why?** Vercel is free, optimized for Next.js, and easier than server setup.

**Steps:**
1. **Deploy to Vercel:**
   ```powershell
   npx vercel@latest --prod
   ```

2. **Get Vercel deployment URL** (e.g., `emerson-eims.vercel.app`)

3. **In Viva Web Host cPanel/DNS Manager, add:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
   
   OR point to Vercel's A records (get from Vercel dashboard)

4. **In Vercel Dashboard:**
   - Project Settings → Domains
   - Add: `www.emersoneims.com`
   - Follow DNS instructions

**Benefits:**
- ✅ Free hosting
- ✅ Automatic SSL/HTTPS
- ✅ CDN included
- ✅ Optimized for Next.js
- ✅ Easy deployment

---

### 🖥️ Option 2: Upload to Viva Web Host Server

**Only if Viva Web Host supports Node.js 18+**

#### Step 1: Contact Viva Web Host

Ask them:
- ✅ Do you support Node.js applications?
- ✅ What Node.js version is available?
- ✅ Do I have SSH/terminal access?
- ✅ Can I run Node.js applications on port 3000?
- ✅ Do you support PM2 or process managers?

#### Step 2: Prepare Files for Upload

**Run this script:**
```powershell
.\CREATE_DEPLOYMENT_PACKAGE.ps1
```

This creates a `deployment-package/` folder with all required files.

#### Step 3: Upload to Server

**Via FTP/SFTP:**
1. Get FTP credentials from Viva Web Host
2. Connect using FileZilla or similar
3. Upload `deployment-package/` contents to `/public_html/` or your domain folder

**Via SSH (if available):**
```bash
# On your computer
scp -r deployment-package/* username@your-server:/path/to/domain/
```

#### Step 4: On Server

```bash
# Navigate to domain directory
cd /path/to/your/domain

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=production
PORT=3000
EOF

# Start application (use PM2 for production)
npm install -g pm2
pm2 start npm --name "emerson-eims" -- start
pm2 save
pm2 startup
```

#### Step 5: Configure Reverse Proxy

**For Apache (.htaccess):**
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**For Nginx:** Contact hosting support for configuration.

---

## 📋 Current DNS Settings

Your nameservers are already set:
- ✅ ns1-satya.vivawebhost.com
- ✅ ns2-satya.vivawebhost.com

**If deploying to Vercel, you'll need to add DNS records in Viva Web Host cPanel:**
- CNAME: `www` → `cname.vercel-dns.com`
- OR A records pointing to Vercel IPs

---

## 🎯 My Recommendation

**Deploy to Vercel** because:
1. ✅ Free and optimized for Next.js
2. ✅ Automatic SSL/HTTPS
3. ✅ Easy deployment (one command)
4. ✅ Better performance with CDN
5. ✅ WordPress can stay on Viva Web Host
6. ✅ No server management needed

**Then point your domain DNS to Vercel.**

---

## 🚀 Quick Deploy (Vercel)

```powershell
# 1. Deploy
npx vercel@latest --prod

# 2. Add domain in Vercel dashboard: www.emersoneims.com

# 3. Update DNS in Viva Web Host cPanel:
#    Add CNAME: www → cname.vercel-dns.com
```

---

## 📞 Need Help?

1. **Check with Viva Web Host:** Do they support Node.js?
2. **If yes:** Use Option 2 (upload to server)
3. **If no/unsure:** Use Option 1 (Vercel) ⭐

---

**Ready to deploy! Choose your option above!** 🚀

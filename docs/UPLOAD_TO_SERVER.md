# 📤 Upload to Viva Web Host - Deployment Guide

## 🎯 Your Setup

- **Domain:** www.emersoneims.com
- **Hosting:** Viva Web Host
- **Nameservers:** ns1-satya.vivawebhost.com, ns2-satya.vivawebhost.com

## 📦 Files to Upload

After running `npm run build`, upload these to your server:

### Required Files/Folders:
1. `.next/` - Production build folder
2. `package.json` - Dependencies list
3. `next.config.ts` - Next.js configuration
4. `node_modules/` - OR install on server (recommended)
5. `.env` - Environment variables (create on server)
6. `public/` - Static assets (if exists)
7. `app/` - Application code
8. `components/` - React components (if exists)
9. `lib/` - Utility libraries (if exists)
10. `types/` - TypeScript types (if exists)

## 🔧 Server Setup Steps

### Step 1: Access Your Server

**Via FTP:**
- Host: ftp.emersoneims.com (or IP provided by Viva Web Host)
- Username: (from hosting control panel)
- Password: (from hosting control panel)
- Port: 21 (FTP) or 22 (SFTP)

**Via cPanel File Manager:**
- Login to cPanel
- File Manager → public_html or www

**Via SSH (if available):**
```bash
ssh username@your-server-ip
```

### Step 2: Upload Files

Upload all project files to your domain directory:
- Typically: `/public_html/` or `/www/` or `/home/username/public_html/`

### Step 3: Install Dependencies on Server

**Via SSH:**
```bash
cd /path/to/your/domain
npm install --production
```

### Step 4: Configure Environment Variables

Create `.env` file on server:
```env
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=production
PORT=3000
```

### Step 5: Start Application

**Option A: Direct Start**
```bash
npm start
```

**Option B: PM2 (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "emerson-eims" -- start

# Save configuration
pm2 save

# Auto-start on reboot
pm2 startup
```

### Step 6: Configure Reverse Proxy

If your server uses Apache, create `.htaccess`:
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

For Nginx, configure in server block (contact hosting for help).

## 📋 Quick Upload Checklist

- [ ] Get FTP/SSH credentials from Viva Web Host
- [ ] Connect to server
- [ ] Upload project files
- [ ] Install Node.js dependencies
- [ ] Create `.env` file with production values
- [ ] Start Node.js application
- [ ] Configure reverse proxy
- [ ] Test: www.emersoneims.com
- [ ] Verify WordPress API connection

## ⚠️ Important Notes

1. **Check Node.js Version:**
   - Viva Web Host must support Node.js 18+
   - Verify: `node --version` on server

2. **Port Configuration:**
   - Next.js runs on port 3000 by default
   - May need to configure firewall/port forwarding
   - Or use reverse proxy to port 80/443

3. **Process Manager:**
   - Use PM2 to keep app running
   - Prevents app from stopping when SSH session ends

4. **SSL Certificate:**
   - Ensure HTTPS is configured
   - Use Let's Encrypt (free) if available

## 🔄 Alternative: Static Export

If Node.js is not available, export static files:

```powershell
# Update next.config.ts to add:
output: 'export'

# Rebuild
npm run build

# Upload 'out/' folder contents to public_html/
```

---

**Contact Viva Web Host support for:**
- Node.js availability
- Server access credentials
- Port configuration
- Reverse proxy setup





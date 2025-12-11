# Deployment Guide - Emerson EIMS

Quick deployment guide for `www.emersoneims.com` to Vercel.

## 🚀 Quick Deploy

### Windows (PowerShell)
```powershell
.\scripts\deploy.ps1
```

### Windows (Command Prompt)
```cmd
scripts\deploy.bat
```

### Mac/Linux
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Vercel account** (free tier works)
3. **Domain configured** (`www.emersoneims.com`)

## 🔧 Manual Deployment Steps

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Build the Project
```bash
npm run build
# OR
npx next build --webpack
```

### 3. Login to Vercel
```bash
npx vercel@latest login
```

### 4. Deploy to Production
```bash
npx vercel@latest --prod
```

## ⚙️ Script Options

### PowerShell Script
```powershell
# Skip build step
.\scripts\deploy.ps1 -SkipBuild

# Skip login check
.\scripts\deploy.ps1 -SkipLogin

# Deploy to preview
.\scripts\deploy.ps1 -Environment preview
```

### Bash Script
```bash
# Skip build step
./scripts/deploy.sh --skip-build

# Skip login check
./scripts/deploy.sh --skip-login

# Deploy to preview
./scripts/deploy.sh --preview
```

## 🌐 Domain Configuration

After deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add `www.emersoneims.com`
5. Follow DNS configuration instructions
6. Wait for DNS propagation (up to 48 hours)

## 🔍 Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install --legacy-peer-deps`
- Check Node.js version: `node --version` (should be 18+)
- Try building with webpack: `npx next build --webpack`

### Authentication Issues
- Run `npx vercel@latest login` manually
- Check your Vercel account status
- Ensure you have project access

### Deployment Failures
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure `vercel.json` is correctly configured

## 📝 Environment Variables

The following environment variables are configured in `vercel.json`:

- `NEXT_PUBLIC_SITE_URL`: `https://www.emersoneims.com`
- `WORDPRESS_API_URL`: `https://www.emersoneims.com/wp-json/wp/v2`
- `WORDPRESS_SITE_URL`: `https://www.emersoneims.com`
- `NODE_ENV`: `production`

## ✅ Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Deployment successful on Vercel
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Site accessible at `www.emersoneims.com`
- [ ] WordPress integration tested (if applicable)

## 🆘 Support

If you encounter issues:
1. Check the build logs in Vercel dashboard
2. Review error messages in the terminal
3. Verify all prerequisites are met
4. Check Vercel status page: https://www.vercel-status.com

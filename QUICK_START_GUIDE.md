# 🚀 QUICK START - Deploy Emerson EIMS to www.emersoneims.com

## ONE-CLICK DEPLOYMENT

### Option 1: Double-click the batch file
```
🚀_DEPLOY_NOW.bat
```

### Option 2: Run PowerShell script
```powershell
.\DEPLOY_PRODUCTION_NOW.ps1
```

### Option 3: Manual command
```powershell
cd C:\Users\PC\my-app
.\DEPLOY_PRODUCTION_NOW.ps1
```

---

## WHAT HAPPENS AUTOMATICALLY

The script will:
- ✅ Stop all running processes
- ✅ Clean all caches and build artifacts
- ✅ Fresh install all dependencies
- ✅ Configure environment for www.emersoneims.com
- ✅ Build and test locally
- ✅ Deploy to Vercel Production
- ✅ Configure custom domains
- ✅ Test deployment
- ✅ Open Vercel Dashboard

**Time Required**: 5-10 minutes

---

## AFTER DEPLOYMENT

### Step 1: Configure DNS (IMPORTANT!)

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:

```
Type    Name    Value
----    ----    -----
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### Step 2: Verify in Vercel

1. Open: https://vercel.com/dashboard
2. Select: emerson-eims project
3. Go to: Settings → Domains
4. Verify: Both domains show "Active"

### Step 3: Wait for DNS (5 min - 48 hours)

Check propagation: https://dnschecker.org/

---

## VERIFY DEPLOYMENT

```powershell
# Test website
curl -I https://www.emersoneims.com

# Check Vercel status
vercel ls

# Check domains
vercel domains ls
```

---

## TROUBLESHOOTING

### "Domain already in use"
- Go to Vercel Dashboard
- Find old project using the domain
- Remove domain from old project
- Run deployment script again

### "DNS not configured"
- Add DNS records at your domain registrar
- Wait for propagation (can take 48 hours)
- Check https://dnschecker.org/

### "Build failed"
- Check error messages
- Run: `npm install`
- Run: `npm run build`
- Fix any errors shown
- Run deployment script again

---

## SUPPORT FILES

- `DEPLOY_PRODUCTION_NOW.ps1` - Main deployment script
- `DOMAIN_MIGRATION_GUIDE.md` - Detailed guide
- `.env.production` - Production environment config
- `vercel.json` - Vercel configuration

---

## VERIFICATION CHECKLIST

After deployment and DNS configuration:

- [ ] Website loads at https://www.emersoneims.com
- [ ] SSL certificate is active (green padlock)
- [ ] All pages are accessible
- [ ] Forms work correctly
- [ ] Calculators function properly
- [ ] Images display correctly
- [ ] No console errors
- [ ] Mobile responsive

---

## EMERGENCY ROLLBACK

If something goes wrong:

```powershell
# Rollback to previous deployment
vercel rollback

# Or deploy a specific version
vercel ls
vercel deploy --prod [deployment-url]
```

---

## CONTACTS

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Support**: https://vercel.com/support
- **DNS Checker**: https://dnschecker.org/
- **SSL Checker**: https://www.ssllabs.com/ssltest/

---

**🎉 Ready to deploy? Run:** `🚀_DEPLOY_NOW.bat`

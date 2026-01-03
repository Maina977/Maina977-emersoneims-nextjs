# 🔄 Domain Override & Migration Instructions

## Scenario: Domain Already in Use

If `emersoneims.com` or `www.emersoneims.com` is currently being used by another Vercel project, follow these steps:

---

## AUTOMATIC OVERRIDE (Recommended)

The deployment script handles this automatically, but if you need to do it manually:

### Step 1: Find the Old Project

```powershell
# Login to Vercel CLI
vercel login

# List all your projects
vercel projects ls

# Find which project is using the domain
vercel domains ls
```

### Step 2: Remove Domain from Old Project

#### Via Vercel Dashboard (Easiest):
1. Go to: https://vercel.com/dashboard
2. Find the old project using `emersoneims.com`
3. Click the project
4. Go to: **Settings** → **Domains**
5. Find `emersoneims.com` and `www.emersoneims.com`
6. Click the **X** or **Remove** button for each
7. Confirm removal

#### Via CLI:
```powershell
# Switch to the old project
cd path/to/old/project

# Remove domains
vercel domains rm emersoneims.com
vercel domains rm www.emersoneims.com
```

### Step 3: Deploy New Project

Now run the deployment:
```powershell
cd C:\Users\PC\my-app
.\DEPLOY_PRODUCTION_NOW.ps1
```

---

## FORCE OVERRIDE METHOD

If you want to force the domain to the new project:

```powershell
# Navigate to new project
cd C:\Users\PC\my-app

# Force add domains (will prompt to remove from old project)
vercel domains add emersoneims.com --force
vercel domains add www.emersoneims.com --force

# Then deploy
vercel --prod --yes
```

---

## COMPLETE MIGRATION CHECKLIST

### Before Migration:
- [ ] Backup old project (if needed)
- [ ] Note down any important environment variables
- [ ] Export any data from old project
- [ ] Take screenshots of old project settings

### During Migration:
- [ ] Remove domains from old project
- [ ] Run deployment script for new project
- [ ] Verify environment variables are set
- [ ] Confirm deployment succeeded

### After Migration:
- [ ] Test new website thoroughly
- [ ] Verify all pages load correctly
- [ ] Test forms and functionality
- [ ] Check analytics are working
- [ ] Update any external links

---

## SIDE-BY-SIDE COMPARISON

| Old Project | New Project |
|------------|-------------|
| Domain: emersoneims.com | Domain: www.emersoneims.com |
| Status: Will be replaced | Status: Active & Live |
| Framework: ??? | Framework: Next.js 16.1.1 |
| Features: Limited | Features: Full EIMS Platform |

---

## WHAT IF OLD PROJECT IS BETTER?

If you need to keep the old project instead:

### Option 1: Use Different Domain
Deploy new project to a temporary domain first:
```powershell
# Deploy without custom domain
vercel --prod --yes

# Use the Vercel-provided URL: xxxxx.vercel.app
```

### Option 2: Subdomain Strategy
Use subdomain for new project:
```powershell
# Add subdomain instead
vercel domains add app.emersoneims.com
vercel domains add new.emersoneims.com
```

---

## VERIFYING DOMAIN OWNERSHIP

To confirm you own the domain:

```powershell
# Check domain status
vercel domains ls

# Inspect specific domain
vercel domains inspect emersoneims.com

# Check DNS records
nslookup emersoneims.com
nslookup www.emersoneims.com
```

---

## DOMAIN TRANSFER PROCESS

### Immediate Transfer (Both projects in same Vercel account):
1. Remove from old project (takes effect immediately)
2. Add to new project (takes effect in ~5 minutes)
3. Wait for DNS propagation (up to 48 hours)

### Cross-Account Transfer:
1. Remove from old account's project
2. Wait 24 hours for domain to be released
3. Add to new account's project
4. Configure DNS

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Domain is in use by another team"
**Solution:**
- The domain is used in a different Vercel account/team
- You need to remove it from there first
- Or contact Vercel support to transfer

### Issue: "Unable to verify domain"
**Solution:**
- Check DNS records are correct
- Wait for DNS propagation
- Use DNS checker: https://dnschecker.org/

### Issue: "SSL Certificate error"
**Solution:**
- Vercel auto-provisions SSL
- Can take up to 24 hours after domain verification
- No manual action needed

---

## EMERGENCY CONTACTS

### Vercel Support:
- Dashboard: https://vercel.com/dashboard
- Support: https://vercel.com/support
- Status: https://vercel-status.com/

### DNS Help:
- DNS Checker: https://dnschecker.org/
- What's My DNS: https://whatsmydns.net/
- DNS Propagation: https://www.whatsmydns.net/

---

## POST-OVERRIDE ACTIONS

After successfully migrating the domain:

1. **Update External Services:**
   - Google Search Console
   - Google Analytics
   - Social media links
   - Email signatures
   - Business cards

2. **Monitor Old Project:**
   - Archive or delete old project
   - Download any important data
   - Cancel if on paid plan

3. **Test Everything:**
   - All pages load
   - Forms submit correctly
   - Calculators work
   - Images display
   - API endpoints function

4. **SEO Update:**
   - Submit new sitemap
   - Update robots.txt
   - Set up redirects if needed

---

## CONFIRMATION COMMANDS

Run these to confirm migration:

```powershell
# Verify deployment
vercel ls

# Check domains
vercel domains ls

# Test website
curl -I https://www.emersoneims.com

# Check DNS
nslookup www.emersoneims.com

# Verify SSL
curl -I https://www.emersoneims.com | Select-String "strict-transport-security"
```

---

## SUCCESS CRITERIA

Migration is complete when:

- ✅ Old project no longer uses emersoneims.com
- ✅ New project shows domain in Vercel Dashboard
- ✅ Website loads at https://www.emersoneims.com
- ✅ SSL certificate is active
- ✅ DNS resolves correctly worldwide
- ✅ All functionality works
- ✅ No console errors

---

**Ready to override and migrate?**

Run: `.\DEPLOY_PRODUCTION_NOW.ps1`

The script will handle domain conflicts automatically!

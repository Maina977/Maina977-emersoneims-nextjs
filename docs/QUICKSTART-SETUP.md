# Quick Start: PostgreSQL + Email Setup

Get the database and email working in **30 minutes**.

---

## Step 1: PostgreSQL Database (15 minutes)

### Option A: Render (Recommended - Easiest)

1. **Create Free Account**
   - Go to https://render.com
   - Sign up with GitHub (easiest)

2. **Create PostgreSQL Database**
   - Click "New +" button
   - Select "PostgreSQL"
   - Choose free tier
   - Region: Choose closest to Kenya (Europe or US)
   - Click "Create Database"

3. **Copy Connection String**
   - After created, find "Connections" section
   - Copy "External Database URL" (starts with `postgresql://`)
   - This is your `DATABASE_URL`

4. **Add to Vercel**
   - Go to Vercel project settings
   - Environment Variables
   - Add: `DATABASE_URL` = paste your connection string
   - Deploy

5. **Create Tables**
   - In Render dashboard, click "Connect"
   - Open "psql" terminal
   - Paste contents of `docs/database-schema.sql`
   - Run the SQL script

**Done!** Database is ready.

### Option B: Supabase (Alternative)

1. Go to https://supabase.com
2. Sign up
3. Create new project
4. In SQL editor, paste `docs/database-schema.sql`
5. Copy connection string from settings
6. Add `DATABASE_URL` to Vercel

### Option C: Railway (Alternative)

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL plugin
4. Copy generated connection string
5. Add `DATABASE_URL` to Vercel

---

## Step 2: Email Service (10 minutes)

### Set Up Resend

1. **Create Account**
   - Go to https://resend.com
   - Sign up with email or GitHub

2. **Create API Key**
   - Dashboard → API Keys
   - "Create API Key"
   - Copy the key

3. **Add to Vercel**
   - Vercel project settings
   - Environment Variables
   - Add: `RESEND_API_KEY` = your key
   - Deploy

4. **Test Email (Optional)**
   - Run this in your terminal:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H 'Authorization: Bearer YOUR_API_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "noreply@emersoneims.com",
       "to": "your-email@example.com",
       "subject": "Test Email",
       "html": "<p>Email is working!</p>"
     }'
   ```

**Done!** Emails ready to send.

---

## Step 3: Test Everything (5 minutes)

### Create Test Order

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:3000/marketplace/checkout

# 3. Create test order
# Note: Needs items in cart first

# 4. Check email inbox
# Should receive order confirmation
```

### Verify Database

```bash
# 1. Connect to your database
# Use Render/Supabase/Railway console

# 2. Run this query
SELECT * FROM orders;

# 3. Should see your test order
```

---

## Environment Variables Summary

After setup, your `.env.local` should have:

```
# Database
DATABASE_URL=postgresql://user:password@host:port/db

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx

# M-Pesa (when available)
MPESA_CONSUMER_KEY=xxxxx
MPESA_CONSUMER_SECRET=xxxxx
MPESA_PASSKEY=xxxxx
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback
```

---

## Troubleshooting

### Database Connection Failed
- [ ] Check `DATABASE_URL` is correct
- [ ] Database is public (not private)
- [ ] IP whitelist includes your server
- [ ] Re-run schema script

### Emails Not Sending
- [ ] Check `RESEND_API_KEY` is set
- [ ] Key has not expired
- [ ] Check email address is valid
- [ ] Check spam folder

### Orders Not Saving
- [ ] PostgreSQL installed and running
- [ ] `DATABASE_URL` environment variable set
- [ ] Tables created (run schema script)
- [ ] Check server logs for SQL errors

---

## Next: Deploy to Production

Once working locally:

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: add database + email + checkout"
git push origin main

# 2. Vercel auto-deploys
# Set DATABASE_URL and RESEND_API_KEY in Vercel dashboard

# 3. Test live
# https://your-domain.vercel.app/marketplace/checkout

# 4. Create test order
# Check email inbox for confirmation
```

---

## Cost Breakdown (Monthly)

- **Render PostgreSQL:** $0 (free tier)
- **Resend Email:** $0-20 (100 free/month, then $0.20 per email)
- **Vercel Hosting:** $0-20 (free tier or pro)
- **Domain:** $12-15 (Namecheap, Google Domains)

**Total MVP Cost:** $0 (all free tiers)

---

## Performance Expectations

After setup:

- Page load: <1s
- API response: <100ms
- Email delivery: 1-2 seconds
- Order persistence: Instant

All metrics production-ready.

---

## What's Next

Once database + email working:

1. **Build Login Pages** (2 hours)
2. **Create Account Dashboard** (2 hours)
3. **Integrate M-Pesa** (4 hours, once you get credentials)
4. **Go Live** 🚀

Total: 1-2 weeks to full production.

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Resend Docs:** https://resend.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Next.js Docs:** https://nextjs.org/docs

---

**You've got this! 🚀**

If stuck, check logs:
```bash
# Local logs
npm run dev  # Watch console

# Vercel logs
vercel logs --tail

# Database logs
# Check Render/Supabase dashboard
```

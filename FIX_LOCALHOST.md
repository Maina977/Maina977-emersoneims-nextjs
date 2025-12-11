# Fix: ERR_SSL_PROTOCOL_ERROR

## Problem
You're accessing: `https://localhost:3000/` ❌
**Error**: ERR_SSL_PROTOCOL_ERROR

## Solution
Use **HTTP** (not HTTPS) for local development:

✅ **Correct URL**: `http://localhost:3000/`

## Why This Happens
- Next.js dev server runs on **HTTP** by default
- `https://` requires SSL certificates (not needed for local dev)
- Production uses HTTPS (handled by Vercel)

## Quick Fix

### Option 1: Use HTTP
Simply change:
- ❌ `https://localhost:3000`
- ✅ `http://localhost:3000`

### Option 2: Check Dev Server Status
Make sure the dev server is running:
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
```

## Steps to Access

1. **Make sure dev server is running**:
   ```bash
   npm run dev
   ```

2. **Open browser**:
   - Type: `http://localhost:3000`
   - Press Enter

3. **Verify**:
   - Homepage should load
   - No SSL errors
   - HeroCanvas should render

## If Dev Server Isn't Running

Open Command Prompt and run:
```cmd
cd C:\Users\PC\my-app
npm run dev
```

Wait for:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

Then open: `http://localhost:3000`

## Summary
- ❌ Don't use: `https://localhost:3000`
- ✅ Use: `http://localhost:3000`
- ✅ Dev server must be running first



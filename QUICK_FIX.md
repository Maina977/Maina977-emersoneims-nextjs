# QUICK FIX - Server Not Working on localhost:3000

## ✅ Immediate Solution

Run this PowerShell script in your terminal:

```powershell
.\scripts\fix-and-start.ps1
```

OR manually run these commands:

```powershell
# 1. Kill existing processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Clean build
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 3. Verify .env exists
if (-not (Test-Path .env)) {
    @"
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
}

# 4. Start dev server
npm run dev
```

## 🔍 Common Issues Fixed

1. ✅ Port 3000 already in use → Script kills existing processes
2. ✅ Stale build cache → Script cleans .next folder
3. ✅ Missing .env file → Script creates it
4. ✅ Missing dependencies → Script checks and installs
5. ✅ TypeScript errors → Script checks for errors

## 📋 What the Script Does

1. Kills any running Node.js processes
2. Cleans build artifacts (.next folder)
3. Verifies/creates .env file
4. Checks for missing dependencies
5. Runs TypeScript type checking
6. Starts the development server

## 🌐 After Running

Once the server starts, you should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Then open: **http://localhost:3000**

## 🚨 Still Not Working?

1. **Check if port 3000 is blocked:**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 3000
   ```

2. **Try a different port:**
   ```powershell
   $env:PORT=3001
   npm run dev
   ```

3. **Check for errors in the terminal** where npm run dev is running

4. **Verify Node.js version:**
   ```powershell
   node --version  # Should be 18+
   npm --version
   ```

5. **Complete reset:**
   ```powershell
   Remove-Item -Recurse -Force node_modules, .next, package-lock.json
   npm install
   npm run dev
   ```

---

**Run the script now:** `.\scripts\fix-and-start.ps1`





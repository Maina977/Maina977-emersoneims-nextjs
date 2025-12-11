# Fix Server Issues - localhost:3000

## Problem Diagnosis

If localhost:3000 is not working, try these steps:

## Quick Fix Steps

### Step 1: Kill All Node Processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Clean Build
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
```

### Step 3: Verify .env File
```powershell
# Check if .env exists
Test-Path .env

# If not, create it:
@"
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

### Step 4: Reinstall Dependencies
```powershell
npm install
```

### Step 5: Start Dev Server (Easier for Debugging)
```powershell
npm run dev
```

### Step 6: If Dev Works, Then Build Production
```powershell
npm run build
npm start
```

## Common Issues & Solutions

### Issue 1: Port 3000 Already in Use
```powershell
# Find what's using port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Kill it or use different port
$env:PORT=3001
npm run dev
```

### Issue 2: Build Errors
```powershell
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

### Issue 3: Missing Dependencies
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue 4: Environment Variables Not Loading
```powershell
# Verify .env file is in root directory
Get-Content .env

# Restart server after changing .env
```

## Alternative: Use Development Mode

Development mode is easier to debug:

```powershell
npm run dev
```

Then access: http://localhost:3000

## Verify Server is Running

```powershell
# Check if port is listening
Test-NetConnection -ComputerName localhost -Port 3000

# Check Node processes
Get-Process -Name node
```

## Complete Reset

If nothing works, complete reset:

```powershell
# 1. Kill all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Clean everything
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 3. Reinstall
npm install

# 4. Create .env
@"
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8

# 5. Start dev server
npm run dev
```





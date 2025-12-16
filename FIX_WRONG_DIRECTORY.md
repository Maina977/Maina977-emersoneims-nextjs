# Fix: npm run build - Missing script error

## Problem
```
npm error Missing script: "build"
```

## Root Cause
You're running `npm run build` from the wrong directory:
- ❌ Current directory: `C:\Users\PC\`
- ✅ Project directory: `C:\Users\PC\my-app\`

## Solution

### Option 1: Use the Build Script (Recommended)
```batch
BUILD.bat
```

This script automatically:
1. Navigates to the correct directory
2. Verifies package.json exists
3. Runs the build

### Option 2: Navigate Manually
```batch
cd C:\Users\PC\my-app
npm run build
```

### Option 3: Quick Build Script
```batch
QUICK_BUILD.bat
```

## Verify You're in the Right Directory

Check if you're in the project root:
```batch
dir package.json
```

If you see `package.json`, you're in the right place!

## Project Structure

```
C:\Users\PC\my-app\          ← Project root (run npm commands here)
├── package.json             ← Contains build script
├── app\
├── components\
├── node_modules\
└── ...
```

## Build Scripts Available

From `package.json`:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

Always run these commands from `C:\Users\PC\my-app\`!














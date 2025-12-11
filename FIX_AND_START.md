# Fix: npm run dev Not Working

## The Problem:
You're running `npm run dev` from `C:\Users\PC>` but you need to be in `C:\Users\PC\my-app>`.

## Solution 1: Use the Batch File (EASIEST)
Double-click `START_DEV.bat` in your project folder. It will:
1. Navigate to the correct directory
2. Start the dev server
3. Keep the window open

## Solution 2: Use Command Prompt
1. Open Command Prompt (not PowerShell)
2. Type:
   ```
   cd C:\Users\PC\my-app
   npm run dev
   ```

## Solution 3: Fix PowerShell (Permanent)
Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then you can use PowerShell normally.

## Solution 4: Always Navigate First
In ANY terminal, always run:
```
cd C:\Users\PC\my-app
```
BEFORE running:
```
npm run dev
```

## Quick Test:
From `C:\Users\PC>`, run:
```
cd my-app
npm run dev
```

The dev script EXISTS in package.json - you just need to be in the right folder!


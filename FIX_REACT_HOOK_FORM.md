# Fix: react-hook-form Module Not Found

## Problem
```
Module not found: Can't resolve 'react-hook-form'
```

This error occurs in:
- `components/contact/ContactForm.jsx`
- `components/contact/EmailUs.jsx`

## Solution

### Option 1: Run the Fix Script (Recommended)
```batch
INSTALL_REACT_HOOK_FORM.bat
```

### Option 2: Manual Installation
```batch
npm install react-hook-form@^7.53.0 --legacy-peer-deps
```

### Option 3: If Above Fails
```batch
npm cache clean --force
npm install react-hook-form --legacy-peer-deps
```

## Verification

After installation, verify it's installed:
```batch
npm list react-hook-form
```

Then test the build:
```batch
npm run build
```

## Why This Happens

The `react-hook-form` package is listed in `package.json` dependencies, but:
1. It hasn't been installed yet (missing from `node_modules/`)
2. Or the installation was incomplete
3. Or there was a dependency conflict

## Files That Use react-hook-form

- ✅ `components/contact/ContactForm.jsx` - Uses `useForm` hook
- ✅ `components/contact/EmailUs.jsx` - Uses `useForm` hook

Both files are correctly importing:
```javascript
import { useForm } from "react-hook-form";
```

Once `react-hook-form` is installed, these errors will be resolved.






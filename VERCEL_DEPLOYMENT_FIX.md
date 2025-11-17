# Vercel 404 Error - Fix Guide

## 🔍 The Problem

You're getting a 404 error from `expense-pizza.vercel.app`. This is likely because:

1. **Vercel configuration is missing** - Vercel needs to know where your build output is
2. **Build output directory not set** - Vite builds to `dist/` folder
3. **SPA routing not configured** - React Router needs rewrites for client-side routing

## ✅ Solution

I've created a `vercel.json` file in your `frontend/` directory that configures:
- Build command: `npm run build`
- Output directory: `dist` (where Vite builds to)
- SPA rewrites: All routes redirect to `index.html` for React Router

## 🚀 Steps to Fix

### Step 1: Verify vercel.json exists
The file `frontend/vercel.json` should now exist with the correct configuration.

### Step 2: Update Vercel Project Settings

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `expense-pizza` (or your project name)
3. **Go to Settings → General**
4. **Verify these settings**:
   - **Framework Preset**: Vite (or Other)
   - **Root Directory**: `frontend` (if your repo has frontend/ folder)
   - **Build Command**: `npm run build` (or leave empty, vercel.json will handle it)
   - **Output Directory**: `dist` (or leave empty, vercel.json will handle it)
   - **Install Command**: `npm install` (or leave empty)

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

### Step 4: Redeploy

1. **Option A: Automatic** - Push to your connected Git branch
2. **Option B: Manual** - Go to Deployments → Click "Redeploy" on latest deployment

## 📋 Vercel Configuration Checklist

- [ ] `vercel.json` exists in `frontend/` directory
- [ ] Root Directory is set to `frontend` (if using monorepo)
- [ ] Build Command: `npm run build` (or auto-detected)
- [ ] Output Directory: `dist` (or auto-detected)
- [ ] Environment variables set (VITE_API_URL, VITE_SOCKET_URL)
- [ ] Project redeployed after configuration

## 🔧 Alternative: If Root Directory is Wrong

If your Vercel project root is set to the repository root (not `frontend/`):

1. **Option 1: Change Root Directory in Vercel**
   - Settings → General → Root Directory → Set to `frontend`

2. **Option 2: Move vercel.json to Root**
   - Move `frontend/vercel.json` to repository root
   - Update paths in vercel.json if needed

## 🧪 Test Locally

Before deploying, test the build:

```bash
cd frontend
npm run build
npm run preview
```

This should:
- Build successfully to `dist/` folder
- Preview server should work on `http://localhost:4173`
- All routes should work (test navigation)

## 🐛 Common Issues

### Issue: Still getting 404
**Check:**
- Is `vercel.json` in the correct location?
- Is Root Directory set correctly in Vercel?
- Did you redeploy after adding `vercel.json`?

### Issue: Build fails
**Check:**
- Vercel logs for build errors
- Ensure all dependencies are in `package.json`
- Check Node.js version (Vercel should auto-detect)

### Issue: Routes work but API calls fail
**Check:**
- Environment variables are set correctly
- `VITE_API_URL` points to your backend
- Backend CORS allows your Vercel domain

## 📝 Next Steps

1. ✅ `vercel.json` created
2. ⏳ Update Vercel project settings (Root Directory)
3. ⏳ Set environment variables
4. ⏳ Redeploy project
5. ⏳ Test the deployed site

---

**Note**: After adding `vercel.json` and updating settings, Vercel should automatically redeploy. If not, trigger a manual redeploy.


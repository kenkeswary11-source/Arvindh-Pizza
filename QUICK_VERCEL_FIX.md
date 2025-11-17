# Quick Fix for Vercel 404 Error

## ✅ What I Fixed

1. **Created `frontend/vercel.json`** - Configures Vercel to:
   - Build from `dist/` folder (Vite output)
   - Handle SPA routing (all routes → index.html)
   - Use correct build commands

2. **Verified build works** - The frontend builds successfully to `dist/`

## 🚀 What You Need to Do

### Step 1: Commit and Push (if not already done)
```bash
git add frontend/vercel.json
git commit -m "Add Vercel configuration"
git push
```

### Step 2: Update Vercel Settings

1. Go to: https://vercel.com/dashboard
2. Select your project: `expense-pizza`
3. Go to **Settings → General**
4. Set **Root Directory**: `frontend`
   - This tells Vercel your frontend code is in the `frontend/` folder
5. Save settings

### Step 3: Set Environment Variables

In **Settings → Environment Variables**, add:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

### Step 4: Redeploy

Vercel should auto-deploy when you push. If not:
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment

## ✅ Expected Result

After redeploying:
- ✅ Site should load at `expense-pizza.vercel.app`
- ✅ No more 404 errors
- ✅ React Router routes should work
- ✅ API calls should work (if env vars are set)

## 🔍 If Still Getting 404

1. **Check Vercel Logs**:
   - Go to Deployments → Click on latest deployment → View logs
   - Look for build errors

2. **Verify Root Directory**:
   - Must be set to `frontend` (not empty, not root)

3. **Check Build Output**:
   - In deployment logs, verify it says "Output Directory: dist"
   - Verify build completed successfully

4. **Test Build Locally**:
   ```bash
   cd frontend
   npm run build
   ```
   Should create `dist/` folder with `index.html`

## 📝 Summary

- ✅ `vercel.json` created and configured
- ✅ Build verified working
- ⏳ **You need to**: Set Root Directory to `frontend` in Vercel
- ⏳ **You need to**: Set environment variables
- ⏳ **You need to**: Redeploy

The configuration is ready - just update Vercel settings and redeploy!


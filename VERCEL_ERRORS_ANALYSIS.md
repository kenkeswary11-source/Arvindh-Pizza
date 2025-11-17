# Vercel Errors Analysis & Fixes

## Error Classification

### 🔴 EXTERNAL ERRORS (GitHub Permissions - Fix in Vercel/GitHub Dashboard)

These errors are **NOT** caused by your project files. They require action in Vercel or GitHub settings:

#### 1. **401 GitHub Bad Credentials**
- **Cause**: GitHub OAuth token expired or invalid
- **Location**: Vercel Dashboard → Settings → Git → GitHub
- **Fix**: 
  1. Go to Vercel Dashboard
  2. Settings → Git → GitHub
  3. Click "Disconnect" then "Connect" again
  4. Re-authorize Vercel access to your GitHub account

#### 2. **Vercel App is not installed**
- **Cause**: Vercel GitHub App not installed on your repository
- **Location**: GitHub Repository Settings
- **Fix**:
  1. Go to your GitHub repository
  2. Settings → Integrations → GitHub Apps
  3. Find "Vercel" and click "Configure"
  4. Grant access to your repository
  5. Or install from: https://github.com/apps/vercel

#### 3. **400 search-repo API errors**
- **Cause**: GitHub API rate limit or insufficient permissions
- **Location**: GitHub API permissions
- **Fix**:
  1. Check GitHub API rate limits
  2. Ensure Vercel has read access to your repository
  3. Re-authenticate GitHub connection in Vercel

#### 4. **404 project not found**
- **Possible Causes**:
  - Wrong repository name in Vercel
  - Wrong root directory setting
  - Repository is private and Vercel doesn't have access
- **Fix**:
  1. Vercel Dashboard → Project Settings → General
  2. Verify "Root Directory" is set to `frontend` (not empty)
  3. Verify repository name matches your GitHub repo
  4. Check repository visibility (private repos need proper access)

---

### 🟢 INTERNAL ERRORS (Fixed in Project Files)

These errors were caused by project configuration and have been fixed:

#### 5. **WebSocket connection failed**
- **Cause**: `VITE_SOCKET_URL` environment variable not set in production
- **Files Fixed**:
  - `frontend/src/config/api.js` - Added better error handling and fallbacks
  - `frontend/src/context/NotificationContext.jsx` - Added connection checks
  - `frontend/src/pages/LiveTracking.jsx` - Added connection error handling
  - `frontend/src/pages/admin/AdminOrders.jsx` - Added connection checks
- **Fix Applied**: 
  - Socket.io now checks if `SOCKET_URL` exists before connecting
  - Added connection error handlers
  - Added reconnection logic
  - Added console warnings when URL is missing

---

## Required Vercel Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

**Important**: 
- Replace `your-backend.onrender.com` with your actual Render backend URL
- These MUST be set for production builds
- WebSocket will fail if `VITE_SOCKET_URL` is not set

---

## Vercel Project Settings Checklist

1. **Root Directory**: `frontend` (not empty, not `/`)
2. **Build Command**: `npm run build` (auto-detected)
3. **Output Directory**: `dist` (auto-detected)
4. **Framework Preset**: Vite (auto-detected)
5. **Node Version**: 18.x or 20.x (auto-detected)
6. **Environment Variables**: 
   - `VITE_API_URL` ✅
   - `VITE_SOCKET_URL` ✅

---

## How to Fix External Errors

### Step 1: Reconnect GitHub Integration
1. Vercel Dashboard → Settings → Git
2. Click "Disconnect" next to GitHub
3. Click "Connect Git Repository"
4. Select your repository
5. Re-authorize permissions

### Step 2: Install Vercel GitHub App
1. Go to: https://github.com/apps/vercel
2. Click "Install"
3. Select your repository
4. Grant all requested permissions

### Step 3: Verify Repository Access
1. GitHub → Your Repository → Settings → Collaborators
2. Ensure Vercel has access
3. For private repos, ensure proper permissions

---

## Testing After Fixes

1. **Check Build Logs**: Vercel Dashboard → Deployments → Latest
2. **Check Runtime Logs**: Vercel Dashboard → Functions → Logs
3. **Test WebSocket**: Open browser console, check for socket connection errors
4. **Test API Calls**: Verify API requests go to correct backend URL

---

## Summary

- **External Errors (4)**: Fix in Vercel/GitHub dashboard (authentication/permissions)
- **Internal Errors (1)**: Fixed in project files (WebSocket connection handling)
- **Action Required**: 
  1. Reconnect GitHub in Vercel
  2. Set environment variables in Vercel
  3. Verify root directory is `frontend`



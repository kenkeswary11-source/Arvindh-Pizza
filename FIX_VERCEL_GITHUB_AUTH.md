# Fix Vercel GitHub Authentication Errors

## 🔍 The Problem

You're seeing these errors in the Vercel dashboard:
- **GitHub 401 Bad Credentials** - Vercel can't authenticate with GitHub
- **Vercel App is not installed** - GitHub integration broken
- **404 on production-deployment API** - Dashboard can't fetch info

**Project Name**: `expense-pizzeria`
**Team ID**: `aravindhans-projects-98b31cae`

## ✅ Solution: Reconnect GitHub Integration

### Method 1: Through Vercel Settings (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click your profile icon** (top right) → **Settings**
3. **Go to**: **Git** → **GitHub**
4. **Click**: **"Disconnect"** (if connected) or **"Connect"** (if not)
5. **Re-authorize** Vercel to access your GitHub account
6. **Grant access** to your repositories (including `American-Pizza`)

### Method 2: Through GitHub Settings

1. **Go to GitHub**: https://github.com/settings/installations
2. **Find "Vercel"** in your installed GitHub Apps
3. **Click "Configure"**
4. **Verify repository access**:
   - Ensure `aravindhanp-11031990/American-Pizza` (or your repo) is selected
   - Or select "All repositories" if you want
5. **Click "Save"**

### Method 3: Reinstall Vercel GitHub App

If the above doesn't work:

1. **Go to**: https://github.com/settings/installations
2. **Find "Vercel"** → Click **"Uninstall"**
3. **Go back to Vercel**: https://vercel.com/dashboard
4. **Try to connect a project** or go to Settings → Git → GitHub
5. **Click "Connect"** and authorize again

## 🔧 After Reconnecting

### Step 1: Verify Project Connection

1. Go to your project: `expense-pizzeria`
2. **Settings → Git**
3. Verify:
   - ✅ Repository is connected
   - ✅ Branch: `main` (or your default branch)
   - ✅ Root Directory: `frontend`

### Step 2: Check Deployment Status

1. Go to **Deployments** tab
2. You should see deployment history
3. If no deployments, trigger one:
   - Click **"Deploy"** → **"Deploy Git Repository"**
   - Or push to your connected branch

### Step 3: Refresh Dashboard

1. **Hard refresh** the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or **clear browser cache** for vercel.com
3. The errors should disappear

## 🧪 Test Your Actual Site

**Important**: These dashboard errors don't affect your live site!

1. **Visit your site**: `https://expense-pizzeria.vercel.app` (or your actual URL)
2. **Check if it loads** - Should work fine
3. **Test functionality** - Navigation, API calls, etc.

## 📋 Quick Checklist

- [ ] Disconnected and reconnected GitHub in Vercel Settings
- [ ] Verified Vercel app has repository access in GitHub
- [ ] Checked project Git settings (repository, branch, root directory)
- [ ] Refreshed dashboard (hard refresh)
- [ ] Tested actual deployed site (not just dashboard)

## 🐛 If Errors Persist

### Option 1: Check Repository Access

1. Go to: https://github.com/settings/installations
2. Click on **Vercel** → **Configure**
3. Under **Repository access**, ensure your repo is selected
4. If using organization, check organization settings

### Option 2: Check Vercel Team Settings

1. Go to: https://vercel.com/teams/aravindhans-projects-98b31cae/settings
2. Check **Git** settings
3. Verify GitHub integration is enabled

### Option 3: Create New Project

If nothing works:
1. **Delete current project** (Settings → Delete Project)
2. **Create new project**
3. **Connect GitHub repository** during setup
4. **Set Root Directory** to `frontend`
5. **Deploy**

## ✅ Expected Result

After reconnecting:
- ✅ No more GitHub 401 errors
- ✅ No more "Vercel App not installed" errors
- ✅ Dashboard shows deployment information
- ✅ Your site still works (was never broken)

## 📝 Notes

- These are **dashboard UI errors only** - your site works fine
- Users don't see these errors
- Reconnecting GitHub usually fixes all issues
- May take a few minutes for changes to propagate

---

**Most Common Fix**: Reconnect GitHub in Vercel Settings → Git → GitHub



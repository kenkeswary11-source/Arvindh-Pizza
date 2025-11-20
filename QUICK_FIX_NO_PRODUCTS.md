# 🚨 Quick Fix: No Products Showing

## ❌ The Problem

Products are not showing because `VITE_API_URL` environment variable is **NOT SET** in Vercel.

The frontend is trying to call: `https://arvindh-pizza.vercel.app/api/products` (wrong!)
But it should call: `https://arvindh-pizza.onrender.com/api/products` (correct!)

## ✅ The Solution

### Step 1: Go to Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Click on your project: **Arvindh-Pizza** (or your project name)
3. Click on **Settings** (in the top menu)
4. Click on **Environment Variables** (in the left sidebar)

### Step 2: Add Environment Variables

Click **"Add New"** and add these **TWO** variables:

#### Variable 1:
- **Key:** `VITE_API_URL`
- **Value:** `https://arvindh-pizza.onrender.com/api`
- **Environment:** Select **Production**, **Preview**, and **Development** (or just **Production**)

#### Variable 2:
- **Key:** `VITE_SOCKET_URL`
- **Value:** `https://arvindh-pizza.onrender.com`
- **Environment:** Select **Production**, **Preview**, and **Development** (or just **Production**)

### Step 3: Save and Redeploy

1. Click **"Save"** after adding each variable
2. Go to **Deployments** tab
3. Click the **"..."** (three dots) on the latest deployment
4. Click **"Redeploy"**
5. Wait 2-3 minutes for deployment to complete

## ✅ After Redeploy

1. Visit your site: `https://arvindh-pizza.vercel.app`
2. Open browser console (F12 → Console tab)
3. You should see: `Fetching products from: https://arvindh-pizza.onrender.com/api/products`
4. Products should now load!

## 🔍 Verify Backend is Working

Before fixing Vercel, verify your backend is working:

1. Visit: `https://arvindh-pizza.onrender.com/health`
   - Should return: `{"status":"ok",...}`

2. Visit: `https://arvindh-pizza.onrender.com/api/products`
   - Should return: `[]` or a list of products

If these don't work, your backend might be down. Check Render dashboard.

## 📝 Summary

**The Issue:** Frontend doesn't know where the backend is  
**The Fix:** Set `VITE_API_URL` in Vercel environment variables  
**The Value:** `https://arvindh-pizza.onrender.com/api`

---

**After setting these variables and redeploying, your products will appear!** 🎉


# 🚀 Complete Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend (Render) - All Fixed ✅

- [x] **server.js** uses `process.env.PORT` and `process.env.HOST`
- [x] **dotenv** loads before all imports
- [x] **CORS** configured for Vercel domains
- [x] **Error handling** middleware added
- [x] **Health check** endpoint (`/health`)
- [x] **Uploads directory** auto-created
- [x] **Graceful shutdown** handler
- [x] **package.json** has correct start script
- [x] **No hardcoded URLs** in backend
- [x] **Environment variables** properly used

### Frontend (Vercel) - All Fixed ✅

- [x] **API configuration** centralized in `src/config/api.js`
- [x] **All components** use centralized API config
- [x] **Environment variables** use `import.meta.env.VITE_*`
- [x] **vercel.json** configured correctly
- [x] **Build settings** optimized
- [x] **WebSocket** connection handling with error checks
- [x] **No hardcoded localhost** URLs in production
- [x] **SPA routing** configured in vercel.json
- [x] **package.json** has correct build script

---

## 📋 Backend Deployment (Render)

### Step 1: Prepare Repository
- [ ] Backend code is in separate GitHub repository (`aravindhanriya/backend`)
- [ ] All files are at root level (not in subdirectory)
- [ ] `config/database.js` exists
- [ ] `server.js` exists at root
- [ ] `package.json` exists at root

### Step 2: Create Render Service
1. Go to: https://dashboard.render.com
2. Click: **New** → **Web Service**
3. Connect your GitHub repository: `aravindhanriya/backend`
4. Configure:
   - **Name**: `american-pizza-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: (leave empty - files at root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `node server.js` (or `npm start`)

### Step 3: Set Environment Variables
In Render Dashboard → Environment tab, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/american-pizza?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-app.vercel.app,https://your-app-preview.vercel.app
NODE_ENV=production
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a strong random string (32+ characters)
- Replace `FRONTEND_URL` with your actual Vercel frontend URL(s)
- `PORT` is auto-set by Render (don't set manually)

### Step 4: Deploy
- [ ] Click **Create Web Service**
- [ ] Wait for deployment to complete
- [ ] Check logs for any errors
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`
- [ ] Test API endpoint: `https://your-backend.onrender.com/api`

### Step 5: Verify Backend
- [ ] Health check returns: `{"status":"ok",...}`
- [ ] API root returns: `{"message":"American Pizza API",...}`
- [ ] CORS allows your frontend domain
- [ ] Database connection successful (check logs)

---

## 📋 Frontend Deployment (Vercel)

### Step 1: Prepare Repository
- [ ] Frontend code is in `frontend/` directory
- [ ] `vercel.json` exists in `frontend/` directory
- [ ] `package.json` exists in `frontend/` directory
- [ ] All source files in `frontend/src/`

### Step 2: Connect to Vercel
1. Go to: https://vercel.com/dashboard
2. Click: **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite (or Other)
   - **Root Directory**: `frontend` ⚠️ **CRITICAL**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

**Important:**
- Replace `your-backend.onrender.com` with your actual Render backend URL
- These MUST be set for production builds
- Add for all environments: Production, Preview, Development

### Step 4: Deploy
- [ ] Click **Deploy**
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Verify deployment URL

### Step 5: Verify Frontend
- [ ] Site loads at `https://your-app.vercel.app`
- [ ] No console errors in browser
- [ ] API calls work (check Network tab)
- [ ] WebSocket connects (check console)
- [ ] React Router routes work
- [ ] Images load correctly

---

## 🔧 Post-Deployment Testing

### Backend Tests
- [ ] `GET /health` returns 200 OK
- [ ] `GET /api` returns API info
- [ ] `POST /api/auth/login` works
- [ ] `GET /api/products` returns products
- [ ] CORS allows frontend origin
- [ ] File uploads work (`/api/products` POST with image)

### Frontend Tests
- [ ] Home page loads
- [ ] Products page loads
- [ ] Login/Signup works
- [ ] Cart functionality works
- [ ] Payment flow works
- [ ] Admin panel accessible (if admin user)
- [ ] Real-time notifications work (WebSocket)
- [ ] Order tracking works

### Integration Tests
- [ ] Frontend can call backend API
- [ ] Authentication works end-to-end
- [ ] Orders can be created
- [ ] Images display correctly
- [ ] WebSocket real-time updates work

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot find module './config/database'**
- ✅ Fixed: Error handling added in server.js
- Check: Files exist in GitHub repository

**Error: CORS blocked**
- ✅ Fixed: CORS allows `.vercel.app` domains
- Check: `FRONTEND_URL` environment variable is set correctly

**Error: Database connection failed**
- Check: `MONGODB_URI` is correct
- Check: MongoDB cluster allows connections from Render IPs

**Error: Port already in use**
- ✅ Fixed: Uses `process.env.PORT` (auto-set by Render)

### Frontend Issues

**Error: 404 on all routes**
- ✅ Fixed: `vercel.json` has SPA rewrites
- Check: Root Directory is set to `frontend`

**Error: API calls fail**
- ✅ Fixed: Centralized API config
- Check: `VITE_API_URL` is set in Vercel
- Check: Backend CORS allows Vercel domain

**Error: WebSocket connection failed**
- ✅ Fixed: Connection checks and error handling added
- Check: `VITE_SOCKET_URL` is set in Vercel
- Check: Backend Socket.io is running

**Error: Build fails**
- Check: All dependencies in `package.json`
- Check: No TypeScript errors (if using TS)
- Check: Vite config is correct

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=          [Required] MongoDB connection string
JWT_SECRET=           [Required] Secret for JWT tokens (32+ chars)
FRONTEND_URL=         [Required] Comma-separated frontend URLs
NODE_ENV=production   [Required] Environment mode
PORT=                 [Auto-set] Don't set manually
HOST=0.0.0.0          [Optional] Default is correct
```

### Frontend (Vercel)
```
VITE_API_URL=         [Required] Backend API URL with /api
VITE_SOCKET_URL=      [Required] Backend Socket.io URL
```

---

## ✅ Final Verification

Before marking as complete, verify:

- [ ] Backend health check: `https://your-backend.onrender.com/health` ✅
- [ ] Frontend loads: `https://your-app.vercel.app` ✅
- [ ] No console errors in browser ✅
- [ ] API calls work ✅
- [ ] WebSocket connects ✅
- [ ] All features work end-to-end ✅

---

## 🎉 Deployment Complete!

Once all items are checked, your application is fully deployed and ready for production use!

**Backend URL**: `https://your-backend.onrender.com`  
**Frontend URL**: `https://your-app.vercel.app`

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in Render/Vercel dashboards
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Verify CORS configuration
5. Test API endpoints directly with Postman/curl

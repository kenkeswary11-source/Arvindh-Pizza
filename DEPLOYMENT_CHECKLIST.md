# Backend Deployment Checklist for Render

## Required Files Structure

Your GitHub repository `aravindhanriya/backend` should have the following structure at the **root level**:

```
backend/ (or root of repository)
├── config/
│   └── database.js          ✅ REQUIRED
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── Offer.js
│   ├── Order.js
│   ├── Product.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── deliveryRoutes.js
│   ├── offerRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   └── salesRoutes.js
├── scripts/
│   └── createAdmin.js
├── utils/
│   ├── distanceCalculator.js
│   ├── notificationService.js
│   └── pdfGenerator.js
├── .gitignore
├── package.json
├── package-lock.json
└── server.js                 ✅ REQUIRED (entry point)
```

## Critical Files for Deployment

1. **config/database.js** - Database connection (MUST EXIST)
2. **server.js** - Main entry point
3. **package.json** - Dependencies and scripts
4. **.gitignore** - Excludes node_modules, .env, uploads

## Render Configuration

### Build Command
```
npm install
```

### Start Command
```
node server.js
```

### Environment Variables Required
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Port number (usually set automatically by Render)
- `FRONTEND_URL` - Your frontend URL for CORS

## Common Issues & Solutions

### Issue: "Cannot find module './config/database'"
**Solution:** 
- Verify `config/database.js` exists in your GitHub repository
- Check that the file is committed and pushed
- Ensure the repository structure matches the expected layout

### Issue: Files in wrong directory
**Solution:**
- If Render shows `/opt/render/project/src/server.js`, your repo might have files in a `src/` subdirectory
- Move all files to the root of the repository, or update Render's root directory setting

## Verification Steps

1. Clone your repository fresh:
   ```bash
   git clone https://github.com/aravindhanriya/backend.git
   cd backend
   ```

2. Verify config folder exists:
   ```bash
   ls config/database.js
   ```

3. Verify server.js exists:
   ```bash
   ls server.js
   ```

4. Test locally:
   ```bash
   npm install
   node server.js
   ```

## Files Currently Tracked in Git

All required files should be in your repository. If any are missing, add them:

```bash
git add config/database.js
git add server.js
git add package.json
# ... etc
git commit -m "Add missing files for deployment"
git push
```


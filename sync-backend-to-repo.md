# How to Sync Backend Files to aravindhanriya/backend Repository

## Current Situation

Your files are in this structure:
```
American-Pizza/
├── backend/
│   ├── config/
│   ├── server.js
│   └── ...
└── frontend/
```

But the `aravindhanriya/backend` repository needs:
```
backend/ (root)
├── config/
├── server.js
└── ...
```

## Solution Options

### Option 1: Use Git Subtree (Recommended)

This pushes only the `backend/` directory contents to the root of the backend repository:

```bash
# Add the backend repository as a remote (if not already added)
git remote add backend https://github.com/aravindhanriya/backend.git

# Push the backend directory to the backend repository
git subtree push --prefix=backend backend main
```

### Option 2: Manual Copy and Push

1. Clone the backend repository separately:
```bash
cd ..
git clone https://github.com/aravindhanriya/backend.git backend-repo
cd backend-repo
```

2. Copy all files from `American Pizza/backend/` to the root of `backend-repo/`:
```bash
# From backend-repo directory
cp -r ../American\ Pizza/backend/* .
# Or on Windows PowerShell:
Copy-Item -Path "..\American Pizza\backend\*" -Destination "." -Recurse -Force
```

3. Commit and push:
```bash
git add .
git commit -m "Sync backend files from main repository"
git push origin main
```

### Option 3: Use a Script (Automated)

I can create a script that automates this process for you.

## Quick Fix for Render Deployment

The immediate issue is that `config/database.js` is missing from the GitHub repository.

**Fastest solution:**
1. Go to: https://github.com/aravindhanriya/backend
2. Create the `config` folder
3. Create `config/database.js` with this content:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

4. Commit and push
5. Redeploy on Render

## Recommended Approach

Use **Option 1 (Git Subtree)** as it's the cleanest and maintains the connection between repositories.


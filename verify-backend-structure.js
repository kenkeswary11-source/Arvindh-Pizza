#!/usr/bin/env node

/**
 * Verification script to check if all required backend files exist
 * Run this to verify your backend structure before deploying to Render
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'config/database.js',
  'server.js',
  'package.json',
  'package-lock.json',
  'middleware/auth.js',
  'middleware/upload.js',
  'models/User.js',
  'models/Product.js',
  'models/Order.js',
  'models/Offer.js',
  'models/Review.js',
  'routes/authRoutes.js',
  'routes/productRoutes.js',
  'routes/orderRoutes.js',
  'routes/reviewRoutes.js',
  'routes/offerRoutes.js',
  'routes/deliveryRoutes.js',
  'routes/salesRoutes.js',
  'utils/distanceCalculator.js',
  'utils/notificationService.js',
  'utils/pdfGenerator.js',
  'scripts/createAdmin.js',
  '.gitignore'
];

console.log('🔍 Verifying backend structure...\n');
console.log('Current directory:', process.cwd());

// Check if we're in the backend directory or root
const backendDir = fs.existsSync(path.join(process.cwd(), 'backend')) 
  ? path.join(process.cwd(), 'backend')
  : process.cwd();

console.log('Checking in:', backendDir);
console.log('');

let allFilesExist = true;
const missingFiles = [];
const existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(backendDir, file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Total files checked: ${requiredFiles.length}`);
console.log(`✅ Found: ${existingFiles.length}`);
console.log(`❌ Missing: ${missingFiles.length}`);

if (allFilesExist) {
  console.log('\n🎉 All required files are present!');
  console.log('Your backend structure is ready for deployment.');
  
  // Verify server.js can require config/database
  try {
    const serverPath = path.join(backendDir, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (serverContent.includes("require('./config/database')")) {
      console.log('✅ server.js correctly requires config/database');
    } else {
      console.log('⚠️  server.js might have incorrect require path');
    }
  } catch (err) {
    console.log('⚠️  Could not verify server.js');
  }
} else {
  console.log('\n❌ Some files are missing!');
  console.log('\nMissing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  console.log('\nPlease add these files before deploying to Render.');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Make sure all files are committed to git');
console.log('2. Push to your GitHub repository: aravindhanriya/backend');
console.log('3. Verify the files exist in the GitHub repository');
console.log('4. Check Render deployment settings match your repository structure');


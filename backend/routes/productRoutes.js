const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// GET single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ 
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// POST create product (admin only)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('POST /api/products - Request received');
    console.log('Request body:', {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      featured: req.body.featured
    });
    console.log('File received:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? `Buffer exists (${req.file.buffer.length} bytes)` : 'Buffer MISSING',
      fieldname: req.file.fieldname
    } : 'No file');

    if (!req.file) {
      console.error('No file in request!');
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Check if buffer exists (should exist with memoryStorage)
    if (!req.file.buffer) {
      console.error('File buffer is missing! File object:', JSON.stringify(req.file, null, 2));
      return res.status(500).json({ 
        message: 'File processing error: buffer not found. Please try uploading again.',
        details: 'The file was received but the buffer is missing. This might be a multer configuration issue.'
      });
    }

    console.log('File buffer size:', req.file.buffer.length, 'bytes');

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing!');
      return res.status(500).json({ 
        message: 'Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'
      });
    }

    // Convert buffer to data URI for Cloudinary upload
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    console.log('Uploading to Cloudinary...');
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
      api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'not set'
    });
    
    let uploaded;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    
    // Try signed upload first (more reliable, doesn't need preset)
    try {
      console.log('Attempting signed upload to Cloudinary...');
      uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "american_pizza",
        resource_type: "image",
        use_filename: true,
        unique_filename: true
      });
      console.log('✓ Signed upload successful');
    } catch (signedError) {
      console.error('Signed upload failed:', signedError.message || signedError);
      
      // If signed upload fails and we have a preset, try preset
      if (uploadPreset) {
        try {
          console.log(`Trying upload with preset: ${uploadPreset}`);
          uploaded = await cloudinary.uploader.upload(dataUri, {
            upload_preset: uploadPreset,
            folder: "american_pizza",
            resource_type: "image"
          });
          console.log('✓ Preset upload successful');
        } catch (presetError) {
          console.error('Preset upload also failed:', presetError.message || presetError);
          return res.status(500).json({ 
            message: 'Failed to upload image to Cloudinary. Please check your Cloudinary configuration in Render environment variables.',
            error: process.env.NODE_ENV !== 'production' ? {
              signedError: signedError.message,
              presetError: presetError.message,
              http_code: signedError.http_code || presetError.http_code
            } : undefined
          });
        }
      } else {
        // No preset, signed upload failed
        return res.status(500).json({ 
          message: 'Failed to upload image to Cloudinary. Error: ' + (signedError.message || 'Unknown error'),
          error: process.env.NODE_ENV !== 'production' ? {
            error: signedError.message,
            http_code: signedError.http_code
          } : undefined
        });
      }
    }

    if (!uploaded || !uploaded.secure_url) {
      throw new Error('Failed to upload image to Cloudinary - no secure URL returned');
    }

    console.log('Image uploaded successfully:', uploaded.secure_url);

    // Create product
    console.log('Creating product in database...');
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      image: uploaded.secure_url,
      cloudinary_id: uploaded.public_id,
      featured: req.body.featured === "true"
    });

    console.log('Product created successfully:', product._id);
    res.status(201).json(product);

  } catch (err) {
    console.error("Product Creation Error:", err);
    console.error("Error stack:", err.stack);
    
    // Provide more detailed error message
    let errorMessage = err.message || 'Failed to create product';
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      errorMessage = messages || 'Validation error';
      return res.status(400).json({ message: errorMessage });
    }

    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// PUT update product (admin only)
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageUrl = product.image;
    let cloudinaryId = product.cloudinary_id;

    // If a new image is provided, upload it to Cloudinary
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryId);
        } catch (cloudinaryErr) {
          console.warn('Failed to delete old image from Cloudinary:', cloudinaryErr);
        }
      }

      // Check if buffer exists
      if (!req.file.buffer) {
        console.error('File buffer is missing during update! File:', req.file);
        return res.status(500).json({ 
          message: 'File processing error: buffer not found. Please try uploading again.'
        });
      }

      // Convert buffer to data URI for Cloudinary upload
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Upload new image to Cloudinary
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "pizza_unsigned";
      let uploaded;
      
      try {
        // Try with preset first
        uploaded = await cloudinary.uploader.upload(dataUri, {
          upload_preset: uploadPreset,
          folder: "american_pizza",
          resource_type: "image"
        });
      } catch (presetError) {
        // Fallback to signed upload if preset fails
        if (presetError.message && presetError.message.includes('preset')) {
          console.warn('Upload preset failed, using signed upload fallback...');
          uploaded = await cloudinary.uploader.upload(dataUri, {
            folder: "american_pizza",
            resource_type: "image"
          });
        } else {
          throw presetError;
        }
      }

      if (!uploaded || !uploaded.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      imageUrl = uploaded.secure_url;
      cloudinaryId = uploaded.public_id;
    }

    // Update product
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.price = req.body.price ? parseFloat(req.body.price) : product.price;
    product.image = imageUrl;
    product.cloudinary_id = cloudinaryId;
    product.featured = req.body.featured !== undefined ? req.body.featured === "true" : product.featured;

    await product.save();

    res.json(product);

  } catch (err) {
    console.error("Product Update Error:", err);
    const errorMessage = err.message || 'Failed to update product';
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// POST fix all product images (admin only) - converts filenames to Cloudinary URLs if cloudinary_id exists
router.post('/fix-images', protect, admin, async (req, res) => {
  try {
    console.log('🔧 Starting product image fix...');
    const products = await Product.find({});
    let fixed = 0;
    let skipped = 0;
    let errors = [];
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      return res.status(500).json({ message: 'Cloudinary cloud name not configured' });
    }

    // First, get all images from Cloudinary in the american_pizza folder
    console.log('📦 Fetching all images from Cloudinary...');
    let allCloudinaryImages = [];
    try {
      const searchResult = await cloudinary.search
        .expression('folder:american_pizza')
        .max_results(500)
        .execute();
      allCloudinaryImages = searchResult.resources || [];
      console.log(`✓ Found ${allCloudinaryImages.length} images in Cloudinary`);
    } catch (searchError) {
      console.error('Error fetching Cloudinary images:', searchError);
      return res.status(500).json({ 
        message: 'Failed to fetch images from Cloudinary: ' + searchError.message 
      });
    }

    for (const product of products) {
      // Check if image is a filename (not a URL)
      if (product.image && !product.image.startsWith('http')) {
        try {
          // If product has cloudinary_id, reconstruct URL
          if (product.cloudinary_id) {
            const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${product.cloudinary_id}`;
            product.image = cloudinaryUrl;
            await product.save();
            fixed++;
            console.log(`✓ Fixed product ${product._id}: ${product.name} (using cloudinary_id)`);
            continue;
          }
          
          // Extract filename from product.image
          const filename = product.image.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
          const fullFilename = product.image.replace(/^.*[\\\/]/, '');
          
          // Try to find matching image in Cloudinary
          const matching = allCloudinaryImages.find(img => {
            const imgFilename = img.filename || img.public_id.split('/').pop();
            return imgFilename === fullFilename || 
                   imgFilename.includes(filename) || 
                   img.public_id.includes(filename) ||
                   img.secure_url.includes(filename);
          });
          
          if (matching) {
            product.image = matching.secure_url;
            product.cloudinary_id = matching.public_id;
            await product.save();
            fixed++;
            console.log(`✓ Fixed product ${product._id}: ${product.name} (found in Cloudinary: ${matching.public_id})`);
          } else {
            errors.push(`Product ${product._id} (${product.name}): Image "${product.image}" not found in Cloudinary`);
            skipped++;
            console.warn(`⚠️ Could not find image for product: ${product.name} (${product.image})`);
          }
        } catch (err) {
          errors.push(`Product ${product._id}: ${err.message}`);
          skipped++;
          console.error(`Error fixing product ${product._id}:`, err);
        }
      } else {
        skipped++;
      }
    }

    console.log(`✅ Image fix completed. Fixed: ${fixed}, Skipped: ${skipped}, Errors: ${errors.length}`);

    res.json({
      message: `Image fix completed. Fixed: ${fixed}, Skipped: ${skipped}`,
      fixed,
      skipped,
      errors: errors.length > 0 ? errors.slice(0, 20) : undefined, // Show first 20 errors
      totalErrors: errors.length
    });
  } catch (err) {
    console.error('Error fixing product images:', err);
    res.status(500).json({ 
      message: 'Failed to fix product images',
      error: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// DELETE product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary if it exists
    if (product.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(product.cloudinary_id);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete image from Cloudinary:', cloudinaryErr);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error("Product Deletion Error:", err);
    res.status(500).json({ 
      message: 'Failed to delete product',
      error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

module.exports = router;

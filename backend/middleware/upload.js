const multer = require("multer");

// Use memory storage instead of CloudinaryStorage to avoid signature issues
// Files will be uploaded directly to Cloudinary in the route handlers using unsigned presets
const storage = multer.memoryStorage();

// Optional file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExt = allowedTypes.test(file.originalname.toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
  },
});

module.exports = upload;

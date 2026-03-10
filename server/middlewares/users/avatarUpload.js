const multer = require("multer");
const { uploadUserAvatar } = require("../../services/cloudinaryService");

// Configure multer to use memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
    }
  },
});

/**
 * Middleware to handle user avatar upload
 * Uploads file to Cloudinary and adds the URL to req.avatarUrl
 */
const avatarUpload = async (req, res, next) => {
  // Use multer to handle the file upload (stores in memory)
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: "Error uploading avatar",
        error: err.message,
      });
    }

    // If no file was uploaded, continue without avatar
    if (!req.files || req.files.length === 0) {
      console.log("No file uploaded, continuing without avatar");
      return next();
    }

    const file = req.files[0];
    console.log("Avatar file received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferLength: file.buffer ? file.buffer.length : 0,
    });

    try {
      // Upload to Cloudinary
      console.log("Uploading avatar to Cloudinary...");
      const avatarUrl = await uploadUserAvatar(file.buffer, file.originalname);

      console.log("Avatar upload successful, URL:", avatarUrl);

      // Add avatar URL to request object
      req.avatarUrl = avatarUrl;
      // Keep req.files for backward compatibility (but use req.avatarUrl)
      next();
    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        success: false,
        message: "Error uploading avatar to storage",
        error: error.message,
      });
    }
  });
};

module.exports = avatarUpload;

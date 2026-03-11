const multer = require("multer");
const { uploadCommunityBanner } = require("../../services/cloudinaryService");

// Configure multer to use memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for banners
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
 * Middleware to handle community banner upload
 * Uploads file to Cloudinary and adds the URL to req.bannerUrl
 */
const bannerUpload = async (req, res, next) => {
  // Use multer to handle the file upload (stores in memory)
  upload.single("banner")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: "Error uploading banner",
        error: err.message,
      });
    }

    // If no file was uploaded, continue without banner
    if (!req.file) {
      console.log("No file uploaded, continuing without banner");
      // Check if banner field exists in body (might be a URL or path string)
      if (req.body && req.body.banner && !req.body.banner.startsWith("http")) {
        console.warn("Warning: banner field contains a file path but no file was uploaded. Did you forget '@' in curl?");
      }
      return next();
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0,
    });

    try {
      // Upload to Cloudinary
      console.log("Uploading to Cloudinary...");
      const bannerUrl = await uploadCommunityBanner(
        req.file.buffer,
        req.file.originalname
      );

      console.log("Upload successful, banner URL:", bannerUrl);

      // Add banner URL to request object
      req.bannerUrl = bannerUrl;
      next();
    } catch (error) {
      console.error("Error uploading banner to Cloudinary:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        success: false,
        message: "Error uploading banner to storage",
        error: error.message,
      });
    }
  });
};

module.exports = bannerUpload;


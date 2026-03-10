const multer = require("multer");
const { uploadPostFile } = require("../../services/cloudinaryService");

// Configure multer to use memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for post files
  },
  fileFilter: (req, file, cb) => {
    // Only allow image and video files
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

/**
 * Middleware to handle post file upload
 * Uploads file to Cloudinary and adds the URL to req.fileUrl
 */
function fileUpload(req, res, next) {
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: "Error uploading file",
        error: err.message,
      });
    }

    // If no file was uploaded, continue without file
    if (!req.files || req.files.length === 0) {
      console.log("No file uploaded, continuing without file");
      return next();
    }

    const file = req.files[0];
    console.log("Post file received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferLength: file.buffer ? file.buffer.length : 0,
    });

    try {
      // Upload to Cloudinary
      console.log("Uploading post file to Cloudinary...");
      const fileUrl = await uploadPostFile(file.buffer, file.originalname);

      console.log("Post file upload successful, URL:", fileUrl);

      // Add file URL and type to request object
      req.file = file;
      req.fileUrl = fileUrl;
      req.fileType = file.mimetype.split("/")[0];

      next();
    } catch (error) {
      console.error("Error uploading post file to Cloudinary:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        success: false,
        message: "Error uploading file to storage",
        error: error.message,
      });
    }
  });
}

module.exports = fileUpload;

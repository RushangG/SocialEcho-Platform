const { cloudinary, FOLDERS } = require("../config/cloudinary");
const path = require("path");
const crypto = require("crypto");

/**
 * Upload a file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @param {String} folder - Folder path in Cloudinary
 * @param {Object} options - Additional Cloudinary options
 * @returns {Promise<Object>} - { url, public_id, secure_url }
 */
const uploadFile = async (fileBuffer, originalName, folder, options = {}) => {
  try {
    // Validate inputs
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid file buffer provided");
    }
    if (!originalName) {
      throw new Error("Original filename is required");
    }
    if (!folder) {
      throw new Error("Folder path is required");
    }

    console.log("Uploading file to Cloudinary:", {
      folder,
      originalName,
      fileSize: fileBuffer.length,
    });

    // Generate unique filename
    const ext = path.extname(originalName);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    // Remove extension for public_id (Cloudinary handles extensions automatically)
    const publicIdWithoutExt = uniqueName.replace(ext, "");

    // Convert buffer to data URI for Cloudinary
    const dataUri = `data:${getContentType(ext)};base64,${fileBuffer.toString("base64")}`;

    // Upload to Cloudinary
    // Note: When folder is specified, Cloudinary automatically prefixes the public_id with the folder
    // So we should NOT include the folder in public_id to avoid duplication
    const uploadOptions = {
      folder: folder,
      public_id: publicIdWithoutExt, // Don't include folder - Cloudinary adds it automatically
      resource_type: options.resourceType || "auto", // auto detects image/video
      overwrite: false,
      invalidate: true, // Invalidate CDN cache
      ...options,
    };

    console.log("Uploading to Cloudinary with options:", uploadOptions);

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    console.log("File uploaded successfully to Cloudinary:", result.secure_url);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    console.error("Error details:", {
      message: error.message,
      http_code: error.http_code,
      stack: error.stack,
    });
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload community banner image
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @returns {Promise<String>} - Public URL of uploaded image
 */
const uploadCommunityBanner = async (fileBuffer, originalName) => {
  const result = await uploadFile(fileBuffer, originalName, FOLDERS.COMMUNITIES, {
    resourceType: "image",
    transformation: [
      {
        width: 1920,
        height: 1080,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
  return result.url;
};

/**
 * Upload user avatar
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @returns {Promise<String>} - Public URL of uploaded image
 */
const uploadUserAvatar = async (fileBuffer, originalName) => {
  const result = await uploadFile(fileBuffer, originalName, FOLDERS.USER_AVATARS, {
    resourceType: "image",
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
  return result.url;
};

/**
 * Upload post file (image/video)
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @returns {Promise<String>} - Public URL of uploaded file
 */
const uploadPostFile = async (fileBuffer, originalName) => {
  const result = await uploadFile(fileBuffer, originalName, FOLDERS.POST_FILES, {
    resourceType: "auto", // Auto-detect image or video
  });
  return result.url;
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - Public ID of the file
 * @param {String} resourceType - Resource type (image, video, raw)
 * @returns {Promise<void>}
 */
const deleteFile = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    console.log(`File deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} - Public ID
 */
const extractPublicId = (url) => {
  try {
    // Cloudinary URLs have format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{folder}/{public_id}.{format}
    // Example: https://res.cloudinary.com/mycloud/image/upload/v1234567890/socialecho/post-files/uuid.jpg
    // Public ID should be: socialecho/post-files/uuid
    
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL format: 'upload' not found");
    }
    
    // Get everything after "upload" (version, folder, public_id, extension)
    // uploadIndex + 1 = version
    // uploadIndex + 2 onwards = folder/public_id.extension
    const partsAfterUpload = urlParts.slice(uploadIndex + 1);
    
    if (partsAfterUpload.length < 2) {
      throw new Error("Invalid Cloudinary URL format: insufficient parts after 'upload'");
    }
    
    // Skip version (first part), get the rest
    const publicIdWithExt = partsAfterUpload.slice(1).join("/");
    
    // Remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", url, error);
    throw new Error(`Invalid Cloudinary URL format: ${error.message}`);
  }
};

/**
 * Get content type based on file extension
 * @param {String} ext - File extension
 * @returns {String} - MIME type
 */
const getContentType = (ext) => {
  const contentTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
  };
  return contentTypes[ext.toLowerCase()] || "application/octet-stream";
};

module.exports = {
  uploadFile,
  uploadCommunityBanner,
  uploadUserAvatar,
  uploadPostFile,
  deleteFile,
  extractPublicId,
  FOLDERS,
};


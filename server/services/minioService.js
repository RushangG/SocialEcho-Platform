const { minioClient, BUCKETS, getPublicUrl } = require("../config/minio");
const path = require("path");
const crypto = require("crypto");

/**
 * Upload a file to MinIO
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @param {String} bucketName - Bucket name (from BUCKETS)
 * @param {String} folder - Optional folder path within bucket
 * @returns {Promise<Object>} - { url, objectName }
 */
const uploadFile = async (fileBuffer, originalName, bucketName, folder = "") => {
  try {
    // Validate inputs
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid file buffer provided");
    }
    if (!originalName) {
      throw new Error("Original filename is required");
    }
    if (!bucketName) {
      throw new Error("Bucket name is required");
    }

    console.log("Uploading file to MinIO:", {
      bucketName,
      folder,
      originalName,
      fileSize: fileBuffer.length,
    });

    // Check if bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} does not exist, creating...`);
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket ${bucketName} created`);
    }

    // Generate unique filename using crypto (no external dependency)
    const ext = path.extname(originalName);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const objectName = folder ? `${folder}/${uniqueName}` : uniqueName;

    console.log("Uploading object:", objectName);

    // Upload to MinIO
    await minioClient.putObject(bucketName, objectName, fileBuffer, {
      "Content-Type": getContentType(ext),
    });

    console.log("File uploaded successfully to MinIO");

    // Get public URL
    const url = getPublicUrl(bucketName, objectName);

    console.log("Generated public URL:", url);

    return {
      url,
      objectName,
      bucketName,
    };
  } catch (error) {
    console.error("Error uploading file to MinIO:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
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
  const result = await uploadFile(
    fileBuffer,
    originalName,
    BUCKETS.COMMUNITIES,
    "banners"
  );
  return result.url;
};

/**
 * Upload user avatar
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @returns {Promise<String>} - Public URL of uploaded image
 */
const uploadUserAvatar = async (fileBuffer, originalName) => {
  const result = await uploadFile(
    fileBuffer,
    originalName,
    BUCKETS.USER_AVATARS,
    "avatars"
  );
  return result.url;
};

/**
 * Upload post file (image/video)
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original file name
 * @returns {Promise<String>} - Public URL of uploaded file
 */
const uploadPostFile = async (fileBuffer, originalName) => {
  const result = await uploadFile(
    fileBuffer,
    originalName,
    BUCKETS.POST_FILES,
    "posts"
  );
  return result.url;
};

/**
 * Delete a file from MinIO
 * @param {String} bucketName - Bucket name
 * @param {String} objectName - Object name (path)
 * @returns {Promise<void>}
 */
const deleteFile = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
  } catch (error) {
    console.error("Error deleting file from MinIO:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
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

/**
 * Extract object name from URL
 * @param {String} url - Full URL
 * @returns {Object} - { bucketName, objectName }
 */
const extractObjectInfo = (url) => {
  try {
    // If using custom public URL
    if (process.env.MINIO_PUBLIC_URL) {
      const pathAfterDomain = url.replace(process.env.MINIO_PUBLIC_URL + "/", "");
      const [bucketName, ...objectPath] = pathAfterDomain.split("/");
      return {
        bucketName,
        objectName: objectPath.join("/"),
      };
    }
    
    // Parse standard MinIO URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const bucketName = pathParts[0];
    const objectName = pathParts.slice(1).join("/");
    
    return { bucketName, objectName };
  } catch (error) {
    throw new Error("Invalid MinIO URL format");
  }
};

module.exports = {
  uploadFile,
  uploadCommunityBanner,
  uploadUserAvatar,
  uploadPostFile,
  deleteFile,
  extractObjectInfo,
  BUCKETS,
};


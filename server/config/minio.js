const Minio = require("minio");

// MinIO client configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true" || false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

// Bucket names
const BUCKETS = {
  COMMUNITIES: "communities",
  USER_AVATARS: "user-avatars",
  POST_FILES: "post-files",
};

// Initialize buckets (create if they don't exist)
const initializeBuckets = async () => {
  try {
    // Test connection first
    await minioClient.listBuckets();
    
    for (const bucketName of Object.values(BUCKETS)) {
      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName, "us-east-1");
        console.log(`✅ MinIO bucket "${bucketName}" created successfully`);
      }
    }
    console.log("✅ MinIO buckets initialized");
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.warn("⚠️  MinIO server is not running. File uploads will fail until MinIO is started.");
      console.warn("   Start MinIO with: docker run -d -p 9000:9000 -p 9001:9001 --name minio -e 'MINIO_ROOT_USER=minioadmin' -e 'MINIO_ROOT_PASSWORD=minioadmin' minio/minio server /data --console-address ':9001'");
    } else {
      console.error("❌ Error initializing MinIO buckets:", error.message);
    }
    // Don't throw - allow app to start even if MinIO is not available
    // This is useful for development when MinIO might not be running
  }
};

// Get public URL for an object
const getPublicUrl = (bucketName, objectName) => {
  const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
  const port = process.env.MINIO_PORT || 9000;
  const endpoint = process.env.MINIO_ENDPOINT || "localhost";
  
  // If using MinIO with a custom domain/CDN, use that instead
  if (process.env.MINIO_PUBLIC_URL) {
    return `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${objectName}`;
  }
  
  return `${protocol}://${endpoint}:${port}/${bucketName}/${objectName}`;
};

module.exports = {
  minioClient,
  BUCKETS,
  initializeBuckets,
  getPublicUrl,
};


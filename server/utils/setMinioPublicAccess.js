const { minioClient, BUCKETS } = require("../config/minio");

/**
 * Set MinIO buckets to public read access
 * This allows images to be accessed directly via URL
 */
const setMinioPublicAccess = async () => {
  try {
    console.log("Setting MinIO buckets to public read access...");

    // Set policy for each bucket individually
    for (const bucketName of Object.values(BUCKETS)) {
      try {
        // Create a public read policy for this specific bucket
        const publicPolicy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        };

        await minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
        console.log(`✅ Set public access for bucket: ${bucketName}`);
      } catch (error) {
        console.error(`❌ Error setting policy for ${bucketName}:`, error.message);
        console.error("Full error:", error);
      }
    }

    console.log("✅ MinIO public access configured");
    console.log("\n📝 Note: If images still don't load, check:");
    console.log("   1. MinIO server is accessible at http://localhost:9000");
    console.log("   2. No firewall blocking port 9000");
    console.log("   3. Try accessing an image URL directly in browser");
  } catch (error) {
    console.error("❌ Error setting MinIO public access:", error.message);
  }
};

// Run if called directly
if (require.main === module) {
  require("dotenv").config();
  setMinioPublicAccess()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = setMinioPublicAccess;


const { minioClient, BUCKETS, initializeBuckets } = require("../config/minio");

/**
 * Test MinIO connection and bucket operations
 */
const testMinio = async () => {
  try {
    console.log("Testing MinIO connection...");
    console.log("Configuration:", {
      endpoint: process.env.MINIO_ENDPOINT || "localhost",
      port: process.env.MINIO_PORT || 9000,
      accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    });

    // Test connection by listing buckets
    const buckets = await minioClient.listBuckets();
    console.log("✅ MinIO connection successful!");
    console.log("Existing buckets:", buckets.map((b) => b.name));

    // Initialize buckets
    console.log("\nInitializing buckets...");
    await initializeBuckets();

    // Test upload
    const testBucket = BUCKETS.COMMUNITIES;
    const testObjectName = "test/test-file.txt";
    const testContent = Buffer.from("This is a test file");

    console.log(`\nTesting upload to bucket: ${testBucket}`);
    await minioClient.putObject(testBucket, testObjectName, testContent, {
      "Content-Type": "text/plain",
    });
    console.log("✅ Test file uploaded successfully!");

    // Test retrieval
    const dataStream = await minioClient.getObject(testBucket, testObjectName);
    const chunks = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }
    const retrievedContent = Buffer.concat(chunks).toString();
    console.log("✅ Test file retrieved successfully!");
    console.log("Content:", retrievedContent);

    // Clean up
    await minioClient.removeObject(testBucket, testObjectName);
    console.log("✅ Test file deleted");

    console.log("\n✅ All MinIO tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MinIO test failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Run test if called directly
if (require.main === module) {
  require("dotenv").config();
  testMinio();
}

module.exports = testMinio;


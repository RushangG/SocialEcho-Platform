# Troubleshooting MinIO Image Upload

## Issue: Community created but image not stored in MinIO

### Step 1: Test MinIO Connection

Run the test script to verify MinIO is accessible:

```bash
cd server
node utils/testMinio.js
```

This will:
- Test MinIO connection
- List existing buckets
- Create buckets if needed
- Test upload/download/delete operations

### Step 2: Check Server Logs

When you make the request, check the server console for:
- "File received:" - confirms multer received the file
- "Uploading to MinIO..." - confirms upload started
- "Upload successful" - confirms upload completed
- Any error messages

### Step 3: Verify Request Format

Make sure your curl command is correct:

```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/path/to/banner.jpg"
```

**Important:**
- Use `-F` for form-data (not `-d`)
- Use `@` before file path
- File path must be absolute or relative to current directory

### Step 4: Check MinIO Server

1. **Verify MinIO is running:**
```bash
docker ps | grep minio
# or
curl http://localhost:9000/minio/health/live
```

2. **Check MinIO Console:**
   - Open http://localhost:9001
   - Login with minioadmin/minioadmin
   - Check if `communities` bucket exists
   - Check if files are in `communities/banners/` folder

### Step 5: Check Environment Variables

Verify `.env` file has:
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Step 6: Common Issues

#### Issue: "No file uploaded"
- **Cause:** File field name mismatch
- **Solution:** Ensure field name is exactly `banner` in form-data

#### Issue: "Error uploading banner to storage"
- **Cause:** MinIO connection failed
- **Solution:** 
  - Check MinIO server is running
  - Verify credentials in .env
  - Check network connectivity

#### Issue: "Bucket does not exist"
- **Cause:** Buckets not initialized
- **Solution:** Restart server (buckets auto-create on startup)

#### Issue: File received but not uploaded
- **Cause:** MinIO connection error
- **Solution:** Check server logs for detailed error message

### Step 7: Debug Mode

Add this temporary endpoint to test:

```javascript
// In admin.route.js (temporary for debugging)
router.post("/test-upload", bannerUpload, (req, res) => {
  res.json({
    hasFile: !!req.file,
    hasBannerUrl: !!req.bannerUrl,
    bannerUrl: req.bannerUrl,
    fileInfo: req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    } : null,
  });
});
```

Then test with:
```bash
curl -X POST http://localhost:4000/admin/test-upload \
  -F "banner=@/path/to/banner.jpg"
```

### Step 8: Manual MinIO Test

Test MinIO directly:

```bash
# Using MinIO client (mc)
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc ls myminio/communities/banners/
```

Or use the test script:
```bash
node utils/testMinio.js
```

## Expected Behavior

When working correctly, you should see in server logs:
1. "File received:" with file details
2. "Uploading to MinIO..."
3. "Upload successful, banner URL: http://..."
4. Response with banner URL in database

## Still Not Working?

1. Check all server logs for errors
2. Verify MinIO server logs
3. Test MinIO connection separately
4. Check file permissions
5. Verify network/firewall settings


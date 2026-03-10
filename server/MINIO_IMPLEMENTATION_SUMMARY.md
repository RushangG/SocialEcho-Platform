# MinIO Implementation Summary

## ✅ What Has Been Implemented

### 1. **MinIO Configuration** (`config/minio.js`)
- MinIO client setup with environment variables
- Automatic bucket initialization (communities, user-avatars, post-files)
- Public URL generation with support for custom domains/CDN

### 2. **MinIO Service** (`services/minioService.js`)
- `uploadCommunityBanner()` - Upload community banner images
- `uploadUserAvatar()` - Upload user avatars
- `uploadPostFile()` - Upload post files (images/videos)
- `deleteFile()` - Delete files from MinIO
- `extractObjectInfo()` - Extract bucket/object info from URLs

### 3. **Banner Upload Middleware** (`middlewares/admin/bannerUpload.js`)
- Multer configuration with memory storage
- File validation (JPEG, PNG, GIF, WebP)
- 10MB file size limit
- Automatic upload to MinIO

### 4. **Updated Admin Controller**
- `addCommunities` endpoint now supports:
  - File upload via form-data (with banner image)
  - JSON body with banner URL
  - Multiple communities
  - Default data from JSON file

### 5. **Updated Routes**
- `/admin/communities` now includes `bannerUpload` middleware

### 6. **App Initialization**
- MinIO buckets are automatically created on server startup

## 📦 Installed Packages

- `minio` - MinIO client library
- `uuid` - For generating unique file names

## 🔧 Environment Variables Required

Add these to your `.env` file:

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
# Optional:
# MINIO_PUBLIC_URL=http://localhost:9000
```

## 🚀 Quick Start

### 1. Start MinIO Server

**Using Docker:**
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

### 2. Configure Environment
Add MinIO credentials to `.env` file (see above)

### 3. Start Your Server
```bash
npm start
```

The buckets will be created automatically on startup.

## 📝 Usage Examples

### Upload Community with Banner (Form-Data)

**cURL:**
```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/path/to/banner.jpg"
```

**Postman/Thunder Client:**
1. Method: POST
2. URL: `/admin/communities`
3. Body → form-data
4. Add fields:
   - `name`: Gaming (Text)
   - `description`: A community for gamers (Text)
   - `banner`: [Select File] (File)

### Upload Community with Banner URL (JSON)

```json
POST /admin/communities
{
  "communities": {
    "name": "Gaming",
    "description": "A community for gamers",
    "banner": "https://example.com/banner.jpg"
  }
}
```

## 📁 File Structure

```
server/
├── config/
│   └── minio.js                 # MinIO client configuration
├── services/
│   └── minioService.js          # MinIO service functions
├── middlewares/
│   └── admin/
│       └── bannerUpload.js      # Banner upload middleware
├── controllers/
│   └── admin.controller.js      # Updated with file upload support
└── routes/
    └── admin.route.js            # Updated with bannerUpload middleware
```

## 🎯 Next Steps (Optional)

You can extend this implementation to:

1. **Update User Avatar Upload**
   - Modify `middlewares/users/avatarUpload.js` to use MinIO
   - Use `uploadUserAvatar()` from minioService

2. **Update Post File Upload**
   - Modify `middlewares/post/fileUpload.js` to use MinIO
   - Use `uploadPostFile()` from minioService

3. **Add File Deletion**
   - Implement cleanup when communities/users/posts are deleted
   - Use `deleteFile()` from minioService

4. **Add Image Resizing**
   - Integrate sharp or jimp for image optimization
   - Resize before uploading to MinIO

## 🔍 Testing

1. **Test MinIO Connection:**
   - Check server logs for "✅ MinIO buckets initialized"
   - Access MinIO Console at http://localhost:9001

2. **Test File Upload:**
   - Use Postman/Thunder Client to upload a community with banner
   - Verify file appears in MinIO console under `communities` bucket

3. **Test URL Generation:**
   - Check response includes MinIO URL for uploaded banner
   - Verify URL is accessible

## 📚 Documentation Files

- `MINIO_SETUP.md` - Complete MinIO setup guide
- `ADMIN_API_TEST_PAYLOADS.md` - Updated with file upload examples
- `test-payloads.json` - Updated with form-data examples

## ⚠️ Important Notes

1. **File Size Limits:**
   - Community banners: 10MB max
   - Supported formats: JPEG, PNG, GIF, WebP

2. **MinIO Access:**
   - Ensure MinIO server is running before starting the app
   - Buckets are created automatically, but MinIO must be accessible

3. **Production Considerations:**
   - Use SSL/TLS for MinIO
   - Configure proper access policies
   - Set up CDN for public URLs
   - Implement backup strategy

## 🐛 Troubleshooting

**Buckets not created:**
- Check MinIO connection in `.env`
- Verify MinIO server is running
- Check server logs for errors

**Upload fails:**
- Verify file size is under 10MB
- Check file format is supported
- Verify MinIO credentials

**Can't access files:**
- Check `MINIO_PUBLIC_URL` configuration
- Verify MinIO server is accessible
- Check bucket policies


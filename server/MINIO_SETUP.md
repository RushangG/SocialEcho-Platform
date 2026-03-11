# MinIO Setup Guide

This guide explains how to set up and use MinIO for image storage in SocialEcho.

## What is MinIO?

MinIO is a high-performance object storage service compatible with Amazon S3 API. It's used in this project to store:
- Community banner images
- User avatars
- Post files (images/videos)

## Installation

### Option 1: Using Docker (Recommended)

```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

Access MinIO Console at: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

### Option 2: Using Binary

Download from: https://min.io/download

```bash
# Linux
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /data --console-address ":9001"
```

## Environment Variables

Add these to your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Optional: If using a CDN or custom domain
# MINIO_PUBLIC_URL=http://localhost:9000
```

## Buckets

The application automatically creates these buckets on startup:
- `communities` - Stores community banner images
- `user-avatars` - Stores user profile pictures
- `post-files` - Stores post images and videos

## Usage

### Uploading Community Banner

**Using Form-Data (with file upload):**

```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/path/to/banner.jpg"
```

**Using JSON (with URL):**

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

### File Upload Specifications

- **Supported formats**: JPEG, PNG, GIF, WebP
- **Max file size**: 10MB for banners
- **Storage location**: `communities/banners/` bucket

## MinIO Service Functions

The `minioService.js` provides these functions:

### `uploadCommunityBanner(fileBuffer, originalName)`
Uploads a community banner image to MinIO.

### `uploadUserAvatar(fileBuffer, originalName)`
Uploads a user avatar to MinIO.

### `uploadPostFile(fileBuffer, originalName)`
Uploads a post file (image/video) to MinIO.

### `deleteFile(bucketName, objectName)`
Deletes a file from MinIO.

### `extractObjectInfo(url)`
Extracts bucket and object name from a MinIO URL.

## Production Setup

For production, consider:

1. **Use SSL/TLS**: Set `MINIO_USE_SSL=true` and configure certificates
2. **Custom Domain**: Set `MINIO_PUBLIC_URL` to your CDN or domain
3. **Access Policies**: Configure MinIO bucket policies for security
4. **Backup**: Set up regular backups of MinIO data
5. **Monitoring**: Monitor MinIO performance and storage usage

## Troubleshooting

### Buckets not created
- Check MinIO connection settings in `.env`
- Ensure MinIO server is running
- Check console logs for errors

### Upload fails
- Verify MinIO credentials
- Check file size limits
- Ensure bucket exists (should auto-create)

### Can't access uploaded files
- Check `MINIO_PUBLIC_URL` configuration
- Verify MinIO server is accessible
- Check bucket policies

## Testing

Test MinIO connection:

```javascript
const { minioClient, BUCKETS } = require('./config/minio');

// List buckets
minioClient.listBuckets()
  .then(buckets => console.log('Buckets:', buckets))
  .catch(err => console.error('Error:', err));
```

## Migration from Local Storage

If you're migrating from local file storage:

1. Upload existing files to MinIO
2. Update database URLs to point to MinIO
3. Remove old local files
4. Update any hardcoded paths


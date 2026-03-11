# Cloudinary Setup Guide

This guide explains how to set up and use Cloudinary for image storage in SocialEcho.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Automatic image optimization and transformation
- CDN delivery for fast global access
- Automatic format conversion (WebP, AVIF)
- Image resizing and cropping
- Video processing
- Secure uploads

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials

After signing up, you'll be taken to your dashboard. You'll see:
- **Cloud Name**: Your unique cloud name
- **API Key**: Your API key
- **API Secret**: Your API secret (keep this secure!)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important**: Never commit your `.env` file to version control!

## How It Works

### File Upload Flow

1. **User uploads file** → Multer receives file in memory
2. **File buffer** → Converted to base64 data URI
3. **Cloudinary upload** → File uploaded to Cloudinary
4. **Public URL** → Cloudinary returns secure URL
5. **Database** → URL stored in database

### Storage Structure

Files are organized in Cloudinary folders:
- `socialecho/communities/banners/` - Community banner images
- `socialecho/user-avatars/` - User profile pictures
- `socialecho/post-files/` - Post images and videos

### Automatic Optimizations

Cloudinary automatically:
- Optimizes images for web (quality, format)
- Resizes community banners to max 1920x1080
- Crops user avatars to 400x400 with face detection
- Converts formats to modern web formats (WebP, AVIF)
- Delivers via global CDN for fast loading

## Usage Examples

### Upload Community Banner

```javascript
const { uploadCommunityBanner } = require('./services/cloudinaryService');

const bannerUrl = await uploadCommunityBanner(fileBuffer, 'banner.jpg');
// Returns: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/socialecho/communities/banners/uuid.jpg
```

### Upload User Avatar

```javascript
const { uploadUserAvatar } = require('./services/cloudinaryService');

const avatarUrl = await uploadUserAvatar(fileBuffer, 'avatar.png');
// Returns: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/socialecho/user-avatars/uuid.png
```

### Upload Post File

```javascript
const { uploadPostFile } = require('./services/cloudinaryService');

const fileUrl = await uploadPostFile(fileBuffer, 'video.mp4');
// Returns: https://res.cloudinary.com/your-cloud/video/upload/v1234567890/socialecho/post-files/uuid.mp4
```

### Delete File

```javascript
const { deleteFile, extractPublicId } = require('./services/cloudinaryService');

const publicId = extractPublicId(fileUrl);
await deleteFile(publicId, 'image'); // or 'video'
```

## API Endpoints

All existing endpoints work the same way:

- `POST /admin/communities` - Upload community banner
- `POST /users/signup` - Upload user avatar
- `POST /posts` - Upload post files

## Benefits Over MinIO

1. **No Server Setup**: No need to run Docker containers or manage servers
2. **Automatic Optimization**: Images are automatically optimized
3. **CDN Delivery**: Global CDN for fast image delivery
4. **Transformations**: Built-in image transformations (resize, crop, etc.)
5. **Free Tier**: Generous free tier for development
6. **Reliability**: Managed service with high uptime

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- Unlimited transformations
- CDN delivery

For production, consider upgrading to a paid plan.

## Troubleshooting

### Upload Fails

1. **Check credentials**: Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`
2. **Check file size**: Free tier has limits (check Cloudinary dashboard)
3. **Check file format**: Ensure file is a valid image/video format
4. **Check network**: Ensure server can reach Cloudinary API

### Images Not Displaying

1. **Check URL**: Verify the URL is a valid Cloudinary URL
2. **Check permissions**: Cloudinary URLs are public by default
3. **Check CORS**: If loading from frontend, ensure CORS is configured

### Rate Limits

If you hit rate limits:
- Check your Cloudinary dashboard for usage
- Consider upgrading to a paid plan
- Implement caching for frequently accessed images

## Migration from MinIO

If you're migrating from MinIO:

1. **Update environment variables**: Replace MinIO vars with Cloudinary vars
2. **Files are automatically migrated**: New uploads go to Cloudinary
3. **Old files**: Old MinIO URLs will continue to work if MinIO server is still running
4. **Gradual migration**: You can migrate old files to Cloudinary over time

## Security Best Practices

1. **Never commit `.env`**: Keep credentials secret
2. **Use environment variables**: Never hardcode credentials
3. **Restrict uploads**: Validate file types and sizes
4. **Use signed URLs**: For sensitive uploads, use Cloudinary's signed uploads
5. **Set upload presets**: Configure upload presets in Cloudinary dashboard

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Video Transformations](https://cloudinary.com/documentation/video_transformation)




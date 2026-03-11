# Correct cURL Examples for File Upload

## ❌ WRONG - Missing @ symbol

```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=/home/tirth/Pictures/image.png"
```

**Problem:** Without `@`, curl sends the file path as a string, not the file content.

## ✅ CORRECT - With @ symbol

```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/home/tirth/Pictures/image.png"
```

**Note:** The `@` symbol tells curl to read the file and upload its contents.

## More Examples

### Upload with absolute path
```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/home/tirth/Pictures/Screenshots/Screenshot from 2026-02-26 22-28-29.png"
```

### Upload with relative path (from current directory)
```bash
cd /home/tirth/Pictures
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@Screenshots/Screenshot from 2026-02-26 22-28-29.png"
```

### Upload with spaces in filename
```bash
# Use quotes around the path
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/home/tirth/Pictures/Screenshots/Screenshot from 2026-02-26 22-28-29.png"
```

## How to Verify

After uploading, check the response. You should see:

```json
{
  "message": "Communities added successfully",
  "added": 1,
  "skipped": 0,
  "communities": [{
    "_id": "...",
    "name": "Gaming",
    "banner": "http://localhost:9000/communities/banners/uuid-generated-name.png"
  }]
}
```

**If you see a file path instead of a URL**, the file wasn't uploaded correctly.

## Server Logs

When working correctly, you should see in server logs:
```
File received: { originalname: 'Screenshot from 2026-02-26 22-28-29.png', ... }
Uploading to MinIO...
Upload successful, banner URL: http://localhost:9000/communities/banners/...
```

## Using Postman/Thunder Client

1. Select **POST** method
2. URL: `http://localhost:4000/admin/communities`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields:
   - `name`: `Gaming` (Text)
   - `description`: `A community for gamers` (Text)
   - `banner`: Select file (File) - Click and choose your image file

No `@` needed in Postman - it handles file uploads automatically!


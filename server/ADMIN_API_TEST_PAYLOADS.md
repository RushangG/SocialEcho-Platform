# Admin API Test Payloads

This document contains ready-to-use payloads for testing all admin endpoints.

## Authentication

### 1. Admin Sign In
**POST** `/admin/signin`

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessTokenUpdatedAt": "12/25/2024, 10:30:00 AM",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin"
  }
}
```

---

## Admin Management

### 2. Create Admin User
**POST** `/admin/create-admin`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "username": "newadmin",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "Admin user created successfully",
  "admin": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "newadmin"
  }
}
```

---

## Community Management

### 3. Add Communities (Using Default Data)
**POST** `/admin/communities`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "useDefaultData": true
}
```

**Success Response (201):**
```json
{
  "message": "Communities added successfully",
  "added": 10,
  "skipped": 0,
  "communities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Health and Fitness"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Travel"
    }
  ]
}
```

### 4. Add Single Community with Banner Upload (Form-Data)
**POST** `/admin/communities`  
**Headers:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `multipart/form-data`

**Form Data:**
- `name`: "Gaming"
- `description`: "A community for gamers to discuss games, strategies, and gaming news."
- `banner`: [File] (JPEG, PNG, GIF, or WebP, max 10MB)

**Using cURL:**
```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/path/to/banner.jpg"
```

**Using Postman:**
1. Select POST method
2. Enter URL: `/admin/communities`
3. Go to Body tab → Select `form-data`
4. Add fields:
   - `name`: `Gaming` (Text)
   - `description`: `A community for gamers` (Text)
   - `banner`: Select file (File)

**Success Response (201):**
```json
{
  "message": "Communities added successfully",
  "added": 1,
  "skipped": 0,
  "communities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Gaming",
      "banner": "http://localhost:9000/communities/banners/uuid-generated-name.jpg"
    }
  ]
}
```

### 5. Add Single Community (JSON with URL)
**POST** `/admin/communities`  
**Headers:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `application/json`

```json
{
  "communities": {
    "name": "Gaming",
    "description": "A community for gamers to discuss games, strategies, and gaming news.",
    "banner": "https://example.com/gaming-banner.jpg"
  }
}
```

### 6. Add Multiple Communities (Custom)
**POST** `/admin/communities`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "communities": [
    {
      "name": "Photography",
      "description": "A community for photography enthusiasts to share tips and showcase their work.",
      "banner": "https://example.com/photography-banner.jpg"
    },
    {
      "name": "Technology",
      "description": "A community for tech enthusiasts to discuss the latest in technology.",
      "banner": "https://example.com/technology-banner.jpg"
    }
  ]
}
```

---

## Rules Management

### 6. Get All Rules
**GET** `/admin/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

**No body required**

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "rule": "No hate speech or discrimination",
    "description": "Any language that promotes violence or discrimination..."
  },
  {
    "_id": "507f1f77bcf86cd799439016",
    "rule": "No sexually explicit content",
    "description": "Posting nudity or pornography is not allowed."
  }
]
```

### 7. Add Rules (Using Default Data)
**POST** `/admin/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "useDefaultData": true
}
```

**Success Response (201):**
```json
{
  "message": "Moderation rules added successfully",
  "added": 10,
  "skipped": 0,
  "rules": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "rule": "No hate speech or discrimination"
    }
  ]
}
```

### 8. Add Single Rule (Custom)
**POST** `/admin/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "rules": {
    "rule": "No fake news",
    "description": "Sharing false or misleading information is prohibited."
  }
}
```

### 9. Add Multiple Rules (Custom)
**POST** `/admin/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "rules": [
    {
      "rule": "No spam",
      "description": "Repeated posting of the same content is not allowed."
    },
    {
      "rule": "Respect others",
      "description": "Be respectful to other community members."
    }
  ]
}
```

---

## Add Rules to Communities

### 10. Add All Rules to Specific Community
**POST** `/admin/communities/:communityId/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

Replace `:communityId` with actual community ID, e.g., `/admin/communities/507f1f77bcf86cd799439013/rules`

```json
{
  "useAllRules": true
}
```

**Success Response (200):**
```json
{
  "message": "Rules added to community successfully",
  "community": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Health and Fitness"
  },
  "rulesAdded": 10
}
```

### 11. Add Specific Rules to Community
**POST** `/admin/communities/:communityId/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

Replace `:communityId` with actual community ID

```json
{
  "ruleIds": [
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016",
    "507f1f77bcf86cd799439017"
  ]
}
```

### 12. Add All Rules to All Communities
**POST** `/admin/communities/all/rules`  
**Headers:** `Authorization: Bearer <accessToken>`

OR

**POST** `/admin/communities/any-id/rules?all=true`  
**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "useAllRules": true
}
```

**Success Response (200):**
```json
{
  "message": "Rules added to all communities successfully",
  "communitiesUpdated": 10,
  "rulesAdded": 10
}
```

---

## Moderator Management

### 13. Get All Moderators
**GET** `/admin/moderators`  
**Headers:** `Authorization: Bearer <accessToken>`

**No body required**

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439018",
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

### 14. Add Moderator to Community
**PATCH** `/admin/add-moderators?communityId=507f1f77bcf86cd799439013&moderatorId=507f1f77bcf86cd799439018`  
**Headers:** `Authorization: Bearer <accessToken>`

**No body required**

**Success Response (200):**
```json
{
  "message": "Moderator added"
}
```

### 15. Remove Moderator from Community
**PATCH** `/admin/remove-moderators?communityId=507f1f77bcf86cd799439013&moderatorId=507f1f77bcf86cd799439018`  
**Headers:** `Authorization: Bearer <accessToken>`

**No body required**

**Success Response (200):**
```json
{
  "message": "Moderator removed"
}
```

---

## Testing with cURL

### Example: Create Admin
```bash
curl -X POST http://localhost:4000/admin/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "username": "testadmin",
    "password": "test123"
  }'
```

### Example: Add Communities (Default Data)
```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "useDefaultData": true
  }'
```

### Example: Add Community with Banner Upload (Form-Data)
```bash
curl -X POST http://localhost:4000/admin/communities \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Gaming" \
  -F "description=A community for gamers" \
  -F "banner=@/path/to/banner.jpg"
```

### Example: Add Rules (Default Data)
```bash
curl -X POST http://localhost:4000/admin/rules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "useDefaultData": true
  }'
```

### Example: Add All Rules to Community
```bash
curl -X POST http://localhost:4000/admin/communities/COMMUNITY_ID/rules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "useAllRules": true
  }'
```

---

## Testing Workflow

1. **Sign in as admin** → Get access token
2. **Create admin user** (optional, if you need more admins)
3. **Add communities** → Use default data or custom
4. **Add rules** → Use default data or custom
5. **Get all rules** → Get rule IDs
6. **Add rules to communities** → Use rule IDs or useAllRules
7. **Get moderators** → Get moderator IDs
8. **Add moderators to communities** → Use community and moderator IDs

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Username and password are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Community not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error adding communities",
  "error": "Detailed error message"
}
```


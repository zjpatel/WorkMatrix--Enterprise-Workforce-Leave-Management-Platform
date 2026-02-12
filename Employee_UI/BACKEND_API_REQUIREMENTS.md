# Backend API Endpoints Expected by Frontend

## 📌 Image-Related Endpoints

The frontend now expects these backend endpoints to be available:

---

### 1. Upload Images
**Endpoint**: `POST /api/images/upload/{empId}`

**Request**:
```http
POST /api/images/upload/123
Content-Type: multipart/form-data

FormData:
  images: [File, File, File]  // Multiple files with key "images"
```

**Response**:
```json
{
  "message": "Images uploaded successfully",
  "imageIds": [1, 2, 3]
}
```

**Used By**:
- Employee Create/Edit Component
- Employee Profile Component

**When Called**:
- After employee data is saved
- Only if `empId` exists (approved employees)

---

### 2. Get Image by Name
**Endpoint**: `GET /api/images/by-name/{fileName}`

**Request**:
```http
GET /api/images/by-name/employee_123_image1.jpg
```

**Response**:
```
Content-Type: image/jpeg
[Binary image data]
```

**Used By**:
- All components displaying images
- Lazy loading directive

**When Called**:
- When image scrolls into view (lazy loading)
- Cached after first load

---

### 3. Delete Image
**Endpoint**: `DELETE /api/images/{imageId}`

**Request**:
```http
DELETE /api/images/456
```

**Response**:
```json
{
  "message": "Image deleted successfully"
}
```

**Used By**:
- Employee Create/Edit Component
- When user clicks "X" on existing image

---

## 🔄 Employee Endpoints (Already Working)

These endpoints are already functional and unchanged:

### Get Employee by ID
```http
GET /api/employees/{empId}
```

### Get My Profile
```http
GET /api/employees/me
```

### Update My Profile
```http
PUT /api/employees/me
Body: { name, age, gender }
```

### Admin: Get All Users
```http
GET /api/admin/employees
```

### Admin: Get User by ID
```http
GET /api/admin/employees/user/{userId}
```

### Admin: Update User
```http
PUT /api/admin/employees/user/{userId}
Body: { name, age, gender, deptId, status }
```

---

## 📋 Expected Response Format

### Employee Object with Images
```json
{
  "empId": 123,
  "userId": 456,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "gender": "Male",
  "status": "APPROVED",
  "department": "Engineering",
  "deptId": 1,
  "images": [
    {
      "imageId": 1,
      "fileName": "employee_123_image1.jpg",
      "uploadedAt": "2024-01-15T10:30:00"
    },
    {
      "imageId": 2,
      "fileName": "employee_123_image2.jpg",
      "uploadedAt": "2024-01-15T10:30:05"
    }
  ]
}
```

---

## 🔒 Important Backend Requirements

### 1. Image Upload Logic
```java
// Backend should:
1. Accept multiple files with key "images"
2. Validate empId exists
3. Save files to storage
4. Create Image records in database
5. Link images to employee (empId)
6. Return success response
```

### 2. Image Retrieval Logic
```java
// Backend should:
1. Accept fileName as path parameter
2. Find image file in storage
3. Return file as binary stream
4. Set correct Content-Type header
5. Handle file not found (404)
```

### 3. Image Delete Logic
```java
// Backend should:
1. Accept imageId as path parameter
2. Find image record in database
3. Delete file from storage
4. Delete database record
5. Return success response
```

---

## 🎯 Frontend Upload Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. User fills employee form + selects images       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. Click "Save"                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. Frontend: PUT /api/employees/me                  │
│    Body: { name, age, gender }                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. Backend: Save employee data                      │
│    Return: { empId: 123, ... }                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. Frontend: Check if empId exists                  │
│    If YES → proceed to step 6                       │
│    If NO → skip image upload (not approved yet)     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 6. Frontend: POST /api/images/upload/123            │
│    FormData: { images: [File, File] }               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 7. Backend: Save images to storage                  │
│    Link to empId: 123                               │
│    Return: { message: "Success", imageIds: [...] }  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 8. Frontend: Show success message                   │
│    Navigate to employee list                        │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Backend Endpoints

### Test Image Upload
```bash
curl -X POST http://localhost:8080/api/images/upload/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### Test Get Image
```bash
curl http://localhost:8080/api/images/by-name/employee_123_image1.jpg \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output test.jpg
```

### Test Delete Image
```bash
curl -X DELETE http://localhost:8080/api/images/456 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Common Issues

### Issue 1: Images not uploading
**Cause**: Backend endpoint not accepting FormData with key "images"
**Fix**: Ensure backend accepts `@RequestParam("images") MultipartFile[] images`

### Issue 2: Images not displaying
**Cause**: Backend not returning correct Content-Type
**Fix**: Set `Content-Type: image/jpeg` or `image/png` in response

### Issue 3: CORS errors
**Cause**: Backend not allowing image requests from frontend
**Fix**: Add CORS configuration for `/api/images/**`

### Issue 4: 404 on image requests
**Cause**: Image file not found in storage
**Fix**: Verify file path and storage configuration

---

## 🔐 Security Considerations

### File Upload
- ✅ Validate file types (jpg, png, gif only)
- ✅ Limit file size (e.g., 5MB max)
- ✅ Sanitize file names
- ✅ Check user permissions (only owner or admin)

### File Retrieval
- ✅ Validate fileName parameter
- ✅ Prevent path traversal attacks
- ✅ Check user permissions
- ✅ Return 404 for non-existent files

### File Deletion
- ✅ Verify imageId exists
- ✅ Check user owns the image
- ✅ Delete from storage AND database
- ✅ Handle orphaned files

---

## 📊 Expected Backend Behavior

| Scenario | Backend Should |
|----------|----------------|
| Upload to non-existent empId | Return 404 "Employee not found" |
| Upload invalid file type | Return 400 "Invalid file type" |
| Upload file too large | Return 413 "File too large" |
| Get non-existent image | Return 404 "Image not found" |
| Delete non-existent image | Return 404 "Image not found" |
| Unauthorized access | Return 401 "Unauthorized" |

---

## ✅ Checklist for Backend

- [ ] POST `/api/images/upload/{empId}` accepts FormData
- [ ] GET `/api/images/by-name/{fileName}` returns binary image
- [ ] DELETE `/api/images/{imageId}` removes file and record
- [ ] Employee responses include `images` array
- [ ] Image objects have `imageId` and `fileName`
- [ ] CORS configured for image endpoints
- [ ] File validation implemented
- [ ] Error handling returns proper status codes

---

## 🎉 Summary

The frontend now properly:
1. ✅ Uploads images via FormData after employee save
2. ✅ Displays images using `/api/images/by-name/{fileName}`
3. ✅ Deletes images via DELETE endpoint
4. ✅ Handles errors gracefully
5. ✅ Caches images for performance

**No changes needed to existing employee endpoints!**
**Only image-related endpoints need to be verified/implemented.**

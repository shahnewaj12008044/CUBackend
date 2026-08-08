# Image Upload Feature (Cloudinary)

## What Was Done

A file upload system was added using **Cloudinary** (free cloud storage for images and videos). Here's what changed:

### New File
- `src/app/utils/uploadCloudinary.ts` — One function `uploadToCloudinary(buffer, filename, folder)` that uploads a file to Cloudinary and returns the URL.

### Modified Files

| File | What Changed |
|------|-------------|
| `src/app/config/index.ts` | Added Cloudinary env vars |
| `.env` | Added `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| `src/app/module/auth/auth.route.ts` | Added multer middleware for student registration |
| `src/app/module/auth/auth.controller.ts` | Passes file to service |
| `src/app/module/auth/auth.service.ts` | Uploads file and sets `profileImage` URL during registration |
| `src/app/module/student/student.routes.ts` | Added multer middleware for profile update |
| `src/app/module/student/student.controller.ts` | Passes file to service |
| `src/app/module/student/student.service.ts` | Uploads file and sets `profileImage` URL during update |
| `src/app/module/admin/admin.route.ts` | Added multer middleware for register and update |
| `src/app/module/admin/admin.controller.ts` | Passes file to service |
| `src/app/module/admin/admin.service.ts` | Uploads file and sets `profileImg` URL during register/update |

### How It Works

1. Frontend sends file as `multipart/form-data` (along with other fields)
2. Multer catches the file in memory (no disk storage)
3. Service checks if file exists → calls `uploadToCloudinary()` → gets URL
4. URL is saved to the image field (`profileImage` or `profileImg`) in MongoDB

---

## How to Run

### 1. Install dependencies (already done, but just in case)

```bash
npm install cloudinary multer multer-storage-cloudinary
npm install -D @types/multer
```

### 2. Create Cloudinary Account

1. Go to https://cloudinary.com and sign up (free)
2. From Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**

### 3. Set Environment Variables

Add to `.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=CUBackend
```

### 4. Add to Railway

Go to Railway → your project → **Variables** tab → add the same 3 Cloudinary variables.

### 5. Start the Server

```bash
npm run start:dev
```

Server runs at `http://localhost:5000`

---

## How to Test in Postman

### Step 1: Login First (to get token)

For update endpoints, you need a JWT token.

1. **Method:** `POST` → `http://localhost:5000/api/v1/auth/login`
2. **Body** → **raw** → **JSON**:
```json
{
  "email": "your_email",
  "password": "your_password"
}
```
3. Copy the `accessToken` from response.

---

### Step 2: Test Student Registration (with image)

1. **Method:** `POST` → `http://localhost:5000/api/v1/auth/signup/student`
2. **Body** → **form-data**
3. Add these rows:

| Key | Type | Value |
|-----|------|-------|
| `email` | Text | `test@student.com` |
| `password` | Text | `password123` |
| `student` | Text | `{"studentId":"STU-001","name":{"firstName":"John","lastName":"Doe"},"session":"2024","department":"CSE","faculty":"Science","gender":"male"}` |
| `profileImage` | **File** | Click "Select File" → pick any image |

**How to change key type to File:**
- Hover over the key row → you'll see a dropdown on the left side → change from **Text** to **File**

4. Click **Send**
5. In response, you'll see `"profileImage": "https://res.cloudinary.com/..."`

---

### Step 3: Test Student Profile Update (with image)

1. **Method:** `PATCH` → `http://localhost:5000/api/v1/students/me`
2. **Headers:**
   - `Authorization` → `Bearer <your_token>`
3. **Body** → **form-data**
4. Add these rows:

| Key | Type | Value |
|-----|------|-------|
| `bio` | Text | `Hello, I'm a student` |
| `profileImage` | **File** | Click "Select File" → pick any image |

5. Click **Send**
6. Response will show the new Cloudinary URL in `profileImage`

---

### Step 4: Test Admin Profile Update (with image)

1. **Method:** `PATCH` → `http://localhost:5000/api/v1/admin/me`
2. **Headers:**
   - `Authorization` → `Bearer <admin_token>`
3. **Body** → **form-data**
4. Add these rows:

| Key | Type | Value |
|-----|------|-------|
| `admin` | Text | `{"name":{"firstName":"Admin"}}` |
| `profileImg` | **File** | Click "Select File" → pick any image |

5. Click **Send**

---

### Step 5: Test Admin Register via Invite (with image)

1. First, an admin invites someone → gets a token
2. **Method:** `POST` → `http://localhost:5000/api/v1/admin/register`
3. **Body** → **form-data**
4. Add these rows:

| Key | Type | Value |
|-----|------|-------|
| `token` | Text | `<invite_token>` |
| `password` | Text | `password123` |
| `admin` | Text | `{"adminId":"ADM-001","name":{"firstName":"Jane","lastName":"Smith"},"designation":"Professor"}` |
| `profileImg` | **File** | Click "Select File" → pick any image |

5. Click **Send**

---

## Example Success Response

```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "user": { "id": "STU-001", "email": "test@student.com", "role": "student" },
    "student": {
      "name": { "firstName": "John", "lastName": "Doe" },
      "profileImage": "https://res.cloudinary.com/demo/image/upload/v1234567890/profile/1234567890_image.jpg",
      "studentId": "STU-001"
    }
  }
}
```

---

## Supported File Types

| Type | Extensions |
|------|-----------|
| Images | jpg, jpeg, png, gif, webp |
| Videos | mp4, mov, avi, mkv, webm |

**Max file size:** 50MB

---

## Important Notes

- Image upload is **optional** — all endpoints work without sending a file
- Files are stored on Cloudinary (not on your server)
- The URL returned by Cloudinary is permanent and can be used directly in `<img>` tags
- If no `CLOUDINARY_*` env vars are set, the upload will fail with an error

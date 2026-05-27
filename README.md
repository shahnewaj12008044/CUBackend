# COBIANS University Portal — Backend API

> Base URL: `http://localhost:5000` (local) — set `{{Cobians}}` in Postman to switch between environments.

All endpoints are prefixed with `/api/v1`.

All protected routes require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

All responses follow this shape:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Paginated responses include a `meta` object inside `data`:
```json
{
  "success": true,
  "message": "...",
  "data": {
    "meta": { "page": 1, "limit": 10, "total": 4, "totalPage": 1 },
    "result": [ ... ]
  }
}
```

---

## Table of Contents

- [Auth](#auth)
- [Users](#users)
- [Students](#students)
- [Alumni](#alumni)
- [Admin](#admin)
- [Posts](#posts)
- [Query Parameters](#query-parameters)
- [Missing Modules](#missing-modules)

---

## Auth

> Rate limited: 20 requests per window on auth routes.

### Sign Up — Student

**POST** `/auth/signup/student` — Public

```json
{
  "email": "student@gmail.com",
  "password": "123456",
  "student": {
    "studentId": "2023108",
    "name": "Mohammad Hasan",
    "contactNumber": "01755555555",
    "gender": "male",
    "session": "2019-20",
    "department": "CSE",
    "faculty": "Engineering",
    "studyInfo": {
      "currentProgram": "BSc",
      "currentYear": 3,
      "semester": 1
    },
    "socialMedia": [
      { "platform": "github", "link": "https://github.com/username" }
    ],
    "skills": ["JavaScript", "React"],
    "interests": ["Web Development"],
    "bio": "A passionate developer.",
    "profileImage": "https://example.com/photo.jpg",
    "cvLink": "https://example.com/cv.pdf",
    "portfolioLink": "https://portfolio.dev"
  }
}
```

Response `201`:
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "user": { "id": "2023108", "email": "...", "role": "student", "status": "active" },
    "student": { ... }
  }
}
```

---

### Sign Up — Alumni

**POST** `/auth/signup/alumni` — Public

```json
{
  "email": "alumni@cobians.edu",
  "password": "StrongPass123!",
  "alumni": {
    "studentId": "CSE-2011-059",
    "name": "Arif Mahmud",
    "gender": "male",
    "graduationYear": 2015,
    "contactNumber": "01633445566",
    "session": "2010-2011",
    "department": "Computer Science and Engineering",
    "faculty": "Engineering",
    "willingToMentor": true,
    "location": { "country": "Bangladesh", "city": "Sylhet" },
    "portfolioLink": "https://arifmahmud.io",
    "alumniProfile": {
      "alumniCategory": "business",
      "businessInfo": [
        {
          "businessName": "NextGen Soft Ltd",
          "designation": "Founder & CEO",
          "startDate": "2020-03-01",
          "currentlyWorking": true,
          "description": "Building SaaS solutions for SMEs",
          "location": "Sylhet, Bangladesh",
          "website": "https://nextgensoftbd.com"
        }
      ]
    }
  }
}
```

> `alumniCategory` options: `corporate` `research` `academia` `administration` `business` `other`

---

### Sign In

**POST** `/auth/signin` — Public

```json
{
  "email": "student@gmail.com",
  "password": "123456"
}
```

Response `200`:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

> Store the `accessToken` and send it as `Bearer <token>` on all protected routes.

---

### Refresh Token

**POST** `/auth/refresh-token` — Public

Send the refresh token in the request cookie or body. Returns a new access token.

---

### Forgot Password

**POST** `/auth/forgot-password` — Public

```json
{ "email": "student@gmail.com" }
```

Sends a 6-digit OTP to the email. OTP expires in 10 minutes.

---

### Verify OTP

**POST** `/auth/verify-otp` — Public

```json
{
  "email": "student@gmail.com",
  "otp": "123456"
}
```

---

### Reset Password

**POST** `/auth/reset-password` — Public

```json
{
  "email": "student@gmail.com",
  "otp": "123456",
  "newPassword": "newpass123"
}
```

Response `200`:
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": { "message": "Password has been reset successfully" }
}
```

---

## Users

> All user routes require authentication.

### Get All Users

**GET** `/users/` — `admin` only

Returns a paginated list of all users.

---

### Get Single User

**GET** `/users/:userId` — `admin` only

```
GET /users/CSE-2012-009
```

---

### Update User (Admin)

**PATCH** `/users/:userId` — `admin` only

Admin can update `role`, `status`, `isVerified`, `isDeleted`.

```json
{ "isVerified": true }
```

---

### Update My Account

**PATCH** `/users/me/account` — All authenticated users

Any user can update their own email.

```json
{ "email": "newemail@gmail.com" }
```

---

### Change Password

**PATCH** `/users/me/change-password` — All authenticated users

```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

---

### Delete User

**DELETE** `/users/:userId` — `admin` only

```
DELETE /users/CSE-2012-009
```

---

## Students

> All student routes require authentication.

### Get All Students

**GET** `/students/` — `admin`, `alumni`

Supports search and filter via query params (see [Query Parameters](#query-parameters)).

---

### Get Single Student

**GET** `/students/:studentId` — `admin`, `alumni`

```
GET /students/2023108
```

---

### Get My Profile

**GET** `/students/me` — `student` only

Returns the logged-in student's own profile.

---

### Update My Profile

**PATCH** `/students/me` — `student` only

Students can update their own profile. The following fields cannot be updated: `studentId`, `userId`.

```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "skills": ["React", "Node.js", "TypeScript"],
  "socialMedia": [
    { "platform": "linkedin", "link": "https://linkedin.com/in/username" }
  ]
}
```

---

### Update Student (Admin)

**PATCH** `/students/:studentId` — `admin` only

```json
{
  "studyInfo": {
    "currentYear": 4,
    "semester": 2
  }
}
```

---

## Alumni

> All alumni routes require authentication unless stated otherwise.

### Get All Mentors

**GET** `/alumni/mentors` — authenticated

Returns all alumni with `willingToMentor: true`.

Response `200`:
```json
{
  "success": true,
  "message": "Mentors fetched successfully",
  "data": {
    "meta": { "page": 1, "limit": 10, "total": 5, "totalPage": 1 },
    "result": [ ... ]
  }
}
```

---

### Get My Profile

**GET** `/alumni/me` — `alumni` only

Returns the logged-in alumni's own profile.

---

### Update My Profile

**PATCH** `/alumni/me` — `alumni` only

Alumni can update their own profile. Fields that cannot be updated: `studentId`, `userId`, `graduationYear`, `session`, `department`, `faculty`.

```json
{
  "name": "Updated Name",
  "bio": "Senior engineer at Google.",
  "willingToMentor": false,
  "location": { "country": "USA", "city": "San Francisco" },
  "onlinePresence": [
    { "platform": "LinkedIn", "link": "https://linkedin.com/in/username" }
  ],
  "alumniProfile": {
    "alumniCategory": "corporate",
    "corporateInfo": [
      {
        "company": "Google",
        "designation": "Senior Software Engineer",
        "startDate": "2022-01-01",
        "currentlyWorking": true
      }
    ]
  }
}
```

---

### Update My Account (Linked Data)

**PATCH** `/alumni/me/account` — `alumni` only

Updates email or status which live in the User model.

```json
{ "email": "newemail@gmail.com" }
```

---

### Get All Alumni

**GET** `/alumni/` — `admin` only

Supports search and filter via query params.

---

### Get Single Alumni

**GET** `/alumni/:studentId` — `alumni`, `admin`

```
GET /alumni/CSE-2011-059
```

---

### Update Alumni (Admin)

**PATCH** `/alumni/:studentId` — `admin` only

Admin can update any alumni's profile.

---

## Admin

> All admin routes require `admin` role.

### Invite Admin

**POST** `/admins/invite` — `admin` only

```json
{ "email": "newadmin@university.ac.bd" }
```

Sends an invite email with a registration link. Link expires in 24 hours.

> In development, the response also includes `devToken` for testing in Postman.

---

### Register via Invite

**POST** `/admins/register` — Public (token-gated)

```json
{
  "token": "<invite_token_from_email>",
  "password": "securepassword",
  "admin": {
    "name": { "firstName": "Rahman", "lastName": "Chowdhury" },
    "contactNo": "01700000000",
    "emergencyContactNo": "01800000000",
    "designation": "Faculty Admin"
  }
}
```

---

### Get All Admins

**GET** `/admins/` — `admin` only

---

### Get Single Admin

**GET** `/admins/:adminId` — `admin` only

```
GET /admins/ADM-2025-001
```

---

### Update My Admin Profile

**PATCH** `/admins/me` — `admin` only

Admin updates their own profile.

```json
{
  "admin": {
    "name": { "firstName": "Updated" },
    "designation": "Senior Admin",
    "contactNo": "01700000001"
  }
}
```

---

### Delete Admin

**DELETE** `/admins/:adminId` — `admin` only

Soft deletes the admin and their linked user account.

---

### Post Moderation

#### Get All Posts (Admin View)

**GET** `/admin/posts/all` — `admin` only

Returns all posts regardless of status (pending, approved, rejected). Supports pagination.

Response `200`:
```json
{
  "success": true,
  "message": "All posts fetched successfully",
  "data": {
    "meta": { "page": 1, "limit": 10, "total": 4, "totalPage": 1 },
    "result": [ ... ]
  }
}
```

---

#### Get Pending Posts

**GET** `/admin/posts/pending` — `admin` only

Returns only posts with `status: "pending"` waiting for approval.

---

#### Approve Post

**PATCH** `/admin/posts/:postId/approve` — `admin` only

```
PATCH /admin/posts/6a16621b587be80aa9b839a0/approve
```

No request body needed. Records who approved and when.

Response `200`:
```json
{
  "success": true,
  "message": "Post approved successfully",
  "data": {
    "_id": "...",
    "status": "approved",
    "approvedBy": "69f839bbe95da26b12ab17a4",
    "approvedAt": "2026-05-27T03:36:57.654Z"
  }
}
```

---

#### Reject Post

**PATCH** `/admin/posts/:postId/reject` — `admin` only

```json
{ "rejectionReason": "Post contains promotional content that violates community guidelines." }
```

Response `200`:
```json
{
  "success": true,
  "message": "Post rejected successfully",
  "data": {
    "_id": "...",
    "status": "rejected",
    "rejectionReason": "Post contains promotional content..."
  }
}
```

---

#### Delete Any Post (Admin)

**DELETE** `/admin/posts/:postId` — `admin` only

Admin can delete any post. Soft delete.

---

## Posts

> All post routes require authentication.

### Create Post

**POST** `/posts/` — `student`, `alumni`

Post is always created with `status: "pending"`. Admins are notified by email automatically.

```json
{
  "type": "blog",
  "title": "My Journey from COBIANS to Google",
  "description": "After graduating in 2021, I started preparing for big tech interviews...",
  "tags": ["career", "google", "interview"],
  "media": [
    {
      "mediaType": "image",
      "url": "https://example.com/images/offer.jpg",
      "caption": "My offer letter"
    }
  ]
}
```

> `type` options: `blog` `opportunity` `course` `seminar` `general`

> `mediaType` options: `image` `video` `link`

Response `201`:
```json
{
  "success": true,
  "message": "Post created successfully and is pending approval",
  "data": { "_id": "...", "status": "pending", ... }
}
```

---

### Get All Posts

**GET** `/posts/` — `student`, `alumni`, `admin`

Returns only `approved` posts. Supports search and filter via query params.

---

### Get Single Post

**GET** `/posts/:postId` — `student`, `alumni`, `admin`

```
GET /posts/6a16621b587be80aa9b839a0
```

Returns only if the post is `approved`.

---

### Update Post

**PATCH** `/posts/:postId` — `student`, `alumni` (own posts only)

Only the post author can edit. After editing, the post goes back to `status: "pending"` and admins are notified again.

```json
{
  "title": "Updated Title",
  "description": "Updated description with more details.",
  "tags": ["career", "google", "tips", "system-design"]
}
```

Response `200`:
```json
{
  "success": true,
  "message": "Post updated and resubmitted for approval",
  "data": { "_id": "...", "status": "pending", ... }
}
```

---

### Delete Post

**DELETE** `/posts/:postId` — `student`, `alumni` (own posts only)

Authors can only delete their own posts. For deleting any post, admin uses `/admin/posts/:postId`.

Response `200`:
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

---

## Query Parameters

All list endpoints support these query parameters:

| Parameter | Description | Example |
|---|---|---|
| `searchTerm` | Search across text fields | `?searchTerm=google` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Results per page (default: 10) | `?limit=5` |
| `sort` | Sort field, prefix `-` for descending | `?sort=-createdAt` |
| `fields` | Comma-separated fields to include | `?fields=name,email` |

Filter by any field directly:
```
GET /posts?type=opportunity
GET /posts?type=seminar&sort=-createdAt&page=1&limit=5
GET /students?department=CSE&session=2019-20
GET /alumni?faculty=Engineering&willingToMentor=true
```

---

## Missing Modules

The following modules are planned but **not yet implemented**. The frontend team should not build integrations for these yet:

| Module | Status |
|---|---|
| Comments | Not built — separate module planned |
| Reactions (like/love/insightful/support) | Not built — separate module planned |
| Notifications | Not built — email notifications for post approval are working; in-app notifications planned for later |
| Teacher module | Not yet started |

---

## Notes for Frontend

- **Tokens expire in 1 day.** Use the refresh token endpoint to get a new access token silently.
- **Posts are always `pending` after create or edit.** Don't show them in the feed until `status === "approved"`.
- **Alumni email and status** come from the `userId` populate, not directly on the alumni object. Access as `alumni.userId.email`.
- **Rate limiting** is active — auth routes allow 20 requests per window, all other API routes allow 100 requests per 15 minutes. Handle `429 Too Many Requests` gracefully.
- **Soft deletes** — deleted records don't appear in any list response. No need to filter on the frontend.
- The base URL variable in Postman is `{{Cobians}}` — set it to `http://localhost:5000` for local or the deployed URL for production.

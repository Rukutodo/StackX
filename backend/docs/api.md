# StackX Backend API Documentation

This file explains **how to interact with the backend API**.

## 1. API Overview
The StackX API provides RESTful endpoints to manage authentication, services, portfolio projects, careers (jobs/applications), and dashboard statistics for the admin dashboard and public website.

## 2. Base URL
Local Development: `http://localhost:4000`

## 3. Authentication
The API uses JSON Web Tokens (JWT) stored in HTTP-only cookies. After successful login, the `token` cookie is securely set and used for subsequent authenticated requests. Alternatively, pass the token via `Authorization: Bearer <token>` header.

## 4. Request & Response Format
All data is sent and received as JSON (`application/json`), except for image uploads which use `multipart/form-data`.

## 5. Error Handling
Standard HTTP status codes are used to indicate success or failure. Error responses generally follow this format:
```json
{
  "message": "Error description"
}
```

## 6. Rate Limiting
*(Not yet implemented)*

## 7. Endpoints

### Authentication

#### POST /api/auth/login

**Description:**
Authenticate an admin user and set the JWT session cookie.

**Headers:**
*   `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response Example (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64bc1234abcd567890efghij",
    "username": "admin"
  }
}
```

**Cookies Set:**
`token` (HTTP-only)

**Error Responses:**
*   `401 Unauthorized`
```json
{
  "message": "Invalid username or password"
}
```

---

#### POST /api/auth/logout

**Description:**
Logs out the user by clearing the JWT session cookie.

**Response Example (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Services

#### GET /api/services
**Description:** Fetch all active service categories.
**Parameters:** Use `?all=true` to fetch all service categories, including drafts.
**Authentication:** Public (Admin routes pass `?all=true`).

#### POST /api/services
**Description:** Create a new service category.
**Headers:** `Content-Type: application/json`, Cookie: `token` (Requires Admin login)
**Authentication:** Protected

#### PUT /api/services/:id
**Description:** Update an existing service category.
**Authentication:** Protected

#### DELETE /api/services/:id
**Description:** Delete a service category.
**Authentication:** Protected

---

### Portfolio

#### GET /api/portfolio
**Description:** Fetch portfolio projects. Public: returns active + completed projects sorted by `order`. Use `?all=true` to include drafts (for admin).
**Authentication:** Public

**Response Example (200 OK):**
```json
[
  {
    "_id": "64bc...",
    "slug": "communize-vizag",
    "title": "Communize VIZAG",
    "category": "Web Development",
    "description": "Complete digital platform...",
    "image": "/uploads/portfolio/1234.jpg",
    "techStack": ["Next.js", "Node.js"],
    "result": "3x engagement increase",
    "featured": true,
    "status": "completed",
    "order": 1,
    "caseStudy": { "..." }
  }
]
```

#### GET /api/portfolio/:slug
**Description:** Fetch a single portfolio project by its slug. Used for the dynamic case study page.
**Authentication:** Public

#### POST /api/portfolio
**Description:** Create a new portfolio project.
**Authentication:** Protected

**Request Body:**
```json
{
  "slug": "my-project",
  "title": "My Project",
  "category": "Web Development",
  "description": "Project description",
  "image": "/uploads/portfolio/file.jpg",
  "techStack": ["React", "Node.js"],
  "result": "2x faster",
  "featured": false,
  "status": "active",
  "order": 1,
  "caseStudy": null
}
```

#### POST /api/portfolio/upload
**Description:** Upload a project image (max 5MB, jpeg/jpg/png/gif/webp/svg).
**Authentication:** Protected
**Content-Type:** `multipart/form-data` (field name: `image`)

**Response Example (200 OK):**
```json
{
  "url": "/uploads/portfolio/1711000000-123456789.jpg"
}
```

#### PUT /api/portfolio/:id
**Description:** Update an existing portfolio project.
**Authentication:** Protected

#### DELETE /api/portfolio/:id
**Description:** Delete a portfolio project.
**Authentication:** Protected

---

### Careers & Jobs

#### GET /api/jobs
**Description:** Fetch job postings. Public returns active jobs. Use `?all=true` to include drafts and archived jobs (for admin).
**Authentication:** Public

#### POST /api/jobs
**Description:** Create a new job posting.
**Authentication:** Protected

#### PUT /api/jobs/:id
**Description:** Update a job posting.
**Authentication:** Protected

#### DELETE /api/jobs/:id
**Description:** Delete a job posting.
**Authentication:** Protected

#### GET /api/applications
**Description:** Fetch all job applications.
**Authentication:** Protected

#### POST /api/applications
**Description:** Submit a job application. Supports resume upload (max 10MB, pdf/doc/docx).
**Authentication:** Public
**Content-Type:** `multipart/form-data` (field name: `resume`)

#### PUT /api/applications/:id/status
**Description:** Update the status of a job application. Valid statuses: "new", "reviewed", "shortlisted", "rejected".
**Authentication:** Protected

#### DELETE /api/applications/:id
**Description:** Delete a job application.
**Authentication:** Protected

---

### Admin Dashboard

#### GET /api/stats
**Description:** Fetch overview statistics for the admin dashboard. Returns totals for services, projects, jobs, applications, plus recent items for the activity feed.
**Authentication:** Protected

## 8. Example Requests
Using Fetch API:
```javascript
// Login
fetch("http://localhost:4000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password123" })
});

// Fetch portfolio projects
fetch("http://localhost:4000/api/portfolio");

// Upload image
const formData = new FormData();
formData.append("image", file);
fetch("http://localhost:4000/api/portfolio/upload", {
  method: "POST",
  credentials: "include",
  body: formData
});
```

## 9. Static File Serving
Uploaded images are served statically at `/uploads/portfolio/<filename>`.
Full URL example: `http://localhost:4000/uploads/portfolio/1711000000-123456789.jpg`

## 10. Status Codes
*   **200 OK**: Request successful.
*   **201 Created**: Resource created successfully.
*   **400 Bad Request**: Invalid input data or missing file.
*   **401 Unauthorized**: Missing or invalid authentication.
*   **404 Not Found**: Resource not found.
*   **409 Conflict**: Duplicate slug.
*   **500 Internal Server Error**: Server encountered an unexpected condition.

## 11. Pagination
*(Not yet applicable)*

## 12. Versioning
Currently using `v1` natively, though not explicitly defined in the route prefix yet.

## 13. Webhooks
*(None mapping yet)*

## 14. API Change Policy
Subject to change alongside major dashboard updates.

# StackX Frontend API Integration

This document outlines how the StackX frontend interacts with the backend Node.js API.

## 1. Overview
The frontend communicates with a backend server (`http://localhost:4000`) for data persistence. Administrators can manage dynamic content like Services, Portfolio projects, and Careers (Jobs/Applications) from the Admin Dashboard. Statistics for the dashboard are fetched dynamically. Public pages fetch data via server-side rendering (SSR) where applicable.

## 2. Environment Configuration
The base URL for the API should be set via environment variables.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 3. Services Integration
The frontend fetches the list of active services from the backend. This data is rendered on the public `/services` page.

### Fetching Services
**Endpoint:** `GET /api/services`
**Usage:**
Provides a JSON array of `ServiceCategory` objects. The frontend maps this array to display the service offerings. 

*Example Request:*
```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
  cache: "no-store"
});
const services = await response.json();
```

## 4. Portfolio Integration
The frontend fetches portfolio projects from the backend. Data is rendered on the public `/portfolio` page (SSR) and the dynamic `/portfolio/[slug]` case study page.

### Fetching Projects (Public Page)
**Endpoint:** `GET /api/portfolio`
**Usage:** Server-side fetch in `portfolio/page.tsx`, SSR with `cache: "no-store"`. Passes project array to `PortfolioClient` component.

```javascript
const response = await fetch("http://localhost:4000/api/portfolio", {
  cache: "no-store"
});
const projects = await response.json();
```

### Dynamic Case Study Page
**Endpoint:** `GET /api/portfolio/:slug`
**Usage:** Client-side fetch in `portfolio/[slug]/page.tsx`. Renders full case study content (problem, solution, features, result metrics, testimonial) when available.

### Portfolio Images
Uploaded images are served from `http://localhost:4000/uploads/portfolio/<filename>`. The frontend renders these in project cards and case study hero sections.

## 5. Careers Integration
The frontend fetches job postings for the public `/careers` page and handles job application submissions (including file uploads).

### Fetching Jobs
**Endpoint:** `GET /api/jobs`
**Usage:** Server-side fetch in `careers/page.tsx`. Passes jobs to `CareersClient`.

### Submitting an Application
**Endpoint:** `POST /api/applications`
**Usage:** Dispatched from the client component using `FormData` because of the file upload (resume).
**Headers:** Omit `Content-Type` so the browser can automatically set the `multipart/form-data` boundary.

## 6. Admin Dashboard
The admin side of the Next.js application (under `/admin`) handles content management. It integrates securely with the backend using JWT stored in HTTP-only cookies and `Authorization: Bearer <token>` headers.

### Authentication
*   **Login:** `POST /api/auth/login` — Authenticates user and sets the `token` cookie.
*   **Logout:** `POST /api/auth/logout` — Clears the authentication session.

*(Note: Cookies are managed automatically by the browser/Next.js for cross-origin or same-site requests if CORS and credentials are set up properly).*

### Services CRUD
Administrators can perform full CRUD operations on services via the dashboard:
*   `GET /api/services?all=true` — View all services (active & draft).
*   `POST /api/services` — Create a new service.
*   `PUT /api/services/:id` — Update an existing service.
*   `DELETE /api/services/:id` — Delete a service.

### Portfolio CRUD
Administrators can manage portfolio projects and case studies via the dashboard:
*   `GET /api/portfolio?all=true` — View all projects (including drafts).
*   `POST /api/portfolio` — Create a new project.
*   `POST /api/portfolio/upload` — Upload a project image (`multipart/form-data`, field: `image`).
### Careers CRUD
Administrators can manage job postings and applications:
*   `GET /api/jobs?all=true` — View all jobs.
*   `POST /api/jobs` — Create a new job.
*   `PUT /api/jobs/:id` — Update a job.
*   `DELETE /api/jobs/:id` — Delete a job.
*   `GET /api/applications` — Fetch all applications.
*   `PUT /api/applications/:id/status` — Update application status.
*   `DELETE /api/applications/:id` — Delete application.

### Dashboard Stats
*   `GET /api/stats` — Fetches live counts and recent activity to render the Admin Dashboard Overview.

## 7. Future Integrations
*   **Consultation & Contact Forms:** Connecting to a mailing service (Resend, NodeMailer) or a simple backend route.
*   **Testimonials:** Will be migrated from static arrays to dynamic API fetches.


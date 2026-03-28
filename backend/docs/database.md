# StackX Database Documentation

This file explains **how data is structured and related**.

## 1. Database Overview
The database stores authentication records and content management data (services, portfolio projects) for the StackX platform backend.

## 2. Database Technology
*   **Engine:** MongoDB
*   **ODM:** Mongoose
*   **Hosting:** MongoDB Atlas

## 3. Database Architecture
Document-based NoSQL architecture. Collections are unstructured natively but enforced via Mongoose Schemas.

## 4. Entity Relationship Diagram (ERD)
```
adminusers
├── username (unique)
└── password (hashed)

servicecategories
├── slug (unique)
├── items[] (embedded accordion items)
└── caseStudy (embedded, optional)

portfolioprojects
├── slug (unique)
├── techStack[]
└── caseStudy (embedded, optional)
    ├── features[]
    ├── results[] (embedded metrics)
    └── testimonial (embedded)

jobpostings
├── title
├── status
└── requirements[]

jobapplications
├── email
├── position
├── resume
└── status
```

## 5. Collections
Currently implemented:
*   `adminusers` — Stores dashboard administrators.
*   `servicecategories` — Stores the service offerings and their details.
*   `portfolioprojects` — Stores portfolio projects and case studies.
*   `jobpostings` — Stores available career opportunities.
*   `jobapplications` — Stores submitted applications and applicant data.

## 6. Table / Collection Documentation Structure

### Collection: `adminusers`

**Purpose:**
Stores admin account information for authenticating with the backend.

**Fields:**
*   `_id` (ObjectId) - Primary key, generated automatically by MongoDB.
*   `username` (String) - Unique username for the account. **Required**.
*   `password` (String) - Encrypted password (hashed via Bcrypt). **Required**.
*   `createdAt` (Date) - Timestamp of when the document was created.
*   `updatedAt` (Date) - Timestamp of when the document was last updated.

**Indexes:**
*   `username` (Unique index)

**Data Validation Rules:**
*   `username` must be trimmed of whitespace and be strictly unique.
*   Passwords are automatically salted and hashed before saving.

---

### Collection: `servicecategories`

**Purpose:**
Stores available platform services displayed on the frontend and managed via the admin dashboard.

**Fields:**
*   `_id` (ObjectId) - Primary key.
*   `slug` (String) - Unique URL-friendly identifier. **Required**.
*   `title` (String) - Display title of the service. **Required**.
*   `icon` (String) - React icon identifier. Defaults to "HiCode".
*   `tagline` (String) - Short description or catchphrase. **Required**.
*   `pricing` (String) - Pricing info (e.g., "$3,000"). **Required**.
*   `techStack` (Array of Strings) - Technologies used for the service.
*   `items` (Array of Objects) - Details for the expandable accordion.
    *   `title` (String) - Accordion item heading.
    *   `desc` (String) - Accordion item content.
*   `caseStudy` (Object) - Link to a related success story.
    *   `title` (String) - Title of case study.
    *   `href` (String) - URL for case study.
*   `status` (String) - Enum: "active" | "draft". Defaults to "active".
*   `order` (Number) - Array position for sorting. Defaults to 0.
*   `createdAt` / `updatedAt` (Date) - Tracking timestamps.

**Indexes:**
*   `slug` (Unique index)

**Data Validation Rules:**
*   `slug` must be globally unique and lowercase without spaces.

---

### Collection: `portfolioprojects`

**Purpose:**
Stores portfolio projects and detailed case studies, displayed on the public portfolio page and managed via the admin dashboard. Supports image uploads.

**Fields:**
*   `_id` (ObjectId) - Primary key.
*   `slug` (String) - Unique URL-friendly identifier (lowercase, trimmed). **Required**.
*   `title` (String) - Project display name. **Required**.
*   `category` (String) - Project category (e.g., "Web Development", "Automation", "Ad Tech"). **Required**.
*   `description` (String) - Short project summary. **Required**.
*   `image` (String) - Path to uploaded thumbnail (e.g., `/uploads/portfolio/filename.jpg`). Defaults to `""`.
*   `techStack` (Array of Strings) - Technologies used.
*   `result` (String) - Key metric (e.g., "3x engagement increase").
*   `featured` (Boolean) - Whether to show a featured badge. Defaults to `false`.
*   `status` (String) - Enum: "active" | "completed" | "draft". Defaults to "active".
*   `order` (Number) - Sort order. Defaults to 0.
*   `caseStudy` (Embedded Object, optional) - Full case study content:
    *   `subtitle` (String) - Badge text (e.g., "Case Study — Web Development").
    *   `overview` (String) - Detailed project description.
    *   `problem` (String) - The client's challenge.
    *   `solution` (String) - How StackX solved it.
    *   `features` (Array of Strings) - Key features delivered.
    *   `results` (Array of Objects) - Measurable outcomes:
        *   `metric` (String) - e.g., "3x". **Required**.
        *   `label` (String) - e.g., "Engagement Increase". **Required**.
    *   `testimonial` (Embedded Object, optional) - Client quote:
        *   `name` (String) - Client name. **Required**.
        *   `company` (String) - Company name. **Required**.
        *   `feedback` (String) - Quote text. **Required**.
        *   `rating` (Number) - 1–5 star rating. Defaults to 5.
        *   `projectType` (String) - e.g., "Web Development".
*   `createdAt` / `updatedAt` (Date) - Tracking timestamps.

**Indexes:**
*   `slug` (Unique index)

**Data Validation Rules:**
*   `slug` must be globally unique, lowercase, and trimmed.
*   `status` must be one of: "active", "completed", "draft".
*   `testimonial.rating` must be between 1 and 5.

**Uploaded Files:**
*   Project images are stored in `backend/uploads/portfolio/` and served statically via Express at `/uploads/portfolio/`.

---

### Collection: `jobpostings`

**Purpose:**
Stores career opportunities displayed on the public jobs page and managed by admins.

**Fields:**
*   `_id` (ObjectId) - Primary key.
*   `title` (String) - Job title. **Required**.
*   `department` (String) - e.g., "Engineering", "Design". **Required**.
*   `type` (String) - e.g., "Full-time", "Contract". **Required**.
*   `location` (String) - e.g., "Remote", "New York". **Required**.
*   `description` (String) - Full job description. **Required**.
*   `requirements` (Array of Strings) - List of qualifications/skills.
*   `status` (String) - Enum: "active" | "draft" | "archived". Defaults to "active".
*   `order` (Number) - Sort order. Defaults to 0.
*   `createdAt` / `updatedAt` (Date) - Tracking timestamps.

---

### Collection: `jobapplications`

**Purpose:**
Stores submissions from job applicants along with uploaded resumes.

**Fields:**
*   `_id` (ObjectId) - Primary key.
*   `fullName` (String) - Applicant's name. **Required**.
*   `email` (String) - Applicant's email. **Required**.
*   `phone` (String) - Applicant's phone number. **Required**.
*   `position` (String) - Job title applied for. **Required**.
*   `experience` (String) - Years of experience.
*   `resume` (String) - Path to uploaded resume (e.g., `/uploads/resumes/filename.pdf`).
*   `portfolioLink` (String) - Applicant's portfolio URL.
*   `linkedIn` (String) - Applicant's LinkedIn URL.
*   `coverLetter` (String) - Custom cover letter text. **Required**.
*   `status` (String) - Enum: "new" | "reviewed" | "shortlisted" | "rejected". Defaults to "new".
*   `createdAt` / `updatedAt` (Date) - Tracking timestamps.

**Uploaded Files:**
*   Resumes are stored in `backend/uploads/resumes/` and served statically via Express at `/uploads/resumes/`.

## 7. Relationships Between Tables
*   `servicecategories.caseStudy.href` may reference a `portfolioprojects.slug` via URL (e.g., `/portfolio/communize-vizag`), but there is no foreign key constraint.

## 8. Indexes
*   `AdminUser.username`_1 (Unique)
*   `ServiceCategory.slug`_1 (Unique)
*   `PortfolioProject.slug`_1 (Unique)

## 9. Migrations / Schema Changes
MongoDB doesn't use rigid migrations like SQL. Schema additions are made directly in Mongoose models. Ensure default values are provided for backwards compatibility if adding new required fields.

## 10. Data Access Patterns
*   `adminusers`: `findOne({ username })` for login authentication.
*   `servicecategories`: `find({ status })` for listing, sorted by `order`.
*   `portfolioprojects`: `find({ status })` for listing, sorted by `order`. `findOne({ slug })` for case study pages.
*   `jobpostings`: `find({ status })` for listing, sorted by `order`.
*   `jobapplications`: `find()` for admin views, filtered by standard application fields.

## 11. Backup & Recovery Strategy
Managed via MongoDB Atlas automated cloud backups.

## 12. Performance Considerations
*   `adminusers` lookups remain fast via the `username` index.
*   `servicecategories` and `portfolioprojects` benefit from `slug` unique indexes for fast lookups.
*   Portfolio image files are stored on disk, not in MongoDB, to avoid bloating the database.

## 13. Security Considerations
*   Never retrieve or expose `password` in API responses.
*   Mongoose handles basic NoSQL injection prevention via strict schema validation.
*   Connection requires SSL/TLS via MongoDB Atlas.
*   Image uploads are limited to 5MB and filtered by file extension (jpeg, jpg, png, gif, webp, svg).

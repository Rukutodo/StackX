# StackX Backend

## 1. Project Title
StackX Backend API

## 2. Project Description
The backend server for the StackX platform, handling authentication and admin functionalities for the dashboard — managing services, portfolio projects, and case studies. Built with Node.js, Express, and MongoDB.

## 3. Demo / Screenshots
*(Coming soon)*

## 4. Features
*   JWT-based Authentication
*   Secure HTTP-only cookie session management
*   Bcrypt password hashing
*   MongoDB integration with Mongoose ODM
*   CORS enabled for specific frontends
*   Portfolio project management with case study support
*   Careers management (Job postings and applications)
*   Admin dashboard statistics aggregation
*   Image and resume upload via Multer (stored on disk, served statically)

## 5. Tech Stack
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Auth:** JSON Web Tokens (JWT), bcryptjs
*   **Upload:** Multer (disk storage)
*   **Security:** CORS, Cookie Parser

## 6. Project Structure
```
backend/
├── src/
│   ├── config/       # Configuration (db.ts)
│   ├── middlewares/  # Auth middleware (authMiddleware.ts)
│   ├── models/       # Mongoose Schemas
│   │   ├── AdminUser.ts
│   │   ├── ServiceCategory.ts
│   │   ├── PortfolioProject.ts
│   │   ├── JobPosting.ts
│   │   └── JobApplication.ts
│   ├── routes/       # Express API routes
│   │   ├── auth.ts
│   │   ├── services.ts
│   │   ├── portfolio.ts
│   │   ├── jobs.ts
│   │   ├── applications.ts
│   │   └── stats.ts
│   ├── seed.ts       # Database seeding script
│   └── server.ts     # Main application entry point
├── uploads/          # Uploaded files (images/resumes)
│   ├── portfolio/    # Portfolio project images
│   └── resumes/      # Job applicant resumes
├── docs/             # Documentation (API, Database)
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript config
```

## 7. Installation
1.  Clone the repository and go to the backend folder: `cd backend`
2.  Install dependencies: `npm install`

## 8. Environment Variables
Create a `.env` file in the root of the `backend` folder with the following keys:
```env
PORT=4000
MONGO_URI=mongodb+srv://admin_db_user:<password>@cluster0.n0zaaik.mongodb.net/stackx
JWT_SECRET=your_super_secret_jwt_key
```

## 9. Running the Project
*   Development: `npm run dev`
*   Seed database: `npx ts-node src/seed.ts`

## 10. Build for Production
*   Compile TypeScript: `npx tsc`
*   Start compiled code: `node dist/server.js`

## 11. API Overview (short)
*   `POST /api/auth/login` — Authenticate admin user
*   `POST /api/auth/logout` — Clear authentication cookie
*   `GET /api/services` — Fetch active service categories (`?all=true` for drafts)
*   `POST /api/services` — Create a new service category (Protected)
*   `PUT /api/services/:id` — Update a service category (Protected)
*   `DELETE /api/services/:id` — Delete a service category (Protected)
*   `GET /api/portfolio` — Fetch portfolio projects (`?all=true` for drafts)
*   `GET /api/portfolio/:slug` — Fetch single project by slug
*   `POST /api/portfolio` — Create a new project (Protected)
*   `POST /api/portfolio/upload` — Upload project image (Protected, multipart)
*   `PUT /api/portfolio/:id` — Update a project (Protected)
*   `DELETE /api/portfolio/:id` — Delete a project (Protected)
*   `GET /api/jobs` — Fetch job postings (`?all=true` for admin)
*   `POST /api/jobs` — Create a job posting (Protected)
*   `PUT /api/jobs/:id` — Update a job posting (Protected)
*   `DELETE /api/jobs/:id` — Delete a job posting (Protected)
*   `GET /api/applications` — Fetch all job applications (Protected)
*   `POST /api/applications` — Submit a job application (Public, multipart)
*   `PUT /api/applications/:id/status` — Update application status (Protected)
*   `DELETE /api/applications/:id` — Delete an application (Protected)
*   `GET /api/stats` — Fetch overview stats for the admin dashboard (Protected)

> For comprehensive documentation, see [docs/api.md](docs/api.md)

## 12. Testing
*(Coming soon)*

## 13. Deployment
*(Coming soon)*

## 14. Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) if available.

## 15. License
ISC License

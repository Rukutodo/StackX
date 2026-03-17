# StackX Backend

## 1. Project Title
StackX Backend API

## 2. Project Description
The backend server for the StackX platform, handling authentication and future admin functionalities for the dashboard. Built with Node.js, Express, and MongoDB.

## 3. Demo / Screenshots
*(Coming soon)*

## 4. Features
*   JWT-based Authentication
*   Secure HTTP-only cookie session management
*   Bcrypt password hashing
*   MongoDB integration with Mongoose ODM
*   CORS enabled for specific frontends

## 5. Tech Stack
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Auth:** JSON Web Tokens (JWT), bcryptjs
*   **Security:** CORS, Cookie Parser

## 6. Project Structure
```
backend/
├── src/
│   ├── config/       # Configuration (e.g., db.ts)
│   ├── models/       # Mongoose Schemas (e.g., AdminUser.ts)
│   ├── routes/       # Express API routes (e.g., auth.ts)
│   ├── seed.ts       # Database seeding script
│   └── server.ts     # Main application entry point
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
*   `POST /api/auth/login` - Authenticate admin user
*   `POST /api/auth/logout` - Clear authentication cookie

> For comprehensive documentation, see [docs/api.md](docs/api.md)

## 12. Testing
*(Coming soon)*

## 13. Deployment
*(Coming soon)*

## 14. Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) if available.

## 15. License
ISC License

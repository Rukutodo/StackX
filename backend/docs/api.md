# StackX Backend API Documentation

This file explains **how to interact with the backend API**.

## 1. API Overview
The StackX API provides RESTful endpoints to manage authentication and interactions for the admin dashboard.

## 2. Base URL
Local Development: `http://localhost:4000`

## 3. Authentication
The API uses JSON Web Tokens (JWT) stored in HTTP-only cookies. After successful login, the `token` cookie is securely set and used for subsequent authenticated requests.

## 4. Request & Response Format
All data is sent and received as JSON (`application/json`).

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
### POST /api/auth/login

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

**Query Parameters:**
None

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
*   `500 Internal Server Error`

---

### POST /api/auth/logout

**Description:**
Logs out the user by clearing the JWT session cookie.

**Headers:**
None required

**Request Body:**
None

**Response Example (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

## 8. Example Requests
Using Fetch API:
```javascript
fetch("http://localhost:4000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password123" })
});
```

## 9. Example Responses
See Endpoints section above.

## 10. Status Codes
*   **200 OK**: Request successful.
*   **400 Bad Request**: Invalid input data.
*   **401 Unauthorized**: Missing or invalid authentication.
*   **500 Internal Server Error**: Server encountered an unexpected condition.

## 11. Pagination
*(Not yet applicable)*

## 12. Versioning
Currently using `v1` natively, though not explicitly defined in the route prefix yet.

## 13. Webhooks
*(None mapping yet)*

## 14. API Change Policy
Subject to change alongside major dashboard updates.

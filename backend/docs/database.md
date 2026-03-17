# StackX Database Documentation

This file explains **how data is structured and related**.

## 1. Database Overview
The database stores authentication records and future platform data for the StackX backend.

## 2. Database Technology
*   **Engine:** MongoDB
*   **ODM:** Mongoose
*   **Hosting:** MongoDB Atlas

## 3. Database Architecture
Document-based NoSQL architecture. Collections are unstructured natively but enforced via Mongoose Schemas.

## 4. Entity Relationship Diagram (ERD)
*(Coming soon as more collections are added)*

## 5. Collections
Currently implemented:
*   `adminusers` - Stores dashboard administrators.

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

## 7. Relationships Between Tables
*(No multi-collection relationships established yet)*

## 8. Indexes
*   `AdminUser.username`_1 (Unique)

## 9. Migrations / Schema Changes
MongoDB doesn't use rigid migrations like SQL. Schema additions are made directly in Mongoose models. Ensure default values are provided for backwards compatibility if adding new required fields.

## 10. Data Access Patterns
Queries predominantly focus on `findOne({ username })` for login authentication.

## 11. Backup & Recovery Strategy
Managed via MongoDB Atlas automated cloud backups.

## 12. Performance Considerations
As the dataset grows, `adminusers` lookups will remain fast via the `username` index.

## 13. Security Considerations
*   Never retrieve or expose `password` in API responses.
*   Mongoose handles basic NoSQL injection prevention via strict schema validation.
*   Connection requires SSL/TLS via MongoDB Atlas.

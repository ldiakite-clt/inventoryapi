# Inventory Management API

A Node.js REST API for tracking personal inventory items, categories, and storage locations.

## Live Links
- **API Root:** https://inventoryapi-6cew.onrender.com
- **API Health**: https://inventoryapi-6cew.onrender.com/health
- **API Documentation:** https://inventoryapi-6cew.onrender.com/api-docs

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT with bcrypt hashing

## Local Setup
1. Clone the repository and run `npm install`.
2. Configure your `.env` file with `DATABASE_URL` and `JWT_SECRET`.
3. Sync the database: `npx prisma db push`.
4. Seed test data: `npm run seed:dev`.
5. Start the server: `npm run dev`.

## API Resources
- **Auth:** Signup and Login endpoints.
- **Items:** Full CRUD with search and pagination (Ownership required for updates).
- **Categories:** Groupings for inventory organization.
- **Locations:** Physical storage tracking.
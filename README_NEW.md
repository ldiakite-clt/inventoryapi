# Inventory Management API

A comprehensive REST API for managing personal inventory with user authentication, item categorization, and storage location tracking.

## Features

- **User Authentication:** JWT-based authentication with bcrypt password hashing
- **Role-Based Access:** Support for USER and ADMIN roles
- **Ownership-Based Authorization:** Users can only modify their own resources
- **Full CRUD Operations:** Complete Create, Read, Update, Delete functionality for:
  - Items (inventory entries)
  - Categories (item groupings)
  - Locations (storage locations)
- **Search & Sorting:** Search items by name/description and sort by various fields
- **Swagger/OpenAPI Documentation:** Interactive API documentation at `/api-docs`
- **Database Seeding:** Pre-populated test data with multiple user accounts
- **Production-Ready:** Configured for deployment to Render

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Documentation:** Swagger UI + OpenAPI 3.0

## Project Structure

```
inventory-api/
├── src/
│   ├── server.js                 # Main application entry point
│   ├── config/
│   │   └── db.js                 # Database connection setup
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── categoryController.js
│   │   └── locationController.js
│   ├── services/                 # Business logic layer
│   │   ├── authService.js
│   │   ├── itemService.js
│   │   ├── categoryService.js
│   │   └── locationService.js
│   ├── repositories/             # Database access layer
│   │   ├── userRepo.js
│   │   ├── itemRepo.js
│   │   ├── categoryRepo.js
│   │   └── locationRepo.js
│   ├── routes/                   # Route definitions
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── locationRoutes.js
│   └── middleware/               # Express middleware
│       ├── authMiddleware.js
│       ├── authorizationMiddleware.js
│       ├── handleValidationErrors.js
│       ├── validateAuth.js
│       ├── validateItem.js
│       ├── validateCategory.js
│       └── validateLocation.js
├── prisma/
│   ├── schema.prisma             # Prisma data model
│   └── seed.js                   # Database seeding script
├── docs/
│   └── openapi.yaml              # OpenAPI specification
├── .env.example                  # Environment variables template
├── package.json
├── TESTING.md                    # Comprehensive testing plan
├── DEPLOYMENT.md                 # Deployment instructions
└── README.md                     # This file
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/inventory-api.git
   cd inventory-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://localhost:5432/inventory_db"
   JWT_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

4. **Create database:**
   ```bash
   createdb inventory_db
   ```

5. **Run migrations:**
   ```bash
   npm run migrate:dev
   ```

6. **Seed the database:**
   ```bash
   npm run seed:dev
   ```

7. **Start the server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run dev                 # Start dev server with auto-reload

# Production
npm start                   # Start production server
npm run migrate:deploy      # Apply migrations in production
npm run seed:prod           # Seed production database

# Database
npm run migrate:dev         # Create and apply migrations locally
npm run seed:dev            # Seed local database

# Prisma
npx prisma studio          # Open Prisma Studio GUI
npx prisma generate        # Generate Prisma Client
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in and receive JWT token

### Items

- `GET /api/items` - Get all items (supports search, sort, pagination)
- `GET /api/items/:id` - Get a single item
- `POST /api/items` - Create a new item (requires auth)
- `PUT /api/items/:id` - Update an item (owner only)
- `DELETE /api/items/:id` - Delete an item (owner only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a single category
- `POST /api/categories` - Create a new category (requires auth)
- `PUT /api/categories/:id` - Update a category (owner only)
- `DELETE /api/categories/:id` - Delete a category (owner only)

### Locations

- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get a single location
- `POST /api/locations` - Create a new location (requires auth)
- `PUT /api/locations/:id` - Update a location (owner only)
- `DELETE /api/locations/:id` - Delete a location (owner only)

### Health Check

- `GET /health` - API health status

## API Documentation

Interactive Swagger documentation is available at `/api-docs`:

```
http://localhost:3000/api-docs
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. To access protected endpoints:

1. **Sign up or log in** to get an access token:
   ```bash
   POST /api/auth/login
   ```

2. **Include the token** in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Test Credentials (from seed data)

| Email | Password | Role |
|-------|----------|------|
| owner@example.com | Password123! | USER |
| not-owner@example.com | Password123! | USER |
| admin@example.com | AdminPass123! | ADMIN |

## Testing

A comprehensive testing plan is available in [TESTING.md](./TESTING.md).

The plan includes step-by-step instructions for testing:
- Authentication endpoints
- Item CRUD operations
- Category management
- Location management
- Authorization and ownership validation
- Error handling

All tests should be performed using the Swagger UI at `/api-docs`.

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Render

1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Create Web Service on Render with:
   - Build command: `npm install`
   - Start command: `npm run migrate:deploy && npm run seed:prod && npm start`
4. Set environment variables: `DATABASE_URL`, `JWT_SECRET`
5. Deploy

## Database Schema

The database consists of four main models:

### User
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (USER or ADMIN)
- `createdAt`

### Item
- `id` (Primary Key)
- `name` (Required)
- `description` (Optional)
- `quantity` (Default: 1)
- `userId` (Foreign Key)
- `categoryId` (Foreign Key)
- `locationId` (Foreign Key)
- `createdAt`

### Category
- `id` (Primary Key)
- `name` (Required)
- `userId` (Foreign Key)
- `createdAt`

### Location
- `id` (Primary Key)
- `name` (Required)
- `userId` (Foreign Key)
- `createdAt`

## Authorization

The API implements two levels of authorization:

1. **Authentication:** Users must be logged in to access protected endpoints
2. **Ownership:** Users can only modify resources they own

Example:
- Any user can GET items, categories, and locations (public endpoints)
- Only authenticated users can POST new resources
- Only the owner can PUT/DELETE their own resources

## Error Handling

The API returns appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (authorization failed) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email, items in category) |
| 500 | Internal Server Error |

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

# JWT Secret (should be a strong, random string)
JWT_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# Server
PORT=3000
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly using Swagger UI
4. Commit and push
5. Create a pull request

## License

ISC

## Support

For issues or questions, please create an issue in the GitHub repository.

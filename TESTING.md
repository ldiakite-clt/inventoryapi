# Inventory Management API - Testing Plan

This document provides a comprehensive step-by-step testing guide for all API endpoints using Swagger UI. All tests should be performed using the Swagger UI interface at `/api-docs`.

## Test Users

Before starting, note these test credentials created by the seed script:

**Owner Account:**
- Email: `owner@example.com`
- Password: `Password123!`

**Non-Owner Account:**
- Email: `not-owner@example.com`
- Password: `Password123!`

**Admin Account:**
- Email: `admin@example.com`
- Password: `AdminPass123!`

---

## Section 1: Authentication

### 1.1 POST /api/auth/signup - User Registration

#### Success Case (201 Created)

1. Navigate to `/api-docs`
2. Find POST `/api/auth/signup` endpoint
3. Click "Try it out"
4. Enter the following JSON in the request body:
   ```json
   {
     "email": "newuser@example.com",
     "password": "TestPassword123!"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 201 Created with user object containing `id`, `email`, and `role: "USER"`

#### 400 Bad Request - Missing Email

1. Click "Try it out" on POST `/api/auth/signup`
2. Enter request body:
   ```json
   {
     "password": "TestPassword123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with error message about missing email

#### 400 Bad Request - Invalid Email Format

1. Click "Try it out" on POST `/api/auth/signup`
2. Enter request body:
   ```json
   {
     "email": "not-an-email",
     "password": "TestPassword123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with error message about invalid email format

#### 400 Bad Request - Password Too Short

1. Click "Try it out" on POST `/api/auth/signup`
2. Enter request body:
   ```json
   {
     "email": "user@example.com",
     "password": "short"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with error message about password length

#### 409 Conflict - Email Already Exists

1. Click "Try it out" on POST `/api/auth/signup`
2. Enter request body:
   ```json
   {
     "email": "owner@example.com",
     "password": "AnotherPassword123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 409 Conflict with message about email already existing

---

### 1.2 POST /api/auth/login - User Login

#### Success Case (200 OK)

1. Navigate to `/api-docs`
2. Find POST `/api/auth/login` endpoint
3. Click "Try it out"
4. Enter request body:
   ```json
   {
     "email": "owner@example.com",
     "password": "Password123!"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 200 OK with `accessToken` (JWT token)
7. **IMPORTANT:** Copy the entire `accessToken` value (without quotes)

#### 400 Bad Request - Missing Email

1. Click "Try it out" on POST `/api/auth/login`
2. Enter request body:
   ```json
   {
     "password": "Password123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request

#### 401 Unauthorized - Invalid Password

1. Click "Try it out" on POST `/api/auth/login`
2. Enter request body:
   ```json
   {
     "email": "owner@example.com",
     "password": "WrongPassword123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 401 Unauthorized with "Invalid email or password"

#### 401 Unauthorized - User Not Found

1. Click "Try it out" on POST `/api/auth/login`
2. Enter request body:
   ```json
   {
     "email": "nonexistent@example.com",
     "password": "Password123!"
   }
   ```
3. Click "Execute"
4. **Expected Response:** 401 Unauthorized with "Invalid email or password"

---

## Section 2: Items Endpoints

### 2.1 GET /api/items - Retrieve All Items

#### Success Case (200 OK, Public)

1. Find GET `/api/items` endpoint
2. Click "Try it out"
3. Leave all parameters empty (or set defaults)
4. Click "Execute"
5. **Expected Response:** 200 OK with array of items (should include pre-seeded items)

#### With Search Parameter

1. Click "Try it out" on GET `/api/items`
2. In the `search` parameter, enter: `USB`
3. Click "Execute"
4. **Expected Response:** 200 OK with filtered items containing "USB" in name or description

#### With Sort Parameter

1. Click "Try it out" on GET `/api/items`
2. In the `sort` parameter, enter: `name:asc`
3. Click "Execute"
4. **Expected Response:** 200 OK with items sorted by name ascending

#### Invalid Sort Parameter (400 Bad Request)

1. Click "Try it out" on GET `/api/items`
2. In the `sort` parameter, enter: `invalid:sort`
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with validation error

---

### 2.2 GET /api/items/:id - Retrieve Single Item

#### Success Case (200 OK, Public)

1. Find GET `/api/items/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Click "Execute"
5. **Expected Response:** 200 OK with item details

#### 400 Bad Request - Invalid ID Format

1. Click "Try it out" on GET `/api/items/{id}`
2. Enter `id`: `-10`
3. Click "Execute"
4. **Expected Response:** 400 Bad Request

#### 404 Not Found - Non-existent Item

1. Click "Try it out" on GET `/api/items/{id}`
2. Enter `id`: `9999`
3. Click "Execute"
4. **Expected Response:** 404 Not Found

---

### 2.3 POST /api/items - Create New Item

#### Setup: Authorize with Owner Account

1. First, get a token by logging in (see section 1.2 Success Case)
2. In Swagger UI, find the "Authorize" button (lock icon) at the top right
3. Click it and paste the JWT token in the "Value" field (just paste the token value)
4. Click "Authorize" then "Close"

#### Success Case (201 Created)

1. Find POST `/api/items` endpoint
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "name": "Wireless Mouse",
     "description": "Bluetooth mouse with USB receiver",
     "quantity": 2,
     "categoryId": 1,
     "locationId": 1
   }
   ```
4. Click "Execute"
5. **Expected Response:** 201 Created with new item object including `id` and `createdAt`

#### 400 Bad Request - Missing Required Field

1. Click "Try it out" on POST `/api/items`
2. Enter request body (missing `categoryId`):
   ```json
   {
     "name": "Test Item",
     "description": "Missing category",
     "quantity": 1,
     "locationId": 1
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with validation error

#### 401 Unauthorized - No Token

1. **First, clear the authorization:** Click "Authorize", find your token, click "Logout" or clear it
2. Click "Try it out" on POST `/api/items`
3. Enter request body:
   ```json
   {
     "name": "Test Item",
     "description": "No auth",
     "quantity": 1,
     "categoryId": 1,
     "locationId": 1
   }
   ```
4. Click "Execute"
5. **Expected Response:** 401 Unauthorized

---

### 2.4 PUT /api/items/:id - Update Item

#### Setup: Authorize with Owner Account

1. Get token from owner@example.com (see section 1.2)
2. Click "Authorize" button and paste token
3. Click "Authorize" then "Close"

#### Success Case (200 OK)

1. Find PUT `/api/items/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1` (the Screwdriver Set owned by owner@example.com)
4. Enter request body:
   ```json
   {
     "name": "Precision Screwdriver Set",
     "description": "Updated description",
     "quantity": 2
   }
   ```
5. Click "Execute"
6. **Expected Response:** 200 OK with updated item

#### 404 Not Found

1. Click "Try it out" on PUT `/api/items/{id}`
2. Enter `id`: `9999`
3. Enter request body:
   ```json
   {
     "name": "Updated Name"
   }
   ```
4. Click "Execute"
5. **Expected Response:** 404 Not Found

#### 401 Unauthorized - No Token

1. Clear the authorization (logout)
2. Click "Try it out" on PUT `/api/items/{id}`
3. Enter `id`: `1`
4. Enter request body:
   ```json
   {
     "name": "Updated Name"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 401 Unauthorized

#### 403 Forbidden - Not Owner

1. **Switch to non-owner account:** Logout, then login with `not-owner@example.com` / `Password123!`
2. Copy the new token and authorize
3. Click "Try it out" on PUT `/api/items/{id}`
4. Enter `id`: `1` (owned by owner@example.com)
5. Enter request body:
   ```json
   {
     "name": "Hacked Name"
   }
   ```
6. Click "Execute"
7. **Expected Response:** 403 Forbidden with "You do not have permission" message

---

### 2.5 DELETE /api/items/:id - Delete Item

#### Setup: Authorize with Owner Account

1. Login with owner@example.com
2. Get token and authorize in Swagger

#### Success Case (204 No Content)

1. Find DELETE `/api/items/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Click "Execute"
5. **Expected Response:** 204 No Content (no response body)
6. **Verify:** GET `/api/items/1` should now return 404

#### 404 Not Found

1. Click "Try it out" on DELETE `/api/items/{id}`
2. Enter `id`: `9999`
3. Click "Execute"
4. **Expected Response:** 404 Not Found

#### 401 Unauthorized - No Token

1. Logout
2. Click "Try it out" on DELETE `/api/items/{id}`
3. Enter `id`: `1`
4. Click "Execute"
5. **Expected Response:** 401 Unauthorized

#### 403 Forbidden - Not Owner

1. Login with non-owner@example.com and authorize
2. Click "Try it out" on DELETE `/api/items/{id}`
3. Enter `id`: `2` (owned by owner@example.com)
4. Click "Execute"
5. **Expected Response:** 403 Forbidden

---

## Section 3: Categories Endpoints

### 3.1 GET /api/categories - Retrieve All Categories (Public)

1. Find GET `/api/categories` endpoint
2. Click "Try it out"
3. Click "Execute"
4. **Expected Response:** 200 OK with array of categories

---

### 3.2 GET /api/categories/:id - Retrieve Single Category (Public)

#### Success Case (200 OK)

1. Find GET `/api/categories/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Click "Execute"
5. **Expected Response:** 200 OK with category details

#### 404 Not Found

1. Click "Try it out" on GET `/api/categories/{id}`
2. Enter `id`: `9999`
3. Click "Execute"
4. **Expected Response:** 404 Not Found

---

### 3.3 POST /api/categories - Create New Category

#### Setup: Authorize with Owner Account

1. Login with owner@example.com and get token
2. Click "Authorize" button and paste token

#### Success Case (201 Created)

1. Find POST `/api/categories` endpoint
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "name": "Office Supplies"
   }
   ```
4. Click "Execute"
5. **Expected Response:** 201 Created with new category

#### 400 Bad Request - Missing Name

1. Click "Try it out" on POST `/api/categories`
2. Enter request body: `{}`
3. Click "Execute"
4. **Expected Response:** 400 Bad Request

#### 401 Unauthorized - No Token

1. Logout
2. Click "Try it out" on POST `/api/categories`
3. Enter request body:
   ```json
   {
     "name": "Test Category"
   }
   ```
4. Click "Execute"
5. **Expected Response:** 401 Unauthorized

---

### 3.4 PUT /api/categories/:id - Update Category

#### Setup: Authorize with Owner Account

1. Login with owner@example.com and authorize

#### Success Case (200 OK)

1. Find PUT `/api/categories/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Enter request body:
   ```json
   {
     "name": "Electronic Gadgets"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 200 OK with updated category

#### 403 Forbidden - Not Owner

1. Login with not-owner@example.com and authorize
2. Click "Try it out" on PUT `/api/categories/{id}`
3. Enter `id`: `1` (owned by owner@example.com)
4. Enter request body:
   ```json
   {
     "name": "Hacked Category"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 403 Forbidden

---

### 3.5 DELETE /api/categories/:id - Delete Category

#### Setup: Create Empty Category First

1. Create a new category without any items (POST `/api/categories` with name "Deletable Category")
2. Note the returned `id`
3. Login with owner@example.com and authorize

#### Success Case (204 No Content)

1. Find DELETE `/api/categories/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: (the ID of the empty category)
4. Click "Execute"
5. **Expected Response:** 204 No Content

#### 409 Conflict - Category Has Items

1. Click "Try it out" on DELETE `/api/categories/{id}`
2. Enter `id`: `1` (Electronics category that has items assigned)
3. Click "Execute"
4. **Expected Response:** 409 Conflict with "cannot delete category with items"

#### 403 Forbidden - Not Owner

1. Login with not-owner@example.com
2. Click "Try it out" on DELETE `/api/categories/{id}`
3. Enter `id`: `1` (owned by owner@example.com)
4. Click "Execute"
5. **Expected Response:** 403 Forbidden

---

## Section 4: Locations Endpoints

### 4.1 GET /api/locations - Retrieve All Locations (Public)

1. Find GET `/api/locations` endpoint
2. Click "Try it out"
3. Click "Execute"
4. **Expected Response:** 200 OK with array of locations

---

### 4.2 GET /api/locations/:id - Retrieve Single Location (Public)

#### Success Case (200 OK)

1. Find GET `/api/locations/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Click "Execute"
5. **Expected Response:** 200 OK with location details

---

### 4.3 POST /api/locations - Create New Location

#### Setup: Authorize with Owner Account

1. Login with owner@example.com and authorize

#### Success Case (201 Created)

1. Find POST `/api/locations` endpoint
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "name": "Home Office"
   }
   ```
4. Click "Execute"
5. **Expected Response:** 201 Created with new location

#### 401 Unauthorized

1. Logout
2. Click "Try it out" on POST `/api/locations`
3. Enter request body:
   ```json
   {
     "name": "Test Location"
   }
   ```
4. Click "Execute"
5. **Expected Response:** 401 Unauthorized

---

### 4.4 PUT /api/locations/:id - Update Location

#### Setup: Authorize with Owner Account

1. Login with owner@example.com and authorize

#### Success Case (200 OK)

1. Find PUT `/api/locations/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: `1`
4. Enter request body:
   ```json
   {
     "name": "Updated Garage Shelf"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 200 OK with updated location

#### 403 Forbidden - Not Owner

1. Login with not-owner@example.com and authorize
2. Click "Try it out" on PUT `/api/locations/{id}`
3. Enter `id`: `1` (owned by owner@example.com)
4. Enter request body:
   ```json
   {
     "name": "Hacked Location"
   }
   ```
5. Click "Execute"
6. **Expected Response:** 403 Forbidden

---

### 4.5 DELETE /api/locations/:id - Delete Location

#### Setup: Create Empty Location First

1. Create a new location (POST `/api/locations` with name "Deletable Location")
2. Note the returned `id`
3. Login with owner@example.com and authorize

#### Success Case (204 No Content)

1. Find DELETE `/api/locations/{id}` endpoint
2. Click "Try it out"
3. Enter `id`: (the ID of the empty location)
4. Click "Execute"
5. **Expected Response:** 204 No Content

#### 409 Conflict - Location Has Items

1. Click "Try it out" on DELETE `/api/locations/{id}`
2. Enter `id`: `1` (Garage Shelf that has items assigned)
3. Click "Execute"
4. **Expected Response:** 409 Conflict with "cannot delete location with items"

---

## Section 5: Authorization & Ownership Tests

### Test: Users Cannot Modify Other Users' Items

1. Login with owner@example.com, get token, and authorize
2. Find PUT `/api/items/{id}` and update item `id: 2`
3. Note that it works (you own it)
4. Logout and login with not-owner@example.com
5. Try to PUT `/api/items/{id}` with `id: 2`
6. **Expected:** 403 Forbidden

### Test: Users Can Only See Their Categories/Locations in Updates

1. Verify that GET endpoints (public) show all categories/locations
2. Verify that only owners can PUT/DELETE their own resources

---

## Section 6: Error Handling Tests

### Test: Invalid JSON in Request Body

1. Find any POST endpoint (e.g., POST `/api/auth/login`)
2. Click "Try it out"
3. Enter malformed JSON: `{"email": "test@example.com", invalid}`
4. Click "Execute"
5. **Expected Response:** 400 Bad Request or similar error response

### Test: Required Fields Missing

1. Find POST `/api/items`
2. Enter request body with missing `categoryId`:
   ```json
   {
     "name": "Item",
     "locationId": 1
   }
   ```
3. Click "Execute"
4. **Expected Response:** 400 Bad Request with field validation errors

---

## Summary Checklist

- [ ] Authentication (signup/login) works
- [ ] Items CRUD operations work with ownership
- [ ] Categories CRUD operations work with ownership
- [ ] Locations CRUD operations work with ownership
- [ ] Authorization prevents unauthorized access
- [ ] Ownership-based authorization works
- [ ] Search/sort parameters work on items
- [ ] Error handling returns appropriate status codes
- [ ] Public endpoints (GET) work without authentication
- [ ] Protected endpoints require authentication
- [ ] Seed data is properly populated

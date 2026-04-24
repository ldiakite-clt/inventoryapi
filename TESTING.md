# API Testing Plan (Swagger UI)


This guide provides step-by-step instructions to verify all API endpoints using the interactive documentation at `/api-docs`.


## Live Links
- **API Root:** https://inventoryapi-6cew.onrender.com
- **API Health**: https://inventoryapi-6cew.onrender.com/health
- **API Documentation:** https://inventoryapi-6cew.onrender.com/api-docs
- ** Repo**: https://github.com/ldiakite-clt/inventoryapi 

--- 



## 1. Authentication Endpoints

### POST /api/auth/signup
**Access Control:** Public
- **Success Case:**
  - Click **Try it out**.
  - Enter a new email and password.
  - **Expect:** `201 Created` with a new user object.
- **409 Conflict:**
  - Attempt to sign up with `owner@example.com`.
  - **Expect:** `409 Conflict` (Email already exists).
- **400 Bad Request:**
  - Provide an invalid email format (e.g., "not-an-email").
  - **Expect:** `400 Bad Request`.

### POST /api/auth/login
**Access Control:** Public
- **Success Case:**
  - Click **Try it out**.
  - Use Credentials: `owner@example.com` / `Password123!`.
  - **Expect:** `200 OK` with an `accessToken`. **Copy this token for the following steps.**
- **401 Unauthorized:**
  - Enter the wrong password for an existing email.
  - **Expect:** `401 Unauthorized`.

---

## 2. Items Endpoints

### GET /api/items
**Access Control:** Public
- **Success Case:**
  - Click **Try it out** and then **Execute**.
  - **Expect:** `200 OK` with an array of all seeded items.

### POST /api/items
**Access Control:** Authenticated Users
- **Setup:** Click **Authorize** at the top and paste your JWT `accessToken`.
- **Success Case:**
  - Click **Try it out**.
  - Enter name, categoryId (e.g., 1), and locationId (e.g., 1).
  - **Expect:** `201 Created` with the new item object.
- **401 Unauthorized:**
  - Click **Logout** in the Authorize menu and click **Execute**.
  - **Expect:** `401 Unauthorized`.

### PUT /api/items/{id}
**Access Control:** Owner of the item
- **Setup:** Ensure you are authorized with the `owner@example.com` token.
- **Success Case:**
  - Use `id: 1` (Screwdriver Set).
  - Click **Try it out** and change the `quantity` to `10`.
  - **Expect:** `200 OK` with the updated item.
- **403 Forbidden:**
  - Login as `not-owner@example.com` / `Password123!`.
  - Copy new token into **Authorize**.
  - Attempt to update `id: 1`.
  - **Expect:** `403 Forbidden` (You do not own this item).

---

## 3. Categories & Locations

### GET /api/categories (and /api/locations)
**Access Control:** Public
- **Success Case:** Click **Try it out** and **Execute**.
- **Expect:** `200 OK` with a list of seeded resources.

### DELETE /api/categories/{id}
**Access Control:** Owner of the category
- **Setup:** Authorize as `owner@example.com`.
- **Success Case:**
  - First, use **POST** to create a new category named "Empty". Note its ID.
  - Use that ID in the **DELETE** endpoint.
  - **Expect:** `204 No Content`.
- **409 Conflict (Integrity Test):**
  - Attempt to delete `id: 1` (Electronics).
  - **Expect:** `409 Conflict` (Cannot delete category with assigned items).

---

## 4. General Error Handling (All Endpoints)

- **404 Not Found:** Use an ID that doesn't exist (e.g., `9999`) on any `GET`, `PUT`, or `DELETE` endpoint.
- **400 Bad Request:** Provide a non-integer ID (e.g., `abc`) in a path parameter or remove a required field from a `POST` body.
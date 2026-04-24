# Deployment Guide

This guide explains how to deploy the Inventory Management API to Render.

## Prerequisites

1. GitHub account
2. Render account (create at https://render.com)
3. Git installed locally
4. Node.js 18+ installed

## Step 1: Prepare Your Local Environment

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Set Up Local Database (PostgreSQL)

```bash
# Create a local PostgreSQL database
createdb inventory_db

# Update .env with local database URL
DATABASE_URL="postgresql://localhost:5432/inventory_db"
JWT_SECRET="your-local-secret-key"
NODE_ENV="development"
```

### 1.3 Run Migrations Locally

```bash
npm run migrate:dev
```

When prompted for a migration name, enter something like "init_schema"

### 1.4 Seed the Database

```bash
npm run seed:dev
```

### 1.5 Start Development Server

```bash
npm run dev
```

The API should now be running at `http://localhost:3000`

Visit `http://localhost:3000/api-docs` to access Swagger UI.

## Step 2: Push to GitHub

### 2.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Inventory Management API"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "inventory-api")
3. Follow GitHub's instructions to push your local repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/inventory-api.git
git branch -M main
git push -u origin main
```

## Step 3: Set Up Render Database

### 3.1 Create PostgreSQL Database on Render

1. Log in to https://render.com
2. Click "New +"
3. Select "PostgreSQL"
4. Fill in the details:
   - **Name:** inventory-api-db
   - **Database:** inventory_db
   - **User:** leave as default or customize
   - **Region:** Choose the region closest to you
   - **Blueprint ID:** Leave blank
5. Click "Create Database"
6. Wait for the database to be created (may take a few minutes)
7. Once created, copy the **External Database URL** (it will look like: `postgresql://user:password@hostname:5432/inventory_db`)

## Step 4: Deploy to Render

### 4.1 Create Web Service on Render

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository:
   - Click "Connect repository"
   - Authorize Render to access your GitHub
   - Select your "inventory-api" repository
4. Fill in the service details:
   - **Name:** inventory-api
   - **Environment:** Node
   - **Region:** Same as database
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm run migrate:deploy && npm run seed:prod && npm start`
5. Scroll down to "Environment"
6. Add the following environment variables:
   - **DATABASE_URL:** Paste the PostgreSQL URL from Step 3.1
   - **JWT_SECRET:** Enter a strong random string (e.g., generate with `openssl rand -hex 32`)
   - **NODE_ENV:** production

### 4.2 Deploy

1. Click "Create Web Service"
2. Render will automatically start deploying
3. Wait for the build to complete (check "Logs" tab for progress)
4. Once deployed, you'll see a URL like: `https://inventory-api.onrender.com`

### 4.3 Verify Deployment

1. Visit `https://inventory-api.onrender.com/health`
2. You should see: `{"status": "ok"}`
3. Visit `https://inventory-api.onrender.com/api-docs` to access Swagger UI

## Step 5: Test the Deployed API

Use the Swagger UI at `https://YOUR_RENDER_URL/api-docs` to test all endpoints.

### Test Credentials (from seed data)

- **Owner Account:**
  - Email: `owner@example.com`
  - Password: `Password123!`

- **Non-Owner Account:**
  - Email: `not-owner@example.com`
  - Password: `Password123!`

- **Admin Account:**
  - Email: `admin@example.com`
  - Password: `AdminPass123!`

## Step 6: Troubleshooting

### Deployment Fails

1. Check the "Logs" tab in Render dashboard
2. Common issues:
   - **Missing environment variables:** Ensure `DATABASE_URL` and `JWT_SECRET` are set
   - **Database connection error:** Verify `DATABASE_URL` is correct
   - **Migration errors:** Check that Prisma migrations were applied

### Database Not Populated with Seed Data

1. Check Render logs for seed script output
2. Manually run seed by:
   - Connecting to database with psql
   - Checking if tables exist
   - Re-running migrations: `npx prisma migrate deploy`

### Can't Connect to Database

1. Verify DATABASE_URL is correct (should include password if required)
2. Check that Render PostgreSQL service is running
3. Ensure network access is configured correctly

## Step 7: Continuous Deployment

Render automatically redeploys when you push to GitHub.

To update your API:
1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub: `git push origin main`
4. Render will automatically rebuild and deploy

## Environment Variables Summary

| Variable | Example | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://user:pass@hostname:5432/db` | Render PostgreSQL connection string |
| `JWT_SECRET` | `long-random-string-32-chars-min` | Should be strong and unique |
| `NODE_ENV` | `production` | Set to production on Render |
| `PORT` | `3000` | Automatically set by Render |

## API Documentation

Once deployed, access Swagger UI at:
- Local: `http://localhost:3000/api-docs`
- Production: `https://your-render-url.onrender.com/api-docs`

## Support Resources

- Render Docs: https://render.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com
- PostgreSQL Docs: https://www.postgresql.org/docs

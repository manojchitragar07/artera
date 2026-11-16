# ARTÉRA — Local Development & Setup Guide

This guide walks you through setting up and running ARTÉRA locally from scratch.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn** / **pnpm**
- **Docker** (recommended for local PostgreSQL) OR a free cloud PostgreSQL connection string (such as **Neon** or **Supabase**)

---

## 2. Quick Start (Automated Single-Command)

From the project root:

```bash
# 1. Install all dependencies across root, backend, and frontend
npm run install:all

# 2. Launch local PostgreSQL database via Docker (if using Docker)
docker compose up -d

# 3. Apply database schema and seed realistic traditional art data
npm run seed

# 4. Start both backend (port 5001) and frontend (port 5173) concurrently
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 3. Step-by-Step Manual Setup

### 3.1 Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```bash
   cp .env.example .env
   ```

   Configure your `DATABASE_URL`:
   - If using local Docker:
     `DATABASE_URL="postgresql://artera_user:artera_password@localhost:5433/artera_db?schema=public"`
   - If using Neon PostgreSQL:
     `DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require"`

3. Push the Prisma schema to the database:
   ```bash
   npx prisma db push
   ```

4. Seed the database with 8 traditional master artists, 22 artworks, and 4 curated exhibitions:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5001`.

---

### 3.2 Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables in `frontend/.env`:
   ```bash
   cp .env.example .env
   ```
   Default settings:
   ```env
   VITE_API_URL="http://localhost:5001/api"
   VITE_SITE_URL="http://localhost:5173"
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## 4. Evaluation Accounts (Pre-Seeded)

The database seed script generates 3 distinct role-based accounts for instant evaluation:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Chief Curator (Admin)** | `admin@artera.art` | `Admin@123456` | Curatorial dashboard, artist approvals, artwork moderation, exhibition curation |
| **Master Artist** | `artist@artera.art` | `Artist@123456` | Artist creative workspace, upload masterpiece, collections, studio inquiries, analytics |
| **Art Collector (Visitor)** | `visitor@artera.art` | `Visitor@123456` | Personal salon wall, saved artworks, followed artists, acquisition inquiries |

*(You can also use the one-click evaluation buttons directly on the Login page).*

---

## 5. Running the Test Suite

Run backend API tests with Jest:
```bash
cd backend
npm test
```
All 15 integration tests will run against live PostgreSQL models verifying authentication, RBAC, artwork CRUD, enquiries, and curatorial guards.


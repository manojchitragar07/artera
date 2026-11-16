# ARTÉRA — Production Deployment Guide

This guide details deploying ARTÉRA across modern production infrastructure:
- **Database**: Neon Serverless PostgreSQL
- **Backend API**: Render, Railway, or Fly.io
- **Frontend SPA**: Vercel or Cloudflare Pages
- **Image Storage**: Cloudinary Media CDN

---

## 1. Cloud Database Setup (Neon PostgreSQL)

1. Sign up for a free PostgreSQL cluster at [Neon.tech](https://neon.tech).
2. Create a new project named `artera-production`.
3. Copy the pooled or direct connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:<password>@<endpoint>.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. From your development machine or CI pipeline, push the Prisma migrations:
   ```bash
   cd backend
   DATABASE_URL="<your_neon_url>" npx prisma db push
   ```
5. *(Optional initial staging seed)*:
   ```bash
   DATABASE_URL="<your_neon_url>" npm run seed
   ```

---

## 2. Image CDN Setup (Cloudinary)

1. Register at [Cloudinary.com](https://cloudinary.com).
2. From the Cloudinary Dashboard, copy:
   - `Cloud Name`
   - `API Key`
   - `API Secret`
3. ARTÉRA automatically streams uploaded artwork images to Cloudinary, generating responsive sizes and quality-optimized thumbnails on demand.

---

## 3. Backend Deployment (e.g. Render / Railway)

### 3.1 Deploying on Render
1. Create a **New Web Service** connected to your Git repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables in Render Dashboard:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL="<your_neon_database_url>"
   JWT_SECRET="<generate_secure_random_64_char_key>"
   JWT_REFRESH_SECRET="<generate_secure_random_64_char_key>"
   FRONTEND_URL="https://your-artera-app.vercel.app"
   CLOUDINARY_CLOUD_NAME="<your_cloud_name>"
   CLOUDINARY_API_KEY="<your_api_key>"
   CLOUDINARY_API_SECRET="<your_api_secret>"
   CLOUDINARY_FOLDER="artera_artworks"
   ```

---

## 4. Frontend Deployment (Vercel)

### 4.1 Deploying on Vercel
1. Import your repository into [Vercel](https://vercel.com).
2. Configure Project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   ```env
   VITE_API_URL="https://your-backend-service.onrender.com/api"
   VITE_SITE_URL="https://your-artera-app.vercel.app"
   ```
4. For client-side routing on Vercel, ensure `frontend/vercel.json` rewrites are present:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 5. Security & Production Checklist
- [x] Passwords hashed with bcrypt (salt rounds: 12).
- [x] JWT tokens signed with secure server secrets and rotated with refresh tokens.
- [x] Rate limiting configured on all `/api/*` endpoints.
- [x] RBAC server authorization enforced on all mutating routes.
- [x] CORS restricted to verified frontend production domain.
- [x] Helmet security headers active.
- [x] Zero plain text secrets in client bundle or source control.


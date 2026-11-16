# ARTÉRA — A Digital Sanctuary for Traditional Artists

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

**ARTÉRA** is a full-stack, production-grade digital fine art museum and exhibition platform engineered specifically for traditional and manual artists:
- Canvas, oil, and acrylic painters
- Watercolour masters
- Pencil and charcoal sketch artists
- Portrait artists
- Muralists and true fresco painters
- Bronze and stone sculptors
- Terracotta and anagama ceramic artisans
- Traditional craft and folk pigment artists

Rather than functioning as a standard e-commerce store, ARTÉRA replicates the contemplative spatial aesthetic of a contemporary fine art institution with asymmetrical gallery walls, authentic museum framing styles, provenance archives, and three dedicated role-based portals for **Artists**, **Collectors**, and **Curators**.

---

## 🏛 Visual Design System & Palette

- **Theme**: Contemporary Fine Art Museum
- **Warm Ivory**: `#F5F0E8` (Primary background)
- **Gallery Cream**: `#EAE2D5` (Cards, sub-layers)
- **Charcoal**: `#252321` (Typography, deep museum frames)
- **Deep Brown**: `#47382F` (Accents, labels)
- **Antique Gold**: `#B49A65` (Curatorial seals, active highlights)
- **Muted Grey**: `#858078` (Placard notes, metadata)
- **Typography**: Editorial serif headings (`Playfair Display`, `Cormorant Garamond`) paired with crisp modern typography (`Plus Jakarta Sans`).

---

## 🛠 Technology Stack

### Frontend:
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS with custom museum shadows and fine-art frames
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Client State & Caching**: TanStack React Query v5
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with automatic JWT refresh interceptor
- **Validation**: Zod + React Hook Form

### Backend:
- **Runtime & Framework**: Node.js, Express.js, TypeScript
- **Architecture**: Modular REST API with centralized error handling
- **Authentication**: JWT access & refresh tokens, password hashing with bcryptjs (12 rounds)
- **Authorization**: Role-Based Access Control (`ARTIST`, `VISITOR`, `ADMIN`)
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Image Storage**: Cloudinary Media CDN with automated fallback to local uploads

### Database & ORM:
- **Database Engine**: PostgreSQL 16 (local Docker or Neon Serverless PostgreSQL)
- **ORM**: Prisma ORM with 17 normalized relational models, foreign keys, and indexes

---

## 📂 Project Architecture

```
artera/
├── frontend/
│   ├── public/
│   │   └── favicon/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Frame, Lightbox, EnquiryModal, ShareModal
│   │   │   ├── navigation/     # Museum Navbar, Footer
│   │   │   ├── gallery/        # ArtworkCard, FilterBar
│   │   │   └── dashboard/      # Role-aware DashboardLayout
│   │   ├── context/            # AuthContext
│   │   ├── layouts/            # RootLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, Explore, Detail, Artists, Exhibitions, About
│   │   │   ├── auth/           # Login, Register, Forgot Password
│   │   │   ├── artist/         # Overview, MyArtwork, Upload, Collections, Inquiries, Analytics, Profile
│   │   │   ├── visitor/        # Overview, SavedGallery, Following, Inquiries, Settings
│   │   │   └── admin/          # Overview, Artists, Moderation, Exhibitions, Categories, Reports
│   │   ├── routes/             # Protected and public route guards
│   │   ├── services/           # Axios API service clients
│   │   ├── styles/             # Tailwind directives and museum theme
│   │   ├── types/              # Comprehensive TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/             # Environment, Prisma singleton, Cloudinary/disk storage
│   │   ├── controllers/        # REST route handlers
│   │   ├── middleware/         # Auth, RBAC, Multer upload, Validation, Error handler
│   │   ├── routes/             # Modular API routes
│   │   ├── services/           # Database business logic
│   │   ├── types/              # Request & token types
│   │   ├── utils/              # ApiResponse, ApiError, logger
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts              # Express application configuration
│   │   └── server.ts           # HTTP server bootloader
│   ├── prisma/
│   │   ├── schema.prisma       # 17 normalized relational models
│   │   └── seed.ts             # Realistic sample traditional artists and artworks
│   ├── tests/                  # Integration test suite (Supertest + Jest)
│   ├── uploads/                # Local asset fallback storage
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── PROJECT_OVERVIEW.md     # Architecture and executive summary
│   ├── DATABASE_SCHEMA.md      # ERD and entity data dictionary
│   ├── API_DOCUMENTATION.md    # REST API endpoints and payloads
│   ├── SETUP_GUIDE.md          # Local developer setup
│   └── DEPLOYMENT_GUIDE.md     # Production deployment on Vercel, Render, and Neon
│
├── docker-compose.yml          # Local PostgreSQL 16 container
├── README.md
└── package.json                # Workspace orchestration scripts
```

---

## 🔑 Pre-Seeded Evaluation Accounts

For immediate evaluation, the database seed script generates 3 distinct role-based accounts:

| Portal | Email | Password | Role | Features |
| :--- | :--- | :--- | :--- | :--- |
| **Chief Curator** | `admin@artera.art` | `Admin@123456` | `ADMIN` | Full moderation queue, artist verifications, artwork curation, curated exhibition manager, audit logs |
| **Traditional Master** | `artist@artera.art` | `Artist@123456` | `ARTIST` | Artist creative workspace, upload masterpiece, series collections, studio inquiries, real analytics |
| **Art Collector** | `visitor@artera.art` | `Visitor@123456` | `VISITOR` | Private salon wall, saved artworks, followed artists, acquisition inquiries |

*(You can also click the quick-fill badges on the Login page to authenticate with any role with a single click).*

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18.0.0+ (v20+ recommended)
- Docker Desktop (for local PostgreSQL) OR a free [Neon](https://neon.tech) PostgreSQL connection string

### 1. Installation
In the project root:
```bash
npm run install:all
```

### 2. Database Launch
Start the local PostgreSQL container:
```bash
docker compose up -d
```

### 3. Database Schema & Seed
Sync the schema to PostgreSQL and populate 8 master artists, 22 artworks, and 4 curated exhibitions:
```bash
npm run seed
```

### 4. Run Development Servers
Start both backend (port 5001) and frontend (port 5173) simultaneously:
```bash
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 Testing & Quality Assurance

ARTÉRA includes full integration tests covering Authentication, Role-Based Access Guards, Public Gallery Endpoints, Visitor Saves, and Curatorial Moderation:

```bash
npm run test
```

All 15 test suites run against live PostgreSQL models via Jest and Supertest.

---

## 🌐 Production Deployment

- **Frontend**: Ready for one-click deployment on [Vercel](https://vercel.com) (configured via `vercel.json` rewrites).
- **Backend**: Ready for deployment on [Render](https://render.com), Railway, or Fly.io.
- **Database**: Native support for [Neon Serverless PostgreSQL](https://neon.tech).
- **Images**: Seamless streaming to [Cloudinary](https://cloudinary.com).

Consult `docs/DEPLOYMENT_GUIDE.md` for step-by-step production configuration.

---

## 📜 License
MIT License. Built with reverence for physical fine art.


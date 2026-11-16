# ARTÉRA — Project Overview & Architecture Specification

## 1. Executive Summary

**ARTÉRA — A Digital Sanctuary for Traditional Artists** is a contemporary fine-art digital gallery and exhibition management platform engineered specifically for manual, physical, and traditional artists. The platform provides a sanctuary for artists practicing traditional disciplines (oil and acrylic painters, sketch and charcoal artists, bronze sculptors, anagama ceramicists, woodcarvers, muralists, and cultural pigment artisans).

Unlike conventional e-commerce websites or generic SaaS marketplaces, ARTÉRA adopts the aesthetic, rhythm, and curatorial standards of an international fine art museum. Artworks are presented on asymmetrical gallery walls with custom museum framing styles, authentic matting, provenance documentation, and direct studio acquisition communication.

---

## 2. System Architecture

ARTÉRA is constructed with a decoupled full-stack architecture:

```
┌────────────────────────────────────────────────────────┐
│                   ARTÉRA PLATFORM                      │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     FRONTEND (SPA Client)     │   │      BACKEND (REST API)       │
│  - React 18 + Vite + TS       │   │  - Node.js + Express + TS     │
│  - Tailwind CSS + Museum UI   │   │  - Prisma ORM 6.x             │
│  - Framer Motion              │   │  - JWT Bearer Authentication  │
│  - TanStack Query v5          │   │  - Role-Based Access Control  │
│  - Lucide Icons               │   │  - Multer + Cloudinary Stream │
└──────────────┬────────────────┘   └──────────────┬────────────────┘
               │                                   │
               │ HTTP / JSON REST                  │ SQL Connection Pool
               └─────────────────► ◄───────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    PostgreSQL 16 Database   │
                    │  - Neon Cloud / Local       │
                    │  - 17 Relational Entities   │
                    │  - Foreign Keys & Cascades  │
                    │  - Audit Logs & Indexing    │
                    └─────────────────────────────┘
```

---

## 3. Core Modules & Dashboards

### 3.1 Public Museum Sanctuary
- **Landing Page**: Museum headline ("Where Art Finds Its Place"), curatorial highlights, traditional disciplines showcase, featured atelier masters, virtual exhibition halls, and artist invitation manifesto.
- **Explore Gallery Wall**: Asymmetrical gallery wall layout with multiple frame styles (Blond Oak, Bevelled Walnut, 24K Gold Leaf, Museum Linen Matting). Instant filtering by Category, Medium, Price, and Curation order.
- **Artwork Detail Experience**: Aspect-ratio-preserving primary visual, multi-image view strip, fullscreen Lightbox with keyboard navigation, provenance notes, physical dimensions, material classification, and Direct Studio Enquiry modal.
- **Master Artists Directory & Profile**: Public artist atelier profiles (`/artists/:slug`) featuring studio biographies, artist philosophies, complete portfolios, social archives, and follow mechanisms.
- **Curated Digital Exhibitions**: Thematic virtual exhibition halls (`/exhibitions/:slug`) pairing curated essays with selected masterpieces.
- **The Platform Manifesto**: Institutional statement on manual physical art preservation.

### 3.2 Artist Creative Workspace
- **Overview**: Real-time stats (catalogued works, visitor impressions, collector saves, acquisition communications).
- **Artwork Management**: Upload, edit, delete, preview, and toggle availability.
- **Upload Masterpiece**: Multi-file dropzone with local preview, primary image assignment, dimension specifications, creation year, optional fixed pricing or direct enquiry only, tags, and status selection (Draft or Submit for Curation).
- **Thematic Series & Collections**: Group artworks into bodies of work (e.g., "The Venetian Winter Studies").
- **Studio Acquisition Enquiries**: Direct correspondence inbox with collector details and response composer.
- **Studio Analytics**: Impressions ledger and save conversion rates calculated from live database activity.
- **Profile & Statement Editor**: Atelier portrait upload, biography, philosophy, and social links.

### 3.3 Visitor / Art Collector Personal Salon
- **Personal Salon Overview**: Private collection statistics, recent saves, followed artists, and correspondence tracking.
- **Private Gallery Wall (`/visitor/saved`)**: Saved masterpieces displayed in an asymmetrical museum gallery wall.
- **Following Studio Lineages**: Master artists followed with instant links to their latest atelier works.
- **My Inquiries**: Real-time tracking of acquisition questions and artist responses.
- **Collector Settings**: Residence location, aesthetic interests, and collection focus.

### 3.4 Chief Curator / Administrator Portal
- **Curatorial Overview**: Platform metrics, pending artist verifications, pending artwork submissions, and activity feed.
- **Artist Roster & Induction Moderation**: Approve, reject (with recorded reason), suspend, or reactivate artist accounts.
- **Masterpiece Curation & Approvals**: Review uploaded artworks, approve for public exhibition, reject with custom curator feedback, or toggle "Featured" status.
- **Curated Exhibition Management**: Create and schedule thematic exhibitions, draft curatorial essays, set date ranges, and curate participating artworks.
- **Category & Medium Taxonomies**: Create and manage fine-art categories and physical medium classifications.
- **Curatorial Audit Trail & Reports**: Comprehensive chronological ledger documenting all administrative actions with timestamp, curator email, target entity, and justification.

---

## 4. Security & Compliance
- **Server-Derived Identity**: The client never provides roles or user IDs. The server verifies identity exclusively from signed JWT Bearer tokens.
- **Role-Based Access Control**: Strict middleware guards protect endpoints based on `Role` (`ARTIST`, `VISITOR`, `ADMIN`).
- **Artist Induction Workflow**: New artists receive `PENDING_APPROVAL` status by default, ensuring artwork quality and medium provenance before public appearance.
- **Image Upload Validation**: Strictly whitelisted MIME types (JPEG, PNG, WEBP, AVIF, GIF) with file size caps and memory streaming.
- **Cross-Origin & Content Security**: Helmet configured with cross-origin resource policy allowing seamless image loading across CDNs and local storage.


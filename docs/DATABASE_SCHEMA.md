# ARTÉRA — Database Schema & Data Dictionary

## 1. Overview
The database layer for ARTÉRA is modeled in PostgreSQL using Prisma ORM. The schema consists of 17 normalized relational entities with strong foreign key integrity, cascading rules, and indexes designed for fine-art exhibition queries.

---

## 2. Entity-Relationship Diagram (Conceptual)

```
       ┌─────────────────┐
       │      User       │
       └───┬─────────┬───┘
           │         │
    1:1    │         │ 1:1
           ▼         ▼
┌──────────────────┐ ┌──────────────────┐
│  ArtistProfile   │ │  VisitorProfile  │
└────────┬─────────┘ └────────┬─────────┘
         │ 1:N                │ 1:N
         ▼                    ▼
┌──────────────────┐ ┌──────────────────┐
│     Artwork      │ │    Favourite     │
└────────┬─────────┘ └──────────────────┘
         │
         ├─── 1:N ──► ArtworkImage
         ├─── N:1 ──► Category
         ├─── N:1 ──► Medium
         ├─── 1:N ──► CollectionArtwork ◄── N:1 ── Collection
         ├─── 1:N ──► ExhibitionArtwork ◄── N:1 ── Exhibition
         ├─── 1:N ──► ArtworkView
         └─── 1:N ──► Enquiry
```

---

## 3. Entities & Data Dictionary

### 3.1 `User`
Primary identity and authentication table.
- `id` (String, PK, cuid)
- `email` (String, Unique, Index)
- `password` (String, bcrypt hash)
- `role` (Enum: `ARTIST`, `VISITOR`, `ADMIN`, Index)
- `status` (Enum: `PENDING_APPROVAL`, `ACTIVE`, `SUSPENDED`, `REJECTED`, Index)
- `refreshToken` (String, Nullable)
- `createdAt` / `updatedAt` (DateTime)

### 3.2 `ArtistProfile`
Atelier credentials and public portfolio identity.
- `id` (String, PK, cuid)
- `userId` (String, FK -> User.id, Unique, Cascade Delete)
- `name` (String)
- `slug` (String, Unique, Index)
- `bio` (String, Nullable)
- `statement` (String, Nullable, Artist Philosophy)
- `speciality` (String, e.g. "Classical Oil & Chiaroscuro")
- `disciplines` (String, Nullable)
- `location` (String, Nullable, e.g. "Florence, Italy")
- `yearsOfExperience` (Int, Nullable)
- `profileImage` (String, Nullable)
- `coverImage` (String, Nullable)
- `website` / `instagram` (String, Nullable)
- `featured` (Boolean, Default: false, Index)
- `createdAt` / `updatedAt` (DateTime)

### 3.3 `VisitorProfile`
Art collector and salon member profile.
- `id` (String, PK, cuid)
- `userId` (String, FK -> User.id, Unique, Cascade Delete)
- `name` (String)
- `avatar` (String, Nullable)
- `bio` (String, Nullable)
- `location` (String, Nullable)
- `createdAt` / `updatedAt` (DateTime)

### 3.4 `Artwork`
Catalogued masterwork metadata.
- `id` (String, PK, cuid)
- `artistId` (String, FK -> ArtistProfile.id, Cascade Delete, Index)
- `categoryId` (String, FK -> Category.id, Index)
- `mediumId` (String, FK -> Medium.id, Nullable, Index)
- `title` (String)
- `slug` (String, Unique, Index)
- `description` (String)
- `dimensions` (String, e.g. "90 x 120 cm")
- `creationYear` (Int)
- `price` (Float, Nullable)
- `isForSale` (Boolean, Default: true)
- `isEnquiryOnly` (Boolean, Default: false)
- `status` (Enum: `DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`, `REJECTED`, `ARCHIVED`, Index)
- `rejectionReason` (String, Nullable)
- `isFeatured` (Boolean, Default: false, Index)
- `viewsCount` / `favoritesCount` (Int, Default: 0)
- `primaryImageUrl` (String)
- `primaryImagePublicId` (String, Nullable)
- `frameStyle` (String, Default: "natural-oak")
- `tags` (String, Nullable)
- `createdAt` / `updatedAt` (DateTime)

### 3.5 `ArtworkImage`
Additional detail, impasto texture, and angle photographs.
- `id` (String, PK, cuid)
- `artworkId` (String, FK -> Artwork.id, Cascade Delete, Index)
- `url` (String)
- `publicId` (String, Nullable)
- `caption` (String, Nullable)
- `isPrimary` (Boolean, Default: false)
- `order` (Int, Default: 0)

### 3.6 `Category`
Official fine art branches (Canvas Painting, Watercolour, Sketches, Sculpture, Ceramics, etc.).
- `id` (String, PK, cuid)
- `name` (String, Unique)
- `slug` (String, Unique, Index)
- `description` / `coverImage` (String, Nullable)

### 3.7 `Medium`
Physical material and pigment classification (Oil on Canvas, Bronze, Terracotta, etc.).
- `id` (String, PK, cuid)
- `name` (String, Unique)
- `slug` (String, Unique, Index)
- `description` (String, Nullable)

### 3.8 `Favourite`
Collector saved artworks for private salon walls.
- `id` (String, PK, cuid)
- `visitorId` (String, FK -> VisitorProfile.id, Cascade Delete)
- `artworkId` (String, FK -> Artwork.id, Cascade Delete)
- `createdAt` (DateTime)
- Compound Unique Index: `[visitorId, artworkId]`

### 3.9 `ArtistFollow`
Collector subscription to studio updates.
- `id` (String, PK, cuid)
- `visitorId` (String, FK -> VisitorProfile.id, Cascade Delete)
- `artistId` (String, FK -> ArtistProfile.id, Cascade Delete)
- `createdAt` (DateTime)
- Compound Unique Index: `[visitorId, artistId]`

### 3.10 `Collection`
Thematic grouping by an artist (e.g. series) or a visitor (curation).
- `id` (String, PK, cuid)
- `visitorId` (String, FK -> VisitorProfile.id, Nullable, Index)
- `artistId` (String, FK -> ArtistProfile.id, Nullable, Index)
- `title` (String)
- `slug` (String, Unique, Index)
- `description` / `coverImage` (String, Nullable)
- `isPublic` (Boolean, Default: true)

### 3.11 `CollectionArtwork`
Associative join table between Collection and Artwork.
- `id` (String, PK, cuid)
- `collectionId` (String, FK -> Collection.id, Cascade Delete)
- `artworkId` (String, FK -> Artwork.id, Cascade Delete)
- `order` (Int, Default: 0)
- Compound Unique Index: `[collectionId, artworkId]`

### 3.12 `Enquiry`
Direct patron communication with artist studio archives.
- `id` (String, PK, cuid)
- `visitorId` (String, FK -> VisitorProfile.id, Nullable, SetNull)
- `artistId` (String, FK -> ArtistProfile.id, Cascade Delete, Index)
- `artworkId` (String, FK -> Artwork.id, Nullable, SetNull, Index)
- `senderName` / `senderEmail` / `senderPhone` (String)
- `subject` / `message` (String)
- `status` (Enum: `PENDING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, Index)
- `artistResponse` (String, Nullable)
- `respondedAt` (DateTime, Nullable)

### 3.13 `Exhibition`
Curated thematic museum programs.
- `id` (String, PK, cuid)
- `title` (String)
- `slug` (String, Unique, Index)
- `subtitle` / `curatorStatement` (String)
- `coverImage` (String)
- `startDate` / `endDate` (DateTime)
- `status` (Enum: `UPCOMING`, `ONGOING`, `COMPLETED`, `ARCHIVED`, Index)
- `featured` (Boolean, Default: false)

### 3.14 `ExhibitionArtwork`
Associative join table linking artworks into exhibitions with curator commentary.
- `id` (String, PK, cuid)
- `exhibitionId` (String, FK -> Exhibition.id, Cascade Delete)
- `artworkId` (String, FK -> Artwork.id, Cascade Delete)
- `order` (Int, Default: 0)
- `curatorNotes` (String, Nullable)
- Compound Unique Index: `[exhibitionId, artworkId]`

### 3.15 `ArtworkView`
Audit log of individual gallery inspections.
- `id` (String, PK, cuid)
- `artworkId` (String, FK -> Artwork.id, Cascade Delete, Index)
- `ipHash` (String, Nullable)
- `visitorId` (String, Nullable)
- `viewedAt` (DateTime, Default: now, Index)

### 3.16 `Notification`
Real-time dispatch system for enquiries, approvals, and followers.
- `id` (String, PK, cuid)
- `userId` (String, FK -> User.id, Cascade Delete, Index)
- `title` / `message` (String)
- `type` (Enum: `ENQUIRY_RECEIVED`, `ENQUIRY_REPLIED`, `ARTWORK_APPROVED`, `ARTWORK_REJECTED`, `ARTWORK_FEATURED`, `NEW_FOLLOWER`, `SYSTEM`)
- `link` (String, Nullable)
- `isRead` (Boolean, Default: false, Index)

### 3.17 `AdminAuditLog`
Immutable administrative audit trail.
- `id` (String, PK, cuid)
- `adminId` (String, FK -> User.id, Cascade Delete, Index)
- `action` (String, e.g. "APPROVE_ARTIST", "REJECT_ARTWORK")
- `targetType` (String, e.g. "Artwork", "ArtistProfile")
- `targetId` (String)
- `details` (String, Nullable, JSON formatted)
- `ipAddress` (String, Nullable)
- `createdAt` (DateTime, Default: now, Index)


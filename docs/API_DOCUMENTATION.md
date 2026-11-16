# ARTÉRA — REST API Reference & Specification

Base URL: `http://localhost:5001/api` (or production endpoint)

All authenticated endpoints require an `Authorization` header formatted as:
```http
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Register a new member as either an Art Collector (`VISITOR`) or Traditional Artist (`ARTIST`).
- **Body**:
  ```json
  {
    "name": "Elena Rostova",
    "email": "elena@atelier.art",
    "password": "Password@123",
    "role": "ARTIST", // or "VISITOR"
    "speciality": "Oil on Canvas & Chiaroscuro",
    "location": "Florence, Italy",
    "bio": "Classical training in Florence..."
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Registration successful. Welcome to ARTÉRA.",
    "data": {
      "user": { ... },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/auth/login`
Authenticate with email and password.
- **Body**: `{"email": "...", "password": "..."}`
- **Response (200)**: Returns user profile and access/refresh tokens.

### `POST /api/auth/refresh`
Exchange a valid refresh token for a fresh access token.
- **Body**: `{"refreshToken": "..."}`

### `GET /api/auth/me`
Retrieve currently authenticated identity, profile, and recent notifications.
- **Headers**: Bearer token required.

---

## 2. Artwork Endpoints

### `GET /api/artworks`
Explore published gallery artworks. Supports filtering, sorting, and pagination.
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12)
  - `categorySlug`: e.g. `canvas-painting`, `watercolour`
  - `mediumId`: Medium ID
  - `artistId`: Filter by artist profile ID
  - `search`: Keyword across title, description, and artist name
  - `sortBy`: `newest`, `oldest`, `popular`, `featured`, `price-low`, `price-high`
- **Response (200)**: Array of artworks with pagination metadata.

### `GET /api/artworks/:id`
Fetch single masterpiece by ID or slug. Records view count asynchronously.
- **Response (200)**: Full artwork details, images, artist profile, and `isFavourited` status.

### `POST /api/artworks`
Upload and catalogue a new masterpiece.
- **Role Required**: `ARTIST`
- **Body**:
  ```json
  {
    "title": "Twilight on the Tuscan Ridge",
    "description": "Oil study executed on linen...",
    "categoryId": "...",
    "mediumId": "...",
    "dimensions": "90 x 120 cm",
    "creationYear": 2024,
    "price": 5400,
    "isEnquiryOnly": false,
    "frameStyle": "frame-gold",
    "primaryImageUrl": "https://...",
    "additionalImages": [
      { "url": "https://...", "caption": "Detail" }
    ]
  }
  ```

### `PUT /api/artworks/:id`
Update an existing artwork. Artist must own the piece or hold `ADMIN` role.

### `DELETE /api/artworks/:id`
Permanently remove an artwork and its cloud/local image assets.

---

## 3. Master Artist Endpoints

### `GET /api/artists`
List master traditional artists with portfolio previews.
- **Query Parameters**: `search`, `featured`, `page`, `limit`

### `GET /api/artists/:id`
Get full artist profile, studio biography, artist philosophy statement, and portfolio.

### `PUT /api/artists/profile`
Update artist profile details, statement, and social archives.
- **Role Required**: `ARTIST`

### `POST /api/artists/:id/follow`
Toggle follow/unfollow for a traditional artist.
- **Role Required**: `VISITOR`

---

## 4. Visitor / Personal Salon Endpoints

### `GET /api/visitors/dashboard`
Get personal salon overview (saved count, following count, inquiries, recent views).
- **Role Required**: `VISITOR`

### `GET /api/visitors/favourites`
Retrieve all favourited artworks in the visitor's private gallery wall.

### `POST /api/visitors/favourites/:artworkId`
Add or remove an artwork from private salon saves (toggle).

### `GET /api/visitors/following`
List artists followed by the visitor.

---

## 5. Acquisition Enquiry Endpoints

### `POST /api/enquiries`
Send an acquisition or commission enquiry to an artist.
- **Body**:
  ```json
  {
    "artistId": "...",
    "artworkId": "...", // Optional
    "senderName": "Julian Sterling",
    "senderEmail": "julian@sterling.com",
    "subject": "Acquisition Details",
    "message": "Inquiring about international crate transport..."
  }
  ```

### `GET /api/enquiries`
Fetch enquiries. Artists receive studio inquiries; visitors view sent communications.

### `PATCH /api/enquiries/:id/status`
Update enquiry status or dispatch artist response.
- **Role Required**: `ARTIST` or `ADMIN`

---

## 6. Curated Exhibitions Endpoints

### `GET /api/exhibitions`
List all virtual museum exhibition programs.

### `GET /api/exhibitions/:id`
Get exhibition details, curator essay, and participating artworks.

### `POST /api/exhibitions`
Curate and schedule a new exhibition program.
- **Role Required**: `ADMIN`

---

## 7. Administrator Endpoints

All admin endpoints require `ADMIN` role.

### `GET /api/admin/dashboard`
Curator overview metrics, pending verifications, and recent audit trail.

### `GET /api/admin/artists`
Manage artist roster. Filter by `status` (`PENDING_APPROVAL`, `ACTIVE`, `SUSPENDED`).

### `PATCH /api/admin/artists/:id/approve`
Verify and approve an artist profile for public exhibition.

### `PATCH /api/admin/artists/:id/reject`
Reject an artist application with recorded curatorial feedback.

### `PATCH /api/admin/artworks/:id/approve`
Approve an artwork submission and publish to the public gallery wall.

### `PATCH /api/admin/artworks/:id/reject`
Reject an artwork submission with revision requirements.

### `PATCH /api/admin/artworks/:id/feature`
Toggle "Curator's Choice" featured highlight on an artwork.

### `GET /api/admin/audit-logs`
Retrieve chronological administrative audit log with pagination.

### `GET /api/admin/reports`
Statistical breakdown across categories, mediums, and visitor engagement.

---

## 8. Upload Endpoints

### `POST /api/upload/single`
Upload single artwork or portrait photograph (multipart/form-data with field `image`).
- Automatic fallback: Stores in Cloudinary if configured; otherwise saves to local `backend/uploads/`.

### `POST /api/upload/multiple`
Upload up to 10 additional detail images (multipart/form-data with field `images`).


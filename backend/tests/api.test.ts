import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('ARTÉRA Backend REST API Suite', () => {
  let adminToken: string;
  let artistToken: string;
  let visitorToken: string;
  let sampleArtworkId: string;
  let sampleArtistId: string;

  beforeAll(async () => {
    // 1. Authenticate with seeded Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@artera.art', password: 'Admin@123456' });

    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.accessToken;

    // 2. Authenticate with seeded Artist
    const artistRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'artist@artera.art', password: 'Artist@123456' });

    expect(artistRes.status).toBe(200);
    artistToken = artistRes.body.data.accessToken;
    sampleArtistId = artistRes.body.data.user.artistProfile.id;

    // 3. Authenticate with seeded Visitor
    const visitorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'visitor@artera.art', password: 'Visitor@123456' });

    expect(visitorRes.status).toBe(200);
    visitorToken = visitorRes.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Authentication & Role Issuance', () => {
    it('should reject invalid credentials with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@artera.art', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should register a new visitor account with ACTIVE status', async () => {
      const uniqueEmail = `collector_${Date.now()}@artera.art`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'Password@123',
          name: 'Arthur Pendelton',
          role: 'VISITOR',
          location: 'Oxford, UK',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('VISITOR');
      expect(res.body.data.user.status).toBe('ACTIVE');
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should retrieve current authenticated user details from /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${visitorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('visitor@artera.art');
      expect(res.body.data.role).toBe('VISITOR');
    });
  });

  describe('2. Role-Based Access Control (RBAC)', () => {
    it('should block unauthenticated access to admin endpoints', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('should block a VISITOR from accessing admin endpoints with 403', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${visitorToken}`);

      expect(res.status).toBe(403);
    });

    it('should block an ARTIST from accessing admin endpoints with 403', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${artistToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow ADMIN to access the admin dashboard with 200', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats.totalArtworks).toBeGreaterThan(0);
    });
  });

  describe('3. Public Artwork & Gallery Endpoints', () => {
    it('should fetch published artworks with pagination', async () => {
      const res = await request(app).get('/api/artworks?limit=8');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();

      sampleArtworkId = res.body.data[0].id;
    });

    it('should fetch a single artwork with artist details and category', async () => {
      const res = await request(app).get(`/api/artworks/${sampleArtworkId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(sampleArtworkId);
      expect(res.body.data.artist).toBeDefined();
      expect(res.body.data.category).toBeDefined();
    });

    it('should support searching artworks by keyword', async () => {
      const res = await request(app).get('/api/artworks?search=oil');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('4. Visitor Features (Favourites & Enquiries)', () => {
    it('should toggle favourite on an artwork for the visitor', async () => {
      const res = await request(app)
        .post(`/api/visitors/favourites/${sampleArtworkId}`)
        .set('Authorization', `Bearer ${visitorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isFavourited).toBeDefined();
    });

    it('should fetch the visitor saved gallery', async () => {
      const res = await request(app)
        .get('/api/visitors/favourites')
        .set('Authorization', `Bearer ${visitorToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should submit an artwork enquiry to an artist', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .set('Authorization', `Bearer ${visitorToken}`)
        .send({
          artistId: sampleArtistId,
          artworkId: sampleArtworkId,
          senderName: 'Test Collector',
          senderEmail: 'test.collector@example.com',
          subject: 'Private Viewing Request',
          message: 'I am interested in acquiring this piece for an exhibition in Geneva.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('PENDING');
    });
  });

  describe('5. Artist Dashboard & Artwork Management', () => {
    it('should fetch artist dashboard metrics with real database calculations', async () => {
      const res = await request(app)
        .get('/api/artists/dashboard')
        .set('Authorization', `Bearer ${artistToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats.totalArtworks).toBeGreaterThan(0);
    });

    it('should prevent an artist from modifying another artists artwork', async () => {
      // Find an artwork by someone else
      const otherArtwork = await prisma.artwork.findFirst({
        where: { artistId: { not: sampleArtistId } },
      });

      if (otherArtwork) {
        const res = await request(app)
          .put(`/api/artworks/${otherArtwork.id}`)
          .set('Authorization', `Bearer ${artistToken}`)
          .send({ title: 'Hacked Title' });

        expect(res.status).toBe(403);
      }
    });
  });
});


import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Enforce admin role on all admin routes
router.use(authenticate, authorize(Role.ADMIN));

router.get('/dashboard', AdminController.getDashboard);

// Artist moderation
router.get('/artists', AdminController.getArtists);
router.patch('/artists/:id/approve', AdminController.approveArtist);
router.patch('/artists/:id/reject', AdminController.rejectArtist);
router.patch('/users/:userId/status', AdminController.setAccountStatus);

// Artwork moderation
router.get('/artworks', AdminController.getArtworks);
router.patch('/artworks/:id/approve', AdminController.approveArtwork);
router.patch('/artworks/:id/reject', AdminController.rejectArtwork);
router.patch('/artworks/:id/feature', AdminController.toggleFeatureArtwork);

// Reports & Audit Logs
router.get('/audit-logs', AdminController.getAuditLogs);
router.get('/reports', AdminController.getReports);

export default router;


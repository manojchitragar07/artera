import { Router } from 'express';
import { ArtistController } from '../controllers/artist.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { updateArtistProfileSchema } from '../validators/artist.validator';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', ArtistController.getArtists);
router.get('/dashboard', authenticate, authorize(Role.ARTIST), ArtistController.getDashboard);
router.get('/:id', optionalAuthenticate, ArtistController.getArtistById);

// Protected artist routes
router.put(
  '/profile',
  authenticate,
  authorize(Role.ARTIST),
  validate(updateArtistProfileSchema),
  ArtistController.updateProfile
);

// Follow / Unfollow
router.post('/:id/follow', authenticate, authorize(Role.VISITOR), ArtistController.toggleFollow);
router.delete('/:id/follow', authenticate, authorize(Role.VISITOR), ArtistController.toggleFollow);

export default router;


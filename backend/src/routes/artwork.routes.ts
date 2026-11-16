import { Router } from 'express';
import { ArtworkController } from '../controllers/artwork.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { createArtworkSchema, updateArtworkSchema, queryArtworkSchema } from '../validators/artwork.validator';
import { Role } from '@prisma/client';

const router = Router();

// Public explore & single artwork view (optional auth to know if favourited)
router.get('/', optionalAuthenticate, validate(queryArtworkSchema), ArtworkController.getArtworks);
router.get('/my', authenticate, authorize(Role.ARTIST), ArtworkController.getMyArtworks);
router.get('/:id', optionalAuthenticate, ArtworkController.getArtworkById);

// Artist actions
router.post(
  '/',
  authenticate,
  authorize(Role.ARTIST),
  validate(createArtworkSchema),
  ArtworkController.createArtwork
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ARTIST, Role.ADMIN),
  validate(updateArtworkSchema),
  ArtworkController.updateArtwork
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ARTIST, Role.ADMIN),
  ArtworkController.deleteArtwork
);

export default router;


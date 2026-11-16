import { Router } from 'express';
import { VisitorController } from '../controllers/visitor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { updateVisitorProfileSchema } from '../validators/artist.validator';
import { Role } from '@prisma/client';

const router = Router();

// Visitor dashboard & features
router.use(authenticate, authorize(Role.VISITOR));

router.get('/dashboard', VisitorController.getDashboard);
router.get('/favourites', VisitorController.getFavourites);
router.post('/favourites/:artworkId', VisitorController.toggleFavourite);
router.delete('/favourites/:artworkId', VisitorController.toggleFavourite);
router.get('/following', VisitorController.getFollowedArtists);
router.put('/profile', validate(updateVisitorProfileSchema), VisitorController.updateProfile);

export default router;


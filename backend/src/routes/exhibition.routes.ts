import { Router } from 'express';
import { ExhibitionController } from '../controllers/exhibition.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { createExhibitionSchema, updateExhibitionSchema } from '../validators/exhibition.validator';
import { Role } from '@prisma/client';

const router = Router();

// Public browsing of curated exhibitions
router.get('/', ExhibitionController.getExhibitions);
router.get('/:id', ExhibitionController.getExhibitionById);

// Admin exhibition curation
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(createExhibitionSchema),
  ExhibitionController.createExhibition
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(updateExhibitionSchema),
  ExhibitionController.updateExhibition
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  ExhibitionController.deleteExhibition
);

export default router;


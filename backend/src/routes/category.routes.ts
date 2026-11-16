import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public listing
router.get('/', CategoryController.getCategories);
router.get('/mediums', CategoryController.getMediums);

// Admin creation
router.post('/', authenticate, authorize(Role.ADMIN), CategoryController.createCategory);
router.post('/mediums', authenticate, authorize(Role.ADMIN), CategoryController.createMedium);

export default router;


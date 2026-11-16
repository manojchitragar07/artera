import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Allow authenticated artists and admins to upload images
router.post('/single', authenticate, upload.single('image'), UploadController.uploadSingle);
router.post('/multiple', authenticate, upload.array('images', 10), UploadController.uploadMultiple);

export default router;


import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createEnquirySchema, updateEnquiryStatusSchema } from '../validators/enquiry.validator';

const router = Router();

// Create enquiry (public or logged-in visitor)
router.post('/', optionalAuthenticate, validate(createEnquirySchema), EnquiryController.createEnquiry);

// Authenticated viewing and management
router.get('/', authenticate, EnquiryController.getEnquiries);
router.get('/:id', authenticate, EnquiryController.getEnquiryById);
router.patch('/:id/status', authenticate, validate(updateEnquiryStatusSchema), EnquiryController.updateEnquiryStatus);

export default router;


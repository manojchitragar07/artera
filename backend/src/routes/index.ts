import { Router } from 'express';
import authRoutes from './auth.routes';
import artworkRoutes from './artwork.routes';
import artistRoutes from './artist.routes';
import visitorRoutes from './visitor.routes';
import enquiryRoutes from './enquiry.routes';
import collectionRoutes from './collection.routes';
import exhibitionRoutes from './exhibition.routes';
import adminRoutes from './admin.routes';
import categoryRoutes from './category.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/artworks', artworkRoutes);
router.use('/artists', artistRoutes);
router.use('/visitors', visitorRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/collections', collectionRoutes);
router.use('/exhibitions', exhibitionRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ARTÉRA API',
  });
});

export default router;


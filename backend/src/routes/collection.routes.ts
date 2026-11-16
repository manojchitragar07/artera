import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addArtworkToCollectionSchema,
} from '../validators/collection.validator';

const router = Router();

router.get('/', optionalAuthenticate, CollectionController.getCollections);
router.get('/:id', optionalAuthenticate, CollectionController.getCollectionById);
router.post('/', authenticate, validate(createCollectionSchema), CollectionController.createCollection);
router.put('/:id', authenticate, validate(updateCollectionSchema), CollectionController.updateCollection);
router.delete('/:id', authenticate, CollectionController.deleteCollection);
router.post('/:id/artworks', authenticate, validate(addArtworkToCollectionSchema), CollectionController.addArtwork);
router.delete('/:id/artworks/:artworkId', authenticate, CollectionController.removeArtwork);

export default router;


import { z } from 'zod';
import { ArtworkStatus } from '@prisma/client';

export const createArtworkSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    categoryId: z.string().min(1, 'Category is required'),
    mediumId: z.string().optional().nullable(),
    dimensions: z.string().min(2, 'Dimensions are required (e.g. 80 x 100 cm)'),
    creationYear: z.coerce.number().int().min(1500).max(new Date().getFullYear()),
    price: z.coerce.number().positive().optional().nullable(),
    isForSale: z.coerce.boolean().optional().default(true),
    isEnquiryOnly: z.coerce.boolean().optional().default(false),
    status: z.nativeEnum(ArtworkStatus).optional().default(ArtworkStatus.PENDING_APPROVAL),
    frameStyle: z.string().optional().default('natural-oak'),
    tags: z.string().optional().nullable(),
    primaryImageUrl: z.string().url().optional(),
    primaryImagePublicId: z.string().optional(),
    additionalImages: z
      .array(
        z.object({
          url: z.string().url(),
          publicId: z.string().optional(),
          caption: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const updateArtworkSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    categoryId: z.string().optional(),
    mediumId: z.string().optional().nullable(),
    dimensions: z.string().optional(),
    creationYear: z.coerce.number().int().min(1500).max(new Date().getFullYear()).optional(),
    price: z.coerce.number().positive().optional().nullable(),
    isForSale: z.coerce.boolean().optional(),
    isEnquiryOnly: z.coerce.boolean().optional(),
    status: z.nativeEnum(ArtworkStatus).optional(),
    frameStyle: z.string().optional(),
    tags: z.string().optional().nullable(),
    primaryImageUrl: z.string().url().optional(),
    primaryImagePublicId: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Artwork ID is required'),
  }),
});

export const queryArtworkSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(12),
    categoryId: z.string().optional(),
    categorySlug: z.string().optional(),
    mediumId: z.string().optional(),
    artistId: z.string().optional(),
    artistSlug: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['newest', 'oldest', 'price-low', 'price-high', 'popular', 'featured']).optional().default('newest'),
    featured: z.coerce.boolean().optional(),
  }),
});


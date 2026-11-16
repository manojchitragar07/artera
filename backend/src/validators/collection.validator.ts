import { z } from 'zod';

export const createCollectionSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Collection title is required'),
    description: z.string().optional().nullable(),
    isPublic: z.boolean().optional().default(true),
    coverImage: z.string().optional().nullable(),
    artworkIds: z.array(z.string()).optional(),
  }),
});

export const updateCollectionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional().nullable(),
    isPublic: z.boolean().optional(),
    coverImage: z.string().optional().nullable(),
  }),
});

export const addArtworkToCollectionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    artworkId: z.string().min(1),
  }),
});


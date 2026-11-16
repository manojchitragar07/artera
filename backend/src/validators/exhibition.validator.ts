import { z } from 'zod';
import { ExhibitionStatus } from '@prisma/client';

export const createExhibitionSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    subtitle: z.string().optional().nullable(),
    curatorStatement: z.string().min(20, 'Curator statement must be at least 20 characters'),
    coverImage: z.string().url('Cover image must be a valid URL'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    status: z.nativeEnum(ExhibitionStatus).optional().default(ExhibitionStatus.UPCOMING),
    featured: z.boolean().optional().default(false),
    artworkIds: z.array(z.string()).optional(),
  }),
});

export const updateExhibitionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    subtitle: z.string().optional().nullable(),
    curatorStatement: z.string().min(20).optional(),
    coverImage: z.string().url().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.nativeEnum(ExhibitionStatus).optional(),
    featured: z.boolean().optional(),
    artworkIds: z.array(z.string()).optional(),
  }),
});


import { z } from 'zod';

export const updateArtistProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional().nullable(),
    statement: z.string().optional().nullable(),
    speciality: z.string().min(2).optional(),
    disciplines: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    yearsOfExperience: z.coerce.number().int().min(0).max(100).optional().nullable(),
    profileImage: z.string().optional().nullable(),
    coverImage: z.string().optional().nullable(),
    website: z.string().url().optional().nullable().or(z.literal('')),
    instagram: z.string().optional().nullable(),
  }),
});

export const updateVisitorProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    avatar: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
  }),
});


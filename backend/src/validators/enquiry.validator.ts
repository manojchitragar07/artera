import { z } from 'zod';
import { EnquiryStatus } from '@prisma/client';

export const createEnquirySchema = z.object({
  body: z.object({
    artistId: z.string().min(1, 'Artist is required'),
    artworkId: z.string().optional().nullable(),
    senderName: z.string().min(2, 'Name must be at least 2 characters'),
    senderEmail: z.string().email('Please enter a valid email address'),
    senderPhone: z.string().optional().nullable(),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
});

export const updateEnquiryStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.nativeEnum(EnquiryStatus).optional(),
    artistResponse: z.string().optional(),
  }),
});


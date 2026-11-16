import { EnquiryStatus, Role, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class EnquiryService {
  static async createEnquiry(
    data: {
      artistId: string;
      artworkId?: string | null;
      senderName: string;
      senderEmail: string;
      senderPhone?: string | null;
      subject: string;
      message: string;
    },
    visitorProfileId?: string
  ) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: data.artistId },
      include: { user: true },
    });

    if (!artist) {
      throw ApiError.notFound('Artist not found');
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        artistId: data.artistId,
        artworkId: data.artworkId || null,
        visitorId: visitorProfileId || null,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        senderPhone: data.senderPhone || null,
        subject: data.subject,
        message: data.message,
        status: EnquiryStatus.PENDING,
      },
      include: {
        artwork: { select: { id: true, title: true, primaryImageUrl: true } },
        artist: { select: { id: true, name: true, slug: true } },
      },
    });

    // Notify artist
    await prisma.notification.create({
      data: {
        userId: artist.userId,
        title: 'New Artwork Enquiry',
        message: `${data.senderName} sent an enquiry: "${data.subject}"`,
        type: 'ENQUIRY_RECEIVED',
        link: `/artist/enquiries/${enquiry.id}`,
      },
    });

    return enquiry;
  }

  static async getEnquiries(params: {
    userId: string;
    role: Role;
    artistProfileId?: string;
    visitorProfileId?: string;
    status?: EnquiryStatus;
  }) {
    const where: Prisma.EnquiryWhereInput = {};

    if (params.role === Role.ARTIST) {
      if (!params.artistProfileId) throw ApiError.badRequest('Artist profile missing');
      where.artistId = params.artistProfileId;
    } else if (params.role === Role.VISITOR) {
      if (!params.visitorProfileId) throw ApiError.badRequest('Visitor profile missing');
      where.visitorId = params.visitorProfileId;
    }
    // Admin sees all enquiries

    if (params.status) {
      where.status = params.status;
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            slug: true,
            primaryImageUrl: true,
            price: true,
            isEnquiryOnly: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            profileImage: true,
          },
        },
      },
    });

    return enquiries;
  }

  static async getEnquiryById(enquiryId: string, userId: string, role: Role) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: {
        artwork: true,
        artist: { include: { user: { select: { id: true } } } },
        visitor: { include: { user: { select: { id: true } } } },
      },
    });

    if (!enquiry) {
      throw ApiError.notFound('Enquiry not found');
    }

    // Role check
    if (role === Role.ARTIST && enquiry.artist.user.id !== userId) {
      throw ApiError.forbidden('You can only access enquiries sent to you');
    }

    if (role === Role.VISITOR && enquiry.visitor?.user.id !== userId) {
      throw ApiError.forbidden('You can only access your own enquiries');
    }

    return enquiry;
  }

  static async updateEnquiryStatus(
    enquiryId: string,
    artistProfileId: string,
    data: { status?: EnquiryStatus; artistResponse?: string }
  ) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: { visitor: { include: { user: true } } },
    });

    if (!enquiry) {
      throw ApiError.notFound('Enquiry not found');
    }

    if (enquiry.artistId !== artistProfileId) {
      throw ApiError.forbidden('You can only manage enquiries for your studio');
    }

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.artistResponse !== undefined
          ? {
              artistResponse: data.artistResponse,
              respondedAt: new Date(),
              status: EnquiryStatus.IN_PROGRESS,
            }
          : {}),
      },
      include: { artwork: true, artist: true },
    });

    // Notify visitor if visitor is registered
    if (data.artistResponse && enquiry.visitor?.user) {
      await prisma.notification.create({
        data: {
          userId: enquiry.visitor.user.id,
          title: 'Response to your enquiry',
          message: `${updated.artist.name} replied to your enquiry regarding "${updated.artwork?.title || 'your request'}"`,
          type: 'ENQUIRY_REPLIED',
          link: `/visitor/enquiries`,
        },
      });
    }

    return updated;
  }
}


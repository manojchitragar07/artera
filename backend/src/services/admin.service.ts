import { Role, AccountStatus, ArtworkStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class AdminService {
  static async getDashboardOverview() {
    const [
      totalArtists,
      totalVisitors,
      totalArtworks,
      pendingArtists,
      pendingArtworks,
      publishedArtworks,
      totalEnquiries,
      recentLogs,
      recentArtworks,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.ARTIST } }),
      prisma.user.count({ where: { role: Role.VISITOR } }),
      prisma.artwork.count(),
      prisma.user.count({ where: { role: Role.ARTIST, status: AccountStatus.PENDING_APPROVAL } }),
      prisma.artwork.count({ where: { status: ArtworkStatus.PENDING_APPROVAL } }),
      prisma.artwork.count({ where: { status: ArtworkStatus.PUBLISHED } }),
      prisma.enquiry.count(),
      prisma.adminAuditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { email: true } } },
      }),
      prisma.artwork.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: { select: { name: true, slug: true } },
          category: { select: { name: true } },
        },
      }),
    ]);

    return {
      stats: {
        totalArtists,
        totalVisitors,
        totalArtworks,
        pendingArtists,
        pendingArtworks,
        publishedArtworks,
        totalEnquiries,
      },
      recentLogs,
      recentArtworks,
    };
  }

  static async getArtists(params: {
    status?: AccountStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = { role: Role.ARTIST };
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { artistProfile: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          artistProfile: {
            include: {
              _count: { select: { artworks: true, followers: true } },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      artists: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async approveArtist(artistProfileId: string, adminId: string) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistProfileId },
      include: { user: true },
    });

    if (!artist) throw ApiError.notFound('Artist not found');

    await prisma.$transaction([
      prisma.user.update({
        where: { id: artist.userId },
        data: { status: AccountStatus.ACTIVE },
      }),
      prisma.notification.create({
        data: {
          userId: artist.userId,
          title: 'Artist Application Approved',
          message: 'Welcome to ARTÉRA! Your artist profile is now approved and verified for public exhibition.',
          type: 'SYSTEM',
          link: '/artist/overview',
        },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId,
          action: 'APPROVE_ARTIST',
          targetType: 'ArtistProfile',
          targetId: artist.id,
          details: JSON.stringify({ artistName: artist.name, email: artist.user.email }),
        },
      }),
    ]);

    return { success: true, message: `Artist ${artist.name} approved successfully` };
  }

  static async rejectArtist(artistProfileId: string, reason: string, adminId: string) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistProfileId },
      include: { user: true },
    });

    if (!artist) throw ApiError.notFound('Artist not found');

    await prisma.$transaction([
      prisma.user.update({
        where: { id: artist.userId },
        data: { status: AccountStatus.REJECTED },
      }),
      prisma.notification.create({
        data: {
          userId: artist.userId,
          title: 'Application Update',
          message: `Your artist portfolio application was not accepted at this time: ${reason || 'Portfolio criteria not met.'}`,
          type: 'SYSTEM',
        },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId,
          action: 'REJECT_ARTIST',
          targetType: 'ArtistProfile',
          targetId: artist.id,
          details: JSON.stringify({ reason }),
        },
      }),
    ]);

    return { success: true, message: `Artist ${artist.name} application rejected` };
  }

  static async setAccountStatus(userId: string, status: AccountStatus, adminId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId,
          action: `SET_STATUS_${status}`,
          targetType: 'User',
          targetId: userId,
          details: JSON.stringify({ previousStatus: user.status, newStatus: status }),
        },
      }),
    ]);

    return { success: true, message: `Account status updated to ${status}` };
  }

  static async getArtworks(params: {
    status?: ArtworkStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { artist: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true } },
          medium: { select: { id: true, name: true } },
        },
      }),
      prisma.artwork.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      artworks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async approveArtwork(artworkId: string, adminId: string) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { artist: true },
    });

    if (!artwork) throw ApiError.notFound('Artwork not found');

    await prisma.$transaction([
      prisma.artwork.update({
        where: { id: artworkId },
        data: { status: ArtworkStatus.PUBLISHED, rejectionReason: null },
      }),
      prisma.notification.create({
        data: {
          userId: artwork.artist.userId,
          title: 'Artwork Published',
          message: `Your artwork "${artwork.title}" has been approved and is now live in the gallery sanctuary.`,
          type: 'ARTWORK_APPROVED',
          link: `/artworks/${artwork.slug}`,
        },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId,
          action: 'APPROVE_ARTWORK',
          targetType: 'Artwork',
          targetId: artwork.id,
          details: JSON.stringify({ title: artwork.title, artist: artwork.artist.name }),
        },
      }),
    ]);

    return { success: true, message: `Artwork "${artwork.title}" approved and published` };
  }

  static async rejectArtwork(artworkId: string, reason: string, adminId: string) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { artist: true },
    });

    if (!artwork) throw ApiError.notFound('Artwork not found');

    await prisma.$transaction([
      prisma.artwork.update({
        where: { id: artworkId },
        data: { status: ArtworkStatus.REJECTED, rejectionReason: reason },
      }),
      prisma.notification.create({
        data: {
          userId: artwork.artist.userId,
          title: 'Artwork Submission Needs Revision',
          message: `Your artwork "${artwork.title}" requires modification: ${reason}`,
          type: 'ARTWORK_REJECTED',
          link: `/artist/artwork`,
        },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId,
          action: 'REJECT_ARTWORK',
          targetType: 'Artwork',
          targetId: artwork.id,
          details: JSON.stringify({ reason, title: artwork.title }),
        },
      }),
    ]);

    return { success: true, message: `Artwork "${artwork.title}" rejected` };
  }

  static async toggleFeatureArtwork(artworkId: string, isFeatured: boolean, adminId: string) {
    const artwork = await prisma.artwork.update({
      where: { id: artworkId },
      data: { isFeatured },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: isFeatured ? 'FEATURE_ARTWORK' : 'UNFEATURE_ARTWORK',
        targetType: 'Artwork',
        targetId: artwork.id,
        details: JSON.stringify({ title: artwork.title, isFeatured }),
      },
    });

    return { success: true, isFeatured: artwork.isFeatured };
  }

  static async getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { email: true } } },
      }),
      prisma.adminAuditLog.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getReports() {
    const [
      categoryBreakdown,
      mediumBreakdown,
      topViewed,
      topFavourited,
    ] = await Promise.all([
      prisma.category.findMany({
        select: {
          name: true,
          _count: { select: { artworks: true } },
        },
      }),
      prisma.medium.findMany({
        select: {
          name: true,
          _count: { select: { artworks: true } },
        },
      }),
      prisma.artwork.findMany({
        take: 5,
        orderBy: { viewsCount: 'desc' },
        select: { title: true, viewsCount: true, artist: { select: { name: true } } },
      }),
      prisma.artwork.findMany({
        take: 5,
        orderBy: { favoritesCount: 'desc' },
        select: { title: true, favoritesCount: true, artist: { select: { name: true } } },
      }),
    ]);

    return {
      categories: categoryBreakdown.map((c) => ({ name: c.name, count: c._count.artworks })),
      mediums: mediumBreakdown.map((m) => ({ name: m.name, count: m._count.artworks })),
      topViewed,
      topFavourited,
    };
  }
}

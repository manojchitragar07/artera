import { ArtworkStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class ArtistService {
  static async getArtists(params: {
    page?: number;
    limit?: number;
    search?: string;
    speciality?: string;
    featured?: boolean;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const skip = (page - 1) * limit;

    const where: Prisma.ArtistProfileWhereInput = {
      user: {
        status: 'ACTIVE',
      },
    };

    if (params.featured !== undefined) {
      where.featured = params.featured;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { speciality: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
        { bio: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [artists, total] = await Promise.all([
      prisma.artistProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          artworks: {
            where: { status: ArtworkStatus.PUBLISHED },
            select: {
              id: true,
              title: true,
              slug: true,
              primaryImageUrl: true,
            },
            take: 3,
          },
          _count: {
            select: {
              artworks: { where: { status: ArtworkStatus.PUBLISHED } },
              followers: true,
            },
          },
        },
      }),
      prisma.artistProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      artists,
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

  static async getArtistByIdOrSlug(idOrSlug: string, visitorProfileId?: string) {
    const artist = await prisma.artistProfile.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        user: { select: { email: true, status: true } },
        artworks: {
          where: { status: ArtworkStatus.PUBLISHED },
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
            medium: true,
          },
        },
        _count: {
          select: {
            artworks: { where: { status: ArtworkStatus.PUBLISHED } },
            followers: true,
          },
        },
      },
    });

    if (!artist) {
      throw ApiError.notFound('Artist profile not found');
    }

    let isFollowing = false;
    if (visitorProfileId) {
      const follow = await prisma.artistFollow.findUnique({
        where: {
          visitorId_artistId: {
            visitorId: visitorProfileId,
            artistId: artist.id,
          },
        },
      });
      isFollowing = Boolean(follow);
    }

    return {
      ...artist,
      isFollowing,
    };
  }

  static async updateProfile(artistProfileId: string, data: any) {
    const updated = await prisma.artistProfile.update({
      where: { id: artistProfileId },
      data,
    });
    return updated;
  }

  static async getDashboardOverview(artistProfileId: string) {
    const [
      totalArtworks,
      publishedArtworks,
      pendingArtworks,
      artworksStats,
      enquiriesCount,
      recentEnquiries,
      followersCount,
    ] = await Promise.all([
      prisma.artwork.count({ where: { artistId: artistProfileId } }),
      prisma.artwork.count({ where: { artistId: artistProfileId, status: ArtworkStatus.PUBLISHED } }),
      prisma.artwork.count({ where: { artistId: artistProfileId, status: ArtworkStatus.PENDING_APPROVAL } }),
      prisma.artwork.aggregate({
        where: { artistId: artistProfileId },
        _sum: {
          viewsCount: true,
          favoritesCount: true,
        },
      }),
      prisma.enquiry.count({ where: { artistId: artistProfileId } }),
      prisma.enquiry.findMany({
        where: { artistId: artistProfileId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          artwork: { select: { id: true, title: true, primaryImageUrl: true } },
        },
      }),
      prisma.artistFollow.count({ where: { artistId: artistProfileId } }),
    ]);

    // Top viewed artworks
    const topArtworks = await prisma.artwork.findMany({
      where: { artistId: artistProfileId },
      take: 4,
      orderBy: { viewsCount: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        viewsCount: true,
        favoritesCount: true,
        primaryImageUrl: true,
        status: true,
      },
    });

    return {
      stats: {
        totalArtworks,
        publishedArtworks,
        pendingArtworks,
        totalViews: artworksStats._sum.viewsCount || 0,
        totalFavourites: artworksStats._sum.favoritesCount || 0,
        totalEnquiries: enquiriesCount,
        followersCount,
      },
      topArtworks,
      recentEnquiries,
    };
  }

  static async toggleFollow(artistId: string, visitorProfileId: string) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      throw ApiError.notFound('Artist not found');
    }

    const existingFollow = await prisma.artistFollow.findUnique({
      where: {
        visitorId_artistId: {
          visitorId: visitorProfileId,
          artistId,
        },
      },
    });

    if (existingFollow) {
      await prisma.artistFollow.delete({
        where: {
          visitorId_artistId: {
            visitorId: visitorProfileId,
            artistId,
          },
        },
      });
      return { following: false, message: 'Unfollowed artist' };
    } else {
      await prisma.artistFollow.create({
        data: {
          visitorId: visitorProfileId,
          artistId,
        },
      });

      // Send notification to artist
      await prisma.notification.create({
        data: {
          userId: artist.userId,
          title: 'New Follower',
          message: 'An art collector has started following your studio profile.',
          type: 'NEW_FOLLOWER',
          link: `/artists/${artist.slug}`,
        },
      });

      return { following: true, message: 'Following artist' };
    }
  }
}


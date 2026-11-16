import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class VisitorService {
  static async getDashboard(visitorProfileId: string) {
    const [
      visitor,
      favouritesCount,
      followingCount,
      enquiriesCount,
      collectionsCount,
      recentFavourites,
      recentEnquiries,
      recentViews,
    ] = await Promise.all([
      prisma.visitorProfile.findUnique({
        where: { id: visitorProfileId },
      }),
      prisma.favourite.count({ where: { visitorId: visitorProfileId } }),
      prisma.artistFollow.count({ where: { visitorId: visitorProfileId } }),
      prisma.enquiry.count({ where: { visitorId: visitorProfileId } }),
      prisma.collection.count({ where: { visitorId: visitorProfileId } }),
      prisma.favourite.findMany({
        where: { visitorId: visitorProfileId },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          artwork: {
            include: {
              artist: { select: { id: true, name: true, slug: true } },
              category: true,
            },
          },
        },
      }),
      prisma.enquiry.findMany({
        where: { visitorId: visitorProfileId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: { select: { id: true, name: true, slug: true, profileImage: true } },
          artwork: { select: { id: true, title: true, primaryImageUrl: true } },
        },
      }),
      prisma.artworkView.findMany({
        where: { visitorId: visitorProfileId },
        take: 4,
        orderBy: { viewedAt: 'desc' },
        distinct: ['artworkId'],
        include: {
          artwork: {
            include: {
              artist: { select: { id: true, name: true, slug: true } },
              category: true,
            },
          },
        },
      }),
    ]);

    if (!visitor) {
      throw ApiError.notFound('Visitor profile not found');
    }

    return {
      visitor,
      stats: {
        favouritesCount,
        followingCount,
        enquiriesCount,
        collectionsCount,
      },
      recentFavourites: recentFavourites.map((f) => f.artwork),
      recentEnquiries,
      recentlyViewed: recentViews.map((v) => v.artwork),
    };
  }

  static async getFavourites(visitorProfileId: string) {
    const favourites = await prisma.favourite.findMany({
      where: { visitorId: visitorProfileId },
      orderBy: { createdAt: 'desc' },
      include: {
        artwork: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                slug: true,
                location: true,
                profileImage: true,
              },
            },
            category: true,
            medium: true,
          },
        },
      },
    });

    return favourites.map((f) => ({
      ...f.artwork,
      favouritedAt: f.createdAt,
    }));
  }

  static async toggleFavourite(artworkId: string, visitorProfileId: string) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { artist: true },
    });

    if (!artwork) {
      throw ApiError.notFound('Artwork not found');
    }

    const existing = await prisma.favourite.findUnique({
      where: {
        visitorId_artworkId: {
          visitorId: visitorProfileId,
          artworkId,
        },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.favourite.delete({
          where: {
            visitorId_artworkId: {
              visitorId: visitorProfileId,
              artworkId,
            },
          },
        }),
        prisma.artwork.update({
          where: { id: artworkId },
          data: { favoritesCount: { decrement: 1 } },
        }),
      ]);
      return { isFavourited: false, message: 'Removed from your saved gallery' };
    } else {
      await prisma.$transaction([
        prisma.favourite.create({
          data: {
            visitorId: visitorProfileId,
            artworkId,
          },
        }),
        prisma.artwork.update({
          where: { id: artworkId },
          data: { favoritesCount: { increment: 1 } },
        }),
      ]);

      // Notify artist
      if (artwork.artist) {
        await prisma.notification.create({
          data: {
            userId: artwork.artist.userId,
            title: 'Artwork Favourited',
            message: `Someone added "${artwork.title}" to their saved art sanctuary.`,
            type: 'SYSTEM',
            link: `/artworks/${artwork.slug}`,
          },
        });
      }

      return { isFavourited: true, message: 'Added to your saved gallery' };
    }
  }

  static async getFollowedArtists(visitorProfileId: string) {
    const followed = await prisma.artistFollow.findMany({
      where: { visitorId: visitorProfileId },
      orderBy: { createdAt: 'desc' },
      include: {
        artist: {
          include: {
            artworks: {
              take: 3,
              orderBy: { createdAt: 'desc' },
              select: { id: true, title: true, slug: true, primaryImageUrl: true },
            },
            _count: {
              select: { artworks: true, followers: true },
            },
          },
        },
      },
    });

    return followed.map((f) => f.artist);
  }

  static async updateProfile(visitorProfileId: string, data: any) {
    return prisma.visitorProfile.update({
      where: { id: visitorProfileId },
      data,
    });
  }
}


import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class CollectionService {
  static async getCollections(params: {
    visitorProfileId?: string;
    artistProfileId?: string;
    isPublic?: boolean;
  }) {
    const where: any = {};

    if (params.visitorProfileId) {
      where.visitorId = params.visitorProfileId;
    } else if (params.artistProfileId) {
      where.artistId = params.artistProfileId;
    } else if (params.isPublic !== undefined) {
      where.isPublic = params.isPublic;
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        visitor: { select: { id: true, name: true, avatar: true } },
        artist: { select: { id: true, name: true, slug: true, profileImage: true } },
        artworks: {
          orderBy: { order: 'asc' },
          take: 4,
          include: {
            artwork: {
              select: {
                id: true,
                title: true,
                slug: true,
                primaryImageUrl: true,
              },
            },
          },
        },
        _count: {
          select: { artworks: true },
        },
      },
    });

    return collections;
  }

  static async getCollectionByIdOrSlug(idOrSlug: string) {
    const collection = await prisma.collection.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        visitor: { select: { id: true, name: true, avatar: true } },
        artist: { select: { id: true, name: true, slug: true, profileImage: true } },
        artworks: {
          orderBy: { order: 'asc' },
          include: {
            artwork: {
              include: {
                artist: { select: { id: true, name: true, slug: true, location: true } },
                category: true,
                medium: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      throw ApiError.notFound('Collection not found');
    }

    return collection;
  }

  static async createCollection(data: {
    title: string;
    description?: string | null;
    isPublic?: boolean;
    coverImage?: string | null;
    artworkIds?: string[];
    visitorProfileId?: string;
    artistProfileId?: string;
  }) {
    const baseSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const collection = await prisma.collection.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        coverImage: data.coverImage || null,
        visitorId: data.visitorProfileId || null,
        artistId: data.artistProfileId || null,
      },
    });

    if (data.artworkIds && data.artworkIds.length > 0) {
      for (let i = 0; i < data.artworkIds.length; i++) {
        await prisma.collectionArtwork.create({
          data: {
            collectionId: collection.id,
            artworkId: data.artworkIds[i],
            order: i,
          },
        });
      }
    }

    return this.getCollectionByIdOrSlug(collection.id);
  }

  static async updateCollection(
    id: string,
    data: any,
    visitorProfileId?: string,
    artistProfileId?: string
  ) {
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) throw ApiError.notFound('Collection not found');

    if (
      (visitorProfileId && collection.visitorId !== visitorProfileId) ||
      (artistProfileId && collection.artistId !== artistProfileId)
    ) {
      throw ApiError.forbidden('You can only modify your own collection');
    }

    return prisma.collection.update({
      where: { id },
      data,
    });
  }

  static async deleteCollection(
    id: string,
    visitorProfileId?: string,
    artistProfileId?: string,
    isAdmin = false
  ) {
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) throw ApiError.notFound('Collection not found');

    if (
      !isAdmin &&
      ((visitorProfileId && collection.visitorId !== visitorProfileId) ||
        (artistProfileId && collection.artistId !== artistProfileId))
    ) {
      throw ApiError.forbidden('You can only delete your own collection');
    }

    await prisma.collection.delete({ where: { id } });
    return { success: true, message: 'Collection deleted successfully' };
  }

  static async addArtwork(collectionId: string, artworkId: string) {
    const existing = await prisma.collectionArtwork.findUnique({
      where: {
        collectionId_artworkId: {
          collectionId,
          artworkId,
        },
      },
    });

    if (existing) {
      return { success: true, message: 'Artwork already in collection' };
    }

    const count = await prisma.collectionArtwork.count({ where: { collectionId } });

    await prisma.collectionArtwork.create({
      data: {
        collectionId,
        artworkId,
        order: count,
      },
    });

    return { success: true, message: 'Artwork added to collection' };
  }

  static async removeArtwork(collectionId: string, artworkId: string) {
    await prisma.collectionArtwork.delete({
      where: {
        collectionId_artworkId: {
          collectionId,
          artworkId,
        },
      },
    });

    return { success: true, message: 'Artwork removed from collection' };
  }
}


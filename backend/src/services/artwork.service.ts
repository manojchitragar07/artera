import { ArtworkStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { deleteMedia } from '../config/cloudinary';

export class ArtworkService {
  static async getArtworks(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    categorySlug?: string;
    mediumId?: string;
    artistId?: string;
    artistSlug?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'featured';
    featured?: boolean;
    status?: ArtworkStatus; // Defaults to PUBLISHED for public queries
    includePrivate?: boolean;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 12));
    const skip = (page - 1) * limit;

    const where: Prisma.ArtworkWhereInput = {};

    // By default, public queries only see PUBLISHED artworks
    if (!params.includePrivate) {
      where.status = ArtworkStatus.PUBLISHED;
    } else if (params.status) {
      where.status = params.status;
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    if (params.mediumId) {
      where.mediumId = params.mediumId;
    }

    if (params.artistId) {
      where.artistId = params.artistId;
    }

    if (params.artistSlug) {
      where.artist = { slug: params.artistSlug };
    }

    if (params.featured !== undefined) {
      where.isFeatured = params.featured;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { tags: { contains: params.search, mode: 'insensitive' } },
        { artist: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    // Sorting
    let orderBy: Prisma.ArtworkOrderByWithRelationInput = { createdAt: 'desc' };
    if (params.sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    if (params.sortBy === 'price-low') orderBy = { price: 'asc' };
    if (params.sortBy === 'price-high') orderBy = { price: 'desc' };
    if (params.sortBy === 'popular') orderBy = { viewsCount: 'desc' };
    if (params.sortBy === 'featured') orderBy = { isFeatured: 'desc' };

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              slug: true,
              profileImage: true,
              location: true,
              speciality: true,
            },
          },
          category: { select: { id: true, name: true, slug: true } },
          medium: { select: { id: true, name: true, slug: true } },
          images: {
            orderBy: { order: 'asc' },
            take: 3,
          },
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

  static async getArtworkById(idOrSlug: string, visitorProfileId?: string, ipHash?: string) {
    const artwork = await prisma.artwork.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
            statement: true,
            profileImage: true,
            location: true,
            speciality: true,
            yearsOfExperience: true,
          },
        },
        category: true,
        medium: true,
        images: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            favourites: true,
            views: true,
          },
        },
      },
    });

    if (!artwork) {
      throw ApiError.notFound('Artwork not found');
    }

    // Check if the current visitor has favourited this artwork
    let isFavourited = false;
    if (visitorProfileId) {
      const fav = await prisma.favourite.findUnique({
        where: {
          visitorId_artworkId: {
            visitorId: visitorProfileId,
            artworkId: artwork.id,
          },
        },
      });
      isFavourited = Boolean(fav);
    }

    // Record view asynchronously without blocking response
    try {
      await prisma.$transaction([
        prisma.artworkView.create({
          data: {
            artworkId: artwork.id,
            ipHash: ipHash || 'unknown',
            visitorId: visitorProfileId || null,
          },
        }),
        prisma.artwork.update({
          where: { id: artwork.id },
          data: { viewsCount: { increment: 1 } },
        }),
      ]);
    } catch {
      // Ignore duplicate view counter issues
    }

    // Get related artworks from same category or artist
    const relatedArtworks = await prisma.artwork.findMany({
      where: {
        id: { not: artwork.id },
        status: ArtworkStatus.PUBLISHED,
        OR: [
          { categoryId: artwork.categoryId },
          { artistId: artwork.artistId },
        ],
      },
      take: 4,
      orderBy: { viewsCount: 'desc' },
      include: {
        artist: {
          select: { id: true, name: true, slug: true },
        },
        category: true,
      },
    });

    return {
      ...artwork,
      isFavourited,
      relatedArtworks,
    };
  }

  static async createArtwork(
    artistProfileId: string,
    data: {
      title: string;
      description: string;
      categoryId: string;
      mediumId?: string | null;
      dimensions: string;
      creationYear: number;
      price?: number | null;
      isForSale?: boolean;
      isEnquiryOnly?: boolean;
      status?: ArtworkStatus;
      frameStyle?: string;
      tags?: string | null;
      primaryImageUrl?: string;
      primaryImagePublicId?: string;
      additionalImages?: Array<{ url: string; publicId?: string; caption?: string }>;
    }
  ) {
    const baseSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const primaryUrl = data.primaryImageUrl || (data.additionalImages && data.additionalImages[0]?.url) || '';

    const artwork = await prisma.artwork.create({
      data: {
        artistId: artistProfileId,
        categoryId: data.categoryId,
        mediumId: data.mediumId || null,
        title: data.title,
        slug,
        description: data.description,
        dimensions: data.dimensions,
        creationYear: data.creationYear,
        price: data.price !== undefined ? data.price : null,
        isForSale: data.isForSale !== undefined ? data.isForSale : true,
        isEnquiryOnly: data.isEnquiryOnly !== undefined ? data.isEnquiryOnly : false,
        status: data.status || ArtworkStatus.PENDING_APPROVAL,
        frameStyle: data.frameStyle || 'natural-oak',
        tags: data.tags || '',
        primaryImageUrl: primaryUrl,
        primaryImagePublicId: data.primaryImagePublicId || null,
        images: {
          create: [
            ...(primaryUrl
              ? [
                  {
                    url: primaryUrl,
                    publicId: data.primaryImagePublicId || null,
                    isPrimary: true,
                    order: 0,
                  },
                ]
              : []),
            ...(data.additionalImages || [])
              .filter((img) => img.url !== primaryUrl)
              .map((img, idx) => ({
                url: img.url,
                publicId: img.publicId || null,
                caption: img.caption || null,
                isPrimary: false,
                order: idx + 1,
              })),
          ],
        },
      },
      include: {
        images: true,
        category: true,
        medium: true,
      },
    });

    return artwork;
  }

  static async updateArtwork(
    artworkId: string,
    artistProfileId: string | null,
    isAdmin: boolean,
    data: any
  ) {
    const existing = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { images: true },
    });

    if (!existing) {
      throw ApiError.notFound('Artwork not found');
    }

    if (!isAdmin && existing.artistId !== artistProfileId) {
      throw ApiError.forbidden('You can only modify your own artwork');
    }

    const updated = await prisma.artwork.update({
      where: { id: artworkId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(data.mediumId !== undefined ? { mediumId: data.mediumId } : {}),
        ...(data.dimensions ? { dimensions: data.dimensions } : {}),
        ...(data.creationYear ? { creationYear: data.creationYear } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.isForSale !== undefined ? { isForSale: data.isForSale } : {}),
        ...(data.isEnquiryOnly !== undefined ? { isEnquiryOnly: data.isEnquiryOnly } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.frameStyle ? { frameStyle: data.frameStyle } : {}),
        ...(data.tags !== undefined ? { tags: data.tags } : {}),
        ...(data.primaryImageUrl ? { primaryImageUrl: data.primaryImageUrl } : {}),
        ...(data.primaryImagePublicId ? { primaryImagePublicId: data.primaryImagePublicId } : {}),
      },
      include: {
        images: true,
        category: true,
        medium: true,
      },
    });

    return updated;
  }

  static async deleteArtwork(artworkId: string, artistProfileId: string | null, isAdmin: boolean) {
    const existing = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { images: true },
    });

    if (!existing) {
      throw ApiError.notFound('Artwork not found');
    }

    if (!isAdmin && existing.artistId !== artistProfileId) {
      throw ApiError.forbidden('You can only delete your own artwork');
    }

    // Delete related images from storage
    for (const img of existing.images) {
      if (img.publicId) {
        await deleteMedia(img.publicId);
      }
    }
    if (existing.primaryImagePublicId) {
      await deleteMedia(existing.primaryImagePublicId);
    }

    await prisma.artwork.delete({
      where: { id: artworkId },
    });

    return { success: true, message: 'Artwork deleted successfully' };
  }
}


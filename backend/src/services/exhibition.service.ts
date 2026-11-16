import { ExhibitionStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class ExhibitionService {
  static async getExhibitions(params: { status?: ExhibitionStatus; featured?: boolean }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.featured !== undefined) where.featured = params.featured;

    const exhibitions = await prisma.exhibition.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { startDate: 'desc' }],
      include: {
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
                artist: { select: { name: true, slug: true } },
              },
            },
          },
        },
        _count: {
          select: { artworks: true },
        },
      },
    });

    return exhibitions;
  }

  static async getExhibitionByIdOrSlug(idOrSlug: string) {
    const exhibition = await prisma.exhibition.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        artworks: {
          orderBy: { order: 'asc' },
          include: {
            artwork: {
              include: {
                artist: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    speciality: true,
                    location: true,
                    profileImage: true,
                  },
                },
                category: true,
                medium: true,
              },
            },
          },
        },
      },
    });

    if (!exhibition) {
      throw ApiError.notFound('Exhibition not found');
    }

    return exhibition;
  }

  static async createExhibition(data: {
    title: string;
    subtitle?: string | null;
    curatorStatement: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    status?: ExhibitionStatus;
    featured?: boolean;
    artworkIds?: string[];
  }) {
    const baseSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const exhibition = await prisma.exhibition.create({
      data: {
        title: data.title,
        slug,
        subtitle: data.subtitle || null,
        curatorStatement: data.curatorStatement,
        coverImage: data.coverImage,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || ExhibitionStatus.UPCOMING,
        featured: data.featured || false,
      },
    });

    if (data.artworkIds && data.artworkIds.length > 0) {
      for (let i = 0; i < data.artworkIds.length; i++) {
        await prisma.exhibitionArtwork.create({
          data: {
            exhibitionId: exhibition.id,
            artworkId: data.artworkIds[i],
            order: i,
          },
        });
      }
    }

    return this.getExhibitionByIdOrSlug(exhibition.id);
  }

  static async updateExhibition(id: string, data: any) {
    const existing = await prisma.exhibition.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Exhibition not found');

    const updated = await prisma.exhibition.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
        ...(data.curatorStatement ? { curatorStatement: data.curatorStatement } : {}),
        ...(data.coverImage ? { coverImage: data.coverImage } : {}),
        ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
        ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
      },
    });

    if (data.artworkIds) {
      // Re-sync artworks
      await prisma.exhibitionArtwork.deleteMany({ where: { exhibitionId: id } });
      for (let i = 0; i < data.artworkIds.length; i++) {
        await prisma.exhibitionArtwork.create({
          data: {
            exhibitionId: id,
            artworkId: data.artworkIds[i],
            order: i,
          },
        });
      }
    }

    return this.getExhibitionByIdOrSlug(updated.id);
  }

  static async deleteExhibition(id: string) {
    await prisma.exhibition.delete({ where: { id } });
    return { success: true, message: 'Exhibition deleted successfully' };
  }
}


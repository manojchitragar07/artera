import { prisma } from '../config/prisma';

export class CategoryService {
  static async getCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { artworks: true } },
      },
    });
  }

  static async getMediums() {
    return prisma.medium.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { artworks: true } },
      },
    });
  }

  static async createCategory(name: string, description?: string, coverImage?: string) {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return prisma.category.create({
      data: { name, slug, description, coverImage },
    });
  }

  static async createMedium(name: string, description?: string) {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return prisma.medium.create({
      data: { name, slug, description },
    });
  }
}


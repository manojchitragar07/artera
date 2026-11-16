import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, AccountStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { config } from '../config';
import { ApiError } from '../utils/apiError';
import { JwtPayload } from '../types';

export class AuthService {
  static generateTokens(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn as any }
    );

    return { accessToken, refreshToken };
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
    speciality?: string;
    location?: string;
    bio?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    // Artists start as PENDING_APPROVAL unless approved by admin
    const status = data.role === Role.ARTIST ? AccountStatus.PENDING_APPROVAL : AccountStatus.ACTIVE;

    const baseSlug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role,
        status,
        ...(data.role === Role.ARTIST
          ? {
              artistProfile: {
                create: {
                  name: data.name,
                  slug,
                  speciality: data.speciality || 'Traditional Fine Art',
                  bio: data.bio || '',
                  location: data.location || '',
                },
              },
            }
          : {
              visitorProfile: {
                create: {
                  name: data.name,
                  bio: data.bio || '',
                  location: data.location || '',
                },
              },
            }),
      },
      include: {
        artistProfile: true,
        visitorProfile: true,
      },
    });

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      artistProfileId: user.artistProfile?.id,
      visitorProfileId: user.visitorProfile?.id,
    };

    const tokens = this.generateTokens(jwtPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        artistProfile: user.artistProfile,
        visitorProfile: user.visitorProfile,
      },
      ...tokens,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        artistProfile: true,
        visitorProfile: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status === AccountStatus.SUSPENDED) {
      throw ApiError.forbidden('Your account has been suspended. Please contact administrator.');
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      artistProfileId: user.artistProfile?.id,
      visitorProfileId: user.visitorProfile?.id,
    };

    const tokens = this.generateTokens(jwtPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        artistProfile: user.artistProfile,
        visitorProfile: user.visitorProfile,
      },
      ...tokens,
    };
  }

  static async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          artistProfile: true,
          visitorProfile: true,
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
      }

      if (user.status === AccountStatus.SUSPENDED) {
        throw ApiError.forbidden('Your account has been suspended');
      }

      const jwtPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        artistProfileId: user.artistProfile?.id,
        visitorProfileId: user.visitorProfile?.id,
      };

      const tokens = this.generateTokens(jwtPayload);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        artistProfile: true,
        visitorProfile: true,
        notifications: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}


import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { ApiError } from '../utils/apiError';
import { prisma } from '../config/prisma';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Invalid authorization header format');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Verify user is still active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        artistProfile: { select: { id: true, name: true, slug: true } },
        visitorProfile: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists');
    }

    if (user.status === 'SUSPENDED') {
      throw ApiError.forbidden('Your account has been suspended. Please contact support.');
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      artistProfileId: user.artistProfile?.id,
      visitorProfileId: user.visitorProfile?.id,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token has expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Malformed or invalid token'));
    } else {
      next(error);
    }
  }
}

// Optional authentication middleware for public endpoints that can personalize if authenticated
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        artistProfile: { select: { id: true, name: true, slug: true } },
        visitorProfile: { select: { id: true, name: true } },
      },
    });

    if (user && user.status !== 'SUSPENDED') {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        artistProfileId: user.artistProfile?.id,
        visitorProfileId: user.visitorProfile?.id,
      };
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
}


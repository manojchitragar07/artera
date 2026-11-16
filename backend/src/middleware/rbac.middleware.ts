import { Response, NextFunction } from 'express';
import { Role, AccountStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
}

/**
 * Checks that an artist has been approved by admin before they can publish public artworks
 */
export function requireApprovedArtist(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (req.user.role !== Role.ARTIST) {
    return next(ApiError.forbidden('Only artists can perform this action'));
  }

  if (req.user.status === AccountStatus.PENDING_APPROVAL) {
    return next(
      ApiError.forbidden(
        'Your artist account is currently pending administrator approval. You can draft artwork, but publication requires approval.'
      )
    );
  }

  if (req.user.status !== AccountStatus.ACTIVE) {
    return next(ApiError.forbidden('Your artist account is not active'));
  }

  next();
}


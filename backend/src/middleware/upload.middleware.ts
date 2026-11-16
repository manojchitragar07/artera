import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/apiError';

// Store files in memory buffer so we can stream directly to Cloudinary or local disk
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type: ${file.mimetype}. Allowed formats are JPEG, PNG, WEBP, AVIF, and GIF.`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit per image
    files: 10, // Max 10 images at once
  },
  fileFilter,
});


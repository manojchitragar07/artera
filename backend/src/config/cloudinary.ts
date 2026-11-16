import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { config } from './index';

if (config.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

// Ensure local upload directory exists
if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/**
 * Upload an uploaded multer file to either Cloudinary or local uploads directory
 */
export async function uploadMedia(file: Express.Multer.File): Promise<UploadResult> {
  if (config.cloudinary.isConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.cloudinary.folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  } else {
    // Local storage fallback for seamless local development
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${timestamp}_${cleanName}${ext}`;
    const filePath = path.join(config.uploadsDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      publicId: `local_${filename}`,
      format: ext.replace('.', ''),
      bytes: file.size,
    };
  }
}

/**
 * Delete media by public ID
 */
export async function deleteMedia(publicId: string): Promise<void> {
  if (publicId.startsWith('local_')) {
    const filename = publicId.replace('local_', '');
    const filePath = path.join(config.uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }
  } else if (config.cloudinary.isConfigured) {
    await cloudinary.uploader.destroy(publicId).catch(() => {});
  }
}

export { cloudinary };


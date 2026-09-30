import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { ENV } from './env';
import { logger } from '../utils/logger';

const isCloudinaryConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME &&
  ENV.CLOUDINARY_API_KEY &&
  ENV.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('Cloudinary configured successfully.');
} else {
  logger.warn('Cloudinary credentials missing or incomplete in .env. Falling back to local disk storage for uploads.');
}

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
}

/**
 * Upload an image buffer to Cloudinary, or fallback to local disk storage if Cloudinary is not configured.
 */
export const uploadImageBuffer = async (
  buffer: Buffer,
  folder: string = 'business_website/products',
  originalName: string = 'image.jpg'
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ quality: 'auto:good' }],
        },
        (error, result) => {
          if (error || !result) {
            logger.error('Cloudinary upload error:', error);
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  // Local disk fallback
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalName) || '.jpg';
  const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadsDir, cleanName);

  await fs.promises.writeFile(filePath, buffer);

  const localUrl = `/uploads/${cleanName}`;
  return {
    url: localUrl,
    publicId: `local-${cleanName}`,
  };
};

/**
 * Delete an image by its publicId
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  if (!publicId) return true;

  if (publicId.startsWith('local-')) {
    const filename = publicId.replace('local-', '');
    const filePath = path.resolve(__dirname, '../../uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        return true;
      } catch (err) {
        logger.error('Error deleting local file:', err);
        return false;
      }
    }
    return true;
  }

  if (isCloudinaryConfigured) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch (error) {
      logger.error('Error deleting Cloudinary image:', error);
      return false;
    }
  }

  return true;
};

export { cloudinary, isCloudinaryConfigured };

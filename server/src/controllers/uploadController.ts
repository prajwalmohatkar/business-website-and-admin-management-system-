import { Request, Response } from 'express';
import { uploadImageBuffer, deleteImage } from '../config/cloudinary';

/**
 * Upload single image
 * POST /api/uploads/single
 */
export const uploadSingle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const folder = (req.body.folder as string) || 'business_website/products';
    const result = await uploadImageBuffer(req.file.buffer, folder, req.file.originalname);

    res.json({
      success: true,
      message: 'Image uploaded successfully.',
      image: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image.',
      error: error.message,
    });
  }
};

/**
 * Upload multiple images
 * POST /api/uploads/multiple
 */
export const uploadMultiple = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded.' });
      return;
    }

    const folder = (req.body.folder as string) || 'business_website/products';

    const uploadPromises = files.map((file) =>
      uploadImageBuffer(file.buffer, folder, file.originalname)
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${results.length} images uploaded successfully.`,
      images: results.map((r) => ({
        url: r.url,
        publicId: r.publicId,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload images.',
      error: error.message,
    });
  }
};

/**
 * Delete image
 * DELETE /api/uploads
 */
export const deleteUploadedImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({ success: false, message: 'Public ID is required for deletion.' });
      return;
    }

    const deleted = await deleteImage(publicId);

    res.json({
      success: true,
      message: deleted ? 'Image deleted successfully.' : 'Image could not be deleted or was already removed.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete image.',
      error: error.message,
    });
  }
};

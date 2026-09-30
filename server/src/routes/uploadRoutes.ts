import { Router } from 'express';
import { uploadSingle, uploadMultiple, deleteUploadedImage } from '../controllers/uploadController';
import { requireAdmin } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

// Upload routes (Admin protected)
router.post('/single', requireAdmin, uploadMiddleware.single('image'), uploadSingle);
router.post('/multiple', requireAdmin, uploadMiddleware.array('images', 10), uploadMultiple);
router.delete('/', requireAdmin, deleteUploadedImage);

export default router;

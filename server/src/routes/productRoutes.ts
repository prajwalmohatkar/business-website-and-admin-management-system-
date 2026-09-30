import { Router } from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleStatus,
} from '../controllers/productController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin-protected routes
router.get('/admin/:id', requireAdmin, getProductById);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);
router.patch('/:id/featured', requireAdmin, toggleFeatured);
router.patch('/:id/status', requireAdmin, toggleStatus);

export default router;

import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route to view contact and business details
router.get('/', getSettings);

// Admin-protected route to update business information
router.put('/', requireAdmin, updateSettings);

export default router;

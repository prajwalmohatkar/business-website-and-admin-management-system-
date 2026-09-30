import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', requireAdmin, getDashboardStats);

export default router;

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  logout,
  getMe,
  changePassword,
  setupInitialAdmin,
} from '../controllers/authController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Rate limiting for login route (e.g., 20 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);
router.put('/change-password', requireAdmin, changePassword);
router.post('/setup-admin', setupInitialAdmin);

export default router;

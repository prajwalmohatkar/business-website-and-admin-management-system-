import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Rate limiter for enquiry submissions: max 15 submissions per 15 minutes per IP
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many enquiry requests from this IP, please try again shortly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route to submit an enquiry
router.post('/', enquiryLimiter, createEnquiry);

// Admin-protected routes
router.get('/', requireAdmin, getAllEnquiries);
router.put('/:id', requireAdmin, updateEnquiryStatus);
router.delete('/:id', requireAdmin, deleteEnquiry);

export default router;

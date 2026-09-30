import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Enquiry } from '../models/Enquiry';
import { localStore } from '../utils/localStore';

/**
 * Get Admin Dashboard Overview Statistics
 * GET /api/stats/dashboard
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const [
          totalProducts,
          activeProducts,
          totalCategories,
          featuredProducts,
          totalEnquiries,
          newEnquiries,
          recentProducts,
          recentEnquiries,
        ] = await Promise.all([
          Product.countDocuments(),
          Product.countDocuments({ status: 'published' }),
          Category.countDocuments(),
          Product.countDocuments({ featured: true, status: 'published' }),
          Enquiry.countDocuments(),
          Enquiry.countDocuments({ status: 'new' }),
          Product.find().populate('category', 'name').sort({ createdAt: -1 }).limit(5),
          Enquiry.find().sort({ createdAt: -1 }).limit(5),
        ]);

        res.json({
          success: true,
          stats: {
            totalProducts,
            activeProducts,
            totalCategories,
            featuredProducts,
            totalEnquiries,
            newEnquiries,
          },
          recentProducts,
          recentEnquiries,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const data = localStore.getStats();
    res.json({
      success: true,
      stats: data.stats,
      recentProducts: data.recentProducts,
      recentEnquiries: data.recentEnquiries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Enquiry } from '../models/Enquiry';
import { Product } from '../models/Product';
import { localStore } from '../utils/localStore';

/**
 * Submit Customer Enquiry / Quote Request (Public)
 * POST /api/enquiries
 */
export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, mobile, email, productId, message } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Please enter your name.' });
      return;
    }

    if (!mobile || !mobile.trim()) {
      res.status(400).json({ success: false, message: 'Please enter your mobile phone number.' });
      return;
    }

    // Basic mobile validation (must contain at least 10 digits)
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Please write your message or enquiry requirement.' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let productName = '';
        let productRef = null;

        if (productId) {
          const product = await Product.findById(productId);
          if (product) {
            productRef = product._id;
            productName = product.name;
          }
        }

        const enquiry = new Enquiry({
          name: name.trim(),
          mobile: mobile.trim(),
          email: email ? email.trim().toLowerCase() : '',
          product: productRef,
          productName,
          message: message.trim(),
          status: 'new',
        });

        await enquiry.save();

        res.status(201).json({
          success: true,
          message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
          enquiryId: enquiry._id,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    let productName = '';
    if (productId) {
      const prod = localStore.getProductById(productId);
      if (prod) {
        productName = prod.name;
      }
    }

    const enquiry = localStore.createEnquiry({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim().toLowerCase() : '',
      product: productId,
      productName,
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      enquiryId: enquiry._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all enquiries (Admin)
 * GET /api/enquiries
 */
export const getAllEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = {};

        if (status && status !== 'all') {
          query.status = status;
        }

        if (search && (search as string).trim()) {
          const searchRegex = new RegExp((search as string).trim(), 'i');
          query.$or = [
            { name: searchRegex },
            { mobile: searchRegex },
            { email: searchRegex },
            { productName: searchRegex },
            { message: searchRegex },
          ];
        }

        const [enquiries, totalCount, newCount] = await Promise.all([
          Enquiry.find(query)
            .populate('product', 'name slug images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
          Enquiry.countDocuments(query),
          Enquiry.countDocuments({ status: 'new' }),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
          success: true,
          enquiries,
          totalCount,
          newCount,
          totalPages,
          currentPage: pageNum,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const result = localStore.getEnquiries({
      status: status as string,
      search: search as string,
      page: pageNum,
      limit: limitNum,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update enquiry status and notes (Admin)
 * PUT /api/enquiries/:id
 */
export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const enquiry = await Enquiry.findById(id);
        if (enquiry) {
          if (status && ['new', 'contacted', 'completed'].includes(status)) {
            enquiry.status = status;
          }

          if (adminNotes !== undefined) {
            enquiry.adminNotes = adminNotes;
          }

          await enquiry.save();

          res.json({
            success: true,
            message: 'Enquiry updated successfully.',
            enquiry,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const enquiry = localStore.updateEnquiryStatus(id, status, adminNotes);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully.',
      enquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete enquiry (Admin)
 * DELETE /api/enquiries/:id
 */
export const deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const enquiry = await Enquiry.findByIdAndDelete(id);
        if (enquiry) {
          res.json({
            success: true,
            message: 'Enquiry deleted successfully.',
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const deleted = localStore.deleteEnquiry(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

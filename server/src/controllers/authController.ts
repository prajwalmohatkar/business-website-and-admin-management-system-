import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ENV } from '../config/env';
import { localStore } from '../utils/localStore';

/**
 * Admin Login
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Username/email and password are required.',
      });
      return;
    }

    let admin: any = null;
    let isMatch = false;

    // 1. If MongoDB is connected, check MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        admin = await Admin.findOne({
          $or: [
            { username: identifier.trim() },
            { email: identifier.trim().toLowerCase() },
          ],
        });

        if (admin) {
          isMatch = await admin.comparePassword(password);
          if (isMatch) {
            admin.lastLogin = new Date();
            await admin.save();
          }
        }
      } catch (dbErr) {
        // Fallback to localStore
        admin = null;
      }
    }

    // 2. If not found in DB or DB not connected, check localStore
    if (!admin) {
      const localAdmin = await localStore.getAdminByIdentifier(identifier);
      if (localAdmin) {
        isMatch = await bcrypt.compare(password, localAdmin.password);
        if (isMatch) {
          admin = localAdmin;
          await localStore.updateAdminLastLogin(localAdmin._id);
        }
      }
    }

    if (!admin || !isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.',
      });
      return;
    }

    const token = generateToken({
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    // Set HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error.',
      error: error.message,
    });
  }
};

/**
 * Admin Logout
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('admin_token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current admin session
 * GET /api/auth/me
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let admin: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        admin = await Admin.findById(req.admin.id).select('-password');
      } catch (err) {
        admin = await localStore.getAdminById(req.admin.id);
      }
    } else {
      admin = await localStore.getAdminById(req.admin.id);
    }

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin account not found.' });
      return;
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Change Admin Password
 * PUT /api/auth/change-password
 */
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const adminId = req.admin?.id;
    if (!adminId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findById(adminId);
      if (admin) {
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
          res.status(400).json({ success: false, message: 'Current password is incorrect.' });
          return;
        }
        admin.password = newPassword;
        await admin.save();
        res.json({ success: true, message: 'Password updated successfully.' });
        return;
      }
    }

    // LocalStore fallback
    const localAdmin = await localStore.getAdminById(adminId);
    if (!localAdmin) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, localAdmin.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    await localStore.updateAdminPassword(adminId, newPassword);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Initial Admin Setup (Protected by ADMIN_SETUP_SECRET)
 * POST /api/auth/setup-admin
 */
export const setupInitialAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { secret, username, email, password } = req.body;

    if (!secret || secret !== ENV.ADMIN_SETUP_SECRET) {
      res.status(403).json({
        success: false,
        message: 'Invalid setup secret key.',
      });
      return;
    }

    const newAdmin = new Admin({
      username: username || ENV.INITIAL_ADMIN_USERNAME,
      email: email || ENV.INITIAL_ADMIN_EMAIL,
      password: password || ENV.INITIAL_ADMIN_PASSWORD,
      role: 'superadmin',
    });

    if (mongoose.connection.readyState === 1) {
      await newAdmin.save();
    }

    res.status(201).json({
      success: true,
      message: 'Initial administrator account created successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create initial admin.',
      error: error.message,
    });
  }
};

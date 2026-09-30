import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { Admin } from '../models/Admin';
import { localStore } from '../utils/localStore';

export interface AuthenticatedRequest extends Request {
  admin?: TokenPayload;
}

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      // Check cookie if sent
      const cookies = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token' || name === 'admin_token') {
          token = value;
          break;
        }
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as an administrator.',
      });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session. Please log in again.',
      });
      return;
    }

    // Verify admin exists in DB or in localStore
    let adminUser: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        adminUser = await Admin.findById(decoded.id).select('-password');
      } catch (err) {
        // Fallback to localStore
        adminUser = await localStore.getAdminById(decoded.id);
      }
    } else {
      adminUser = await localStore.getAdminById(decoded.id);
    }

    if (!adminUser) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found.',
      });
      return;
    }

    req.admin = {
      id: (adminUser._id as any).toString(),
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    };

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication verification failed.',
      error: error.message,
    });
  }
};

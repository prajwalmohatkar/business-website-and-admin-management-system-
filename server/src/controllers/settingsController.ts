import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessSettings } from '../models/BusinessSettings';
import { localStore } from '../utils/localStore';

/**
 * Get Business Settings (Public)
 * GET /api/settings
 */
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        let settings = await BusinessSettings.findOne();

        if (!settings) {
          // Seed default settings if none exist
          settings = new BusinessSettings({
            businessName: 'Apex Solutions',
            tagline: 'Reliable Solutions for Weighing, Solar & Water Purification',
            phone: '+91 98765 43210',
            whatsapp: '+91 98765 43210',
            email: 'sales@apexsolutions.com',
            address: 'Plot 45, Industrial Area, Phase II',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)',
            aboutBusiness:
              'We are a premier provider of industrial and commercial Weighing Scale Machines, Solar Power Systems, and Water Purification Systems. Committed to precision engineering, unmatched durability, and superior after-sales customer service.',
          });
          await settings.save();
        }

        res.json({
          success: true,
          settings,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const settings = localStore.getSettings();
    res.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Business Settings (Admin)
 * PUT /api/settings
 */
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      businessName,
      tagline,
      logo,
      phone,
      alternatePhone,
      whatsapp,
      email,
      address,
      city,
      state,
      pincode,
      businessHours,
      aboutBusiness,
      googleMapsEmbed,
      socialLinks,
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        let settings = await BusinessSettings.findOne();

        if (!settings) {
          settings = new BusinessSettings();
        }

        if (businessName) settings.businessName = businessName.trim();
        if (tagline !== undefined) settings.tagline = tagline.trim();
        if (logo !== undefined) settings.logo = logo;
        if (phone) settings.phone = phone.trim();
        if (alternatePhone !== undefined) settings.alternatePhone = alternatePhone.trim();
        if (whatsapp) settings.whatsapp = whatsapp.trim();
        if (email) settings.email = email.trim().toLowerCase();
        if (address) settings.address = address.trim();
        if (city !== undefined) settings.city = city.trim();
        if (state !== undefined) settings.state = state.trim();
        if (pincode !== undefined) settings.pincode = pincode.trim();
        if (businessHours !== undefined) settings.businessHours = businessHours.trim();
        if (aboutBusiness !== undefined) settings.aboutBusiness = aboutBusiness.trim();
        if (googleMapsEmbed !== undefined) settings.googleMapsEmbed = googleMapsEmbed;
        if (socialLinks !== undefined) settings.socialLinks = socialLinks;

        await settings.save();

        res.json({
          success: true,
          message: 'Business settings updated successfully.',
          settings,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const settings = localStore.updateSettings({
      businessName,
      tagline,
      logo,
      phone,
      alternatePhone,
      whatsapp,
      email,
      address,
      city,
      state,
      pincode,
      businessHours,
      aboutBusiness,
      googleMapsEmbed,
      socialLinks,
    });

    res.json({
      success: true,
      message: 'Business settings updated successfully.',
      settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

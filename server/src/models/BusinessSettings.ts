import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface IBusinessSettings extends Document {
  businessName: string;
  tagline: string;
  logo?: string;
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessHours: string;
  aboutBusiness: string;
  googleMapsEmbed?: string;
  socialLinks: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSettingsSchema = new Schema<IBusinessSettings>(
  {
    businessName: {
      type: String,
      required: true,
      default: 'Apex Solutions',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Reliable Solutions for Weighing, Solar & Water Purification',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
      default: '+91 98765 43210',
      trim: true,
    },
    alternatePhone: {
      type: String,
      default: '',
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      default: '+91 98765 43210',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      default: 'sales@apexsolutions.com',
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      default: 'Plot 45, Industrial Area, Phase II',
      trim: true,
    },
    city: {
      type: String,
      default: 'Mumbai',
      trim: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
      trim: true,
    },
    pincode: {
      type: String,
      default: '400001',
      trim: true,
    },
    businessHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)',
      trim: true,
    },
    aboutBusiness: {
      type: String,
      default: 'We are a premier provider of industrial and commercial Weighing Scale Machines, Solar Power Systems, and Water Purification Systems. Committed to precision engineering, unmatched durability, and superior after-sales customer service.',
    },
    googleMapsEmbed: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessSettings = mongoose.model<IBusinessSettings>('BusinessSettings', BusinessSettingsSchema);

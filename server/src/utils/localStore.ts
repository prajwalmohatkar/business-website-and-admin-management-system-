import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';
import { createSlug } from './slugify';
import { logger } from './logger';

const DATA_DIR = path.resolve(__dirname, '../../data');

export interface StoredAdmin {
  _id: string;
  username: string;
  email: string;
  password: string; // bcrypt hashed
  role: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredProduct {
  _id: string;
  name: string;
  slug: string;
  category: any;
  subcategory?: string;
  brand?: string;
  shortDescription?: string;
  description: string;
  price?: number;
  mrp?: number;
  discountPrice?: number;
  showPrice: 'exact' | 'mrp_selling' | 'contact' | 'quote';
  priceLabel?: string;
  images: Array<{ url: string; publicId?: string; isPrimary?: boolean; altText?: string }>;
  specifications: Array<{ key: string; value: string }>;
  features: string[];
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_request';
  featured: boolean;
  status: 'published' | 'draft' | 'hidden';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredEnquiry {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  product?: any;
  productName?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSettings {
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
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Helpers to read/write JSON files safely
const readJson = <T>(filename: string, fallback: T): T => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      writeJson(filename, fallback);
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    logger.warn(`Could not read ${filename}, using fallback.`, err);
    return fallback;
  }
};

const writeJson = (filename: string, data: any): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    logger.error(`Error saving ${filename}`, err);
  }
};

const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36)
  );
};

export const localStore = {
  init: async () => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Initialize Admin if not exists
    const admins = readJson<StoredAdmin[]>('admins.json', []);
    if (admins.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ENV.INITIAL_ADMIN_PASSWORD, salt);
      const initialAdmin: StoredAdmin = {
        _id: generateId(),
        username: ENV.INITIAL_ADMIN_USERNAME,
        email: ENV.INITIAL_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeJson('admins.json', [initialAdmin]);
      logger.info(`[LocalStore] Initial admin created in local storage: ${initialAdmin.email}`);
    }

    // Initialize Settings if not exists
    const settings = readJson<StoredSettings | null>('settings.json', null);
    if (!settings) {
      const defaultSettings: StoredSettings = {
        businessName: 'Apex Industrial & Solar Solutions',
        tagline: 'Reliable Solutions for Weighing, Solar & Water Purification',
        logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        phone: '+91 98765 43210',
        alternatePhone: '+91 98765 43211',
        whatsapp: '+91 98765 43210',
        email: 'sales@apexsolutions.in',
        address: 'Plot 42, Industrial Area, Sector 58',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        businessHours: 'Mon - Sat: 9:00 AM - 7:30 PM (Sunday Closed)',
        aboutBusiness:
          'Apex Industrial & Solar Solutions is a leading authorized supplier and service provider of high-precision Digital Weighing Scales, Rooftop & Agriculture Solar Systems, and Commercial Water Purifiers. With over 15 years of industry excellence, we deliver durable hardware, compliant calibration, and dependable after-sales maintenance across India.',
        googleMapsEmbed:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.803884144074!2d72.8776559!3d19.0760908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjkiTiA3MsKwNTInMzkuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
        socialLinks: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          youtube: 'https://youtube.com',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeJson('settings.json', defaultSettings);
      logger.info('[LocalStore] Default business settings initialized in local storage.');
    }

    // Initialize Categories if not exists
    let categories = readJson<StoredCategory[]>('categories.json', []);
    if (categories.length === 0) {
      categories = [
        {
          _id: 'cat_weighing_01',
          name: 'Weighing Scale Machines',
          slug: 'weighing-scale-machines',
          description:
            'High precision digital weighing scales for commercial, retail, laboratory, and heavy industrial applications.',
          image:
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
          isActive: true,
          displayOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'cat_solar_02',
          name: 'Solar Products',
          slug: 'solar-products',
          description:
            'Renewable on-grid, off-grid rooftop solar systems, solar water pumps, and tubular solar batteries.',
          image:
            'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
          isActive: true,
          displayOrder: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'cat_water_03',
          name: 'Water Purifiers',
          slug: 'water-purifiers',
          description:
            'Commercial RO plants, industrial water treatment solutions, and residential multi-stage alkaline purifiers.',
          image:
            'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
          isActive: true,
          displayOrder: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      writeJson('categories.json', categories);
      logger.info('[LocalStore] Default categories initialized in local storage.');
    }

    // Initialize Products if not exists
    let products = readJson<StoredProduct[]>('products.json', []);
    if (products.length === 0) {
      products = [
        {
          _id: 'prod_atom_300kg',
          name: 'ATOM 300kg Digital Heavy Duty Platform Weighing Scale',
          slug: 'atom-300kg-digital-platform-weighing-scale',
          category: categories[0],
          subcategory: 'Platform Scales',
          brand: 'ATOM',
          shortDescription:
            'Rugged 300kg digital platform weighing scale with heavy duty chequered plate, bright green LED display, and rechargeable battery backup.',
          description:
            'The ATOM 300kg Platform Weighing Scale is engineered for commercial warehouses, agricultural mandis, transport hubs, and manufacturing facilities. Built with reinforced mild steel structure and heavy-duty load cell technology, it delivers consistent weight readings even in demanding industrial environments.\n\nFeaturing Tare, Zero, and Auto-calibration functions, this machine comes with dual power operation (direct AC power and internal long-life rechargeable battery delivering over 48 hours of continuous operation on a single charge).',
          price: 7800,
          mrp: 9500,
          showPrice: 'mrp_selling',
          priceLabel: 'Starting Price (GST Extra)',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'ATOM 300kg Platform Scale Front View',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '300 kg' },
            { key: 'Accuracy / Division', value: '50 g' },
            { key: 'Platform Size', value: '450 mm x 450 mm' },
            { key: 'Platform Material', value: 'Heavy Duty MS Chequered Top Plate' },
            { key: 'Display Type', value: 'High Brightness Green LED Display' },
            { key: 'Power Supply', value: '220V AC ±10%, 50Hz' },
            { key: 'Battery Backup', value: '6V 4.5Ah Rechargeable (48 Hours)' },
            { key: 'Certification', value: 'Approved by Legal Metrology Dept (Govt of India)' },
          ],
          features: [
            'Heavy-gauge iron tubular frame designed for industrial abuse',
            'High-precision strain gauge load cell with overload protection',
            'Piece counting & price computation functionality built-in',
            'Tare / Zero subtraction for tare container weights',
            'Rust-resistant powder coated finish',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'ATOM 300kg Digital Platform Weighing Scale | Apex Solutions',
          seoDescription:
            'Buy genuine ATOM 300kg Digital Platform Scale with high precision load cell, government stamping certification, and fast nationwide delivery.',
          seoKeywords: ['ATOM weighing scale', '300kg platform scale', 'commercial digital scale'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'prod_eagle_30kg',
          name: 'Eagle 30kg Tabletop Commercial Counter Scale',
          slug: 'eagle-30kg-tabletop-commercial-counter-scale',
          category: categories[0],
          subcategory: 'Counter Scales',
          brand: 'Eagle',
          shortDescription:
            'High precision 30kg electronic counter scale with dual front-and-back LED displays for retail shops, grocery, and packaging.',
          description:
            'The Eagle 30kg Tabletop Counter Scale is the workhorse of modern retail and grocery operations. Designed with a food-grade stainless steel platter and dual displays facing both shopkeeper and customer, it builds trust and speeds up checkout.\n\nEquipped with lightning-fast weight stabilization (less than 1.5 seconds) and an ultra-sensitive 1g resolution.',
          price: 2650,
          mrp: 3200,
          showPrice: 'mrp_selling',
          priceLabel: 'Special Counter Offer',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Eagle 30kg Counter Scale',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '30 kg' },
            { key: 'Accuracy / Division', value: '1 g / 2 g' },
            { key: 'Platter Size', value: '240 mm x 290 mm' },
            { key: 'Platter Material', value: 'SS 304 Grade Stainless Steel' },
            { key: 'Display', value: 'Dual Red LED (Customer & Operator)' },
          ],
          features: [
            'Dual customer and operator high-contrast LED displays',
            'Splash-proof membrane tactile keyboard',
            'Auto power saving standby mode',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'Eagle 30kg Tabletop Scale | Retail & Grocery Weighing',
          seoDescription:
            'Shop Eagle 30kg electronic tabletop digital counter scale with 1g accuracy and dual display at wholesale price.',
          seoKeywords: ['Eagle 30kg scale', 'tabletop weighing scale'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'prod_solar_5kw',
          name: '5kW On-Grid Rooftop Solar Power System (Complete Turnkey)',
          slug: '5kw-on-grid-rooftop-solar-power-system',
          category: categories[1],
          subcategory: 'Rooftop Solar Systems',
          brand: 'SolarApex',
          shortDescription:
            'Complete 5kW grid-connected rooftop solar plant with Tier-1 Mono PERC solar panels, 5kVA MPPT smart inverter, net-metering support, and 25-year performance warranty.',
          description:
            'Slash your residential or commercial electricity bills by up to 85% with our 5kW On-Grid Rooftop Solar Power System. Generating an average of 20 to 25 units (kWh) of clean electricity every sunny day, this system pays for itself within 3-4 years.\n\nOur turnkey package includes site survey, high-efficiency Half-Cut Mono PERC solar modules, anodized aluminium mounting structures engineered to withstand 150 km/h wind speeds, DCDB/ACDB protection boxes, lightning arrestor, complete earth grounding, and full assistance with DISCOM net-metering approvals.',
          price: 220000,
          mrp: 260000,
          showPrice: 'mrp_selling',
          priceLabel: 'Turnkey Installation Price',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Rooftop Solar System 5kW Installation',
            },
          ],
          specifications: [
            { key: 'System Capacity', value: '5.0 kW' },
            { key: 'Solar Module Type', value: 'Tier-1 Mono PERC Bifacial 545Wp' },
            { key: 'Number of Modules', value: '9-10 Panels' },
            { key: 'Daily Energy Generation', value: '20 - 25 kWh (Units) / Day' },
            { key: 'Warranty', value: '25 Years Module Performance, 5 Years Inverter' },
          ],
          features: [
            'Real-time Wi-Fi generation tracking directly on your smartphone',
            'Surge protection with Type-II SPD in ACDB and DCDB boxes',
            'HDG (Hot Dip Galvanized) structure with rust warranty',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: '5kW On-Grid Rooftop Solar System Price & Subsidy | Apex',
          seoDescription:
            'Install 5kW On-Grid Solar System in India. Highest efficiency Tier 1 Mono PERC panels, PM Surya Ghar subsidy eligible with 25-year warranty.',
          seoKeywords: ['5kW solar system', 'rooftop solar panels'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'prod_ro_250lph',
          name: 'Commercial RO Water Plant 250 LPH Stainless Steel',
          slug: 'commercial-ro-water-plant-250-lph-stainless-steel',
          category: categories[2],
          subcategory: 'Commercial RO Plants',
          brand: 'AquaPure Pro',
          shortDescription:
            '250 Litres/Hour commercial Reverse Osmosis plant with SS 304 skid, dual Dow/Toray 4040 membranes, raw water pump, and automatic control panel for schools, hostels, and factories.',
          description:
            'The AquaPure Pro 250 LPH Commercial RO System provides crystal clear, bacteria-free drinking water for small manufacturing plants, corporate offices, schools, hostels, restaurants, and residential buildings with 100 to 500 people.\n\nBuilt on a durable SS 304 stainless steel frame, it integrates sand and activated carbon media filtration, 5-micron spun pre-filtration, vertical high-pressure multistage pump, and high-rejection Dow Filmtec RO membranes to eliminate up to 98% of dissolved impurities (TDS), heavy metals, pesticides, and microbial pathogens.',
          price: 48000,
          mrp: 58000,
          showPrice: 'mrp_selling',
          priceLabel: 'Standard Unit (Installation Extra)',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: '250 LPH Commercial RO Plant Skid',
            },
          ],
          specifications: [
            { key: 'Flow Rate Capacity', value: '250 Litres / Hour' },
            { key: 'Daily Output', value: '2000 - 3000 Litres / Day' },
            { key: 'RO Membrane', value: '1 x 4040 High Rejection Polyamide' },
            { key: 'Skid Construction', value: 'Food Grade SS 304 Stainless Steel' },
          ],
          features: [
            'Fully automated control panel with dry-run protection and auto-flushing',
            'Low maintenance multiport valves for fast backwash and rinsing',
            'Online rotameters for pure and reject flow measurement',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'Commercial RO Plant 250 LPH Price | SS 304 | Apex Solutions',
          seoDescription:
            'Buy high quality 250 LPH commercial RO plant in stainless steel skid for commercial establishments, offices, and schools at direct manufacturer pricing.',
          seoKeywords: ['250 lph ro plant', 'commercial water purifier'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      writeJson('products.json', products);
      logger.info('[LocalStore] Default sample products initialized in local storage.');
    }
  },

  // ------------------ ADMIN METHODS ------------------
  getAdminByIdentifier: async (identifier: string): Promise<StoredAdmin | null> => {
    const admins = readJson<StoredAdmin[]>('admins.json', []);
    const clean = identifier.trim().toLowerCase();
    const admin = admins.find(
      (a) => a.username.toLowerCase() === clean || a.email.toLowerCase() === clean
    );
    return admin || null;
  },

  getAdminById: async (id: string): Promise<StoredAdmin | null> => {
    const admins = readJson<StoredAdmin[]>('admins.json', []);
    return admins.find((a) => a._id === id) || null;
  },

  updateAdminPassword: async (id: string, newPasswordPlain: string): Promise<boolean> => {
    const admins = readJson<StoredAdmin[]>('admins.json', []);
    const idx = admins.findIndex((a) => a._id === id);
    if (idx === -1) return false;
    const salt = await bcrypt.genSalt(10);
    admins[idx].password = await bcrypt.hash(newPasswordPlain, salt);
    admins[idx].updatedAt = new Date().toISOString();
    writeJson('admins.json', admins);
    return true;
  },

  updateAdminLastLogin: async (id: string): Promise<void> => {
    const admins = readJson<StoredAdmin[]>('admins.json', []);
    const idx = admins.findIndex((a) => a._id === id);
    if (idx !== -1) {
      admins[idx].lastLogin = new Date().toISOString();
      writeJson('admins.json', admins);
    }
  },

  // ------------------ CATEGORY METHODS ------------------
  getCategories: (includeAll: boolean = false): any[] => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    const products = readJson<StoredProduct[]>('products.json', []);

    let list = includeAll ? categories : categories.filter((c) => c.isActive);
    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (includeAll) {
      return list.map((cat) => {
        const productCount = products.filter(
          (p) =>
            p.category === cat._id ||
            p.category?._id === cat._id ||
            p.category?.slug === cat.slug
        ).length;
        return { ...cat, productCount };
      });
    }

    return list;
  },

  getCategoryBySlug: (slug: string): StoredCategory | null => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    return categories.find((c) => c.slug === slug) || null;
  },

  getCategoryById: (id: string): StoredCategory | null => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    return categories.find((c) => c._id === id) || null;
  },

  createCategory: (data: Partial<StoredCategory>): StoredCategory => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    let slug = createSlug(data.slug || data.name || 'category');
    if (categories.some((c) => c.slug === slug)) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newCat: StoredCategory = {
      _id: 'cat_' + generateId(),
      name: data.name?.trim() || 'New Category',
      slug,
      description: data.description || '',
      image: data.image || '',
      isActive: data.isActive !== undefined ? data.isActive : true,
      displayOrder: data.displayOrder || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCat);
    writeJson('categories.json', categories);
    return newCat;
  },

  updateCategory: (id: string, data: Partial<StoredCategory>): StoredCategory | null => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    const idx = categories.findIndex((c) => c._id === id);
    if (idx === -1) return null;

    if (data.name) categories[idx].name = data.name.trim();
    if (data.description !== undefined) categories[idx].description = data.description;
    if (data.image !== undefined) categories[idx].image = data.image;
    if (data.isActive !== undefined) categories[idx].isActive = data.isActive;
    if (data.displayOrder !== undefined) categories[idx].displayOrder = data.displayOrder;
    if (data.slug) {
      categories[idx].slug = createSlug(data.slug);
    }
    categories[idx].updatedAt = new Date().toISOString();

    writeJson('categories.json', categories);
    return categories[idx];
  },

  deleteCategory: (id: string): { success: boolean; message?: string } => {
    const categories = readJson<StoredCategory[]>('categories.json', []);
    const products = readJson<StoredProduct[]>('products.json', []);

    const hasProducts = products.some(
      (p) => p.category === id || p.category?._id === id
    );
    if (hasProducts) {
      return {
        success: false,
        message: 'Cannot delete category: products are assigned to it. Reassign or delete products first.',
      };
    }

    const filtered = categories.filter((c) => c._id !== id);
    writeJson('categories.json', filtered);
    return { success: true };
  },

  // ------------------ PRODUCT METHODS ------------------
  getProducts: (filterOptions: {
    category?: string;
    search?: string;
    brand?: string;
    featured?: boolean | string;
    status?: string;
    stockStatus?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    isAdmin?: boolean;
  }) => {
    const {
      category,
      search,
      brand,
      featured,
      status,
      stockStatus,
      sortBy = 'newest',
      page = 1,
      limit = 12,
      isAdmin = false,
    } = filterOptions;

    let products = readJson<StoredProduct[]>('products.json', []);

    // Filter by status: public gets only published
    if (!isAdmin) {
      products = products.filter((p) => p.status === 'published');
    } else if (status && status !== 'all') {
      products = products.filter((p) => p.status === status);
    }

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(
        (p) =>
          p.category === category ||
          p.category?._id === category ||
          p.category?.slug === category
      );
    }

    // Filter by brand
    if (brand && brand !== 'all') {
      products = products.filter((p) =>
        p.brand?.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Filter by featured
    if (featured === true || featured === 'true') {
      products = products.filter((p) => p.featured === true);
    }

    // Filter by stockStatus
    if (stockStatus && stockStatus !== 'all') {
      products = products.filter((p) => p.stockStatus === stockStatus);
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.specifications?.some(
            (s) =>
              s.key.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
          )
        );
      });
    }

    // Sort
    if (sortBy === 'price_asc') {
      products.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'oldest') {
      products.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      // newest
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginated = products.slice(skip, skip + limit);

    return {
      products: paginated,
      totalCount,
      totalPages,
      currentPage: page,
    };
  },

  getProductBySlug: (slug: string) => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const product = products.find((p) => p.slug === slug);
    if (!product) return null;

    const relatedProducts = products
      .filter(
        (p) =>
          p.status === 'published' &&
          p._id !== product._id &&
          (p.category?._id === product.category?._id ||
            p.category === product.category)
      )
      .slice(0, 4);

    return { product, relatedProducts };
  },

  getProductById: (id: string): StoredProduct | null => {
    const products = readJson<StoredProduct[]>('products.json', []);
    return products.find((p) => p._id === id) || null;
  },

  createProduct: (data: Partial<StoredProduct>): StoredProduct => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const categories = readJson<StoredCategory[]>('categories.json', []);

    let slug = createSlug((data as any).customSlug || data.name || 'product');
    if (products.some((p) => p.slug === slug)) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Attach full category object if possible
    const catId = typeof data.category === 'object' ? data.category?._id : data.category;
    const matchedCategory = categories.find((c) => c._id === catId) || data.category;

    const newProd: StoredProduct = {
      _id: 'prod_' + generateId(),
      name: data.name?.trim() || 'New Product',
      slug,
      category: matchedCategory,
      subcategory: data.subcategory || '',
      brand: data.brand || '',
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      price: data.price,
      mrp: data.mrp,
      discountPrice: data.discountPrice,
      showPrice: data.showPrice || 'exact',
      priceLabel: data.priceLabel || '',
      images: data.images || [],
      specifications: data.specifications || [],
      features: data.features || [],
      stockStatus: data.stockStatus || 'in_stock',
      featured: Boolean(data.featured),
      status: data.status || 'published',
      seoTitle: data.seoTitle || data.name || '',
      seoDescription: data.seoDescription || data.shortDescription || '',
      seoKeywords: data.seoKeywords || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProd);
    writeJson('products.json', products);
    return newProd;
  },

  updateProduct: (id: string, data: Partial<StoredProduct>): StoredProduct | null => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const categories = readJson<StoredCategory[]>('categories.json', []);
    const idx = products.findIndex((p) => p._id === id);
    if (idx === -1) return null;

    if (data.name) products[idx].name = data.name.trim();
    if ((data as any).customSlug) products[idx].slug = createSlug((data as any).customSlug);
    if (data.category) {
      const catId = typeof data.category === 'object' ? data.category?._id : data.category;
      const matchedCategory = categories.find((c) => c._id === catId) || data.category;
      products[idx].category = matchedCategory;
    }
    if (data.subcategory !== undefined) products[idx].subcategory = data.subcategory;
    if (data.brand !== undefined) products[idx].brand = data.brand;
    if (data.shortDescription !== undefined) products[idx].shortDescription = data.shortDescription;
    if (data.description !== undefined) products[idx].description = data.description;
    if (data.price !== undefined) products[idx].price = data.price;
    if (data.mrp !== undefined) products[idx].mrp = data.mrp;
    if (data.discountPrice !== undefined) products[idx].discountPrice = data.discountPrice;
    if (data.showPrice !== undefined) products[idx].showPrice = data.showPrice;
    if (data.priceLabel !== undefined) products[idx].priceLabel = data.priceLabel;
    if (data.images !== undefined) products[idx].images = data.images;
    if (data.specifications !== undefined) products[idx].specifications = data.specifications;
    if (data.features !== undefined) products[idx].features = data.features;
    if (data.stockStatus !== undefined) products[idx].stockStatus = data.stockStatus;
    if (data.featured !== undefined) products[idx].featured = data.featured;
    if (data.status !== undefined) products[idx].status = data.status;
    if (data.seoTitle !== undefined) products[idx].seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) products[idx].seoDescription = data.seoDescription;
    if (data.seoKeywords !== undefined) products[idx].seoKeywords = data.seoKeywords;
    products[idx].updatedAt = new Date().toISOString();

    writeJson('products.json', products);
    return products[idx];
  },

  deleteProduct: (id: string): boolean => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const filtered = products.filter((p) => p._id !== id);
    if (filtered.length === products.length) return false;
    writeJson('products.json', filtered);
    return true;
  },

  toggleFeatured: (id: string): boolean => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const idx = products.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    products[idx].featured = !products[idx].featured;
    products[idx].updatedAt = new Date().toISOString();
    writeJson('products.json', products);
    return products[idx].featured;
  },

  toggleStatus: (id: string, newStatus?: string): string => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const idx = products.findIndex((p) => p._id === id);
    if (idx === -1) return 'published';
    if (newStatus && ['published', 'draft', 'hidden'].includes(newStatus)) {
      products[idx].status = newStatus as any;
    } else {
      products[idx].status = products[idx].status === 'published' ? 'draft' : 'published';
    }
    products[idx].updatedAt = new Date().toISOString();
    writeJson('products.json', products);
    return products[idx].status;
  },

  // ------------------ ENQUIRY METHODS ------------------
  getEnquiries: (filterOptions: { status?: string; search?: string; page?: number; limit?: number }) => {
    const { status, search, page = 1, limit = 20 } = filterOptions;
    let enquiries = readJson<StoredEnquiry[]>('enquiries.json', []);

    if (status && status !== 'all') {
      enquiries = enquiries.filter((e) => e.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      enquiries = enquiries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.mobile.includes(q) ||
          e.productName?.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }

    const totalCount = enquiries.length;
    const newCount = readJson<StoredEnquiry[]>('enquiries.json', []).filter((e) => e.status === 'new').length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginated = enquiries.slice(skip, skip + limit);

    return {
      enquiries: paginated,
      totalCount,
      newCount,
      totalPages,
      currentPage: page,
    };
  },

  createEnquiry: (data: Partial<StoredEnquiry>): StoredEnquiry => {
    const enquiries = readJson<StoredEnquiry[]>('enquiries.json', []);
    const newEnq: StoredEnquiry = {
      _id: 'enq_' + generateId(),
      name: data.name?.trim() || '',
      mobile: data.mobile?.trim() || '',
      email: data.email?.trim() || '',
      product: data.product || null,
      productName: data.productName || '',
      message: data.message?.trim() || '',
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnq);
    writeJson('enquiries.json', enquiries);
    return newEnq;
  },

  updateEnquiryStatus: (id: string, status: 'new' | 'contacted' | 'completed', adminNotes?: string): StoredEnquiry | null => {
    const enquiries = readJson<StoredEnquiry[]>('enquiries.json', []);
    const idx = enquiries.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    if (status) enquiries[idx].status = status;
    if (adminNotes !== undefined) enquiries[idx].adminNotes = adminNotes;
    enquiries[idx].updatedAt = new Date().toISOString();
    writeJson('enquiries.json', enquiries);
    return enquiries[idx];
  },

  deleteEnquiry: (id: string): boolean => {
    const enquiries = readJson<StoredEnquiry[]>('enquiries.json', []);
    const filtered = enquiries.filter((e) => e._id !== id);
    if (filtered.length === enquiries.length) return false;
    writeJson('enquiries.json', filtered);
    return true;
  },

  // ------------------ SETTINGS METHODS ------------------
  getSettings: (): StoredSettings => {
    return readJson<StoredSettings>('settings.json', {
      businessName: 'Apex Industrial & Solar Solutions',
      tagline: 'Reliable Solutions for Weighing, Solar & Water Purification',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'sales@apexsolutions.in',
      address: 'Plot 42, Industrial Area, Sector 58',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      businessHours: 'Mon - Sat: 9:00 AM - 7:30 PM (Sunday Closed)',
      aboutBusiness:
        'Apex Industrial & Solar Solutions is a leading authorized supplier and service provider of high-precision Digital Weighing Scales, Rooftop & Agriculture Solar Systems, and Commercial Water Purifiers.',
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  updateSettings: (data: Partial<StoredSettings>): StoredSettings => {
    const current = localStore.getSettings();
    const updated: StoredSettings = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeJson('settings.json', updated);
    return updated;
  },

  // ------------------ STATS METHODS ------------------
  getStats: () => {
    const products = readJson<StoredProduct[]>('products.json', []);
    const categories = readJson<StoredCategory[]>('categories.json', []);
    const enquiries = readJson<StoredEnquiry[]>('enquiries.json', []);

    return {
      stats: {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.status === 'published').length,
        totalCategories: categories.length,
        featuredProducts: products.filter((p) => p.featured && p.status === 'published').length,
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter((e) => e.status === 'new').length,
      },
      recentProducts: products.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5),
    };
  },
};

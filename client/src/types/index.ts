export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductImage {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
  altText?: string;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: ICategory | string;
  subcategory?: string;
  brand?: string;
  shortDescription?: string;
  description: string;
  price?: number;
  mrp?: number;
  discountPrice?: number;
  showPrice: 'exact' | 'mrp_selling' | 'contact' | 'quote';
  priceLabel?: string;
  images: IProductImage[];
  specifications: IProductSpecification[];
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

export interface IEnquiry {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  product?: {
    _id: string;
    name: string;
    slug: string;
    images?: IProductImage[];
    price?: number;
  } | null;
  productName?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface IBusinessSettings {
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export interface IDashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  featuredProducts: number;
  totalEnquiries: number;
  newEnquiries: number;
}

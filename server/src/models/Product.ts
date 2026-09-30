import mongoose, { Schema, Document } from 'mongoose';

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

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    altText: { type: String, default: '' },
  },
  { _id: false }
);

const ProductSpecificationSchema = new Schema<IProductSpecification>(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product full description is required'],
      default: '',
    },
    price: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
    mrp: {
      type: Number,
      min: [0, 'MRP must be positive'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be positive'],
    },
    showPrice: {
      type: String,
      enum: ['exact', 'mrp_selling', 'contact', 'quote'],
      default: 'exact',
    },
    priceLabel: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    specifications: {
      type: [ProductSpecificationSchema],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'on_request'],
      default: 'in_stock',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'hidden'],
      default: 'published',
      index: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
    },
    seoKeywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index for fast searching across name, brand, shortDescription, specifications
ProductSchema.index({
  name: 'text',
  brand: 'text',
  shortDescription: 'text',
  description: 'text',
  'specifications.value': 'text',
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

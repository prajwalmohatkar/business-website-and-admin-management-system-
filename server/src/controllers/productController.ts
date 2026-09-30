import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { createSlug } from '../utils/slugify';
import { localStore } from '../utils/localStore';

/**
 * Get all products (with search, category filter, pagination, sorting)
 * GET /api/products
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      featured,
      status,
      stockStatus,
      sortBy = 'newest',
      page = '1',
      limit = '12',
      isAdmin = 'false',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = {};

        // For public requests, strictly enforce status = 'published'
        if (isAdmin !== 'true') {
          query.status = 'published';
        } else if (status && status !== 'all') {
          query.status = status;
        }

        // Category filter: could be slug or ObjectId
        if (category && category !== 'all') {
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(category as string);
          if (isObjectId) {
            query.category = category;
          } else {
            const foundCat = await Category.findOne({ slug: category });
            if (foundCat) {
              query.category = foundCat._id;
            } else {
              // Category slug does not match any category, return empty results
              res.json({
                success: true,
                products: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: pageNum,
              });
              return;
            }
          }
        }

        // Brand filter
        if (brand && brand !== 'all') {
          query.brand = new RegExp(brand as string, 'i');
        }

        // Featured filter
        if (featured === 'true') {
          query.featured = true;
        }

        // Stock status filter
        if (stockStatus && stockStatus !== 'all') {
          query.stockStatus = stockStatus;
        }

        // Search query
        if (search && (search as string).trim()) {
          const searchRegex = new RegExp((search as string).trim(), 'i');
          query.$or = [
            { name: searchRegex },
            { brand: searchRegex },
            { shortDescription: searchRegex },
            { description: searchRegex },
            { 'specifications.key': searchRegex },
            { 'specifications.value': searchRegex },
          ];
        }

        // Sorting
        let sortOptions: any = { createdAt: -1 };
        if (sortBy === 'price_asc') {
          sortOptions = { price: 1 };
        } else if (sortBy === 'price_desc') {
          sortOptions = { price: -1 };
        } else if (sortBy === 'name_asc') {
          sortOptions = { name: 1 };
        } else if (sortBy === 'name_desc') {
          sortOptions = { name: -1 };
        } else if (sortBy === 'oldest') {
          sortOptions = { createdAt: 1 };
        }

        const [products, totalCount] = await Promise.all([
          Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum),
          Product.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
          success: true,
          products,
          totalCount,
          totalPages,
          currentPage: pageNum,
        });
        return;
      } catch (dbErr) {
        // Fallback to localStore
      }
    }

    // LocalStore fallback
    const result = localStore.getProducts({
      category: category as string,
      search: search as string,
      brand: brand as string,
      featured: featured as string,
      status: status as string,
      stockStatus: stockStatus as string,
      sortBy: sortBy as string,
      page: pageNum,
      limit: limitNum,
      isAdmin: isAdmin === 'true',
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
 * Get single product by slug (Public)
 * GET /api/products/:slug
 */
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findOne({ slug }).populate('category', 'name slug description');

        if (product) {
          const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: 'published',
          })
            .populate('category', 'name slug')
            .limit(4);

          res.json({
            success: true,
            product,
            relatedProducts,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const result = localStore.getProductBySlug(slug);
    if (!result) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      product: result.product,
      relatedProducts: result.relatedProducts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get product by ID (Admin)
 * GET /api/products/admin/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(id).populate('category', 'name slug');
        if (product) {
          res.json({ success: true, product });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const product = localStore.getProductById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create new Product (Admin)
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      customSlug,
      category,
      subcategory,
      brand,
      shortDescription,
      description,
      price,
      mrp,
      discountPrice,
      showPrice,
      priceLabel,
      images,
      specifications,
      features,
      stockStatus,
      featured,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Product name is required.' });
      return;
    }

    if (!category) {
      res.status(400).json({ success: false, message: 'Category is required.' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          res.status(400).json({ success: false, message: 'Selected category does not exist.' });
          return;
        }

        // Generate unique slug
        let slug = createSlug(customSlug || name);
        let existing = await Product.findOne({ slug });
        if (existing) {
          slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // Ensure at least one primary image if images provided
        let cleanImages = Array.isArray(images) ? [...images] : [];
        if (cleanImages.length > 0 && !cleanImages.some((img: any) => img.isPrimary)) {
          cleanImages[0].isPrimary = true;
        }

        const product = new Product({
          name: name.trim(),
          slug,
          category,
          subcategory: subcategory || '',
          brand: brand || '',
          shortDescription: shortDescription || '',
          description: description || '',
          price: price !== undefined && price !== '' ? Number(price) : undefined,
          mrp: mrp !== undefined && mrp !== '' ? Number(mrp) : undefined,
          discountPrice: discountPrice !== undefined && discountPrice !== '' ? Number(discountPrice) : undefined,
          showPrice: showPrice || 'exact',
          priceLabel: priceLabel || '',
          images: cleanImages,
          specifications: Array.isArray(specifications) ? specifications : [],
          features: Array.isArray(features) ? features : [],
          stockStatus: stockStatus || 'in_stock',
          featured: Boolean(featured),
          status: status || 'published',
          seoTitle: seoTitle || name.trim(),
          seoDescription: seoDescription || shortDescription || '',
          seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
        });

        await product.save();

        res.status(201).json({
          success: true,
          message: 'Product created successfully.',
          product,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const product = localStore.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Product (Admin)
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(id);
        if (product) {
          // Handle slug update if provided
          if (updateData.customSlug && updateData.customSlug !== product.slug) {
            const candidateSlug = createSlug(updateData.customSlug);
            const duplicate = await Product.findOne({ slug: candidateSlug, _id: { $ne: id } });
            if (duplicate) {
              res.status(400).json({ success: false, message: 'Product slug is already in use.' });
              return;
            }
            product.slug = candidateSlug;
          }

          // Handle Category check if changing
          if (updateData.category && updateData.category !== product.category.toString()) {
            const categoryExists = await Category.findById(updateData.category);
            if (!categoryExists) {
              res.status(400).json({ success: false, message: 'Selected category does not exist.' });
              return;
            }
            product.category = updateData.category;
          }

          // Assign other updatable fields
          if (updateData.name !== undefined) product.name = updateData.name.trim();
          if (updateData.subcategory !== undefined) product.subcategory = updateData.subcategory;
          if (updateData.brand !== undefined) product.brand = updateData.brand;
          if (updateData.shortDescription !== undefined) product.shortDescription = updateData.shortDescription;
          if (updateData.description !== undefined) product.description = updateData.description;
          if (updateData.price !== undefined) product.price = updateData.price === '' ? undefined : Number(updateData.price);
          if (updateData.mrp !== undefined) product.mrp = updateData.mrp === '' ? undefined : Number(updateData.mrp);
          if (updateData.discountPrice !== undefined) product.discountPrice = updateData.discountPrice === '' ? undefined : Number(updateData.discountPrice);
          if (updateData.showPrice !== undefined) product.showPrice = updateData.showPrice;
          if (updateData.priceLabel !== undefined) product.priceLabel = updateData.priceLabel;

          if (Array.isArray(updateData.images)) {
            let cleanImages = [...updateData.images];
            if (cleanImages.length > 0 && !cleanImages.some((img: any) => img.isPrimary)) {
              cleanImages[0].isPrimary = true;
            }
            product.images = cleanImages;
          }

          if (Array.isArray(updateData.specifications)) product.specifications = updateData.specifications;
          if (Array.isArray(updateData.features)) product.features = updateData.features;
          if (updateData.stockStatus !== undefined) product.stockStatus = updateData.stockStatus;
          if (updateData.featured !== undefined) product.featured = Boolean(updateData.featured);
          if (updateData.status !== undefined) product.status = updateData.status;
          if (updateData.seoTitle !== undefined) product.seoTitle = updateData.seoTitle;
          if (updateData.seoDescription !== undefined) product.seoDescription = updateData.seoDescription;
          if (Array.isArray(updateData.seoKeywords)) product.seoKeywords = updateData.seoKeywords;

          await product.save();

          res.json({
            success: true,
            message: 'Product updated successfully.',
            product,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const product = localStore.updateProduct(id, updateData);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Product (Admin)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
          res.json({
            success: true,
            message: 'Product deleted successfully.',
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const deleted = localStore.deleteProduct(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle Featured status (Admin)
 * PATCH /api/products/:id/featured
 */
export const toggleFeatured = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(id);
        if (product) {
          product.featured = !product.featured;
          await product.save();

          res.json({
            success: true,
            message: `Product marked as ${product.featured ? 'featured' : 'not featured'}.`,
            featured: product.featured,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const featured = localStore.toggleFeatured(id);
    res.json({
      success: true,
      message: `Product marked as ${featured ? 'featured' : 'not featured'}.`,
      featured,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle Product Status (published / draft) (Admin)
 * PATCH /api/products/:id/status
 */
export const toggleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(id);
        if (product) {
          if (status && ['published', 'draft', 'hidden'].includes(status)) {
            product.status = status;
          } else {
            product.status = product.status === 'published' ? 'draft' : 'published';
          }

          await product.save();

          res.json({
            success: true,
            message: `Product status changed to ${product.status}.`,
            status: product.status,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    // LocalStore fallback
    const newStatus = localStore.toggleStatus(id, status);
    res.json({
      success: true,
      message: `Product status changed to ${newStatus}.`,
      status: newStatus,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

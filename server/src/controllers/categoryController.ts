import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { createSlug } from '../utils/slugify';
import { localStore } from '../utils/localStore';

/**
 * Get all categories
 * Public: GET /api/categories
 * Admin: GET /api/categories?all=true
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeAll = req.query.all === 'true';

    if (mongoose.connection.readyState === 1) {
      try {
        const filter = includeAll ? {} : { isActive: true };
        const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });

        if (includeAll) {
          const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
              const productCount = await Product.countDocuments({ category: cat._id });
              return {
                ...cat.toObject(),
                productCount,
              };
            })
          );
          res.json({ success: true, categories: categoriesWithCount });
          return;
        }

        res.json({ success: true, categories });
        return;
      } catch (dbErr) {
        // Fallback to localStore
      }
    }

    // LocalStore fallback
    const categories = localStore.getCategories(includeAll);
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get category by slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const category = await Category.findOne({ slug });
        if (category) {
          res.json({ success: true, category });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    const category = localStore.getCategoryBySlug(slug);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create Category (Admin only)
 * POST /api/categories
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, isActive, displayOrder, customSlug } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let slug = createSlug(customSlug || name);
        let existing = await Category.findOne({ slug });
        if (existing) {
          slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const category = new Category({
          name: name.trim(),
          slug,
          description: description || '',
          image: image || '',
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        });

        await category.save();

        res.status(201).json({
          success: true,
          message: 'Category created successfully.',
          category,
        });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    const category = localStore.createCategory({
      name: name.trim(),
      slug: customSlug,
      description,
      image,
      isActive,
      displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Category (Admin only)
 * PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug: customSlug, description, image, isActive, displayOrder } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const category = await Category.findById(id);
        if (category) {
          if (name) category.name = name.trim();
          if (description !== undefined) category.description = description;
          if (image !== undefined) category.image = image;
          if (isActive !== undefined) category.isActive = Boolean(isActive);
          if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
          if (customSlug) category.slug = createSlug(customSlug);

          await category.save();

          res.json({
            success: true,
            message: 'Category updated successfully.',
            category,
          });
          return;
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    const updated = localStore.updateCategory(id, {
      name,
      slug: customSlug,
      description,
      image,
      isActive,
      displayOrder: Number(displayOrder),
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Category (Admin only)
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const productCount = await Product.countDocuments({ category: id });
        if (productCount > 0) {
          res.status(400).json({
            success: false,
            message: `Cannot delete category: ${productCount} products are assigned to it.`,
          });
          return;
        }

        await Category.findByIdAndDelete(id);
        res.json({ success: true, message: 'Category deleted successfully.' });
        return;
      } catch (dbErr) {
        // Fallback
      }
    }

    const result = localStore.deleteCategory(id);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message || 'Cannot delete category.' });
      return;
    }

    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

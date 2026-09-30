import { api } from './api';
import { ICategory } from '../types';

export const categoryService = {
  // Public categories (active only)
  getCategories: async (): Promise<ICategory[]> => {
    const res = await api.get<{ success: boolean; categories: ICategory[] }>('/categories');
    return res.data.categories;
  },

  // Admin categories (includes inactive and product counts)
  getAllCategoriesAdmin: async (): Promise<ICategory[]> => {
    const res = await api.get<{ success: boolean; categories: ICategory[] }>('/categories?all=true');
    return res.data.categories;
  },

  getCategoryBySlug: async (slug: string): Promise<ICategory> => {
    const res = await api.get<{ success: boolean; category: ICategory }>(`/categories/${slug}`);
    return res.data.category;
  },

  createCategory: async (categoryData: Partial<ICategory>): Promise<ICategory> => {
    const res = await api.post<{ success: boolean; category: ICategory }>('/categories', categoryData);
    return res.data.category;
  },

  updateCategory: async (id: string, categoryData: Partial<ICategory>): Promise<ICategory> => {
    const res = await api.put<{ success: boolean; category: ICategory }>(`/categories/${id}`, categoryData);
    return res.data.category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

import { api } from './api';
import { IProduct } from '../types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  featured?: boolean | string;
  status?: string;
  stockStatus?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  isAdmin?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  products: IProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const productService = {
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const res = await api.get<ProductsResponse>('/products', { params });
    return res.data;
  },

  getProductBySlug: async (slug: string): Promise<{ product: IProduct; relatedProducts: IProduct[] }> => {
    const res = await api.get<{ success: boolean; product: IProduct; relatedProducts: IProduct[] }>(`/products/${slug}`);
    return res.data;
  },

  getProductByIdAdmin: async (id: string): Promise<IProduct> => {
    const res = await api.get<{ success: boolean; product: IProduct }>(`/products/admin/${id}`);
    return res.data.product;
  },

  createProduct: async (productData: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.post<{ success: boolean; product: IProduct }>('/products', productData);
    return res.data.product;
  },

  updateProduct: async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.put<{ success: boolean; product: IProduct }>(`/products/${id}`, productData);
    return res.data.product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  toggleFeatured: async (id: string): Promise<boolean> => {
    const res = await api.patch<{ success: boolean; featured: boolean }>(`/products/${id}/featured`);
    return res.data.featured;
  },

  toggleStatus: async (id: string, status?: string): Promise<string> => {
    const res = await api.patch<{ success: boolean; status: string }>(`/products/${id}/status`, { status });
    return res.data.status;
  },
};

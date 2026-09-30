import { api } from './api';

export interface UploadedImageData {
  url: string;
  publicId: string;
}

export const uploadService = {
  uploadSingleImage: async (file: File, folder: string = 'business_website/products'): Promise<UploadedImageData> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const res = await api.post<{ success: boolean; image: UploadedImageData }>('/uploads/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.image;
  },

  uploadMultipleImages: async (files: File[], folder: string = 'business_website/products'): Promise<UploadedImageData[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('folder', folder);

    const res = await api.post<{ success: boolean; images: UploadedImageData[] }>('/uploads/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.images;
  },

  deleteImage: async (publicId: string): Promise<boolean> => {
    const res = await api.delete<{ success: boolean; message: string }>('/uploads', {
      data: { publicId },
    });
    return res.data.success;
  },
};

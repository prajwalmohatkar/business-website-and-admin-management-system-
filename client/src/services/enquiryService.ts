import { api } from './api';
import { IEnquiry } from '../types';

export interface SubmitEnquiryData {
  name: string;
  mobile: string;
  email?: string;
  productId?: string;
  message: string;
}

export interface EnquiriesResponse {
  success: boolean;
  enquiries: IEnquiry[];
  totalCount: number;
  newCount: number;
  totalPages: number;
  currentPage: number;
}

export const enquiryService = {
  submitEnquiry: async (data: SubmitEnquiryData): Promise<{ success: boolean; message: string; enquiryId: string }> => {
    const res = await api.post('/enquiries', data);
    return res.data;
  },

  getEnquiries: async (params: { status?: string; search?: string; page?: number; limit?: number } = {}): Promise<EnquiriesResponse> => {
    const res = await api.get<EnquiriesResponse>('/enquiries', { params });
    return res.data;
  },

  updateEnquiryStatus: async (
    id: string,
    status: 'new' | 'contacted' | 'completed',
    adminNotes?: string
  ): Promise<IEnquiry> => {
    const res = await api.put<{ success: boolean; enquiry: IEnquiry }>(`/enquiries/${id}`, { status, adminNotes });
    return res.data.enquiry;
  },

  deleteEnquiry: async (id: string): Promise<void> => {
    await api.delete(`/enquiries/${id}`);
  },
};

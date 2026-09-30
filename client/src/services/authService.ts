import { api } from './api';
import { IAdminUser } from '../types';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: IAdminUser;
}

export const authService = {
  login: async (identifier: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/login', { identifier, password });
    if (res.data.token) {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
    }
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },

  getCurrentAdmin: async (): Promise<IAdminUser> => {
    const res = await api.get<{ success: boolean; admin: IAdminUser }>('/auth/me');
    return res.data.admin;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};

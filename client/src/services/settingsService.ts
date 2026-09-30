import { api } from './api';
import { IBusinessSettings } from '../types';

export const settingsService = {
  getSettings: async (): Promise<IBusinessSettings> => {
    const res = await api.get<{ success: boolean; settings: IBusinessSettings }>('/settings');
    return res.data.settings;
  },

  updateSettings: async (settingsData: Partial<IBusinessSettings>): Promise<IBusinessSettings> => {
    const res = await api.put<{ success: boolean; settings: IBusinessSettings }>('/settings', settingsData);
    return res.data.settings;
  },
};
